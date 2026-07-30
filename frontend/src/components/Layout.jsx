import React, { useState } from 'react';
import Sidebar from './Sidebar';
import PersonalForm from './sections/PersonalForm';
import EducationForm from './sections/EducationForm';
import ExperienceForm from './sections/ExperienceForm';
import SkillsForm from './sections/SkillsForm';
import CertificationsForm from './sections/CertificationsForm';
import ProjectsForm from './sections/ProjectsForm';
import AchievementsForm from './sections/AchievementsForm';
import HobbiesForm from './sections/HobbiesForm';
import ReferencesForm from './sections/ReferencesForm';
import GeneratePDF from './GeneratePDF';
import { useForm } from '../context/FormContext';
import { FileText, RefreshCw, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const STEPS = [
  { id: 0, label: 'Personal Details', icon: '👤', component: PersonalForm },
  { id: 1, label: 'Education', icon: '🎓', component: EducationForm },
  { id: 2, label: 'Experience', icon: '💼', component: ExperienceForm },
  { id: 3, label: 'Skills', icon: '⚡', component: SkillsForm },
  { id: 4, label: 'Certifications', icon: '📜', component: CertificationsForm },
  { id: 5, label: 'Projects', icon: '🚀', component: ProjectsForm },
  { id: 6, label: 'Achievements', icon: '🏆', component: AchievementsForm },
  { id: 7, label: 'Hobbies', icon: '🎯', component: HobbiesForm },
  { id: 8, label: 'References', icon: '🤝', component: ReferencesForm },
];

export default function Layout() {
  const { currentStep, setCurrentStep, completedSteps, resetForm } = useForm();
  const [showPDF, setShowPDF] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const CurrentComponent = STEPS[currentStep].component;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved to local storage!');
  };

  const handleReset = () => {
    if (window.confirm('Reset all form data? This cannot be undone.')) {
      resetForm();
      toast.success('Form reset successfully');
    }
  };

  if (showPDF) {
    return <GeneratePDF onBack={() => setShowPDF(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* TOP NAV */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors md:hidden"
            >
              ☰
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-md">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">Biodata Generator</h1>
                <p className="text-xs text-gray-400">Professional CV Builder</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-sm mx-8">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((completedSteps.size) / STEPS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {completedSteps.size}/{STEPS.length} complete
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleSaveDraft} className="btn-secondary text-xs px-3 py-2">
              <Save size={14} />
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button onClick={handleReset} className="btn-secondary text-xs px-3 py-2 text-red-500 border-red-100 hover:bg-red-50">
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button onClick={() => setShowPDF(true)} className="btn-primary text-xs px-3 py-2">
              <FileText size={14} />
              <span className="hidden sm:inline">Generate PDF</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed md:relative md:translate-x-0 z-30
          w-64 bg-white border-r border-gray-100 shadow-sm md:shadow-none
          h-[calc(100vh-4rem)] overflow-y-auto transition-transform duration-300
        `}>
          <Sidebar steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} onSelect={setCurrentStep} />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Step Header */}
            <div className="mb-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{STEPS[currentStep].icon}</span>
                <h2 className="text-xl font-bold text-gray-900">{STEPS[currentStep].label}</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
              </div>
              {/* Step dots */}
              <div className="flex gap-1.5 mt-3">
                {STEPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(s.id)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s.id === currentStep ? 'w-6 bg-primary-600' :
                      completedSteps.has(s.id) ? 'w-3 bg-primary-300' :
                      'w-3 bg-gray-200'
                    }`}
                    title={s.label}
                  />
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="animate-fade-in">
              <CurrentComponent />
            </div>

            {/* Nav Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="btn-secondary disabled:opacity-40"
              >
                ← Previous
              </button>

              <div className="flex gap-3">
                {currentStep === STEPS.length - 1 ? (
                  <button onClick={() => setShowPDF(true)} className="btn-primary">
                    <FileText size={16} />
                    Generate PDF
                  </button>
                ) : (
                  <button onClick={handleNext} className="btn-primary">
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
