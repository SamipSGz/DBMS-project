import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit2 } from 'lucide-react';

interface Review {
  Submission_ID: number;
  Paper_Title?: string;
  CFP_Title?: string;
  Average_Rating?: number;
}

interface ReviewFormData {
  submissionId: number;
  ratings: { [key: string]: number };
  comments: { [key: string]: string };
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(true);
  const [error, setError] = useState('');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const criteria = [
    { id: 'novelty', label: 'Novelty/Originality', description: 'Evaluate the originality and innovation of the work' },
    { id: 'technical', label: 'Technical Soundness/Correctness', description: 'Assess the technical accuracy and validity' },
    { id: 'significance', label: 'Significance/Impact', description: 'Evaluate potential impact in the field' },
    { id: 'clarity', label: 'Clarity and Presentation', description: 'Assess writing quality and organization' },
    { id: 'relevance', label: 'Relevance to the Conference/Journal', description: 'Evaluate fit with venue scope' },
    { id: 'methodology', label: 'Methodology', description: 'Assess research methods and approach' },
    { id: 'evaluation', label: 'Evaluation and Results', description: 'Review quality of results and analysis' },
    { id: 'literature', label: 'Literature Review', description: 'Evaluate coverage of related work' },
    { id: 'ethical', label: 'Ethical Considerations', description: 'Review ethical implications if applicable' },
    { id: 'overall', label: 'Overall Recommendation', description: 'Final evaluation and recommendation' }
  ];

  const [ratings, setRatings] = useState<{ [key: string]: number }>(
    criteria.reduce((acc, { id }) => ({ ...acc, [id]: 0 }), {})
  );

  const [comments, setComments] = useState<{ [key: string]: string }>(
    criteria.reduce((acc, { id }) => ({ ...acc, [id]: '' }), {})
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token is missing.');
        }

        const response = await axios.get('http://localhost:3000/reviews/reviews', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });


        if (response.status === 403) {
          setLoading(false);
        }
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from the server.");
        }
        
        setReviews(response.data);
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        if (err.response) {
          setError(err.response.data.message || 'Error fetching reviews.');
        } else if (err.request) {
          setError('No response received from the server.');
        } else {
          setError(err.message || 'An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
        setUnauthorized(false);
      }
    };

    fetchReviews();
  }, []);

  const handlePerformReview = (review: Review) => {
    setSelectedReview(review);
    setIsReviewFormOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      const reviewData: ReviewFormData = {
        submissionId: selectedReview.Submission_ID,
        ratings,
        comments
      };
      // //console.log("REVIEW DATA : ", JSON.stringify(reviewData));
      const response = await fetch('http://localhost:3000/reviews/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(reviewData),
      });

      //console.log("Response : ", response);

      // Reset form and close modal
      setRatings(criteria.reduce((acc, { id }) => ({ ...acc, [id]: 0 }), {}));
      setComments(criteria.reduce((acc, { id }) => ({ ...acc, [id]: '' }), {}));
      setIsReviewFormOpen(false);
      setSelectedReview(null);

    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }
  if (unauthorized && !loading) {
    return <p className = "strong font-bold ">You are not authorized review other's papers.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
      
      {/* Reviews Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CFP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.Submission_ID}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {review.Submission_ID || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.Paper_Title || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.CFP_Title || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.Average_Rating || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handlePerformReview(review)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Form Modal */}
      {isReviewFormOpen && selectedReview && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Review: {selectedReview.Paper_Title}</h2>
              <button
                onClick={() => setIsReviewFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              {criteria.map(({ id, label, description }) => (
                <div key={id} className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700 ">
                    {label}
                  </label>
                  <p className="text-sm text-gray-500">{description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={ratings[id] ?? 50} 
                          onChange={(e) =>
                            setRatings((prev) => ({
                              ...prev,
                              [id]: parseInt(e.target.value, 10),  // Ensures integer parsing
                            }))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 w-12">
                        {ratings[id]}
                      </span>
                    </div>
                  </div>
                  <textarea
                    value={comments[id]}
                    onChange={(e) => setComments(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder="Add your comments..."
                    rows={3}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}