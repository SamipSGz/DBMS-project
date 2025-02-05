import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SubmissionRetrive } from '../types';

export function Submissions() {
  const [submissions, setSubmissions] = useState<SubmissionRetrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token is missing.');

        const response = await axios.get('http://localhost:3000/submissions/submissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(response.data);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error fetching submissions:', err.message);
          setError(err.message);
        } else {
          console.error('Unexpected error:', err);
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CFP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.Submission_ID}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.Paper_Title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.CFP_Title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 rounded-full ${
                      submission.Status === 'Accepted'
                        ? 'bg-green-100 text-green-800'
                        : submission.Status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {submission.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(submission.Submission_Date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
