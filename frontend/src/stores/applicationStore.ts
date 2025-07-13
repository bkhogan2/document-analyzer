import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApplicationStore {
  formData: Record<string, any>;
  setFormData: (step: string, data: any) => void;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set) => ({
      formData: {},
      setFormData: (step, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [step]: { ...state.formData[step], ...data },
          },
        })),
    }),
    {
      name: 'application-form-data', // localStorage key
    }
  )
); 