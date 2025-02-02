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
  export interface SubmissionRetrive {
    Submission_ID: number;
    Paper_Title: string;
    CFP_Title: string;
    Status: string;
    Submission_Date: string;
  }
  
  
  // export interface Review {
  //   id?: string;
  //   score: number;
  //   personId: string;
  //   submissionId: string;
  // }


  export interface Review {  // Define an interface for type safety
    Submission_ID: number;
    Paper_Title?: string; // Make Paper_Title optional
    CFP_Title?: string;  // Make CFP_Title optional
    Average_Rating?: number; // Make Average_Rating optional
  }
  
  export interface Category {
    id?: string;
    title: string;
  }