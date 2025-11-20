import { create } from 'zustand';

export type UserRole = 'client' | 'specialist';

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  profession: string;
  address: string;
  region: string;
  district: string;
}

interface RegisterStore {
  role: UserRole;
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  setRole: (role: UserRole) => void;
  reset: () => void;
}

const defaultFormData: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  password: "",
  profession: "",
  address: "",
  region: "",
  district: "",
};

export const useRegisterStore = create<RegisterStore>((set) => ({
  role: "specialist",
  formData: defaultFormData,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setRole: (role) => set(() => ({ role })),
  reset: () =>
    set(() => ({
      role: "specialist",
      formData: defaultFormData,
    })),
}));


