import React, { useEffect } from 'react';
import { useForm } from '../../context/FormContext';
import { Plus, Trash2, Briefcase, Clock } from 'lucide-react';

const EMP_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

const emptyExp = {
  companyName: '', jobTitle: '', employmentType: '', department: '', location: '',
  startDay: '', startMonth: '', startYear: '',
  endDay: '', endMonth: '', endYear: '',
  currentlyWorking: false, duration: '',
  responsibilities: '', achievements: '', technologies: ''
};

function calcDuration(exp) {
  const startY = parseInt(exp.startYear);
  const startM = MONTHS.indexOf(exp.startMonth);
  if (!startY || startM < 0) return '';

  const now = new Date();
  const endDate = exp.currentlyWorking
    ? now
    : exp.endYear && exp.endMonth
      ? new Date(parseInt(exp.endYear), MONTHS.indexOf(exp.endMonth), parseInt(exp.endDay || '1'))
      : null;

  if (!endDate) return '';
  const startDate = new Date(startY, startM, parseInt(exp.startDay || '1'));
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  if (months < 0) return '';
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (remMonths > 0) parts.push(`${remMonths}m`);
  return parts.join(' ') || '< 1m';
}

function calcTotalExperience(experiences) {
  let totalMonths = 0;
  experiences.forEach(exp => {
    const startY = parseInt(exp.startYear);
    const startM = MONTHS.indexOf(exp.startMonth);
    if (!startY || startM < 0) return;
    const now = new Date();
    const endDate = exp.currentlyWorking
      ? now
      : exp.endYear && exp.endMonth
        ? new Date(parseInt(exp.endYear), MONTHS.indexOf(exp.endMonth), 1)
        : null;
    if (!endDate) return;
    const startDate = new Date(startY, startM, 1);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    if (months > 0) totalMonths += months;
  });
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (!years && !months) return null;
  return `${years > 0 ? `${years} year${years > 1 ? 's' : ''}` : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`.trim();
}

function ExpCard({ entry, index, onChange, onRemove }) {
  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const updated = { ...entry, [field]: val };
    updated.duration = calcDuration(updated);
    onChange(index, updated);
  };

  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-primary-600" />
          <h4 className="font-semibold text-gray-700">Experience #{index + 1}</h4>
          {entry.duration && (
            <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
              <Clock size={11} /> {entry.duration}
            </span>
          )}
        </div>
        <button onClick={() => onRemove(index)} className="btn-danger text-xs px-3 py-1.5">
          <Trash2 size={14} /> Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Company Name</label>
          <input className="form-input" placeholder="e.g. Google" value={entry.companyName} onChange={set('companyName')} />
        </div>
        <div>
          <label className="form-label">Job Title</label>
          <input className="form-input" placeholder="e.g. Software Engineer" value={entry.jobTitle} onChange={set('jobTitle')} />
        </div>
        <div>
          <label className="form-label">Employment Type</label>
          <select className="form-input" value={entry.employmentType} onChange={set('employmentType')}>
            <option value="">Select type</option>
            {EMP_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Department</label>
          <input className="form-input" placeholder="e.g. Engineering" value={entry.department} onChange={set('department')} />
        </div>
        <div>
          <label className="form-label">Location</label>
          <input className="form-input" placeholder="e.g. Bangalore, India" value={entry.location} onChange={set('location')} />
        </div>

        {/* Start Date */}
        <div>
          <label className="form-label">Start Date</label>
          <div className="grid grid-cols-3 gap-1.5">
            <select className="form-input" value={entry.startDay} onChange={set('startDay')}>
              <option value="">Day</option>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="form-input" value={entry.startMonth} onChange={set('startMonth')}>
              <option value="">Month</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select className="form-input" value={entry.startYear} onChange={set('startYear')}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="form-label">End Date</label>
          <div className="grid grid-cols-3 gap-1.5">
            <select className="form-input" disabled={entry.currentlyWorking} value={entry.endDay} onChange={set('endDay')}>
              <option value="">Day</option>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="form-input" disabled={entry.currentlyWorking} value={entry.endMonth} onChange={set('endMonth')}>
              <option value="">Month</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select className="form-input" disabled={entry.currentlyWorking} value={entry.endYear} onChange={set('endYear')}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={entry.currentlyWorking} onChange={set('currentlyWorking')} className="rounded text-primary-600" />
            <span className="text-sm text-gray-600">Currently Working Here</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="form-label">Responsibilities</label>
          <textarea className="form-input resize-none" rows={3} placeholder="Describe your key responsibilities..." value={entry.responsibilities} onChange={set('responsibilities')} />
        </div>
        <div>
          <label className="form-label">Major Achievements</label>
          <textarea className="form-input resize-none" rows={2} placeholder="Key achievements..." value={entry.achievements} onChange={set('achievements')} />
        </div>
        <div>
          <label className="form-label">Technologies Used</label>
          <input className="form-input" placeholder="e.g. React, Node.js, AWS" value={entry.technologies} onChange={set('technologies')} />
        </div>
      </div>
    </div>
  );
}

export default function ExperienceForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const experience = formData.experience;
  const totalExp = calcTotalExperience(experience);

  const handleAdd = () => {
    updateSection('experience', [...experience, { ...emptyExp }]);
  };

  const handleChange = (index, updated) => {
    const arr = [...experience];
    arr[index] = updated;
    updateSection('experience', arr);
    if (arr.some(e => e.companyName && e.jobTitle)) markStepCompleted(2);
  };

  const handleRemove = (index) => {
    updateSection('experience', experience.filter((_, i) => i !== index));
  };

  return (
    <div className="section-card space-y-5">
      {totalExp && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <Clock size={20} className="text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">Total Experience</p>
            <p className="text-lg font-bold text-emerald-800">{totalExp}</p>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">Add your work experience. Duration is calculated automatically.</p>

      {experience.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No experience entries yet</p>
        </div>
      )}

      {experience.map((entry, i) => (
        <ExpCard key={i} entry={entry} index={i} onChange={handleChange} onRemove={handleRemove} />
      ))}

      <button onClick={handleAdd} className="btn-primary w-full justify-center py-3">
        <Plus size={18} /> Add Company
      </button>
    </div>
  );
}
