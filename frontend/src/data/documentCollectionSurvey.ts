// SurveyJS configuration for complete SBA loan application
export const documentCollectionSurveyConfig = {
  showQuestionNumbers: false,
  showProgressBar: false,
  showPageTitles: false,
  showPageNumbers: false,
  showEmptyDescriptions: false,
  pageNextText: "Continue",
  pagePrevText: "‹ Back",
  completeText: "Submit",
  title: "Welcome",
  pages: [
    {
      name: "welcome",
      title: "Welcome",
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
      name: "loan-information",
      title: "Loan Information",
      elements: [
        {
          type: "dropdown",
          name: "loanType",
          title: "Loan Type",
          choices: ["7(a) Loan", "504 Loan", "Microloan", "Disaster Loan"],
          isRequired: false,
          startWithNewLine: false,
          colCount: 2
        },
        {
          type: "number",
          name: "loanAmount",
          title: "Requested Loan Amount",
          placeholder: "Enter amount",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "text",
          name: "loanPurpose",
          title: "Primary Use of Funds",
          placeholder: "e.g., Working capital, Equipment purchase",
          isRequired: false,
          startWithNewLine: true,
          colCount: 2
        },
        {
          type: "dropdown",
          name: "termLength",
          title: "Preferred Term Length",
          choices: ["5 years", "10 years", "15 years", "20 years", "25 years"],
          isRequired: false,
          startWithNewLine: false
        }
      ]
    },
    {
      name: "business-info",
      title: "Business Information",
      elements: [
        {
          type: "text",
          name: "businessName",
          title: "Business Name",
          placeholder: "Enter your business name",
          isRequired: false,
          startWithNewLine: false,
          colCount: 2
        },
        {
          type: "text",
          name: "businessAddress",
          title: "Business Address",
          placeholder: "Enter business address",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "dropdown",
          name: "businessType",
          title: "Business Structure",
          choices: ["Sole Proprietorship", "Partnership", "LLC", "Corporation", "Non-profit"],
          isRequired: false,
          startWithNewLine: true,
          colCount: 2
        },
        {
          type: "number",
          name: "yearsInBusiness",
          title: "Years in Business",
          placeholder: "Enter number of years",
          isRequired: false,
          startWithNewLine: false
        }
      ]
    },
    {
      name: "owner-information",
      title: "Owner Information",
      elements: [
        {
          type: "text",
          name: "ownerName",
          title: "Primary Owner Name",
          placeholder: "Enter owner's full name",
          isRequired: false,
          startWithNewLine: false,
          colCount: 2
        },
        {
          type: "text",
          name: "ownerSSN",
          title: "Social Security Number",
          placeholder: "XXX-XX-XXXX",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "number",
          name: "ownerPercentage",
          title: "Ownership Percentage",
          placeholder: "Enter percentage",
          isRequired: false,
          startWithNewLine: true,
          colCount: 2
        },
        {
          type: "text",
          name: "ownerAddress",
          title: "Owner Address",
          placeholder: "Enter owner's address",
          isRequired: false,
          startWithNewLine: false
        }
      ]
    },
    {
      name: "certification",
      title: "Certification",
      elements: [
        {
          type: "boolean",
          name: "certifyAccuracy",
          title: "I certify that all information provided is accurate and complete",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "boolean",
          name: "certifyEligibility",
          title: "I certify that I am eligible for SBA loan programs",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "boolean",
          name: "certifyCompliance",
          title: "I agree to comply with all SBA requirements and regulations",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "text",
          name: "certifierName",
          title: "Certifier Name",
          placeholder: "Enter name of person certifying",
          isRequired: false,
          startWithNewLine: true,
          colCount: 2
        },
        {
          type: "text",
          name: "certifierTitle",
          title: "Certifier Title",
          placeholder: "Enter title/position",
          isRequired: false,
          startWithNewLine: false
        }
      ]
    },
    {
      name: "pre-screen-questions",
      title: "Pre-Screen Questions",
      elements: [
        {
          type: "boolean",
          name: "usCitizen",
          title: "Are you a U.S. citizen or permanent resident?",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "boolean",
          name: "goodCredit",
          title: "Do you have good personal and business credit?",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "boolean",
          name: "collateral",
          title: "Do you have collateral to offer?",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "boolean",
          name: "cashFlow",
          title: "Does your business have positive cash flow?",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "boolean",
          name: "experience",
          title: "Do you have relevant business experience?",
          isRequired: false,
          startWithNewLine: false
        }
      ]
    },
    {
      name: "document-collection",
      title: "Document Collection",
      elements: [
        {
          type: "document-collection",
          name: "documents",
          title: "Required Documents",
          isRequired: false
        }
      ]
    },
    {
      name: "review",
      title: "Review Application",
      elements: [
        {
          type: "html",
          name: "reviewMessage",
              title: "Application Summary",
              html: `
                <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
                  <h3 style="margin-bottom: 15px; color: #374151; font-weight: 600;">Your application is ready for review</h3>
                  <p style="color: #6b7280; margin-bottom: 10px;">Please review all the information you've provided before submitting your application.</p>
                  <ul style="color: #6b7280; padding-left: 20px;">
                    <li>Contact information has been collected</li>
                    <li>Loan details have been specified</li>
                    <li>Business information has been provided</li>
                    <li>Owner information has been documented</li>
                    <li>Certifications have been completed</li>
                    <li>Pre-screen questions have been answered</li>
                    <li>Documents have been uploaded</li>
                  </ul>
                </div>
              `,
              isRequired: false
        },
        {
          type: "boolean",
          name: "confirmReview",
          title: "I have reviewed all information and confirm it is accurate",
          isRequired: false,
          startWithNewLine: false
        },
        {
          type: "boolean",
          name: "agreeSubmit",
          title: "I agree to submit this application",
          isRequired: false,
          startWithNewLine: false
        }
      ]
    }
  ]
}; 