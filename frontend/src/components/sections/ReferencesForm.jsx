import React from 'react';
import { useForm } from '../../context/FormContext';
import { Plus, Trash2, Users } from 'lucide-react';

const emptyRef = {
  name: '', designation: '', company: '', email: '', phone: '', relationship: ''
};

function RefCard({ entry, index, onChange, onRemove }) {
  const set = (field) => (e) => onChange(index, { ...entry, [field]: e.target.value });

  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-primary-600" />
          <h4 className="font-semibold text-gray-700">Reference #{index + 1}</h4>
        </div>
        <button onClick={() => onRemove(index)} className="btn-danger text-xs px-3 py-1.5">
          <Trash2 size={14} /> Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Full Name</label>
          <input className="form-input" placeholder="e.g. Dr. John Smith" value={entry.name} onChange={set('name')} />
        </div>
        <div>
          <label className="form-label">Designation</label>
          <input className="form-input" placeholder="e.g. Senior Manager" value={entry.designation} onChange={set('designation')} />
        </div>
        <div>
          <label className="form-label">Company</label>
          <input className="form-input" placeholder="e.g. Infosys" value={entry.company} onChange={set('company')} />
        </div>
        <div>
          <label className="form-label">Relationship</label>
          <input className="form-input" placeholder="e.g. Former Manager" value={entry.relationship} onChange={set('relationship')} />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="john@company.com" value={entry.email} onChange={set('email')} />
        </div>
        <div>
          <label className="form-label">Phone Number</label>
          <input className="form-input" placeholder="+91 9876543210" value={entry.phone} onChange={set('phone')} />
        </div>
      </div>
    </div>
  );
}

export default function ReferencesForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const references = formData.references;

  const handleAdd = () => updateSection('references', [...references, { ...emptyRef }]);
  const handleChange = (index, updated) => {
    const arr = [...references];
    arr[index] = updated;
    updateSection('references', arr);
    if (arr.some(r => r.name)) markStepCompleted(8);
  };
  const handleRemove = (index) => updateSection('references', references.filter((_, i) => i !== index));

  return (
    <div className="section-card space-y-5">
      <p className="text-sm text-gray-500">Add professional references who can vouch for your work.</p>

      {references.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No references added yet</p>
        </div>
      )}

      {references.map((entry, i) => (
        <RefCard key={i} entry={entry} index={i} onChange={handleChange} onRemove={handleRemove} />
      ))}

      <button onClick={handleAdd} className="btn-primary w-full justify-center py-3">
        <Plus size={18} /> Add Reference
      </button>
    </div>
  );
}
