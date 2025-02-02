import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Tag, BookmarkPlus } from 'lucide-react';

interface FormData {
  title: string;
  cfp_id: string;
  topic: string;
  file: File | null;
}

interface CFPFormProps {
  conferenceId?: string;
  initialCfpId?: string;
}

interface CategoryDetails {
  Topic: string;
}

export function CFPForm({ conferenceId, initialCfpId }: CFPFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    cfp_id: initialCfpId || '',
    topic: '',
    file: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryDetails[]>([]); // State for categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/cfps/categories');
        const data = await response.json();
        const uniqueCategories = Array.from(new Set(data.map((item: any) => item.Topic)))
          .slice(0, 5) // Limit to 5 categories
          .map(topic => ({ Topic: topic }));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (conferenceId && initialCfpId) {
      setFormData(prev => ({
        ...prev,
        cfp_id: initialCfpId,
        title: '',
      }));
    }
  }, [conferenceId, initialCfpId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.cfp_id.trim()) {
      newErrors.cfp_id = 'CFP ID is required';
    }
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({});

    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('cfp_id', formData.cfp_id);
    formPayload.append('topic', formData.topic);
    if (formData.file) {
      formPayload.append('file', formData.file);
    }

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('http://localhost:3000/cfps/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      if (response.ok) {
        setSuccessMessage('Paper submitted successfully!');
        setFormData({ title: '', cfp_id: '', topic: '', file: null });
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Submission failed.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'An error occurred while submitting the form.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
        {errors.title && <span>{errors.title}</span>}
      </div>

      <div>
        <label>CFP ID:</label>
        <input
          type="text"
          value={formData.cfp_id}
          onChange={e => setFormData({ ...formData, cfp_id: e.target.value })}
        />
        {errors.cfp_id && <span>{errors.cfp_id}</span>}
      </div>

      <div>
        <label>Topic:</label>
        <select
          value={formData.topic}
          onChange={e => setFormData({ ...formData, topic: e.target.value })}
        >
          <option value="">Select a topic</option>
          {categories.map((category, index) => (
            <option key={index} value={category.Topic}>
              {category.Topic}
            </option>
          ))}
        </select>
        {errors.topic && <span>{errors.topic}</span>}
      </div>

      <div>
        <label>File:</label>
        <input
          type="file"
          onChange={e => setFormData({ ...formData, file: e.target.files?.[0] || null })}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      {successMessage && <p>{successMessage}</p>}
      {errors.submit && <p>{errors.submit}</p>}
    </form>
  );
}
