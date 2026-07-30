Act as a senior Full Stack Software Engineer and UI/UX designer.

I want you to build a complete web application that runs on my localhost. The application should allow a user to enter their personal, educational, and professional details through a modern, responsive web interface, and then generate a professionally formatted Biodata/CV PDF that can either be previewed or downloaded.

## Project Requirements

### Tech Stack
- Frontend: React.js (preferred) with modern UI components.
- Backend: Node.js with Express.
- PDF Generation: PDFKit, jsPDF, Puppeteer, or any suitable library that generates a clean professional PDF.
- Styling: Tailwind CSS (preferred) or Material UI.
- The application should be easy to run locally.

## Functional Requirements

### 1. Personal Details Section

Ask the user for:

- Full Name
- Date of Birth (Date Picker)
- Age (Auto-calculate from DOB if possible)
- Gender
- Mobile Number
- Email Address
- Current Address
- Permanent Address
- City
- State
- Country
- Postal Code
- Nationality
- Marital Status
- Languages Known
- LinkedIn Profile (optional)
- GitHub Profile (optional)
- Passport Size Photograph Upload (optional)

---

### 2. Education Section

The education section must support adding multiple education entries dynamically.

Each education record should include:

- Degree
  - Diploma
  - Bachelor's
  - Master's
  - PhD
  - Certification
  - Other

- Course Name
- Specialization
- College / University Name
- Board / University
- City
- Country
- Start Date (Month + Year)
- End Date (Month + Year)
- Currently Studying (Checkbox)
- Percentage / CGPA
- Grade
- Additional Remarks (optional)

Provide an "Add Another Education" button.

---

### 3. Professional Experience

This should also support unlimited dynamic entries.

Each experience entry should include:

- Company Name
- Job Title
- Employment Type
  - Full Time
  - Part Time
  - Contract
  - Internship
  - Freelance

- Department
- Location
- Start Date
  - Day
  - Month
  - Year

- End Date
  - Day
  - Month
  - Year

- Currently Working Here (Checkbox)

If checked:
Hide End Date.

Automatically calculate:

- Duration in Years
- Months
- Days

Fields:

- Responsibilities (Multi-line)
- Major Achievements
- Technologies Used

Display:

Total Experience =
Sum of all experience durations.

Provide an "Add Another Company" button.

---

### 4. Skills Section

Dynamic tags:

- Technical Skills
- Programming Languages
- Cloud Platforms
- DevOps Tools
- Databases
- Frameworks
- Soft Skills

---

### 5. Certifications

Allow multiple entries.

Each should contain:

- Certification Name
- Organization
- Issue Date
- Expiry Date (optional)
- Credential ID
- Credential URL

---

### 6. Projects

Allow multiple project entries.

Each project should contain:

- Project Name
- Organization
- Duration
- Description
- Technologies Used
- Role
- GitHub Link
- Live URL

---

### 7. Achievements

Dynamic list.

---

### 8. Hobbies & Interests

Dynamic list.

---

### 9. References

Allow multiple references.

Each reference should contain:

- Name
- Designation
- Company
- Email
- Phone Number
- Relationship

---

## User Interface

Create a professional and clean UI.

Requirements:

- Responsive Design
- Sidebar Navigation
- Progress Indicator
- Multi-step Form Wizard
- Beautiful Cards
- Smooth Animations
- Form Validation
- Modern Typography
- Mobile Friendly

Buttons:

- Save Draft
- Next
- Previous
- Reset Form
- Generate PDF

---

## PDF Generation

After clicking "Generate PDF":

Generate a professional biodata/resume PDF.

The PDF should contain:

- Profile Photo (if uploaded)
- Personal Details
- Education
- Work Experience
- Skills
- Certifications
- Projects
- Achievements
- Languages
- Hobbies
- References

Formatting should be ATS-friendly with clean spacing, proper headings, and professional typography.

---

## PDF Options

After generation, provide two buttons:

1. View PDF
   - Open in a new browser tab.

2. Download PDF
   - Download with filename:
     <FullName>_Biodata.pdf

---

## Additional Features

- Auto-save form data in Local Storage.
- Restore saved draft when reopening the application.
- Real-time form validation.
- Required field indicators.
- Success/error notifications.
- Loading indicator while generating PDF.
- Auto-calculate age from date of birth.
- Auto-calculate total professional experience from employment history.
- Prevent overlapping employment periods if possible.
- Allow editing the form after previewing the PDF.
- Ensure accessibility and keyboard navigation.

---

## Project Structure

Organize the project with:

- Frontend
- Backend
- Components
- Pages
- Services
- Utilities
- PDF Generator Module
- Assets

Use reusable React components and maintain clean code architecture.

---

## Deliverables

Generate:

1. Complete React frontend.
2. Complete Express backend.
3. REST APIs (if required).
4. Professional UI.
5. PDF generation functionality.
6. Local storage integration.
7. Validation logic.
8. Complete folder structure.
9. Installation instructions.
10. README.md.
11. Commands to run the application locally.

The final application should be production-quality, responsive, well-documented, easy to extend, and fully functional on localhost.
