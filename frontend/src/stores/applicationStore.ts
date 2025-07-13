import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApplicationSection {
  id: string;
  label: string;
  stepCount: number;
  isRequired: boolean;
  isCompleted: boolean;
  progress: number;
}

export interface ApplicationStep {
  id: string;
  sectionId: string;
  title: string;
  isCompleted: boolean;
  isRequired: boolean;
}

export interface PerAppState {
  applicationType: string;
  createdAt: string; // ISO string
  lastModified: string; // ISO string
  currentStepIndex: number;
  currentSectionIndex: number;
  sections: ApplicationSection[];
  steps: ApplicationStep[];
  formData: Record<string, unknown>;
}

export interface ApplicationStoreState {
  applications: Record<string, PerAppState>;
  currentApplicationId: string | null;
  selectApplication: (id: string, type: string) => void;
  setCurrentStep: (stepIndex: number) => void;
  setCurrentSection: (sectionIndex: number) => void;
  updateSectionProgress: (sectionId: string, progress: number) => void;
  markStepCompleted: (stepId: string, completed: boolean) => void;
  markSectionCompleted: (sectionId: string, completed: boolean) => void;
  setFormData: (step: string, data: Record<string, unknown>) => void;
  resetApplication: (id: string) => void;
}

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

const defaultSteps: ApplicationStep[] = [
  { id: 'welcome-1', sectionId: 'welcome', title: 'Welcome', isCompleted: false, isRequired: true },
  { id: 'loan-info-1', sectionId: 'loan-info', title: 'Loan Information (1)', isCompleted: false, isRequired: true },
  { id: 'loan-info-2', sectionId: 'loan-info', title: 'Loan Information (2)', isCompleted: false, isRequired: true },
  { id: 'business-info-1', sectionId: 'business-info', title: 'Business Info (1)', isCompleted: false, isRequired: true },
  { id: 'business-info-2', sectionId: 'business-info', title: 'Business Info (2)', isCompleted: false, isRequired: true },
  { id: 'business-info-3', sectionId: 'business-info', title: 'Business Info (3)', isCompleted: false, isRequired: true },
  { id: 'owner-info-1', sectionId: 'owner-info', title: 'Owner Information (1)', isCompleted: false, isRequired: true },
  { id: 'owner-info-2', sectionId: 'owner-info', title: 'Owner Information (2)', isCompleted: false, isRequired: true },
  { id: 'certification-1', sectionId: 'certification', title: 'Certification', isCompleted: false, isRequired: true },
  { id: 'pre-screen-1', sectionId: 'pre-screen', title: 'Pre-Screen Questions (1)', isCompleted: false, isRequired: true },
  { id: 'pre-screen-2', sectionId: 'pre-screen', title: 'Pre-Screen Questions (2)', isCompleted: false, isRequired: true },
  { id: 'documents-1', sectionId: 'documents', title: 'Documents (1)', isCompleted: false, isRequired: true },
  { id: 'documents-2', sectionId: 'documents', title: 'Documents (2)', isCompleted: false, isRequired: true },
  { id: 'review-1', sectionId: 'review', title: 'Review', isCompleted: false, isRequired: true },
];

export const useApplicationStore = create<ApplicationStoreState>()(
  persist(
    (set, get) => ({
      applications: {},
      currentApplicationId: null,

      selectApplication: (id, type) => {
        console.log('[store] selectApplication', { id, type });
        const state = get();
        if (state.currentApplicationId === id && state.applications[id]) return;
        // If not initialized, initialize
        if (!state.applications[id]) {
          get().resetApplication(id, type);
        }
        set({ currentApplicationId: id });
      },

      setCurrentStep: (stepIndex) => {
        console.log('[store] setCurrentStep', { stepIndex });
        const id = get().currentApplicationId;
        if (!id) return;
        set(state => {
          const app = state.applications[id];
          if (!app) return {};
          const step = app.steps[stepIndex];
          if (!step) return {};
          const sectionIndex = app.sections.findIndex(s => s.id === step.sectionId);
          return {
            applications: {
              ...state.applications,
              [id]: {
                ...app,
                currentStepIndex: stepIndex,
                currentSectionIndex: sectionIndex,
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      setCurrentSection: (sectionIndex) => {
        console.log('[store] setCurrentSection', { sectionIndex });
        const id = get().currentApplicationId;
        if (!id) return;
        set(state => {
          const app = state.applications[id];
          if (!app) return {};
          const section = app.sections[sectionIndex];
          if (!section) return {};
          const firstStepIndex = app.steps.findIndex(s => s.sectionId === section.id);
          if (firstStepIndex === -1) return {};
          return {
            applications: {
              ...state.applications,
              [id]: {
                ...app,
                currentStepIndex: firstStepIndex,
                currentSectionIndex: sectionIndex,
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      updateSectionProgress: (sectionId, progress) => {
        console.log('[store] updateSectionProgress', { sectionId, progress });
        const id = get().currentApplicationId;
        if (!id) return;
        set(state => {
          const app = state.applications[id];
          if (!app) return {};
          return {
            applications: {
              ...state.applications,
              [id]: {
                ...app,
                sections: app.sections.map(section =>
                  section.id === sectionId
                    ? { ...section, progress: Math.max(0, Math.min(1, progress)) }
                    : section
                ),
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      markStepCompleted: (stepId, completed) => {
        console.log('[store] markStepCompleted', { stepId, completed });
        const id = get().currentApplicationId;
        if (!id) return;
        set(state => {
          const app = state.applications[id];
          if (!app) return {};
          const updatedSteps = app.steps.map(step =>
            step.id === stepId ? { ...step, isCompleted: completed } : step
          );
          const updatedSections = app.sections.map(section => {
            const sectionSteps = updatedSteps.filter(step => step.sectionId === section.id);
            const completedSteps = sectionSteps.filter(step => step.isCompleted).length;
            const progress = sectionSteps.length > 0 ? completedSteps / sectionSteps.length : 0;
            return {
              ...section,
              progress,
              isCompleted: progress === 1,
            };
          });
          return {
            applications: {
              ...state.applications,
              [id]: {
                ...app,
                steps: updatedSteps,
                sections: updatedSections,
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      markSectionCompleted: (sectionId, completed) => {
        console.log('[store] markSectionCompleted', { sectionId, completed });
        const id = get().currentApplicationId;
        if (!id) return;
        set(state => {
          const app = state.applications[id];
          if (!app) return {};
          const updatedSections = app.sections.map(section =>
            section.id === sectionId
              ? { ...section, isCompleted: completed, progress: completed ? 1 : 0 }
              : section
          );
          const updatedSteps = app.steps.map(step =>
            step.sectionId === sectionId
              ? { ...step, isCompleted: completed }
              : step
          );
          return {
            applications: {
              ...state.applications,
              [id]: {
                ...app,
                sections: updatedSections,
                steps: updatedSteps,
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      setFormData: (step, data) => {
        console.log('[store] setFormData', { step, data });
        const id = get().currentApplicationId;
        if (!id) return;
        set(state => {
          const app = state.applications[id];
          if (!app) return {};
          return {
            applications: {
              ...state.applications,
              [id]: {
                ...app,
                formData: {
                  ...app.formData,
                  [step]: {
                    ...(typeof app.formData[step] === 'object' && app.formData[step] !== null ? app.formData[step] as Record<string, unknown> : {}),
                    ...data,
                  },
                },
                lastModified: new Date().toISOString(),
              },
            },
          };
        });
      },

      resetApplication: (id, type = 'sba') => {
        console.log('[store] resetApplication', { id, type });
        set(state => ({
          applications: {
            ...state.applications,
            [id]: {
              applicationType: type,
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              currentStepIndex: 0,
              currentSectionIndex: 0,
              sections: JSON.parse(JSON.stringify(defaultSections)),
              steps: JSON.parse(JSON.stringify(defaultSteps)),
              formData: {},
            },
          },
        }));
      },
    }),
    {
      name: 'application-store',
    }
  )
); 