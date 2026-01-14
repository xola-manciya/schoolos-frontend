import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/general/notification-preferences/unsubscribe/', {
        token,
        type: 'all'
      });
      return response.data;
    },
    onSuccess: () => {
      setStatus('success');
    },
    onError: () => {
      setStatus('error');
    }
  });

  const resubscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/general/notification-preferences/resubscribe/', {
        token
      });
      return response.data;
    },
    onSuccess: () => {
      setStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  });

  useEffect(() => {
    if (token) {
      unsubscribeMutation.mutate();
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing your request...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Unsubscribed</h2>
            <p className="mt-2 text-gray-600">
              You have been unsubscribed from all email and SMS notifications.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              You will no longer receive:
            </p>
            <ul className="mt-2 text-sm text-gray-500 space-y-1">
              <li>• Payment reminders</li>
              <li>• Payment confirmations</li>
              <li>• School announcements</li>
              <li>• General notifications</li>
            </ul>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => resubscribeMutation.mutate()}
                disabled={resubscribeMutation.isPending}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {resubscribeMutation.isPending ? 'Processing...' : 'Resubscribe'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Error</h2>
            <p className="mt-2 text-gray-600">
              We couldn't process your unsubscribe request. The link may be invalid or expired.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Go to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
