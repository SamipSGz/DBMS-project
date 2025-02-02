import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, BookmarkPlus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface PaperDetails {
  Paper_ID: number;
  Title: string;
  Topic: string;
  file: File;
}

interface FormData {
  title: string;
  cfp_id: string;
  topic: string;
  file: File | null;
}

export function CFPForm() {
  const [searchParams] = useSearchParams();
  const conferenceId = searchParams.get('conference');
  const cfpId = searchParams.get('cfp');

  const [submissions, setSubmissions] = useState<PaperDetails[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    cfp_id: '',
    topic: '',
    file: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (conferenceId && cfpId) {
      setFormData(prev => ({
        ...prev,
        cfp_id: cfpId,
        title: `Paper for CFP ${cfpId} of Conference ${conferenceId}`,
      }));
    }
  }, [conferenceId, cfpId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.cfp_id.trim()) {
      newErrors.cfp_id = 'CFP ID is required';
    }

    if (!formData.file) {
      newErrors.file = 'Paper file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('cfp_id', formData.cfp_id);
    formPayload.append('topic', formData.topic);
    if (formData.file) {
      formPayload.append('file', formData.file);
    }

    try {
      const response = await fetch('http://localhost:3000/cfps/submit', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const submittedPaper = await response.json();
      setSubmissions(prev => [...prev, submittedPaper]);
      
      // Reset form
      setFormData({
        title: '',
        cfp_id: '',
        topic: '',
        file: null,
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to submit paper:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit paper. Please try again.',
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleClear = () => {
    setFormData({
      title: '',
      cfp_id: '',
      topic: '',
      file: null,
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-100 rounded-lg shadow-md">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Submit Your Paper</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Paper Title <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Enter paper title"
              />
            </div>
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="cfp_id" className="block text-sm font-medium text-gray-700">
              CFP ID <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookmarkPlus className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="cfp_id"
                value={formData.cfp_id}
                onChange={(e) => setFormData(prev => ({ ...prev, cfp_id: e.target.value }))}
                className="block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="77"
              />
            </div>
            {errors.cfp_id && <p className="mt-2 text-sm text-red-600">{errors.cfp_id}</p>}
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="block w-full pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="e.g., Machine Learning, Blockchain, Cloud Computing"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
            Upload Paper <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
            </div>
          </div>
          {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
        </div>
      </div>

      {errors.submit && (
        <div className="text-red-600 text-sm">{errors.submit}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Submit Paper
        </button>
      </div>
    </form>
  );
}