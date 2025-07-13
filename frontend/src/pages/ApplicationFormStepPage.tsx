import { Wizard, useWizard } from 'react-use-wizard';
import { useApplicationStore } from "../stores/applicationStore";
import { useState, useEffect } from "react";

function StepperBar() {
  const { activeStep, stepCount } = useWizard();
  const steps = ["Loan Details", "Business Info"];
  return (
    <div className="flex items-center justify-center mb-8">
      <ol className="flex space-x-8">
        {steps.map((label, idx) => (
          <li key={label} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold transition-colors
              ${activeStep === idx ? 'bg-green-600 text-white border-green-600' : idx < activeStep ? 'bg-green-100 text-green-700 border-green-600' : 'bg-gray-200 text-gray-400 border-gray-300'}`}
            >
              {idx + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${activeStep === idx ? 'text-green-700' : 'text-gray-500'}`}>{label}</span>
            {idx < stepCount - 1 && (
              <span className="mx-4 w-8 h-1 bg-gray-200 rounded-full block" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Step1() {
  const { nextStep } = useWizard();
  const { formData, setFormData } = useApplicationStore();
  const [loanAmount, setLoanAmount] = useState(formData["step-1"]?.loanAmount || "");
  const [zipCode, setZipCode] = useState(formData["step-1"]?.zipCode || "");

  useEffect(() => {
    setFormData("step-1", { loanAmount, zipCode });
  }, [loanAmount, zipCode, setFormData]);

  return (
    <div className="flex min-h-[80vh] items-start justify-center bg-gray-50 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
        <StepperBar />
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">Loan Details</h2>
          <p className="mt-2 text-center text-gray-500 text-sm">To get started, please provide your loan amount and business zip code. This helps us determine your eligibility and required documents.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={e => { e.preventDefault(); nextStep(); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Loan Amount</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={loanAmount}
                onChange={e => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                min={0}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Business Zip Code</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                placeholder="Enter business zip code"
                maxLength={10}
              />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-60"
              disabled={!loanAmount || !zipCode}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Step2() {
  const { previousStep } = useWizard();
  return (
    <div className="flex min-h-[80vh] items-start justify-center bg-gray-50 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
        <StepperBar />
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">Business Info</h2>
          <p className="mt-2 text-center text-gray-500 text-sm">This is a placeholder for Step 2. Replace with your form fields.</p>
        </div>
        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            onClick={previousStep}
          >
            Back
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            // onClick={...} // Add next logic here
            disabled={false}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationFormStepPage() {
  return (
    <Wizard>
      <Step1 />
      <Step2 />
    </Wizard>
  );
} 