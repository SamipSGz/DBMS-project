import React, {useState, useEffect} from 'react';
import { FileText, Users, Calendar, BookOpen, Award, Clock, LogOut } from 'lucide-react';

interface stats{
  name: string;
  value: string;
  icon: any;
  color: string;
}

interface recentSubmissions{
  id: number;
  title: string;
  author: string;
  status: string;
  date: string;
}

interface upcomingDeadlines{
  id: number;
  cfp: string;
  deadline: string;
  papers: number;
}

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const[stats, setStats] = useState<stats[]>([]);
  const[recentSubmissions,setRecentSubmissions] = useState<recentSubmissions[]>([]);
  const[upcomingDeadlines,setUpcomingDeadlines] = useState<upcomingDeadlines[]>([]);
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of your Call for Papers tracking system
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={`absolute rounded-md ${item.color} p-3`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Recent Submissions
            </h2>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentSubmissions.map((submission) => (
                    <li key={submission.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {submission.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {submission.author} · {submission.date}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              submission.status === 'Accepted'
                                ? 'bg-green-100 text-green-800'
                                : submission.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {submission.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-gray-500" />
              Upcoming Deadlines
            </h2>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {upcomingDeadlines.map((deadline) => (
                    <li key={deadline.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {deadline.cfp}
                          </p>
                          <p className="text-sm text-gray-500">
                            Deadline: {deadline.deadline}
                          </p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {deadline.papers} papers
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
