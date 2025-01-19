import React, { useState } from 'react';
import { Calendar, MapPin, BookOpen, ArrowRight, FileText } from 'lucide-react';

interface ConferenceDetails {
  id: string;
  name: string;
  theme: string;
  location: string;
  startDate: string;
  endDate: string;
  cfps: {
    id: string;
    title: string;
    topic: string;
    submissionDeadline: string;
    paperCount: number;
  }[];
}

export function Conferences() {
  const [selectedConference, setSelectedConference] = useState<ConferenceDetails | null>(null);

  // Mock data - replace with actual API calls
  const conferences: ConferenceDetails[] = [
    {
      id: '1',
      name: 'International Conference on Artificial Intelligence',
      theme: 'AI for Sustainable Future',
      location: 'San Francisco, CA',
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      cfps: [
        {
          id: 'cfp1',
          title: 'AI in Healthcare',
          topic: 'Machine Learning Applications',
          submissionDeadline: '2024-04-15',
          paperCount: 12,
        },
        {
          id: 'cfp2',
          title: 'Ethical AI Development',
          topic: 'AI Ethics and Governance',
          submissionDeadline: '2024-04-20',
          paperCount: 8,
        },
      ],
    },
    {
      id: '2',
      name: 'Blockchain Technology Summit',
      theme: 'Decentralized Systems and Applications',
      location: 'London, UK',
      startDate: '2024-07-10',
      endDate: '2024-07-12',
      cfps: [
        {
          id: 'cfp3',
          title: 'Smart Contract Security',
          topic: 'Blockchain Security',
          submissionDeadline: '2024-05-01',
          paperCount: 15,
        },
      ],
    },
    {
      id: '3',
      name: 'Cloud Computing and DevOps Conference',
      theme: 'Modern Infrastructure and Practices',
      location: 'Singapore',
      startDate: '2024-08-20',
      endDate: '2024-08-23',
      cfps: [
        {
          id: 'cfp4',
          title: 'Serverless Architecture',
          topic: 'Cloud Infrastructure',
          submissionDeadline: '2024-06-15',
          paperCount: 10,
        },
        {
          id: 'cfp5',
          title: 'DevOps Best Practices',
          topic: 'Development Operations',
          submissionDeadline: '2024-06-20',
          paperCount: 7,
        },
      ],
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Conferences</h1>
        <p className="mt-2 text-sm text-gray-600">
          Browse upcoming conferences and their call for papers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {conferences.map((conference) => (
          <div key={conference.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{conference.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{conference.theme}</p>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(conference.startDate)} - {formatDate(conference.endDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {conference.location}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedConference(
                    selectedConference?.id === conference.id ? null : conference
                  )}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View CFPs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              {selectedConference?.id === conference.id && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Call for Papers</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {conference.cfps.map((cfp) => (
                      <div
                        key={cfp.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-medium text-gray-900">{cfp.title}</h4>
                            <p className="mt-1 text-sm text-gray-500">{cfp.topic}</p>
                            <div className="mt-2 flex items-center gap-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                Deadline: {formatDate(cfp.submissionDeadline)}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <FileText className="h-4 w-4 mr-1" />
                                {cfp.paperCount} papers
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => window.location.href = `/cfp?conference=${conference.id}&cfp=${cfp.id}`}
                            className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Submit Paper
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}