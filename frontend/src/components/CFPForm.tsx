import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, FileText, Upload, BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export function CFPForm() {
  const [searchParams] = useSearchParams();
  const conferenceId = searchParams.get('conference');
  const cfpId = searchParams.get('cfp');

  const [formData, setFormData] = useState({
    title: '',
    email: '',
    phone: '',
    affiliation: '',
    submissionDeadline: '',
    topic: '',
    abstract: '',
    file: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form based on selected conference and CFP
  useEffect(() => {
    if (conferenceId && cfpId) {
      // In a real application, fetch the conference and CFP details from an API
      // For now, we'll just update the title to show it's working
      setFormData(prev => ({
        ...prev,
        title: `Paper for CFP ${cfpId} of Conference ${conferenceId}`,
      }));
    }
  }, [conferenceId, cfpId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.submissionDeadline) {
      newErrors.submissionDeadline = 'Submission deadline is required';
    } else {
      const deadline = new Date(formData.submissionDeadline);
      const today = new Date();
      if (deadline < today) {
        newErrors.submissionDeadline = 'Deadline must be in the future';
      }
    }

    if (!formData.abstract.trim()) {
      newErrors.abstract = 'Abstract is required';
    }

    if (!formData.file) {
      newErrors.file = 'Paper file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Enter paper title"
              />
            </div>
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
              Affiliation
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="affiliation"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                className="block w-full pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="University or Organization"
              />
            </div>
          </div>

          {/* <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Submission Deadline <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="deadline"
                value={formData.submissionDeadline}
                onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                className="block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
            {errors.submissionDeadline && <p className="mt-2 text-sm text-red-600">{errors.submissionDeadline}</p>}
          </div> */}

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="block w-full pr-12 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="e.g., Machine Learning, Blockchain, Cloud Computing"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">
            Abstract <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="abstract"
              rows={4}
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Enter your paper abstract"
            />
          </div>
          {errors.abstract && <p className="mt-2 text-sm text-red-600">{errors.abstract}</p>}
        </div>

        <div className="mt-6">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
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

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => setFormData({
            title: '',
            email: '',
            phone: '',
            affiliation: '',
            submissionDeadline: '',
            topic: '',
            abstract: '',
            file: null,
          })}
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
