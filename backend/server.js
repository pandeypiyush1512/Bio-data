const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generatePDF } = require('./pdfGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer setup for photo uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `photo_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve generated PDFs as static files
const pdfOutputDir = path.join(__dirname, 'generated');
if (!fs.existsSync(pdfOutputDir)) fs.mkdirSync(pdfOutputDir, { recursive: true });
app.use('/pdf', express.static(pdfOutputDir, {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', "frame-ancestors *");
  }
}));

// Temp storage for last generated PDF (in-memory, keyed by session)
const pdfStore = new Map();

// Helper: get the public base URL for this server
function getBaseUrl(req) {
  // On Render (or any reverse proxy), use the forwarded host
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  return `${proto}://${host}`;
}

// Routes
app.post('/api/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const base = getBaseUrl(req);
  res.json({ url: `${base}/uploads/${req.file.filename}` });
});

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Generating PDF for:', formData.personal?.fullName);
    const pdfBuffer = await generatePDF(formData);
    const fullName = (formData.personal?.fullName || 'Resume').replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');

    // Save to disk so browser can open it as a real file URL
    const filename = `${fullName}_Resume_${Date.now()}.pdf`;
    const filepath = path.join(pdfOutputDir, filename);
    fs.writeFileSync(filepath, pdfBuffer);
    // Clean up after 30 minutes
    setTimeout(() => { try { fs.unlinkSync(filepath); } catch {} }, 30 * 60 * 1000);

    const pdfKey = Date.now().toString();
    pdfStore.set(pdfKey, { filepath, name: fullName, filename });
    setTimeout(() => pdfStore.delete(pdfKey), 30 * 60 * 1000);

    const base = getBaseUrl(req);
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes, file:', filename);
    res.json({
      key: pdfKey,
      filename: `${fullName}_Resume.pdf`,
      viewUrl: `${base}/pdf/${filename}`,
      downloadUrl: `${base}/api/download-pdf/${pdfKey}`
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF', details: err.message });
  }
});

// View PDF inline in browser
app.get('/api/view-pdf/:key', (req, res) => {
  const entry = pdfStore.get(req.params.key);
  if (!entry) return res.status(404).send('PDF not found or expired');
  if (!fs.existsSync(entry.filepath)) return res.status(404).send('PDF file no longer on disk');
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${entry.name}_Resume.pdf"`);
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  fs.createReadStream(entry.filepath).pipe(res);
});

// Download PDF
app.get('/api/download-pdf/:key', (req, res) => {
  const entry = pdfStore.get(req.params.key);
  if (!entry) return res.status(404).json({ error: 'PDF not found or expired' });
  if (!fs.existsSync(entry.filepath)) return res.status(404).json({ error: 'PDF file no longer on disk' });

  const downloadName = `${entry.name}_Resume.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  fs.createReadStream(entry.filepath).pipe(res);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'QuickResume' }));

// Serve React frontend build (for production on Render)
const frontendBuild = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  // React Router fallback — serve index.html for any non-API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n✅ QuickResume server running at http://localhost:${PORT}\n`);
});
