import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'biodata_draft';

const defaultFormData = {
  personal: {
    fullName: '', dob: '', age: '', gender: '', mobile: '', email: '',
    currentAddress: '', permanentAddress: '', city: '', state: '', country: '',
    postalCode: '', nationality: '', maritalStatus: '', languages: [],
    linkedIn: '', github: '', photoUrl: ''
  },
  education: [],
  experience: [],
  skills: {
    technical: [], programming: [], cloud: [], devops: [],
    databases: [], frameworks: [], soft: []
  },
  certifications: [],
  projects: [],
  achievements: [],
  hobbies: [],
  references: []
};

const FormContext = createContext(null);

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Auto-save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [formData]);

  const updatePersonal = useCallback((data) => {
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, ...data } }));
  }, []);

  const updateSection = useCallback((section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  }, []);

  const markStepCompleted = useCallback((step) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasDraft = Object.values(formData.personal).some(v =>
    typeof v === 'string' ? v.trim() !== '' : (Array.isArray(v) ? v.length > 0 : false)
  );

  return (
    <FormContext.Provider value={{
      formData, currentStep, setCurrentStep, completedSteps,
      updatePersonal, updateSection, markStepCompleted, resetForm, hasDraft
    }}>
      {children}
    </FormContext.Provider>
  );
}

export const useForm = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useForm must be used within FormProvider');
  return ctx;
};
