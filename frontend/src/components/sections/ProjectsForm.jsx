import React from 'react';
import { useForm } from '../../context/FormContext';
import { Plus, Trash2, Rocket } from 'lucide-react';

const emptyProject = {
  name: '', organization: '', duration: '', description: '',
  technologies: '', role: '', githubLink: '', liveUrl: ''
};

function ProjectCard({ entry, index, onChange, onRemove }) {
  const set = (field) => (e) => onChange(index, { ...entry, [field]: e.target.value });

  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket size={18} className="text-primary-600" />
          <h4 className="font-semibold text-gray-700">Project #{index + 1}</h4>
        </div>
        <button onClick={() => onRemove(index)} className="btn-danger text-xs px-3 py-1.5">
          <Trash2 size={14} /> Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Project Name</label>
          <input className="form-input" placeholder="e.g. E-Commerce Platform" value={entry.name} onChange={set('name')} />
        </div>
        <div>
          <label className="form-label">Organization</label>
          <input className="form-input" placeholder="e.g. Personal / Company Name" value={entry.organization} onChange={set('organization')} />
        </div>
        <div>
          <label className="form-label">Duration</label>
          <input className="form-input" placeholder="e.g. Jan 2023 – Mar 2023" value={entry.duration} onChange={set('duration')} />
        </div>
        <div>
          <label className="form-label">Your Role</label>
          <input className="form-input" placeholder="e.g. Full Stack Developer" value={entry.role} onChange={set('role')} />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">Description</label>
          <textarea className="form-input resize-none" rows={3} placeholder="Brief description of the project..." value={entry.description} onChange={set('description')} />
        </div>
        <div>
          <label className="form-label">Technologies Used</label>
          <input className="form-input" placeholder="e.g. React, Node.js, MongoDB" value={entry.technologies} onChange={set('technologies')} />
        </div>
        <div>
          <label className="form-label">GitHub Link</label>
          <input className="form-input" type="url" placeholder="https://github.com/..." value={entry.githubLink} onChange={set('githubLink')} />
        </div>
        <div>
          <label className="form-label">Live URL</label>
          <input className="form-input" type="url" placeholder="https://yourproject.com" value={entry.liveUrl} onChange={set('liveUrl')} />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsForm() {
  const { formData, updateSection, markStepCompleted } = useForm();
  const projects = formData.projects;

  const handleAdd = () => updateSection('projects', [...projects, { ...emptyProject }]);
  const handleChange = (index, updated) => {
    const arr = [...projects];
    arr[index] = updated;
    updateSection('projects', arr);
    if (arr.some(p => p.name)) markStepCompleted(5);
  };
  const handleRemove = (index) => updateSection('projects', projects.filter((_, i) => i !== index));

  return (
    <div className="section-card space-y-5">
      <p className="text-sm text-gray-500">Showcase your key projects — personal, academic, or professional.</p>

      {projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Rocket size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No projects added yet</p>
        </div>
      )}

      {projects.map((entry, i) => (
        <ProjectCard key={i} entry={entry} index={i} onChange={handleChange} onRemove={handleRemove} />
      ))}

      <button onClick={handleAdd} className="btn-primary w-full justify-center py-3">
        <Plus size={18} /> Add Project
      </button>
    </div>
  );
}
