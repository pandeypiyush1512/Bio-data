import React from 'react';
import { useForm } from '../../context/FormContext';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

const DEGREES = ['Diploma', "Bachelor's", "Master's", 'PhD', 'Certification', 'Other'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const emptyEdu = {
  degree: '', courseName: '', specialization: '', collegeName: '',
  board: '', city: '', country: '', startDate: '', endDate: '',
  currentlyStudying: false, percentage: '', grade: '', remarks: ''
};

function EduCard({ entry, index, onChange, onRemove }) {
  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(index, { ...entry, [field]: val });
  };

  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-primary-600" />
          <h4 className="font-semibold text-gray-700">Education #{index + 1}</h4>
        </div>
        <button onClick={() => onRemove(index)} className="btn-danger text-xs px-3 py-1.5">
          <Trash2 size={14} /> Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Degree</label>
          <select className="form-input" value={entry.degree} onChange={set('degree')}>
            <option value="">Select degree</option>
            {DEGREES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Course Name</label>
          <input className="form-input" placeholder="e.g. Computer Science" value={entry.courseName} onChange={set('courseName')} />
        </div>
        <div>
          <label className="form-label">Specialization</label>
          <input className="form-input" placeholder="e.g. Artificial Intelligence" value={entry.specialization} onChange={set('specialization')} />
        </div>
        <div>
          <label className="form-label">College / University Name</label>
          <input className="form-input" placeholder="e.g. IIT Bombay" value={entry.collegeName} onChange={set('collegeName')} />
        </div>
        <div>
          <label className="form-label">Board / University</label>
          <input className="form-input" placeholder="e.g. Mumbai University" value={entry.board} onChange={set('board')} />
        </div>
        <div>
          <label className="form-label">City</label>
          <input className="form-input" placeholder="e.g. Mumbai" value={entry.city} onChange={set('city')} />
        </div>
        <div>
          <label className="form-label">Country</label>
          <input className="form-input" placeholder="e.g. India" value={entry.country} onChange={set('country')} />
        </div>
        <div>
          <label className="form-label">Start Date</label>
          <div className="grid grid-cols-2 gap-2">
            <select className="form-input" value={entry.startMonth || ''} onChange={e => onChange(index, { ...entry, startMonth: e.target.value })}>
              <option value="">Month</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select className="form-input" value={entry.startYear || ''} onChange={e => onChange(index, { ...entry, startYear: e.target.value })}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">End Date</label>
          <div className="grid grid-cols-2 gap-2">
            <select className="form-input" disabled={entry.currentlyStudying} value={entry.endMonth || ''} onChange={e => onChange(index, { ...entry, endMonth: e.target.value })}>
              <option value="">Month</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select className="form-input" disabled={entry.currentlyStudying} value={entry.endYear || ''} onChange={e => onChange(index, { ...entry, endYear: e.target.value })}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={entry.currentlyStudying} onChange={set('currentlyStudying')} className="rounded text-primary-600" />
            <span className="text-sm text-gray-600">Currently Studying</span>
          </label>
        </div>
        <div>
          <label className="form-label">Percentage / CGPA</label>
          <input className="form-input" placeholder="e.g. 85% or 8.5 CGPA" value={entry.percentage} onChange={set('percentage')} />
        </div>
        <div>
          <label className="form-label">Grade</label>
          <input className="form-input" placeholder="e.g. A+" value={entry.grade} onChange={set('grade')} />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">Additional Remarks</label>
          <textarea className="form-input resize-none" rows={2} placeholder="Any additional info..." value={entry.remarks} onChange={set('remarks')} />
        </div>
      </div>
    </div>
  );
}

export default function EducationForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const education = formData.education;

  const handleAdd = () => {
    updateSection('education', [...education, { ...emptyEdu }]);
  };

  const handleChange = (index, updated) => {
    const arr = [...education];
    arr[index] = updated;
    updateSection('education', arr);
    if (arr.some(e => e.degree && e.collegeName)) markStepCompleted(1);
  };

  const handleRemove = (index) => {
    updateSection('education', education.filter((_, i) => i !== index));
  };

  return (
    <div className="section-card space-y-5">
      <p className="text-sm text-gray-500">Add your educational background. Click "Add Education" to include multiple entries.</p>

      {education.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <GraduationCap size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No education entries yet</p>
        </div>
      )}

      {education.map((entry, i) => (
        <EduCard key={i} entry={entry} index={i} onChange={handleChange} onRemove={handleRemove} />
      ))}

      <button onClick={handleAdd} className="btn-primary w-full justify-center py-3">
        <Plus size={18} /> Add Education
      </button>
    </div>
  );
}
