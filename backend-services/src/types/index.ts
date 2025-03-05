export interface UserInput {
    id: string;
    email: string;
    emailStatus: boolean;
    paymentToken?: string;
    paymentStatus: boolean;
    resume: string;
    expectedSalary: number;
    location: string;
    createdAt: Date;
  }
  
  export interface ResumeAnalysis {
    id: string;
    userInputId: string;
    resumeScore: number;
    analysis: string;
    createdAt: Date;
  }
  
  export interface JobTitle {
    id: string;
    title: string;
    description: string;
    tags: string;
  }
  
  export interface CreateUserInputDTO {
    email: string;
    expectedSalary: number;
    location: string;
  }
  
  export interface FileUploadResponse {
    filename: string;
    path: string;
    size: number;
  }