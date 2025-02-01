import React from 'react';

const submissions = [
  { id: 1, title: 'Machine Learning in Healthcare', author: 'Dr. Sarah Johnson', status: 'Under Review', date: '2024-03-15' },
  { id: 2, title: 'Blockchain Security Protocols', author: 'Prof. Michael Chen', status: 'Accepted', date: '2024-03-14' },
  { id: 3, title: 'Cloud Computing Optimization', author: 'Dr. Emily Brown', status: 'Under Review', date: '2024-03-13' },
  { id: 4, title: 'AI Ethics Framework', author: 'Prof. David Wilson', status: 'Rejected', date: '2024-03-12' },
];

export function Submissions() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 rounded-full ${submission.status === 'Accepted' ? 'bg-green-100 text-green-800' : submission.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}