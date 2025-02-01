import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Trash, Edit } from 'lucide-react';

interface CFPDetails {
  CFP_ID: number;
  CFP_Title: string;
  Topic: string;
  Announced_Date: string;
  Submission_Deadline: string;
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
  const [newConference, setNewConference] = useState({
    Name: '',
    Theme: '',
    Location: '',
    Start_Date: '',
    End_Date: '',
    CFPs: [{ CFP_Title: '', Topic: '' }],
  });
  const [editingConference, setEditingConference] = useState<ConferenceDetails | null>(null);

  const navigate = useNavigate();

  // Fetch conferences from the API
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
              CFPs: [],
            };
          }
          acc[item.Conference_ID].CFPs.push({
            CFP_ID: item.CFP_ID,
            CFP_Title: item.CFP_Title,
            Topic: item.Topic,
            Announced_Date: item.Announced_Date,
            Submission_Deadline: item.Submission_Deadline,
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

  // Handle form input changes for new conference
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewConference((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Handle adding new CFP
  const handleCFPChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: string) => {
    const updatedCFPs = [...newConference.CFPs];
    updatedCFPs[index] = {
      ...updatedCFPs[index],
      [field]: e.target.value,
    };
    setNewConference((prev) => ({
      ...prev,
      CFPs: updatedCFPs,
    }));
  };

  const handleEditCFPChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, conferenceId: number, cfpIndex: number, field: string) => {
    setConferences(prevConferences => prevConferences.map(c => {
      if (c.Conference_ID === conferenceId) {
        const updatedCFPs = [...c.CFPs];
        updatedCFPs[cfpIndex] = {
          ...updatedCFPs[cfpIndex],
          [field]: e.target.value,
        };
        return { ...c, CFPs: updatedCFPs };
      }
      return c;
    }));
  };
  

  // Add new CFP input field
  const addCFP = () => {
    setNewConference((prev) => ({
      ...prev,
      CFPs: [...prev.CFPs, { CFP_Title: '', Topic: '' }],
    }));
  };

  // Submit the new conference
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/conferences/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConference),
    });

    if (response.ok) {
      const addedConference = await response.json();
      setConferences((prev) => [...prev, addedConference]);
      setNewConference({
        Name: '',
        Theme: '',
        Location: '',
        Start_Date: '',
        End_Date: '',
        CFPs: [{ CFP_Title: '', Topic: '' }],
      });
    } else {
      console.error('Failed to add conference');
    }
  };
  
  // Handle edit conference
  const handleEditConference = (conference: ConferenceDetails) => {
    setEditingConference(conference);
  };

  // Handle updating conference
  const handleUpdateConference = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!editingConference) return; 

    try {
      const response = await fetch(`http://localhost:3000/conferences/conferences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingConference),
      });

      if (response.ok) {
        // Update the conference in the state
        setConferences(prevConferences => prevConferences.map(c => 
          c.Conference_ID === id ? editingConference : c
        ));
        setEditingConference(null);
      } else {
        console.error('Failed to update conference');
      }
    } catch (error) {
      console.error('Error updating conference:', error);
    }
  };

  // Handle deleting conference
  const handleDeleteConference = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/conferences/conferences/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setConferences(prevConferences => 
          prevConferences.filter(conference => conference.Conference_ID !== id)
        );
      } else {
        console.error('Failed to delete conference');
      }
    } catch (error) {
      console.error('Error deleting conference:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing UI for viewing conferences */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Conferences</h1>
        <p className="mt-2 text-sm text-gray-600">
          Browse upcoming conferences and their call for papers
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {conferences.map((conference) => (
          <div
            key={conference.Conference_ID}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              {/* Conference information */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingConference && editingConference.Conference_ID === conference.Conference_ID ? (
                    <form onSubmit={(e) => handleUpdateConference(e, conference.Conference_ID)}>
                      <div>
                        <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
                          Conference Name
                        </label>
                        <input
                          type="text"
                          id="Name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          placeholder="Conference Name"
                          value={editingConference.Name}
                          onChange={(e) => setEditingConference({ ...editingConference, Name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="Theme" className="block text-sm font-medium text-gray-700">
                          Theme
                        </label>
                        <input
                          type="text"
                          id="Theme"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          placeholder="Theme"
                          value={editingConference.Theme}
                          onChange={(e) => setEditingConference({ ...editingConference, Theme: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="Location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <input
                          type="text"
                          id="Location"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          placeholder="Location"
                          value={editingConference.Location}
                          onChange={(e) => setEditingConference({ ...editingConference, Location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex space-x-4">
                        <div>
                          <label htmlFor="Start_Date" className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="Start_Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            value={editingConference.Start_Date}
                            onChange={(e) => setEditingConference({ ...editingConference, Start_Date: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="End_Date" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="date"
                            id="End_Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            value={editingConference.End_Date}
                            onChange={(e) => setEditingConference({ ...editingConference, End_Date: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">CFPs</h4>
                        {editingConference.CFPs.map((cfp, cfpIndex) => (
                          <div key={cfpIndex} className="space-y-2">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="CFP Title"
                              value={cfp.CFP_Title}
                              onChange={(e) => handleEditCFPChange(e, conference.Conference_ID, cfpIndex, 'CFP_Title')} 
                              required
                            />
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Topic"
                              value={cfp.Topic}
                              onChange={(e) => handleEditCFPChange(e, conference.Conference_ID, cfpIndex, 'Topic')} 
                              required
                            />
                          </div>
                        ))}
                        {/* You can add more input fields for other CFP details */}
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingConference(null)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {conference.Name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {conference.Theme}
                      </p>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(conference.Start_Date)} -{' '}
                          {formatDate(conference.End_Date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          {conference.Location}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="ml-4 flex">
                  <button
                    onClick={() => handleEditConference(conference)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteConference(conference.Conference_ID)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      setSelectedConference(
                        selectedConference === conference.Conference_ID
                          ? null
                          : conference.Conference_ID
                      )
                    }
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    {selectedConference === conference.Conference_ID
                      ? 'Hide Details'
                      : 'View Details'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>

              {selectedConference === conference.Conference_ID && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Call for Papers (CFP)
                  </h3>
                  {conference.CFPs.length > 0 ? (
                    <ul className="space-y-4">
                      {conference.CFPs.map((cfp, index) => (
                        <li
                          key={cfp.CFP_ID}
                          className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {index + 1}. {cfp.CFP_Title}
                            </p>
                            <p className="text-xs text-gray-600">
                              Topic: {cfp.Topic}
                            </p>
                            <p className="text-xs text-gray-600">
                              Announced Date: {formatDate(cfp.Announced_Date)}
                            </p>
                            <p className="text-xs text-gray-600 font-bold">
                              Submission Deadline: {formatDate(cfp.Submission_Deadline)}
                            </p>
                          </div>
                          <button className="ml-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            Submit Paper
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No CFPs available for this conference.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Form for adding new conference */}
      <div className="mt-8 p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900">
          Add New Conference
        </h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
              Conference Name
            </label>
            <input
              type="text"
              id="Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              placeholder="Conference Name"
              value={newConference.Name}
              onChange={(e) => handleInputChange(e, 'Name')}
              required
            />
          </div>
          <div>
            <label htmlFor="Theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <input
              type="text"
              id="Theme"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              placeholder="Theme"
              value={newConference.Theme}
              onChange={(e) => handleInputChange(e, 'Theme')}
              required
            />
          </div>
          <div>
            <label htmlFor="Location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="Location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              placeholder="Location"
              value={newConference.Location}
              onChange={(e) => handleInputChange(e, 'Location')}
              required
            />
          </div>
          <div className="flex space-x-4">
            <div>
              <label htmlFor="Start_Date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="Start_Date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                value={newConference.Start_Date}
                onChange={(e) => handleInputChange(e, 'Start_Date')}
                required
              />
            </div>
            <div>
              <label htmlFor="End_Date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="End_Date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                value={newConference.End_Date}
                onChange={(e) => handleInputChange(e, 'End_Date')}
                required
              />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">CFP</h4>
            {newConference.CFPs.map((cfp, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="CFP Title"
                  value={cfp.CFP_Title}
                  onChange={(e) => handleCFPChange(e, index, 'CFP_Title')}
                  required
                />
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Topic"
                  value={cfp.Topic}
                  onChange={(e) => handleCFPChange(e, index, 'Topic')}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addCFP}
              className="mt-2 inline-flex items-center px-4 py-2 text-sm text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Add CFP
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex items-center px-6 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Submit Conference
          </button>
        </form>
      </div>
    </div>
  );
}