export interface Submission {
    id: number;
    title: string;
    conference: string;
    submissionDate: string;
    deadline: string;
    status: SubmissionStatus;
    abstract: string;
    category: string;
    authors: string[];
    keywords: string[];
    paperUrl?: string;
    reviewComments?: string;
    lastUpdated: string;
  }
  
  export type SubmissionStatus = 'under-review' | 'accepted' | 'rejected';
  
  export const mockSubmissions: Submission[] = [
    {
      id: 1,
      title: "Machine Learning Applications in Early Disease Detection",
      conference: "International Healthcare AI Summit 2024",
      submissionDate: "2024-03-15",
      deadline: "2024-04-15",
      status: "under-review",
      abstract: "This paper presents a novel approach to early disease detection using advanced machine learning algorithms. We demonstrate improved accuracy in predicting potential health issues through the analysis of multiple biomarkers and patient history data.",
      category: "Machine Learning",
      authors: ["Dr. Sarah Johnson", "Prof. Michael Lee", "Dr. Robert Chen"],
      keywords: ["Machine Learning", "Healthcare", "Disease Detection", "AI"],
      lastUpdated: "2024-03-16",
      reviewComments: "Initial review completed. Awaiting second reviewer's feedback."
    },
    {
      id: 2,
      title: "Quantum-Resistant Blockchain Security Protocols",
      conference: "Blockchain Summit 2024",
      submissionDate: "2024-03-10",
      deadline: "2024-04-20",
      status: "accepted",
      abstract: "An analysis of post-quantum cryptography implementations in blockchain networks. This research proposes new security protocols designed to withstand potential threats from quantum computing advances.",
      category: "Blockchain",
      authors: ["Prof. David Wilson", "Dr. Alice Thompson"],
      keywords: ["Blockchain", "Quantum Computing", "Cryptography", "Security"],
      paperUrl: "/papers/quantum-blockchain-security.pdf",
      lastUpdated: "2024-03-18",
      reviewComments: "Excellent contribution to the field. Accepted for presentation."
    },
    {
      id: 3,
      title: "Sustainable Cloud Computing Resource Optimization",
      conference: "Green Computing Workshop 2024",
      submissionDate: "2024-03-08",
      deadline: "2024-04-25",
      status: "rejected",
      abstract: "A comprehensive study on optimizing cloud computing resources while minimizing environmental impact. We propose new algorithms for workload distribution that reduce energy consumption without compromising performance.",
      category: "Cloud Computing",
      authors: ["Dr. Emily Brown", "Prof. James Wilson"],
      keywords: ["Cloud Computing", "Sustainability", "Resource Optimization", "Green IT"],
      lastUpdated: "2024-03-20",
      reviewComments: "Interesting approach but lacks sufficient experimental validation."
    }
  ];
  
  export const getStatusStyle = (status: SubmissionStatus): string => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };