import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApplicationStore {
  formData: Record<string, unknown>;
  setFormData: (step: string, data: Record<string, unknown>) => void;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      formData: {},
      setFormData: (step, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [step]: { 
              ...(typeof state.formData[step] === 'object' && state.formData[step] !== null ? state.formData[step] as Record<string, unknown> : {}), 
              ...data 
            },
          },
        })),
    }),
    {
      name: 'application-form-data', // localStorage key
    }
  )
); 