import React, { useState } from 'react';
import { Calendar, Mail, Phone, FileText, Upload, BookOpen } from 'lucide-react';

export function CFPForm() {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Paper Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  <BookOpen className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Enter paper title"
                />
              </div>
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="affiliation" className="block text-sm font-medium leading-6 text-gray-900">
                Affiliation
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="affiliation"
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="University or Organization"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                Submission Deadline <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex rounded-md ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  <Calendar className="h-4 w-4" />
                </span>
                <input
                  type="date"
                  id="deadline"
                  value={formData.submissionDeadline}
                  onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.submissionDeadline && <p className="mt-2 text-sm text-red-600">{errors.submissionDeadline}</p>}
            </div>

            <div className="col-span-full">
              <label htmlFor="topic" className="block text-sm font-medium leading-6 text-gray-900">
                Research Topic
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="e.g., Machine Learning, Blockchain, Cloud Computing"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="abstract" className="block text-sm font-medium leading-6 text-gray-900">
                Abstract <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  id="abstract"
                  rows={4}
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your paper abstract"
                />
              </div>
              {errors.abstract && <p className="mt-2 text-sm text-red-600">{errors.abstract}</p>}
            </div>

            <div className="col-span-full">
              <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900">
                Upload Paper <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
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
                  <p className="text-xs leading-5 text-gray-600">PDF, DOC, or DOCX up to 10MB</p>
                </div>
              </div>
              {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
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
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit Paper
          </button>
        </div>
      </div>
    </form>
  );
}