import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Edit2} from 'lucide-react';

// Define the Review interface.  Make sure this matches your actual API response.
interface Review {
  Submission_ID: number;
  Paper_Title?: string; // Optional property
  CFP_Title?: string;  // Optional property
  Average_Rating?: number; // Optional property
  // Add other properties as needed (e.g., Paper_ID, Review_ID, etc.)
}
// interface Review {
//   Submission_ID: number;
//   Submission_Date: string; // Optional property
//   Status: string;  // Optional property
//   Paper_ID: number; // Optional property
//   CFP_ID:number;
//   Submitted_By:number;
//   // Add other properties as needed (e.g., Paper_ID, Review_ID, etc.)
// }

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token is missing.');
        }

        const response = await axios.get('http://localhost:3000/reviews/reviews', {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Attach token
          },
        });

        // Check the response status before setting the data
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from the server.");
        }

        setReviews(response.data);

      } catch (err: any) { // Type the error for better handling
        console.error('Error fetching reviews:', err); // Log the full error object

        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(err.response.data.message || 'Error fetching reviews.'); // Get error message from the server if available
        } else if (err.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          setError('No response received from the server.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(err.message || 'An unexpected error occurred.');
        }

      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handlePerformReview = (review: Review) => {
    // Handle the review action here
    console.log('Performing review for:', review);
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CFP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CFP ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.Submission_ID}>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {review.Submission_ID || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.Submission_Date || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.Status || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {review.Paper_ID || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.CFP_ID || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.Submitted_By || 'N/A'}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {review.Submission_ID || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.Paper_Title || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.CFP_Title || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {review.Average_Rating || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="ml-4 flex">
                  <button
                    onClick={() => handlePerformReview(review)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Review
                  </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}