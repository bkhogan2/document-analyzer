// SurveyJS configuration for document collection with navigation
export const documentCollectionSurveyConfig = {
  showQuestionNumbers: false,
  showProgressBar: false,
  showPageTitles: false,
  showPageNumbers: false,
  pageNextText: "Continue",
  pagePrevText: "‹ Back",
  completeText: "Submit",
  title: "SBA Loan Application",
  description: "Complete your SBA loan application step by step.",
  pages: [
    {
      name: "welcome",
      title: "Welcome to Your SBA Loan Application",
      description: "Please provide your contact and business information to get started.",
      elements: [
        {
          type: "text",
          name: "applicantName",
          title: "Full Name",
          placeholder: "Enter your full name",
          isRequired: false,
          startWithNewLine: false,
          colCount: 2
        },
        {
          type: "text",
          name: "applicantEmail", 
          title: "Email Address",
          placeholder: "Enter your email address",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "text",
          name: "phone",
          title: "Phone Number",
          placeholder: "(555) 123-4567",
          isRequired: false,
          startWithNewLine: true,
          colCount: 2
        },
        {
          type: "text",
          name: "address",
          title: "Street Address",
          placeholder: "123 Main St",
          isRequired: false,
          startWithNewLine: false
        }
      ]
    },
    {
      name: "document-collection",
      title: "Document Collection",
      description: "Upload the required documents for your SBA loan application. All documents should be current and complete.",
      elements: [
        {
          type: "document-collection",
          name: "documents",
          title: "Required Documents",
          isRequired: false
        }
      ]
    }
  ]
}; 