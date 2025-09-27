import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RegistrationAlertFrequency = 'immediate' | 'daily' | 'weekly';

interface AdminSettingsState {
  moderationAlerts: boolean;
  registrationAlerts: RegistrationAlertFrequency;
  defaultEventSettings: {
    maxParticipants: number;
    location: string;
  };
  dashboardPreferences: {
    compactTables: boolean;
  };
}

interface SettingsStore extends AdminSettingsState {
  toggleModerationAlerts: (value: boolean) => void;
  setRegistrationAlerts: (value: RegistrationAlertFrequency) => void;
  updateDefaultEventSettings: (updates: Partial<AdminSettingsState['defaultEventSettings']>) => void;
  updateDashboardPreferences: (updates: Partial<AdminSettingsState['dashboardPreferences']>) => void;
  resetSettings: () => void;
}

const defaultSettings: AdminSettingsState = {
  moderationAlerts: true,
  registrationAlerts: 'immediate',
  defaultEventSettings: {
    maxParticipants: 50,
    location: 'GAFC Community Hub, Rotterdam',
  },
  dashboardPreferences: {
    compactTables: false,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      toggleModerationAlerts: (value) => set({ moderationAlerts: value }),
      setRegistrationAlerts: (value) => set({ registrationAlerts: value }),
      updateDefaultEventSettings: (updates) =>
        set((state) => ({
          defaultEventSettings: {
            ...state.defaultEventSettings,
            ...updates,
          },
        })),
      updateDashboardPreferences: (updates) =>
        set((state) => ({
          dashboardPreferences: {
            ...state.dashboardPreferences,
            ...updates,
          },
        })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'admin-settings',
    }
  )
);
