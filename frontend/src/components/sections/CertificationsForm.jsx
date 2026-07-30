import React from 'react';
import { useForm } from '../../context/FormContext';
import { Plus, Trash2, Award } from 'lucide-react';

const emptyCert = {
  name: '', organization: '', issueDate: '', expiryDate: '',
  credentialId: '', credentialUrl: ''
};

function CertCard({ entry, index, onChange, onRemove }) {
  const set = (field) => (e) => onChange(index, { ...entry, [field]: e.target.value });

  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-primary-600" />
          <h4 className="font-semibold text-gray-700">Certification #{index + 1}</h4>
        </div>
        <button onClick={() => onRemove(index)} className="btn-danger text-xs px-3 py-1.5">
          <Trash2 size={14} /> Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Certification Name</label>
          <input className="form-input" placeholder="e.g. AWS Solutions Architect" value={entry.name} onChange={set('name')} />
        </div>
        <div>
          <label className="form-label">Issuing Organization</label>
          <input className="form-input" placeholder="e.g. Amazon Web Services" value={entry.organization} onChange={set('organization')} />
        </div>
        <div>
          <label className="form-label">Issue Date</label>
          <input className="form-input" type="month" value={entry.issueDate} onChange={set('issueDate')} />
        </div>
        <div>
          <label className="form-label">Expiry Date (Optional)</label>
          <input className="form-input" type="month" value={entry.expiryDate} onChange={set('expiryDate')} />
        </div>
        <div>
          <label className="form-label">Credential ID</label>
          <input className="form-input" placeholder="e.g. ABC123XYZ" value={entry.credentialId} onChange={set('credentialId')} />
        </div>
        <div>
          <label className="form-label">Credential URL</label>
          <input className="form-input" type="url" placeholder="https://..." value={entry.credentialUrl} onChange={set('credentialUrl')} />
        </div>
      </div>
    </div>
  );
}

export default function CertificationsForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const certifications = formData.certifications;

  const handleAdd = () => updateSection('certifications', [...certifications, { ...emptyCert }]);
  const handleChange = (index, updated) => {
    const arr = [...certifications];
    arr[index] = updated;
    updateSection('certifications', arr);
    if (arr.some(c => c.name)) markStepCompleted(4);
  };
  const handleRemove = (index) => updateSection('certifications', certifications.filter((_, i) => i !== index));

  return (
    <div className="section-card space-y-5">
      <p className="text-sm text-gray-500">Add your professional certifications and credentials.</p>

      {certifications.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Award size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No certifications added yet</p>
        </div>
      )}

      {certifications.map((entry, i) => (
        <CertCard key={i} entry={entry} index={i} onChange={handleChange} onRemove={handleRemove} />
      ))}

      <button onClick={handleAdd} className="btn-primary w-full justify-center py-3">
        <Plus size={18} /> Add Certification
      </button>
    </div>
  );
}
