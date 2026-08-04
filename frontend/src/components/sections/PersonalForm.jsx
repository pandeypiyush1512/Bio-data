import React, { useEffect, useRef } from 'react';
import { useForm } from '../../context/FormContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'];
const LANGUAGE_SUGGESTIONS = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Portuguese', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Urdu'];

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="form-label">
        {label}{required && <span className="required-star">*</span>}
      </label>
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default function PersonalForm() {
  const { formData, updatePersonal, markStepCompleted } = useForm();
  const p = formData.personal;
  const [errors, setErrors] = React.useState({});
  const [langInput, setLangInput] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = useRef();

  // Auto-calculate age from DOB
  useEffect(() => {
    if (p.dob) {
      const birth = new Date(p.dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age >= 0 && age < 150) {
        updatePersonal({ age: String(age) });
      }
    }
  }, [p.dob]);

  const set = (field) => (e) => {
    updatePersonal({ [field]: e.target.value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!p.fullName?.trim()) e.fullName = 'Full name is required';
    if (!p.mobile?.trim()) e.mobile = 'Mobile number is required';
    if (!p.email?.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(p.email)) e.email = 'Invalid email format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addLanguage = (lang) => {
    const l = lang.trim();
    if (l && !p.languages.includes(l)) {
      updatePersonal({ languages: [...p.languages, l] });
    }
    setLangInput('');
  };

  const removeLanguage = (lang) => {
    updatePersonal({ languages: p.languages.filter(l => l !== lang) });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || ''}/api/upload-photo`, fd);
      updatePersonal({ photoUrl: res.data.url });
      toast.success('Photo uploaded!');
    } catch {
      // Fallback: use local blob URL
      const url = URL.createObjectURL(file);
      updatePersonal({ photoUrl: url });
      toast.success('Photo ready (local preview)');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (validate()) markStepCompleted(0);
  }, [p.fullName, p.email, p.mobile]);

  return (
    <div className="section-card space-y-6">
      {/* Photo Upload */}
      <div className="flex items-start gap-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex-shrink-0">
          {p.photoUrl ? (
            <div className="relative">
              <img src={p.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
              <button
                onClick={() => updatePersonal({ photoUrl: '' })}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-blue-200 flex items-center justify-center text-3xl">
              👤
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Profile Photo</p>
          <p className="text-xs text-gray-500 mb-3">Upload a passport-size photo (JPG, PNG, max 5MB)</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary text-xs px-3 py-2"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Choose Photo'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" required error={errors.fullName}>
            <input className="form-input" placeholder="John Doe" value={p.fullName} onChange={set('fullName')} />
          </Field>
          <Field label="Email Address" required error={errors.email}>
            <input className="form-input" type="email" placeholder="john@example.com" value={p.email} onChange={set('email')} />
          </Field>
          <Field label="Mobile Number" required error={errors.mobile}>
            <input className="form-input" placeholder="+91 9876543210" value={p.mobile} onChange={set('mobile')} />
          </Field>
          <Field label="Date of Birth">
            <input className="form-input" type="date" value={p.dob} onChange={set('dob')} />
          </Field>
          <Field label="Age (Auto-calculated)">
            <input className="form-input bg-gray-50" value={p.age} readOnly placeholder="Auto-filled from DOB" />
          </Field>
          <Field label="Gender">
            <select className="form-input" value={p.gender} onChange={set('gender')}>
              <option value="">Select gender</option>
              {GENDERS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Marital Status">
            <select className="form-input" value={p.maritalStatus} onChange={set('maritalStatus')}>
              <option value="">Select status</option>
              {MARITAL.map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Nationality">
            <input className="form-input" placeholder="e.g. Indian" value={p.nationality} onChange={set('nationality')} />
          </Field>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Current Address">
            <textarea className="form-input resize-none" rows={2} placeholder="House No, Street..." value={p.currentAddress} onChange={set('currentAddress')} />
          </Field>
          <Field label="Permanent Address">
            <textarea className="form-input resize-none" rows={2} placeholder="House No, Street..." value={p.permanentAddress} onChange={set('permanentAddress')} />
          </Field>
          <Field label="City">
            <input className="form-input" placeholder="Mumbai" value={p.city} onChange={set('city')} />
          </Field>
          <Field label="State">
            <input className="form-input" placeholder="Maharashtra" value={p.state} onChange={set('state')} />
          </Field>
          <Field label="Country">
            <input className="form-input" placeholder="India" value={p.country} onChange={set('country')} />
          </Field>
          <Field label="Postal Code">
            <input className="form-input" placeholder="400001" value={p.postalCode} onChange={set('postalCode')} />
          </Field>
        </div>
      </div>

      {/* Online Profiles */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Online Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="LinkedIn Profile">
            <input className="form-input" placeholder="https://linkedin.com/in/..." value={p.linkedIn} onChange={set('linkedIn')} />
          </Field>
          <Field label="GitHub Profile">
            <input className="form-input" placeholder="https://github.com/..." value={p.github} onChange={set('github')} />
          </Field>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Languages Known</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {p.languages.map(lang => (
            <span key={lang} className="tag">
              {lang}
              <button onClick={() => removeLanguage(lang)} className="hover:text-red-500 ml-1">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="form-input max-w-xs"
            placeholder="Type a language and press Enter"
            value={langInput}
            onChange={e => setLangInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLanguage(langInput); } }}
          />
          <button onClick={() => addLanguage(langInput)} className="btn-secondary px-4">Add</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {LANGUAGE_SUGGESTIONS.filter(l => !p.languages.includes(l)).map(lang => (
            <button
              key={lang}
              onClick={() => addLanguage(lang)}
              className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors"
            >
              + {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
