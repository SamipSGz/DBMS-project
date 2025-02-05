import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  FileText, 
  Calendar, 
  BookOpen, 
  FileCheck2, 
  FileSearch 
} from 'lucide-react';

interface Stats {
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RecentSubmissions {
  Submission_ID: number;
  Paper_Title: string;
  Author_Name: string;
  Status: string;
  Submission_Date: string;
}

interface UpcomingDeadlines {
  CFP_ID: number;
  Title: string;
  Submission_Deadline: string;
}

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmissions[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadlines[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dashboard/dashboard');

        const data = response.data;

        // Prepare stats with icons and colors
        const dashboardStats: Stats[] = [
          {
            name: 'Active CFPs',
            value: data.activeCFP.toString(),
            icon: BookOpen,
            color: 'text-blue-500'
          },
          {
            name: 'Total Submissions',
            value: data.totalSubmissions.toString(),
            icon: FileText,
            color: 'text-green-500'
          },
          {
            name: 'Upcoming Conferences',
            value: data.upcomingConferences.toString(),
            icon: Calendar,
            color: 'text-purple-500'
          },
          {
            name: 'Total Reviewers',
            value: data.noOfReviewers.toString(),
            icon: Users,
            color: 'text-red-500'
          }
        ];

        setStats(dashboardStats);
        setRecentSubmissions(data.recentSubmissions);
        setUpcomingDeadlines(data.upcomingDeadlines);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white shadow rounded-lg p-4 flex items-center space-x-4"
          >
            <stat.icon className={`h-10 w-10 ${stat.color}`} />
            <div>
              <p className="text-gray-500 text-sm">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileSearch className="mr-2 text-gray-500" />
          Recent Submissions
        </h2>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Submission ID</th>
              <th className="pb-2">Paper Title</th>
              <th className="pb-2">Author</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentSubmissions.map((submission) => (
              <tr key={submission.Submission_ID} className="border-b last:border-b-0">
                <td className="py-2">{submission.Submission_ID}</td>
                <td className="py-2">{submission.Paper_Title}</td>
                <td className="py-2">{submission.Author_Name}</td>
                <td className="py-2">
                  <span className={`
                    px-2 py-1 rounded text-xs
                    ${submission.Status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 
                      submission.Status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {submission.Status}
                  </span>
                </td>
                <td className="py-2">{new Date(submission.Submission_Date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileCheck2 className="mr-2 text-gray-500" />
          Upcoming Deadlines
        </h2>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">CFP</th>
              <th className="pb-2">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {upcomingDeadlines.map((deadline) => (
              <tr key={deadline.CFP_ID} className="border-b last:border-b-0">
                <td className="py-2">{deadline.Title}</td>
                <td className="py-2 text-red-500 font-semibold">
                  {new Date(deadline.Submission_Deadline).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}