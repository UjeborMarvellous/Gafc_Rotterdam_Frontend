import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Bell, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useSettingsStore, RegistrationAlertFrequency } from '../../stores/settingsStore';

const registrationAlertLabels: Record<RegistrationAlertFrequency, string> = {
  immediate: 'As registrations happen',
  daily: 'Daily summary email',
  weekly: 'Weekly digest email',
};

const AdminSettingsPage: React.FC = () => {
  const {
    moderationAlerts,
    registrationAlerts,
    defaultEventSettings,
    dashboardPreferences,
    toggleModerationAlerts,
    setRegistrationAlerts,
    updateDefaultEventSettings,
    updateDashboardPreferences,
    resetSettings,
  } = useSettingsStore();

  const handleMaxParticipantsChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      updateDefaultEventSettings({ maxParticipants: Math.max(1, parsed) });
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - Admin Panel</title>
      </Helmet>

      <div className="space-y-8">
        <header className="rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 px-8 py-10 text-white shadow-xl">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Control Centre</p>
            <h1 className="text-3xl font-semibold">Admin Settings</h1>
            <p className="text-emerald-50 text-sm md:text-base">
              Tailor moderation, communication, and workspace defaults so the GAFC Rotterdam platform stays responsive to community needs.
            </p>
          </div>
        </header>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Comment moderation</h2>
                  <p className="text-sm text-slate-600">
                    Keep community conversations respectful. Manual approval is enforced, but you can choose if reminders surface on the comments dashboard.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleModerationAlerts(!moderationAlerts)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${moderationAlerts ? 'bg-emerald-500' : 'bg-slate-300'}`}
                aria-pressed={moderationAlerts}
                aria-label="Toggle moderation reminders"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${moderationAlerts ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              Pending comments will always require approval. When reminders are enabled, a banner appears in the comments area whenever reviews are waiting.
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Bell className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Registration alerts</h2>
                  <p className="text-sm text-slate-600">
                    Choose how frequently admin summaries for new event registrations reach your inbox. Immediate alerts also power the confirmation emails we send right away.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Notification cadence</label>
              <select
                value={registrationAlerts}
                onChange={(event) => setRegistrationAlerts(event.target.value as RegistrationAlertFrequency)}
                className="col-span-1 md:col-span-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="immediate">Send immediately (recommended)</option>
                <option value="daily">Daily summary email</option>
                <option value="weekly">Weekly digest</option>
              </select>
              <p className="col-span-1 md:col-span-2 text-sm text-slate-500">
                Current setting: <span className="font-medium text-slate-700">{registrationAlertLabels[registrationAlerts]}</span>
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <SlidersHorizontal className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">Event defaults</h2>
                <p className="text-sm text-slate-600">
                  These values pre-fill the event form so the team can publish programmes faster. You can still override them for each event.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Input
                    label="Default venue or meeting point"
                    value={defaultEventSettings.location}
                    onChange={(event) => updateDefaultEventSettings({ location: event.target.value })}
                    placeholder="Enter a location"
                  />
                  <Input
                    label="Default max participants"
                    type="number"
                    min={1}
                    value={defaultEventSettings.maxParticipants.toString()}
                    onChange={(event) => handleMaxParticipantsChange(event.target.value)}
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">Dashboard layout</h2>
                <p className="text-sm text-slate-600">
                  Adjust table density when reviewing data from smaller screens or when exporting summaries.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">Compact tables</span>
                <button
                  type="button"
                  onClick={() => updateDashboardPreferences({ compactTables: !dashboardPreferences.compactTables })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${dashboardPreferences.compactTables ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  aria-pressed={dashboardPreferences.compactTables}
                  aria-label="Toggle compact table layout"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${dashboardPreferences.compactTables ? 'translate-x-5' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <RefreshCcw className="h-4 w-4 text-slate-400" />
            <span>Need a clean slate? Restore the recommended defaults.</span>
          </div>
          <Button variant="secondary" onClick={resetSettings}>
            Reset to defaults
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;

