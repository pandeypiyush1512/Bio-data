import React, { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { X, Plus } from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    key: 'technical',
    label: 'Technical Skills',
    icon: '⚙️',
    suggestions: ['Machine Learning', 'Data Analysis', 'System Design', 'REST APIs', 'Microservices', 'CI/CD', 'Agile', 'Scrum']
  },
  {
    key: 'programming',
    label: 'Programming Languages',
    icon: '💻',
    suggestions: ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin']
  },
  {
    key: 'cloud',
    label: 'Cloud Platforms',
    icon: '☁️',
    suggestions: ['AWS', 'Azure', 'Google Cloud', 'Firebase', 'Heroku', 'Vercel', 'Netlify', 'DigitalOcean']
  },
  {
    key: 'devops',
    label: 'DevOps Tools',
    icon: '🔧',
    suggestions: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Prometheus', 'Grafana']
  },
  {
    key: 'databases',
    label: 'Databases',
    icon: '🗄️',
    suggestions: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'DynamoDB', 'Cassandra']
  },
  {
    key: 'frameworks',
    label: 'Frameworks & Libraries',
    icon: '📦',
    suggestions: ['React', 'Node.js', 'Express', 'Django', 'Spring Boot', 'Vue.js', 'Angular', 'Next.js', 'FastAPI', 'Laravel']
  },
  {
    key: 'soft',
    label: 'Soft Skills',
    icon: '🤝',
    suggestions: ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Time Management', 'Critical Thinking', 'Adaptability']
  }
];

function SkillCategory({ category, skills, onAdd, onRemove }) {
  const [input, setInput] = useState('');

  const handleAdd = (val) => {
    const s = val.trim();
    if (s && !skills.includes(s)) onAdd(category.key, s);
    setInput('');
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{category.icon}</span>
        <h4 className="font-semibold text-gray-700 text-sm">{category.label}</h4>
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{skills.length}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3 min-h-8">
        {skills.map(skill => (
          <span key={skill} className="tag">
            {skill}
            <button onClick={() => onRemove(category.key, skill)} className="hover:text-red-500 ml-1">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <input
          className="form-input text-sm py-1.5"
          placeholder={`Add ${category.label.toLowerCase()}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(input); } }}
        />
        <button onClick={() => handleAdd(input)} className="btn-secondary px-3 py-1.5 text-xs">
          <Plus size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {category.suggestions.filter(s => !skills.includes(s)).map(s => (
          <button
            key={s}
            onClick={() => handleAdd(s)}
            className="text-xs text-gray-500 border border-gray-200 rounded-full px-2 py-0.5 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors"
          >
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SkillsForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const skills = formData.skills;

  const handleAdd = (key, skill) => {
    const updated = { ...skills, [key]: [...(skills[key] || []), skill] };
    updateSection('skills', updated);
    const total = Object.values(updated).flat().length;
    if (total >= 1) markStepCompleted(3);
  };

  const handleRemove = (key, skill) => {
    updateSection('skills', { ...skills, [key]: skills[key].filter(s => s !== skill) });
  };

  const totalSkills = Object.values(skills).flat().length;

  return (
    <div className="section-card space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Add skills by category. Click suggestions or type your own.</p>
        {totalSkills > 0 && (
          <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
            {totalSkills} skills added
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SKILL_CATEGORIES.map(cat => (
          <SkillCategory
            key={cat.key}
            category={cat}
            skills={skills[cat.key] || []}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
