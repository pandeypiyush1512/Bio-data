import React, { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { Plus, Trash2, Trophy } from 'lucide-react';

const SUGGESTIONS = [
  'Employee of the Year 2023',
  'Increased team productivity by 40%',
  'Led a team of 10 engineers',
  'Published research paper in IEEE',
  'Won national coding hackathon',
  'Reduced system downtime by 60%',
  'Delivered project 2 weeks ahead of schedule',
];

export default function AchievementsForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const achievements = formData.achievements;
  const [input, setInput] = useState('');

  const handleAdd = (val) => {
    const a = val.trim();
    if (a && !achievements.includes(a)) {
      const updated = [...achievements, a];
      updateSection('achievements', updated);
      markStepCompleted(6);
    }
    setInput('');
  };

  const handleRemove = (i) => {
    updateSection('achievements', achievements.filter((_, idx) => idx !== i));
  };

  return (
    <div className="section-card space-y-5">
      <p className="text-sm text-gray-500">List your key achievements, awards, and recognitions.</p>

      <div className="space-y-2">
        {achievements.map((a, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl animate-fade-in">
            <Trophy size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-700">{a}</span>
            <button onClick={() => handleRemove(i)} className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
          <Trophy size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No achievements added yet</p>
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="form-input"
          placeholder="Describe an achievement..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(input); } }}
        />
        <button onClick={() => handleAdd(input)} className="btn-primary px-4">
          <Plus size={16} /> Add
        </button>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">Suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.filter(s => !achievements.includes(s)).map(s => (
            <button
              key={s}
              onClick={() => handleAdd(s)}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors text-left"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
