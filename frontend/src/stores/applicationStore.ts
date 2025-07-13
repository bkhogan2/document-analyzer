import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Section definitions with metadata
export interface ApplicationSection {
  id: string;
  label: string;
  stepCount: number;
  isRequired: boolean;
  isCompleted: boolean;
  progress: number; // 0-1 for partial completion
}

export interface ApplicationStep {
  id: string;
  sectionId: string;
  title: string;
  isCompleted: boolean;
  isRequired: boolean;
}

export interface ApplicationState {
  // Application metadata
  applicationId: string | null;
  applicationType: string | null;
  createdAt: Date | null;
  lastModified: Date | null;
  
  // Navigation state
  currentStepIndex: number;
  currentSectionIndex: number;
  
  // Progress tracking
  sections: ApplicationSection[];
  steps: ApplicationStep[];
  
  // Form data
  formData: Record<string, unknown>;
  
  // Actions
  setApplicationId: (id: string) => void;
  setApplicationType: (type: string) => void;
  setCurrentStep: (stepIndex: number) => void;
  setCurrentSection: (sectionIndex: number) => void;
  updateSectionProgress: (sectionId: string, progress: number) => void;
  markStepCompleted: (stepId: string, completed: boolean) => void;
  markSectionCompleted: (sectionId: string, completed: boolean) => void;
  setFormData: (step: string, data: Record<string, unknown>) => void;
  resetApplication: () => void;
}

// Default sections configuration
const defaultSections: ApplicationSection[] = [
  { id: 'welcome', label: 'Welcome', stepCount: 1, isRequired: true, isCompleted: false, progress: 0 },
  { id: 'loan-info', label: 'Loan Information', stepCount: 2, isRequired: true, isCompleted: false, progress: 0 },
  { id: 'business-info', label: 'Business Info', stepCount: 3, isRequired: true, isCompleted: false, progress: 0 },
  { id: 'owner-info', label: 'Owner Information', stepCount: 2, isRequired: true, isCompleted: false, progress: 0 },
  { id: 'certification', label: 'Certification', stepCount: 1, isRequired: true, isCompleted: false, progress: 0 },
  { id: 'pre-screen', label: 'Pre-Screen Questions', stepCount: 2, isRequired: true, isCompleted: false, progress: 0 },
  { id: 'documents', label: 'Documents', stepCount: 2, isRequired: true, isCompleted: false, progress: 0 },
  { id: 'review', label: 'Review', stepCount: 1, isRequired: true, isCompleted: false, progress: 0 },
];

// Default steps configuration
const defaultSteps: ApplicationStep[] = [
  // Welcome
  { id: 'welcome-1', sectionId: 'welcome', title: 'Welcome', isCompleted: false, isRequired: true },
  
  // Loan Information
  { id: 'loan-info-1', sectionId: 'loan-info', title: 'Loan Information (1)', isCompleted: false, isRequired: true },
  { id: 'loan-info-2', sectionId: 'loan-info', title: 'Loan Information (2)', isCompleted: false, isRequired: true },
  
  // Business Info
  { id: 'business-info-1', sectionId: 'business-info', title: 'Business Info (1)', isCompleted: false, isRequired: true },
  { id: 'business-info-2', sectionId: 'business-info', title: 'Business Info (2)', isCompleted: false, isRequired: true },
  { id: 'business-info-3', sectionId: 'business-info', title: 'Business Info (3)', isCompleted: false, isRequired: true },
  
  // Owner Information
  { id: 'owner-info-1', sectionId: 'owner-info', title: 'Owner Information (1)', isCompleted: false, isRequired: true },
  { id: 'owner-info-2', sectionId: 'owner-info', title: 'Owner Information (2)', isCompleted: false, isRequired: true },
  
  // Certification
  { id: 'certification-1', sectionId: 'certification', title: 'Certification', isCompleted: false, isRequired: true },
  
  // Pre-Screen Questions
  { id: 'pre-screen-1', sectionId: 'pre-screen', title: 'Pre-Screen Questions (1)', isCompleted: false, isRequired: true },
  { id: 'pre-screen-2', sectionId: 'pre-screen', title: 'Pre-Screen Questions (2)', isCompleted: false, isRequired: true },
  
  // Documents
  { id: 'documents-1', sectionId: 'documents', title: 'Documents (1)', isCompleted: false, isRequired: true },
  { id: 'documents-2', sectionId: 'documents', title: 'Documents (2)', isCompleted: false, isRequired: true },
  
  // Review
  { id: 'review-1', sectionId: 'review', title: 'Review', isCompleted: false, isRequired: true },
];

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      // Initial state
      applicationId: null,
      applicationType: null,
      createdAt: null,
      lastModified: null,
      currentStepIndex: 0,
      currentSectionIndex: 0,
      sections: defaultSections,
      steps: defaultSteps,
      formData: {},
      
      // Actions
      setApplicationId: (id: string) => set({ 
        applicationId: id,
        createdAt: new Date(),
        lastModified: new Date()
      }),
      
      setApplicationType: (type: string) => set({ 
        applicationType: type,
        lastModified: new Date()
      }),
      
      setCurrentStep: (stepIndex: number) => {
        const { steps } = get();
        const step = steps[stepIndex];
        if (!step) return;
        
        const sectionIndex = get().sections.findIndex(s => s.id === step.sectionId);
        
        set({ 
          currentStepIndex: stepIndex,
          currentSectionIndex: sectionIndex,
          lastModified: new Date()
        });
      },
      
      setCurrentSection: (sectionIndex: number) => {
        const { sections, steps } = get();
        const section = sections[sectionIndex];
        if (!section) return;
        
        // Find the first step of this section
        const firstStepIndex = steps.findIndex(s => s.sectionId === section.id);
        if (firstStepIndex === -1) return;
        
        set({ 
          currentStepIndex: firstStepIndex,
          currentSectionIndex: sectionIndex,
          lastModified: new Date()
        });
      },
      
      updateSectionProgress: (sectionId: string, progress: number) => {
        set(state => ({
          sections: state.sections.map(section => 
            section.id === sectionId 
              ? { ...section, progress: Math.max(0, Math.min(1, progress)) }
              : section
          ),
          lastModified: new Date()
        }));
      },
      
      markStepCompleted: (stepId: string, completed: boolean) => {
        set(state => {
          const updatedSteps = state.steps.map(step => 
            step.id === stepId ? { ...step, isCompleted: completed } : step
          );
          
          // Recalculate section progress
          const updatedSections = state.sections.map(section => {
            const sectionSteps = updatedSteps.filter(step => step.sectionId === section.id);
            const completedSteps = sectionSteps.filter(step => step.isCompleted).length;
            const progress = sectionSteps.length > 0 ? completedSteps / sectionSteps.length : 0;
            
            return {
              ...section,
              progress,
              isCompleted: progress === 1
            };
          });
          
          return {
            steps: updatedSteps,
            sections: updatedSections,
            lastModified: new Date()
          };
        });
      },
      
      markSectionCompleted: (sectionId: string, completed: boolean) => {
        set(state => {
          const updatedSections = state.sections.map(section => 
            section.id === sectionId 
              ? { ...section, isCompleted: completed, progress: completed ? 1 : 0 }
              : section
          );
          
          // Mark all steps in the section as completed
          const updatedSteps = state.steps.map(step => 
            step.sectionId === sectionId 
              ? { ...step, isCompleted: completed }
              : step
          );
          
          return {
            sections: updatedSections,
            steps: updatedSteps,
            lastModified: new Date()
          };
        });
      },
      
      setFormData: (step: string, data: Record<string, unknown>) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [step]: { 
              ...(typeof state.formData[step] === 'object' && state.formData[step] !== null ? state.formData[step] as Record<string, unknown> : {}), 
              ...data 
            },
          },
          lastModified: new Date()
        })),
      
      resetApplication: () => set({
        applicationId: null,
        applicationType: null,
        createdAt: null,
        lastModified: null,
        currentStepIndex: 0,
        currentSectionIndex: 0,
        sections: defaultSections,
        steps: defaultSteps,
        formData: {}
      }),
    }),
    {
      name: 'application-store', // localStorage key
    }
  )
); 