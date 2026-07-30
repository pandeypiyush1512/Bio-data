const puppeteer = require('puppeteer');

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function generateHTML(data) {
  const p = data.personal || {};
  const education = data.education || [];
  const experience = data.experience || [];
  const skills = data.skills || {};
  const certifications = data.certifications || [];
  const projects = data.projects || [];
  const achievements = data.achievements || [];
  const hobbies = data.hobbies || [];
  const references = data.references || [];

  const photoHTML = p.photoUrl
    ? `<img src="${p.photoUrl}" alt="Profile Photo" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid #2563eb;">`
    : `<div style="width:110px;height:110px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:40px;color:#94a3b8;">👤</div>`;

  const skillSection = (title, items) => {
    if (!items || !items.length) return '';
    return `<div style="margin-bottom:8px;">
      <span style="font-weight:600;color:#374151;font-size:13px;">${title}:</span>
      <span style="margin-left:8px;">${items.map(s => `<span style="background:#dbeafe;color:#1d4ed8;padding:2px 10px;border-radius:12px;font-size:12px;margin:2px;display:inline-block;">${s}</span>`).join('')}</span>
    </div>`;
  };

  const sectionTitle = (title) =>
    `<div style="border-bottom:2px solid #2563eb;padding-bottom:4px;margin:20px 0 12px;"><h2 style="font-size:16px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;margin:0;">${title}</h2></div>`;

  let html = `<!DOCTYPE html><html><head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; font-size: 13px; color: #1f2937; background: #fff; padding: 32px 40px; line-height: 1.5; }
    .header { display: flex; align-items: center; gap: 24px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
    .header-info h1 { font-size: 26px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px; }
    .header-info p { color: #6b7280; font-size: 13px; margin: 2px 0; }
    .contact-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
    .contact-item { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #374151; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .info-item { display: flex; gap: 8px; margin-bottom: 4px; }
    .info-label { font-weight: 600; color: #374151; min-width: 120px; font-size: 12px; }
    .info-value { color: #1f2937; font-size: 12px; }
    .edu-item, .exp-item, .cert-item, .proj-item, .ref-item { margin-bottom: 14px; padding: 12px; background: #f8fafc; border-left: 3px solid #2563eb; border-radius: 4px; }
    .item-title { font-weight: 700; font-size: 14px; color: #1e3a8a; }
    .item-sub { font-weight: 600; color: #374151; font-size: 13px; }
    .item-meta { color: #6b7280; font-size: 12px; margin: 2px 0; }
    .item-desc { color: #374151; font-size: 12px; margin-top: 6px; }
    .ach-item { padding: 4px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .ref-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    @media print { body { padding: 20px; } }
  </style>
  </head><body>

  <!-- HEADER -->
  <div class="header">
    ${photoHTML}
    <div class="header-info" style="flex:1;">
      <h1>${p.fullName || 'Full Name'}</h1>
      <div class="contact-row">
        ${p.email ? `<span class="contact-item">✉ ${p.email}</span>` : ''}
        ${p.mobile ? `<span class="contact-item">📞 ${p.mobile}</span>` : ''}
        ${p.city ? `<span class="contact-item">📍 ${[p.city, p.state, p.country].filter(Boolean).join(', ')}</span>` : ''}
        ${p.linkedIn ? `<span class="contact-item">🔗 ${p.linkedIn}</span>` : ''}
        ${p.github ? `<span class="contact-item">💻 ${p.github}</span>` : ''}
        ${p.nationality ? `<span class="contact-item">🌍 ${p.nationality}</span>` : ''}
      </div>
    </div>
  </div>

  <!-- PERSONAL DETAILS -->
  ${sectionTitle('Personal Information')}
  <div class="two-col">
    ${p.dob ? `<div class="info-item"><span class="info-label">Date of Birth:</span><span class="info-value">${p.dob}</span></div>` : ''}
    ${p.age ? `<div class="info-item"><span class="info-label">Age:</span><span class="info-value">${p.age} years</span></div>` : ''}
    ${p.gender ? `<div class="info-item"><span class="info-label">Gender:</span><span class="info-value">${p.gender}</span></div>` : ''}
    ${p.maritalStatus ? `<div class="info-item"><span class="info-label">Marital Status:</span><span class="info-value">${p.maritalStatus}</span></div>` : ''}
    ${p.currentAddress ? `<div class="info-item"><span class="info-label">Current Address:</span><span class="info-value">${p.currentAddress}</span></div>` : ''}
    ${p.permanentAddress ? `<div class="info-item"><span class="info-label">Permanent Address:</span><span class="info-value">${p.permanentAddress}</span></div>` : ''}
    ${p.postalCode ? `<div class="info-item"><span class="info-label">Postal Code:</span><span class="info-value">${p.postalCode}</span></div>` : ''}
    ${p.languages && p.languages.length ? `<div class="info-item"><span class="info-label">Languages:</span><span class="info-value">${p.languages.join(', ')}</span></div>` : ''}
  </div>`;

  // EDUCATION
  if (education.length) {
    html += sectionTitle('Education');
    education.forEach(e => {
      const endDate = e.currentlyStudying ? 'Present' : formatDate(e.endDate);
      html += `<div class="edu-item">
        <div class="item-title">${e.degree || ''} ${e.courseName ? `in ${e.courseName}` : ''}</div>
        <div class="item-sub">${e.collegeName || ''}</div>
        <div class="item-meta">${[e.specialization, e.board, e.city, e.country].filter(Boolean).join(' · ')}</div>
        <div class="item-meta">${formatDate(e.startDate)} – ${endDate}${e.percentage ? ` · ${e.percentage}` : ''}${e.grade ? ` (${e.grade})` : ''}</div>
        ${e.remarks ? `<div class="item-desc">${e.remarks}</div>` : ''}
      </div>`;
    });
  }

  // EXPERIENCE
  if (experience.length) {
    html += sectionTitle('Professional Experience');
    experience.forEach(ex => {
      const endDate = ex.currentlyWorking ? 'Present' : `${ex.endMonth || ''} ${ex.endYear || ''}`.trim();
      const startDate = `${ex.startMonth || ''} ${ex.startYear || ''}`.trim();
      html += `<div class="exp-item">
        <div class="item-title">${ex.jobTitle || ''}</div>
        <div class="item-sub">${ex.companyName || ''} ${ex.employmentType ? `· ${ex.employmentType}` : ''}</div>
        <div class="item-meta">${[ex.department, ex.location].filter(Boolean).join(' · ')}</div>
        <div class="item-meta">${startDate} – ${endDate}${ex.duration ? ` · ${ex.duration}` : ''}</div>
        ${ex.responsibilities ? `<div class="item-desc"><strong>Responsibilities:</strong> ${ex.responsibilities}</div>` : ''}
        ${ex.achievements ? `<div class="item-desc"><strong>Achievements:</strong> ${ex.achievements}</div>` : ''}
        ${ex.technologies ? `<div class="item-desc"><strong>Technologies:</strong> ${ex.technologies}</div>` : ''}
      </div>`;
    });
  }

  // SKILLS
  const hasSkills = Object.values(skills).some(v => v && v.length);
  if (hasSkills) {
    html += sectionTitle('Skills');
    html += skillSection('Technical Skills', skills.technical);
    html += skillSection('Programming Languages', skills.programming);
    html += skillSection('Cloud Platforms', skills.cloud);
    html += skillSection('DevOps Tools', skills.devops);
    html += skillSection('Databases', skills.databases);
    html += skillSection('Frameworks', skills.frameworks);
    html += skillSection('Soft Skills', skills.soft);
  }

  // CERTIFICATIONS
  if (certifications.length) {
    html += sectionTitle('Certifications');
    certifications.forEach(c => {
      html += `<div class="cert-item">
        <div class="item-title">${c.name || ''}</div>
        <div class="item-sub">${c.organization || ''}</div>
        <div class="item-meta">${c.issueDate ? `Issued: ${formatDate(c.issueDate)}` : ''}${c.expiryDate ? ` · Expires: ${formatDate(c.expiryDate)}` : ''}${c.credentialId ? ` · ID: ${c.credentialId}` : ''}</div>
        ${c.credentialUrl ? `<div class="item-meta">URL: ${c.credentialUrl}</div>` : ''}
      </div>`;
    });
  }

  // PROJECTS
  if (projects.length) {
    html += sectionTitle('Projects');
    projects.forEach(pr => {
      html += `<div class="proj-item">
        <div class="item-title">${pr.name || ''}</div>
        <div class="item-sub">${[pr.organization, pr.role].filter(Boolean).join(' · ')}</div>
        ${pr.duration ? `<div class="item-meta">Duration: ${pr.duration}</div>` : ''}
        ${pr.description ? `<div class="item-desc">${pr.description}</div>` : ''}
        ${pr.technologies ? `<div class="item-desc"><strong>Technologies:</strong> ${pr.technologies}</div>` : ''}
        ${pr.githubLink ? `<div class="item-meta">GitHub: ${pr.githubLink}</div>` : ''}
        ${pr.liveUrl ? `<div class="item-meta">Live: ${pr.liveUrl}</div>` : ''}
      </div>`;
    });
  }

  // ACHIEVEMENTS
  if (achievements.length) {
    html += sectionTitle('Achievements');
    achievements.forEach(a => {
      html += `<div class="ach-item">• ${a}</div>`;
    });
  }

  // HOBBIES
  if (hobbies.length) {
    html += sectionTitle('Hobbies & Interests');
    html += `<p style="font-size:13px;">${hobbies.join('  •  ')}</p>`;
  }

  // REFERENCES
  if (references.length) {
    html += sectionTitle('References');
    html += `<div class="ref-grid">`;
    references.forEach(r => {
      html += `<div class="ref-item">
        <div class="item-title">${r.name || ''}</div>
        <div class="item-sub">${r.designation || ''}</div>
        <div class="item-meta">${r.company || ''}</div>
        ${r.email ? `<div class="item-meta">✉ ${r.email}</div>` : ''}
        ${r.phone ? `<div class="item-meta">📞 ${r.phone}</div>` : ''}
        ${r.relationship ? `<div class="item-meta">Rel: ${r.relationship}</div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  html += `</body></html>`;
  return html;
}

async function generatePDF(formData) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  try {
    const page = await browser.newPage();
    const html = generateHTML(formData);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '16px', right: '16px', bottom: '16px', left: '16px' }
    });
    return pdf;
  } finally {
    await browser.close();
  }
}

module.exports = { generatePDF };
