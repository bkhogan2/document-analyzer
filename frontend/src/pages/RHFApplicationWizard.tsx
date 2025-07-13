import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Stepper as StyledStepper } from '../components/Stepper';
import { Button } from '../components/Button';

// Section definitions (copied from ApplicationFormStepPage)
const sections = [
  { label: 'Welcome', stepCount: 1 },
  { label: 'Loan Information', stepCount: 2 },
  { label: 'Business Info', stepCount: 3 },
  { label: 'Owner Information', stepCount: 2 },
  { label: 'Certification', stepCount: 1 },
  { label: 'Pre-Screen Questions', stepCount: 2 },
  { label: 'Documents', stepCount: 2 },
  { label: 'Review', stepCount: 1 },
];

// Map each wizard step index to a section index
const stepToSection = [
  0, // Welcome
  1, 1, // Loan Information
  2, 2, 2, // Business Info
  3, 3, // Owner Information
  4, // Certification
  5, 5, // Pre-Screen Questions
  6, 6, // Documents
  7 // Review
];

// Step titles for each step
const stepTitles = [
  'Welcome',
  'Loan Information (1)', 'Loan Information (2)',
  'Business Info (1)', 'Business Info (2)', 'Business Info (3)',
  'Owner Information (1)', 'Owner Information (2)',
  'Certification',
  'Pre-Screen Questions (1)', 'Pre-Screen Questions (2)',
  'Documents (1)', 'Documents (2)',
  'Review'
];

// TurboTax-style placeholder step
function PlaceholderStep({ stepNumber, sectionLabel }: { stepNumber: number; sectionLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{sectionLabel}</h1>
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-200 mb-2">
        <span className="text-6xl font-extrabold text-gray-700">{stepNumber}</span>
      </div>
    </div>
  );
}

function WizardFooter({
  currentStep,
  stepCount,
  onBack,
  onNext,
  onSubmit
}: {
  currentStep: number;
  stepCount: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <footer>
      <div className="max-w-lg mx-auto w-full">
        <div className="border-t border-gray-200 mt-8 pt-4 flex items-center justify-between px-2">
          <div className="flex-1">
            <Button
              type="button"
              onClick={onBack}
              variant="text"
              className="text-gray-600 hover:text-gray-900"
              disabled={currentStep === 0}
            >
              Back
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            {currentStep < stepCount - 1 ? (
              <Button type="button" onClick={onNext} variant="primary">
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={onSubmit} variant="primary">
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RHFApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  // Set up RHF context
  const methods = useForm<Record<string, unknown>>({
    defaultValues: {}
  });

  // Calculate section progress for the styled Stepper
  const sectionProgress = sections.map((_, sectionIdx) => {
    // Find all step indices for this section
    const stepIndices = stepToSection
      .map((secIdx, i) => (secIdx === sectionIdx ? i : -1))
      .filter(i => i !== -1);
    if (stepIndices.length === 0) return 0;
    // Count how many steps in this section are completed (currentStep > step index)
    const completed = stepIndices.filter(i => currentStep > i).length;
    // If we're currently in this section, fill partially
    if (stepIndices.includes(currentStep)) {
      return (completed + 1) / stepIndices.length;
    }
    // If all steps in this section are before currentStep, fill fully
    if (completed === stepIndices.length) return 1;
    // Otherwise, not started
    return 0;
  });
  const currentSection = stepToSection[currentStep] || 0;

  const next = () => setCurrentStep((s) => Math.min(s + 1, stepTitles.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = () => {
    methods.handleSubmit((data: Record<string, unknown>) => {
      alert(JSON.stringify(data, null, 2));
    })();
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-[70vh]">
        {/* Stepper is now full width */}
        <StyledStepper sections={sections} sectionProgress={sectionProgress} currentSection={currentSection} />
        {/* Form content is constrained */}
        <form className="flex-1 max-w-lg mx-auto w-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <PlaceholderStep
              stepNumber={currentStep + 1}
              sectionLabel={sections[currentSection].label}
            />
          </div>
        </form>
        <WizardFooter
          currentStep={currentStep}
          stepCount={stepTitles.length}
          onBack={back}
          onNext={next}
          onSubmit={onSubmit}
        />
      </div>
    </FormProvider>
  );
} 