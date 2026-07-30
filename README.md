# Biodata CV Generator

A full-stack web application that lets you fill in your personal, educational, and professional details through a clean multi-step form, then instantly generates a professionally formatted, ATS-friendly PDF biodata/resume — viewable and downloadable right in the browser.

---

## Screenshots

> Fill your details across 9 sections → Click Generate PDF → View or Download instantly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| PDF Generation | Puppeteer (Chromium headless) |
| State Management | React Context API |
| Persistence | Browser LocalStorage |
| Icons | Lucide React |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

---

## Features

### Form Sections (9 steps)

1. **Personal Details** — Full name, DOB, auto-calculated age, gender, mobile, email, current/permanent address, city, state, country, postal code, nationality, marital status, languages (tag input with suggestions), LinkedIn, GitHub, passport photo upload
2. **Education** — Unlimited entries; degree type, course, specialization, college/university, board, city, country, start/end month+year, "Currently Studying" toggle, percentage/CGPA, grade, remarks
3. **Professional Experience** — Unlimited entries; company, job title, employment type, department, location, day/month/year start and end dates, "Currently Working Here" toggle that hides end date, auto-calculated duration per job, **total experience** summed across all roles, responsibilities, achievements, technologies
4. **Skills** — 7 categorized tag-based skill groups: Technical Skills, Programming Languages, Cloud Platforms, DevOps Tools, Databases, Frameworks & Libraries, Soft Skills — with quick-add suggestions
5. **Certifications** — Name, issuing organization, issue/expiry dates, credential ID and URL
6. **Projects** — Name, organization, duration, description, technologies, role, GitHub link, live URL
7. **Achievements** — Dynamic list with quick-add suggestions
8. **Hobbies & Interests** — Dynamic colorful tag list with suggestions
9. **References** — Name, designation, company, email, phone, relationship

### UI / UX
- Sticky sidebar with section navigation and completion indicators
- Step progress dots at the top of each section
- Smooth fade-in animations between steps
- Mobile-responsive layout
- Save Draft button (persists to LocalStorage)
- Reset Form with confirmation
- Real-time required field validation with inline error messages
- Toast notifications for all actions
- Auto-save to LocalStorage on every keystroke — data survives page refresh

### PDF Generation
- Generates a full professional PDF via Puppeteer (headless Chromium)
- Profile photo included if uploaded
- ATS-friendly layout — clean sections, proper headings, professional typography
- Saved as a static file on the backend and served at a direct URL
- **View PDF** — opens in browser's native PDF viewer (new tab)
- **Download PDF** — saves as `FirstName_LastName_Biodata.pdf`
- Inline `<object>` preview embedded in the page
- PDFs auto-expire and are cleaned up after 30 minutes

---

## Project Structure

```
Bio-data/
├── backend/
│   ├── server.js           # Express server, REST endpoints, PDF store
│   ├── pdfGenerator.js     # Puppeteer HTML → PDF renderer
│   ├── uploads/            # Uploaded profile photos (gitignored)
│   ├── generated/          # Generated PDFs served as static files (gitignored)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css               # Tailwind + custom utility classes
│   │   ├── context/
│   │   │   └── FormContext.jsx     # Global form state + LocalStorage sync
│   │   └── components/
│   │       ├── Layout.jsx          # Main layout, header, nav buttons
│   │       ├── Sidebar.jsx         # Step navigation sidebar
│   │       ├── GeneratePDF.jsx     # PDF generation page
│   │       └── sections/
│   │           ├── PersonalForm.jsx
│   │           ├── EducationForm.jsx
│   │           ├── ExperienceForm.jsx
│   │           ├── SkillsForm.jsx
│   │           ├── CertificationsForm.jsx
│   │           ├── ProjectsForm.jsx
│   │           ├── AchievementsForm.jsx
│   │           ├── HobbiesForm.jsx
│   │           └── ReferencesForm.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── start.ps1               # One-click startup script (Windows PowerShell)
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher (v24 recommended)
- npm v9 or higher
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/pandeypiyush1512/Bio-data.git
cd Bio-data
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

> Puppeteer will automatically download a Chromium browser (~170 MB) on first install. If prompted to approve scripts, run:
> ```bash
> npm approve-scripts puppeteer
> npm install
> ```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Running the App

You need **two terminals** — one for the backend, one for the frontend.

**Terminal 1 — Backend**
```bash
cd backend
node server.js
```
Backend runs at: `http://localhost:5000`

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

Then open **http://localhost:5173** in your browser.

**Windows shortcut** — run the PowerShell startup script to open both in separate windows:
```powershell
.\start.ps1
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate-pdf` | Accepts form JSON, returns `{ key, filename, viewUrl, downloadUrl }` |
| `GET` | `/api/view-pdf/:key` | Serves the PDF inline for browser viewing |
| `GET` | `/api/download-pdf/:key` | Serves the PDF as a file download |
| `POST` | `/api/upload-photo` | Accepts a profile photo, returns hosted URL |
| `GET` | `/api/health` | Health check — returns `{ status: "ok" }` |

---

## How PDF Generation Works

1. User fills the form and clicks **Generate PDF**
2. Frontend POSTs the entire form data as JSON to `/api/generate-pdf`
3. Backend builds a complete styled HTML document from the form data
4. Puppeteer launches a headless Chromium browser, renders the HTML, and exports it as an A4 PDF
5. The PDF is saved to `backend/generated/` as a static file
6. Backend returns the direct file URL to the frontend
7. Frontend shows View and Download buttons pointing to the real file URL — no blob URLs, works reliably on all browsers including Windows Edge

---

## LocalStorage Auto-Save

Every field change is automatically saved to `localStorage` under the key `biodata_draft`. When you reopen the app, your last session is restored automatically. Use the **Reset Form** button to clear everything.

---

## License

MIT
