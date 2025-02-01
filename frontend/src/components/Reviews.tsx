import React from 'react';

const reviews = [
  { id: 1, title: 'Machine Learning in Healthcare', reviewer: 'Dr. Sarah Johnson', status: 'Under Review', date: '2024-03-15' },
  { id: 2, title: 'Blockchain Security Protocols', reviewer: 'Prof. Michael Chen', status: 'Accepted', date: '2024-03-14' },
  { id: 3, title: 'Cloud Computing Optimization', reviewer: 'Dr. Emily Brown', status: 'Under Review', date: '2024-03-13' },
  { id: 4, title: 'AI Ethics Framework', reviewer: 'Prof. David Wilson', status: 'Rejected', date: '2024-03-12' },
];

export function Reviews() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer
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
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{review.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.reviewer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 rounded-full ${review.status === 'Accepted' ? 'bg-green-100 text-green-800' : review.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}