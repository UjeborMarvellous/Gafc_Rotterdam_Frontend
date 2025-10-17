import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, CheckCircle, Hourglass, RefreshCcw, Filter } from 'lucide-react';
import { useRegistrationsStore } from '../../stores/registrationsStore';
import { useEventsStore } from '../../stores/eventsStore';
import { useSettingsStore } from '../../stores/settingsStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { formatDateTime, formatDate, getPaginationInfo } from '../../utils';
import { EventRegistration, EventSummary } from '../../types';

const STATUS_OPTIONS = ['all', 'confirmed', 'pending', 'cancelled'] as const;

const AdminRegistrationsPage: React.FC = () => {
  const limit = 20;
  const { registrations, fetchRegistrations, isLoading, pagination, error } = useRegistrationsStore();
  const { events, fetchEvents } = useEventsStore();
  const { dashboardPreferences } = useSettingsStore();

  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>('all');
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    if (events.length === 0) {
      fetchEvents({ limit: 100 }).catch(() => null);
    }
  }, [events.length, fetchEvents]);

  useEffect(() => {
    const params: {
      page: number;
      limit: number;
      eventId?: string;
      status?: string;
    } = {
      page,
      limit,
    };

    if (selectedEvent !== 'all') {
      params.eventId = selectedEvent;
    }
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    fetchRegistrations(params).catch(() => null);
  }, [fetchRegistrations, page, limit, selectedEvent, statusFilter]);

  const eventMap = useMemo(() => {
    const map: Record<string, EventSummary> = {};
    events.forEach((event) => {
      map[event._id] = {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
      };
    });
    return map;
  }, [events]);

  const resolveEventDetails = (registration: EventRegistration): EventSummary | undefined => {
    if (typeof registration.eventId === 'string') {
      return eventMap[registration.eventId];
    }
    return registration.eventId;
  };

  // Categorize events as active or expired
  const { activeEvents, expiredEvents } = useMemo(() => {
    const now = new Date();
    const active: typeof events = [];
    const expired: typeof events = [];

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate >= now && event.isActive) {
        active.push(event);
      } else {
        expired.push(event);
      }
    });

    return { activeEvents: active, expiredEvents: expired };
  }, [events]);

  // Separate registrations by event status
  const { activeRegistrations, expiredRegistrations } = useMemo(() => {
    const active: typeof registrations = [];
    const expired: typeof registrations = [];

    registrations.forEach((registration) => {
      const eventDetails = resolveEventDetails(registration);
      if (eventDetails && eventDetails.date) {
        const eventDate = new Date(eventDetails.date);
        const now = new Date();
        if (eventDate >= now) {
          active.push(registration);
        } else {
          expired.push(registration);
        }
      } else {
        // If event details can't be resolved, treat as expired
        expired.push(registration);
      }
    });

    return { activeRegistrations: active, expiredRegistrations: expired };
  }, [registrations, eventMap]);

  const currentRegistrations = showExpired ? expiredRegistrations : activeRegistrations;
  const totalRegistrations = pagination?.total ?? currentRegistrations.length;

  const confirmedCount = useMemo(
    () => currentRegistrations.filter((registration) => registration.status === 'confirmed').length,
    [currentRegistrations]
  );

  const pendingCount = useMemo(
    () => currentRegistrations.filter((registration) => registration.status === 'pending').length,
    [currentRegistrations]
  );

  const eventOptions = useMemo(() => {
    const base = [{ value: 'all', label: 'All events' }];
    const sorted = [...events]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((event) => ({ value: event._id, label: event.title }));
    return base.concat(sorted);
  }, [events]);

  const compactRows = dashboardPreferences.compactTables;
  const rowPadding = compactRows ? 'py-3' : 'py-4';

  const paginationInfo = pagination
    ? getPaginationInfo(pagination.current, pagination.total, limit)
    : {
        current: page,
        totalPages: 1,
        hasNext: false,
        hasPrev: page > 1,
        startItem: registrations.length > 0 ? 1 : 0,
        endItem: registrations.length,
      };

  const handleRefresh = () => {
    setPage(1);
    fetchRegistrations({
      page: 1,
      limit,
      eventId: selectedEvent !== 'all' ? selectedEvent : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    }).catch(() => null);
  };

  return (
    <>
      <Helmet>
        <title>Registrations - Admin Panel</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Event registrations</h1>
            <p className="text-sm text-slate-600 mt-1">
              Review every supporter who has reserved a spot, monitor capacity, and follow up when needed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex gap-2">
              <Button
                variant={!showExpired ? "primary" : "secondary"}
                onClick={() => setShowExpired(false)}
                className="text-sm"
              >
                Confirmed
              </Button>
              <Button
                variant={showExpired ? "primary" : "secondary"}
                onClick={() => setShowExpired(true)}
                className="text-sm"
              >
                Expired
              </Button>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setStatusFilter('all');
                setSelectedEvent('all');
                setPage(1);
              }}
              className="text-sm w-full sm:w-auto"
            >
              Clear filters
            </Button>
            <Button onClick={handleRefresh} className="text-sm w-full sm:w-auto">
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-slate-500">Total registrations</span>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">{totalRegistrations}</p>
          </div>
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-slate-500">Confirmed</span>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">{confirmedCount}</p>
          </div>
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-slate-500">Expired</span>
              <Hourglass className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">{expiredRegistrations.length}</p>
          </div>
        </div>

        <div className="rounded-xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Filter className="h-4 w-4 text-slate-400" />
              Filters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Event</label>
                <select
                  value={selectedEvent}
                  onChange={(event) => {
                    setSelectedEvent(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  {eventOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number]);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="rounded-xl sm:rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          ) : currentRegistrations.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No {showExpired ? 'expired' : 'confirmed'} registrations found
              </h3>
              <p>No registrations match the current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-4 font-semibold">Participant</th>
                    <th scope="col" className="px-4 sm:px-6 py-4 font-semibold">Contact</th>
                    <th scope="col" className="px-4 sm:px-6 py-4 font-semibold">Event</th>
                    <th scope="col" className="px-4 sm:px-6 py-4 font-semibold">Registered on</th>
                    <th scope="col" className="px-4 sm:px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {currentRegistrations.map((registration) => {
                    const eventDetails = resolveEventDetails(registration);
                    return (
                      <tr key={registration._id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-slate-900 text-sm sm:text-base">{registration.userName}</div>
                            {eventDetails?.location && (
                              <div className="text-xs text-slate-500 truncate max-w-48">{eventDetails.location}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-slate-700 text-sm sm:text-base truncate max-w-48">{registration.userEmail}</div>
                            <div className="text-xs text-slate-500">{registration.phoneNumber}</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-slate-900 text-sm sm:text-base truncate max-w-48">
                                {eventDetails?.title ?? 'Event removed'}
                              </div>
                              {showExpired && eventDetails && (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-700">
                                  Expired
                                </span>
                              )}
                            </div>
                            {eventDetails?.date && (
                              <div className="text-xs text-slate-500">{formatDate(eventDetails.date, 'MMM d, yyyy')}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-slate-700 text-sm sm:text-base">
                            {registration.registrationDate ? formatDateTime(registration.registrationDate) : 'Invalid Date'}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${
                              registration.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : registration.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-xl sm:rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 py-4 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            Showing {paginationInfo.startItem}-{paginationInfo.endItem} of {totalRegistrations}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              disabled={!paginationInfo.hasPrev || isLoading}
              onClick={() => paginationInfo.hasPrev && setPage((prev) => Math.max(1, prev - 1))}
              className="text-sm px-3 sm:px-4"
            >
              Previous
            </Button>
            <span className="text-xs text-slate-500 px-2">
              Page {pagination?.current ?? page} {pagination ? `of ${pagination.pages}` : ''}
            </span>
            <Button
              variant="secondary"
              disabled={!paginationInfo.hasNext || isLoading}
              onClick={() => paginationInfo.hasNext && setPage((prev) => prev + 1)}
              className="text-sm px-3 sm:px-4"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegistrationsPage;
