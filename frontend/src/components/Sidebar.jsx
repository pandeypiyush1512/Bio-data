import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Sidebar({ steps, currentStep, completedSteps, onSelect }) {
  return (
    <nav className="p-4 space-y-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Sections</p>
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isDone = completedSteps.has(step.id) && !isActive;

        return (
          <button
            key={step.id}
            onClick={() => onSelect(step.id)}
            className={`w-full text-left sidebar-item ${
              isActive ? 'active' : isDone ? 'completed' : 'inactive'
            }`}
          >
            <span className="text-lg">{step.icon}</span>
            <span className="flex-1">{step.label}</span>
            {isDone && <CheckCircle size={15} className="text-primary-500 flex-shrink-0" />}
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />}
          </button>
        );
      })}

      <div className="pt-4 mt-4 border-t border-gray-100 px-4">
        <p className="text-xs text-gray-400 text-center">
          Data auto-saved locally
        </p>
        <div className="flex items-center gap-1 justify-center mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-600">Auto-save active</span>
        </div>
      </div>
    </nav>
  );
}
