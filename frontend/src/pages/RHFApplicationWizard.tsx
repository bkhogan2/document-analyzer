import { useEffect, useRef, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useApplicationStore } from '../stores/applicationStore';
import { Button } from '../components/Button';
// import { WelcomeStep } from '../components/WelcomeStep';
// import type { WelcomeFormData, WelcomeStepRef } from '../components/WelcomeStep';
import { DocumentCollectionStep } from '../components/DocumentCollectionStep';
import { DynamicStep } from '../components/form/DynamicStep';
import type { DynamicStepRef } from '../components/form/DynamicStep';
import { SurveyJSStep } from '../components/form/SurveyJSStep';
import type { SurveyJSStepRef } from '../components/form/SurveyJSStep';
import { formConfigs, type StepId } from '../data/formConfigs';
import { welcomeSurveyConfig } from '../data/surveyConfigs';

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
  const { type, id, section, step } = useParams<{ type: string; id: string; section?: string; step?: string }>();
  const navigate = useNavigate();
  
  // Minimal foundational step: just log URL parameters (no navigation logic)
  console.log('[Wizard] URL params:', { type, id, section, step });
  

  const {
    selectApplication,
    setCurrentStep,
    markStepCompleted,
    resetApplication,
    setFormData,
  } = useApplicationStore();

  // Get current application state using stable selectors
  const currentApp = useApplicationStore(state => {
    const currentId = state.currentApplicationId;
    return currentId ? state.applications[currentId] : undefined;
  });

  // Initialize application when component mounts
  useEffect(() => {
    if (id && type) {
      selectApplication(id, type);
    }
  }, [id, type]); // Removed selectApplication from dependencies

  // URL-to-state sync using ref to avoid unstable dependencies
  const currentAppRef = useRef(currentApp);
  currentAppRef.current = currentApp;

  useEffect(() => {
    if (!section || !step || !currentAppRef.current) return;
    
    // Find the step that matches the URL parameters
    const targetStepId = `${section}-${step}`;
    const stepIndex = currentAppRef.current.steps.findIndex(s => s.id === targetStepId);
    
    if (stepIndex !== -1) {
      console.log('[Wizard] Navigating to:', { section, step, stepIndex });
      setCurrentStep(stepIndex);
    } else {
      // Invalid URL - redirect to current step
      console.warn('[Wizard] Invalid URL parameters:', { section, step });
      const currentStep = currentAppRef.current.steps[currentAppRef.current.currentStepIndex];
      if (currentStep && id && type) {
        const parts = currentStep.id.split('-');
        const stepNumber = parts[parts.length - 1];
        const sectionId = parts.slice(0, -1).join('-');
        navigate(`/applications/${type}/${id}/steps/${sectionId}/${stepNumber}`, { replace: true });
      }
    }
  }, [section, step, navigate, id, type]); // Only stable dependencies

  // Set up RHF context
  const methods = useForm<Record<string, unknown>>({
    defaultValues: {}
  });

  // Form step refs and state
  // const welcomeStepRef = useRef<WelcomeStepRef>(null);
  const dynamicStepRef = useRef<DynamicStepRef>(null);
  const surveyJSStepRef = useRef<SurveyJSStepRef>(null);
  const [formValid, setFormValid] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Stable callback to prevent infinite loops
  const handleFormStateChange = useCallback(({ isValid }: { isValid: boolean }) => {
    setFormValid(isValid);
  }, []);

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
    
    // Update URL to reflect new step
    const nextStep = steps[nextStepIndex];
    if (nextStep && id && type) {
      // Parse step ID like "owner-info-1" -> section: "owner-info", step: "1"
      const parts = nextStep.id.split('-');
      const stepNumber = parts[parts.length - 1]; // Last part is the step number
      const sectionId = parts.slice(0, -1).join('-'); // Everything except last part is section
      navigate(`/applications/${type}/${id}/steps/${sectionId}/${stepNumber}`);
    }
  };

  const back = () => {
    const prevStepIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(prevStepIndex);
    
    // Update URL to reflect new step
    const prevStep = steps[prevStepIndex];
    if (prevStep && id && type) {
      // Parse step ID like "owner-info-1" -> section: "owner-info", step: "1"
      const parts = prevStep.id.split('-');
      const stepNumber = parts[parts.length - 1]; // Last part is the step number
      const sectionId = parts.slice(0, -1).join('-'); // Everything except last part is section
      navigate(`/applications/${type}/${id}/steps/${sectionId}/${stepNumber}`);
    }
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

  // Render WelcomeStep for the first step (testing SurveyJS)
  console.log('[Wizard] Rendering step:', { currentStepIndex, currentStepId: currentStep?.id });
  if (currentStepIndex === 0) {
    return (
      <div className="flex flex-col min-h-[70vh] bg-white">
        <SurveyJSStep
          ref={surveyJSStepRef}
          surveyConfig={welcomeSurveyConfig}
          title="Welcome to Your SBA Loan Application"
          description="Please provide your contact and business information to get started."
          onSubmit={(data: Record<string, unknown>) => {
            setFormSubmitting(true);
            // Persist the application with form data
            if (id && type) {
              resetApplication(id, type); // Ensure a fresh app
              setFormData('welcome', data); // Store welcome form data
            }
            markStepCompleted(currentStep.id, true);
            setCurrentStep(1); // Move to next step
            setFormSubmitting(false);
          }}
          onFormStateChange={handleFormStateChange}
          defaultValues={currentApp?.formData?.['welcome'] as Record<string, unknown> || {}}
        />
        <footer>
          <div className="max-w-6xl mx-auto w-full px-8">
            <div className="border-t border-gray-200 mt-8 pt-4 flex items-center justify-between">
              <Button
                type="button"
                onClick={() => navigate('/applications')}
                variant="text"
                className="text-gray-600 hover:text-gray-900"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => surveyJSStepRef.current?.submitForm()}
                variant="primary"
                disabled={!formValid || formSubmitting}
              >
                Create Application
              </Button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Render Document Collection for the documents steps
  if (currentStep.id === 'documents-1' || currentStep.id === 'documents-2') {
    return (
      <div className="flex flex-col min-h-[70vh] bg-white">
        <div className="flex-1 max-w-6xl mx-auto w-full px-8 py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">SBA Loan Document Collection</h2>
          <p className="text-gray-600 mb-8">Upload the required documents for your SBA loan application. All documents should be current and complete.</p>
          <DocumentCollectionStep applicationId={id} applicationType={type} />
        </div>
        <WizardFooter
          currentStep={currentStepIndex}
          stepCount={stepCount}
          onBack={back}
          onNext={next}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

  // Check if this step has a form configuration
  const stepId = currentStep.id as StepId;
  const hasFormConfig = stepId in formConfigs;

  // Render dynamic form step if configuration exists
  if (hasFormConfig) {
    return (
      <div className="flex flex-col min-h-[70vh] bg-white">
        <DynamicStep
          ref={dynamicStepRef}
          stepId={stepId}
          onSubmit={(data: Record<string, unknown>) => {
            setFormSubmitting(true);
            // Store form data
            if (id && type) {
              setFormData(stepId, data);
            }
            markStepCompleted(currentStep.id, true);
            next();
            setFormSubmitting(false);
          }}
          onFormStateChange={handleFormStateChange}
          defaultValues={currentApp?.formData?.[stepId] as Record<string, unknown> || {}}
        />
        <footer>
          <div className="max-w-6xl mx-auto w-full px-8">
            <div className="border-t border-gray-200 mt-8 pt-4 flex items-center justify-between">
              <Button
                type="button"
                onClick={back}
                variant="text"
                className="text-gray-600 hover:text-gray-900"
                disabled={currentStepIndex === 0}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => dynamicStepRef.current?.submitForm()}
                variant="primary"
                disabled={!formValid || formSubmitting}
              >
                Continue
              </Button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // All other steps: existing logic
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