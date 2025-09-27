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

  useEffect(() => {
    if (events.length === 0) {
      fetchEvents({ limit: 100, active: true }).catch(() => null);
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

  const totalRegistrations = pagination?.total ?? registrations.length;

  const confirmedCount = useMemo(
    () => registrations.filter((registration) => registration.status === 'confirmed').length,
    [registrations]
  );

  const pendingCount = useMemo(
    () => registrations.filter((registration) => registration.status === 'pending').length,
    [registrations]
  );

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

  const resolveEventDetails = (registration: EventRegistration): EventSummary | undefined => {
    if (typeof registration.eventId === 'string') {
      return eventMap[registration.eventId];
    }
    return registration.eventId;
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

      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Event registrations</h1>
            <p className="text-sm text-slate-600">
              Review every supporter who has reserved a spot, monitor capacity, and follow up when needed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setStatusFilter('all');
                setSelectedEvent('all');
                setPage(1);
              }}
              className="text-sm"
            >
              Clear filters
            </Button>
            <Button onClick={handleRefresh} className="text-sm">
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total registrations</span>
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{totalRegistrations}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Confirmed</span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{confirmedCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Pending follow-up</span>
              <Hourglass className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{pendingCount}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Filter className="h-4 w-4 text-slate-400" />
              Filters
            </div>
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Event</label>
                <select
                  value={selectedEvent}
                  onChange={(event) => {
                    setSelectedEvent(event.target.value);
                    setPage(1);
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {eventOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-48">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number]);
                    setPage(1);
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No registrations match the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className={`px-6 ${rowPadding}`}>Participant</th>
                    <th scope="col" className={`px-6 ${rowPadding}`}>Contact</th>
                    <th scope="col" className={`px-6 ${rowPadding}`}>Event</th>
                    <th scope="col" className={`px-6 ${rowPadding}`}>Registered on</th>
                    <th scope="col" className={`px-6 ${rowPadding}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {registrations.map((registration) => {
                    const eventDetails = resolveEventDetails(registration);
                    return (
                      <tr key={registration._id} className="hover:bg-slate-50">
                        <td className={`px-6 ${rowPadding}`}>
                          <div className="font-medium text-slate-900">{registration.userName}</div>
                          {eventDetails?.location && (
                            <div className="text-xs text-slate-500">{eventDetails.location}</div>
                          )}
                        </td>
                        <td className={`px-6 ${rowPadding}`}>
                          <div className="text-slate-700">{registration.userEmail}</div>
                          <div className="text-xs text-slate-500">{registration.phoneNumber}</div>
                        </td>
                        <td className={`px-6 ${rowPadding}`}>
                          <div className="font-medium text-slate-900">{eventDetails?.title ?? 'Event removed'}</div>
                          {eventDetails?.date && (
                            <div className="text-xs text-slate-500">{formatDate(eventDetails.date, 'PPP')}</div>
                          )}
                        </td>
                        <td className={`px-6 ${rowPadding}`}>
                          <div className="text-slate-700">{formatDateTime(registration.registrationDate)}</div>
                        </td>
                        <td className={`px-6 ${rowPadding}`}>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
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

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            Showing {paginationInfo.startItem}-{paginationInfo.endItem} of {totalRegistrations}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={!paginationInfo.hasPrev || isLoading}
              onClick={() => paginationInfo.hasPrev && setPage((prev) => Math.max(1, prev - 1))}
              className="text-sm"
            >
              Previous
            </Button>
            <span className="text-xs text-slate-500">
              Page {pagination?.current ?? page} {pagination ? `of ${pagination.pages}` : ''}
            </span>
            <Button
              variant="secondary"
              disabled={!paginationInfo.hasNext || isLoading}
              onClick={() => paginationInfo.hasNext && setPage((prev) => prev + 1)}
              className="text-sm"
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
