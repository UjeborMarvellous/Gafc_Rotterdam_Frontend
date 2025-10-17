import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useContactMessagesStore } from '../../stores/contactMessagesStore';
import { ContactMessage } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { formatDateTime, truncateText } from '../../utils';

const filterLabels: Record<'all' | 'new' | 'past', string> = {
  all: 'All enquiries',
  new: 'New',
  past: 'Past',
};

const statusStyles: Record<'new' | 'in_review' | 'resolved', string> = {
  new: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  in_review: 'bg-amber-100 text-amber-700 border border-amber-200',
  resolved: 'bg-slate-200 text-slate-700 border border-slate-300',
};

const messageStatusLabels: Record<'new' | 'in_review' | 'resolved', string> = {
  new: 'New',
  in_review: 'In review',
  resolved: 'Resolved',
};

const AdminContactMessagesPage: React.FC = () => {
  const { messages, fetchMessages, isLoading, error, pagination } = useContactMessagesStore();
  const [filter, setFilter] = useState<'all' | 'new' | 'past'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const params: { page?: number; limit?: number } = {
      page: 1,
      limit: 100, // Fetch more messages to handle client-side filtering
    };

    fetchMessages(params);
  }, [fetchMessages]);

  // Categorize messages into New (recent) and Past (7+ days old)
  const { newMessages, pastMessages } = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const newMsgs: typeof messages = [];
    const pastMsgs: typeof messages = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      if (messageDate >= sevenDaysAgo) {
        newMsgs.push(message);
      } else {
        pastMsgs.push(message);
      }
    });

    return { newMessages: newMsgs, pastMessages: pastMsgs };
  }, [messages]);

  const totals = useMemo(() => {
    return {
      total: messages.length,
      new: newMessages.length,
      past: pastMessages.length,
    };
  }, [messages.length, newMessages.length, pastMessages.length]);

  const displayMessages = useMemo(() => {
    switch (filter) {
      case 'new':
        return newMessages;
      case 'past':
        return pastMessages;
      default:
        return messages;
    }
  }, [filter, newMessages, pastMessages, messages]);

  return (
    <>
      <Helmet>
        <title>Contact enquiries - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contact enquiries</h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor incoming messages from the public site and keep follow-ups organised.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-white px-4 py-3 shadow border border-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{totals.total}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow border border-emerald-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">New</p>
              <p className="mt-1 text-xl font-bold text-emerald-700">{totals.new}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow border border-slate-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Past</p>
              <p className="mt-1 text-xl font-bold text-slate-700">{totals.past}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-2">
          {(Object.keys(filterLabels) as Array<'all' | 'new' | 'past'>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === key
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {filterLabels[key]}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : displayMessages.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
            <p className="text-lg font-semibold text-slate-800 mb-2">
              No {filter === 'all' ? 'enquiries' : filter === 'new' ? 'new messages' : 'past messages'} in this view
            </p>
            <p className="text-sm text-slate-500">
              {filter === 'all'
                ? 'When supporters submit the contact form, the details will appear here.'
                : filter === 'new'
                ? 'No new messages from the last 7 days.'
                : 'No messages older than 7 days.'}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 min-w-[200px]">
                      Supporter
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 min-w-[150px]">
                      Subject
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 min-w-[120px]">
                      Received
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 min-w-[100px]">
                      Status
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 min-w-[200px]">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayMessages.map((message) => (
                    <tr key={message._id} className="hover:bg-slate-50">
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-800">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 text-sm sm:text-base truncate max-w-48">{message.name}</div>
                          <a href={`mailto:${message.email}`} className="text-xs text-slate-500 hover:text-slate-700 truncate max-w-48 block">
                            {message.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-700">
                        <div className="truncate max-w-48">
                          {message.subject ? truncateText(message.subject, 40) : <span className="text-slate-400">(No subject)</span>}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">
                        <div className="text-xs sm:text-sm">
                          {formatDateTime(message.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${statusStyles[message.status]}`}>
                          {messageStatusLabels[message.status]}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm text-slate-600 hidden lg:block truncate max-w-48">
                            {truncateText(message.message, 40)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMessage(message)}
                            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 flex-shrink-0"
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage ? `Message from ${selectedMessage.name}` : 'Message detail'}
        size="md"
      >
        {selectedMessage && (
          <div className="space-y-4 text-sm text-slate-700">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
                <p className="mt-1 font-medium text-slate-900">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                <a href={`mailto:${selectedMessage.email}`} className="mt-1 block font-medium text-slate-900 hover:text-slate-600">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</p>
                <p className="mt-1 text-slate-800">{selectedMessage.subject || 'No subject provided'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Received</p>
                <p className="mt-1 text-slate-800">{formatDateTime(selectedMessage.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
              <div className="mt-2 whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                {selectedMessage.message}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminContactMessagesPage;
