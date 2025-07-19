// SurveyJS configurations that match your current form configs
export const welcomeSurveyConfig = {
  pages: [{
    name: "welcome",
    title: "Welcome to Your SBA Loan Application",
    description: "Please provide your contact and business information to get started.",
    elements: [{
      type: "text",
      name: "applicantName",
      title: "Full Name",
      placeholder: "Enter your full name",
      isRequired: true,
      validators: [{
        type: "text",
        text: "Name is required"
      }]
    }, {
      type: "email",
      name: "applicantEmail", 
      title: "Email Address",
      placeholder: "Enter your email address",
      isRequired: true,
      validators: [{
        type: "email",
        text: "Invalid email address"
      }]
    }, {
      type: "text",
      name: "streetAddress",
      title: "Street Address", 
      placeholder: "123 Main St",
      isRequired: true,
      startWithNewLine: false,
      colCount: 2
    }, {
      type: "text",
      name: "city",
      title: "City",
      placeholder: "San Diego", 
      isRequired: true,
      startWithNewLine: false
    }, {
      type: "text",
      name: "state",
      title: "State",
      placeholder: "CA",
      isRequired: true,
      maxLength: 2,
      validators: [{
        type: "text",
        minLength: 2,
        maxLength: 2,
        text: "State must be 2 characters"
      }],
      startWithNewLine: false
    }, {
      type: "text", 
      name: "zip",
      title: "ZIP Code",
      placeholder: "92103",
      isRequired: true,
      validators: [{
        type: "regex",
        regex: "^\\d{5}(-\\d{4})?$",
        text: "Invalid ZIP code format"
      }],
      startWithNewLine: false
    }]
  }]
};

// Example of TurboTax-style big buttons
export const filingStatusSurveyConfig = {
  pages: [{
    name: "filingStatus",
    title: "What's your filing status?",
    description: "Select the option that best describes your situation.",
    elements: [{
      type: "radiogroup",
      name: "filingStatus",
      title: "Filing Status",
      choices: [
        { value: "single", text: "Single" },
        { value: "married", text: "Married Filing Jointly" },
        { value: "head", text: "Head of Household" }
      ],
      renderAs: "button",
      itemSize: "large"
    }]
  }]
};

// Example of dynamic arrays (add/remove rows)
export const incomeSourcesSurveyConfig = {
  pages: [{
    name: "incomeSources",
    title: "Income Sources",
    description: "Add all your sources of income for the year.",
    elements: [{
      type: "paneldynamic",
      name: "incomeSources",
      title: "Income Sources",
      templateElements: [{
        type: "text",
        name: "source",
        title: "Income Source"
      }, {
        type: "number", 
        name: "amount",
        title: "Amount"
      }],
      minPanelCount: 1,
      maxPanelCount: 10,
      panelAddText: "+ Add Income Source",
      panelRemoveText: "Remove"
    }]
  }]
}; 