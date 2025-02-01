import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface CFPDetails {
  CFP_ID: number;
  CFP_Title: string;
  Topic: string;
}

interface ConferenceDetails {
  Conference_ID: number;
  Name: string;
  Theme: string;
  Location: string;
  Start_Date: string;
  End_Date: string;
  CFPs: CFPDetails[];
}

export function Conferences() {
  const [conferences, setConferences] = useState<ConferenceDetails[]>([]);
  const [selectedConference, setSelectedConference] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch('http://localhost:3000/conferences/conferences');
        const data = await response.json();

        const groupedData = data.reduce((acc: Record<number, ConferenceDetails>, item: any) => {
          if (!acc[item.Conference_ID]) {
            acc[item.Conference_ID] = {
              Conference_ID: item.Conference_ID,
              Name: item.Name,
              Theme: item.Theme,
              Location: item.Location,
              Start_Date: item.Start_Date,
              End_Date: item.End_Date,
              CFPs: []
            };
          }
          acc[item.Conference_ID].CFPs.push({
            CFP_ID: item.CFP_ID,
            CFP_Title: item.CFP_Title,
            Topic: item.Topic
          });
          return acc;
        }, {});

        setConferences(Object.values(groupedData));
      } catch (error) {
        console.error('Error fetching conferences:', error);
      }
    };

    fetchConferences();
  }, []);

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
        <p className="mt-2 text-sm text-gray-600">Browse upcoming conferences and their call for papers</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {conferences.map((conference) => (
          <div key={conference.Conference_ID} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{conference.Name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{conference.Theme}</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(conference.Start_Date)} - {formatDate(conference.End_Date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {conference.Location}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSelectedConference(selectedConference === conference.Conference_ID ? null : conference.Conference_ID)
                  }
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  {selectedConference === conference.Conference_ID ? "Hide Details" : "View Details"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              {selectedConference === conference.Conference_ID && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Call for Papers (CFP)</h3>
                  {conference.CFPs.length > 0 ? (
                    <ul className="space-y-4">
                      {conference.CFPs.map((cfp, index) => (
                        <li key={cfp.CFP_ID} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{index + 1}. {cfp.CFP_Title}</p>
                            <p className="text-xs text-gray-600">Topic: {cfp.Topic}</p>
                          </div>
                          <button
                            className="ml-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          >
                            Submit Paper
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No CFPs available for this conference.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}