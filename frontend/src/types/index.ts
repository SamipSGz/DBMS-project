export interface Person {
    id?: string;
    name: string;
    email: string;
    role: 'Author' | 'Reviewer' | 'Organizer';
    affiliation?: string;
    phoneNumber?: string;
  }
  
  export interface Conference {
    id?: string;
    name: string;
    theme?: string;
    location?: string;
    startDate: Date;
    endDate: Date;
  }
  
  export interface CFP {
    id?: string;
    title: string;
    submissionDeadline: Date;
    announcedDate?: Date;
    topic?: string;
    conferenceId: string;
  }
  
  export interface Paper {
    id?: string;
    title: string;
    categoryId: string;
  }
  
  export interface Submission {
    id?: string;
    submittedDate: Date;
    status: 'Under Review' | 'Accepted' | 'Rejected';
    paperId: string;
    cfpId: string;
    submittedById: string;
  }
  
  export interface Review {
    id?: string;
    score: number;
    personId: string;
    submissionId: string;
  }
  
  export interface Category {
    id?: string;
    title: string;
  }