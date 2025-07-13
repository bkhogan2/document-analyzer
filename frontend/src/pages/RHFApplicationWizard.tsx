import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useApplicationStore } from '../stores/applicationStore';
import { Button } from '../components/Button';

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
  const { type, id } = useParams<{ type: string; id: string }>();
  const {
    selectApplication,
    setCurrentStep,
    markStepCompleted,
  } = useApplicationStore();

  // Get current application state
  const currentApplicationId = useApplicationStore(state => state.currentApplicationId);
  const currentApp = useApplicationStore(state => 
    currentApplicationId ? state.applications[currentApplicationId] : undefined
  );

  // Initialize application when component mounts
  useEffect(() => {
    if (id && type) {
      selectApplication(id, type);
    }
  }, [id, type, selectApplication]);

  // Set up RHF context
  const methods = useForm<Record<string, unknown>>({
    defaultValues: {}
  });

  if (!currentApp) {
    return <div>Loading...</div>;
  }

  const { currentStepIndex, steps, sections, currentSectionIndex } = currentApp;
  const currentStep = steps[currentStepIndex];
  const currentSection = sections[currentSectionIndex];
  const stepCount = steps.length;

  const next = () => {
    // Mark current step as completed
    if (currentStep) {
      markStepCompleted(currentStep.id, true);
    }
    
    // Move to next step
    const nextStepIndex = Math.min(currentStepIndex + 1, stepCount - 1);
    setCurrentStep(nextStepIndex);
  };

  const back = () => {
    const prevStepIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(prevStepIndex);
  };

  const onSubmit = () => {
    methods.handleSubmit((data: Record<string, unknown>) => {
      // Mark final step as completed
      if (currentStep) {
        markStepCompleted(currentStep.id, true);
      }
      
      alert(JSON.stringify(data, null, 2));
    })();
  };

  if (!currentStep || !currentSection) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-[70vh]">
        {/* Form content is constrained */}
        <form className="flex-1 max-w-lg mx-auto w-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <PlaceholderStep
              stepNumber={currentStepIndex + 1}
              sectionLabel={currentSection.label}
            />
          </div>
        </form>
        <WizardFooter
          currentStep={currentStepIndex}
          stepCount={stepCount}
          onBack={back}
          onNext={next}
          onSubmit={onSubmit}
        />
      </div>
    </FormProvider>
  );
} 