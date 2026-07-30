import React, { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { Plus, X } from 'lucide-react';

const SUGGESTIONS = [
  'Reading', 'Photography', 'Travelling', 'Gaming', 'Cooking', 'Painting',
  'Music', 'Blogging', 'Fitness', 'Chess', 'Cycling', 'Yoga', 'Dancing',
  'Volunteering', 'Open Source Contribution', 'Sketching', 'Gardening'
];

const COLORS = [
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-orange-50 text-orange-700 border-orange-100',
  'bg-pink-50 text-pink-700 border-pink-100',
  'bg-teal-50 text-teal-700 border-teal-100',
];

export default function HobbiesForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const hobbies = formData.hobbies;
  const [input, setInput] = useState('');

  const handleAdd = (val) => {
    const h = val.trim();
    if (h && !hobbies.includes(h)) {
      const updated = [...hobbies, h];
      updateSection('hobbies', updated);
      markStepCompleted(7);
    }
    setInput('');
  };

  const handleRemove = (h) => {
    updateSection('hobbies', hobbies.filter(item => item !== h));
  };

  return (
    <div className="section-card space-y-5">
      <p className="text-sm text-gray-500">Add your hobbies and personal interests.</p>

      <div className="flex flex-wrap gap-2 min-h-12">
        {hobbies.map((h, i) => (
          <span key={h} className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-full text-sm font-medium animate-fade-in ${COLORS[i % COLORS.length]}`}>
            {h}
            <button onClick={() => handleRemove(h)} className="hover:opacity-70 transition-opacity">
              <X size={13} />
            </button>
          </span>
        ))}
      </div>

      {hobbies.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400 text-sm">🎯 No hobbies added yet</p>
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="form-input max-w-sm"
          placeholder="Type a hobby and press Enter"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(input); } }}
        />
        <button onClick={() => handleAdd(input)} className="btn-primary px-4">
          <Plus size={16} /> Add
        </button>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.filter(s => !hobbies.includes(s)).map(s => (
            <button
              key={s}
              onClick={() => handleAdd(s)}
              className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
