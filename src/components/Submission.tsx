import { useState } from "react";
import { FileText, Search, Filter, Calendar, BookOpen, Users, Tag } from "lucide-react";
import { mockSubmissions, getStatusStyle, SubmissionStatus } from "../data/mockSubmissions";

type FilterStatus = SubmissionStatus | 'all';

export default function SubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = 
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.conference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.authors.some(author => 
        author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter = filterStatus === 'all' || submission.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track and manage your paper submissions across different conferences
        </p>
      </div>

      <div className="bg-white shadow rounded-xl">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="all">All Status</option>
                <option value="under-review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="py-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900">
                        {submission.title}
                      </p>
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <BookOpen className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        {submission.conference}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        Submitted: {submission.submissionDate}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Users className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        {submission.authors.join(', ')}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {submission.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {submission.abstract}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(submission.status)}`}>
                      {submission.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm text-gray-500">
                      Deadline: {submission.deadline}
                    </span>
                    {submission.reviewComments && (
                      <p className="text-sm text-gray-500 text-right mt-2 max-w-xs">
                        {submission.reviewComments}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}