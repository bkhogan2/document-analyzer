import React, { forwardRef, useImperativeHandle } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import { PageHeader , Breadcrumbs } from '../ui';

export interface SurveyJSStepRef {
  submitForm: () => void;
}

interface SurveyJSStepProps {
  surveyConfig: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onFormStateChange?: (state: { isValid: boolean }) => void;
  defaultValues?: Record<string, unknown>;
  title?: string;
  description?: string;
}

export const SurveyJSStep = forwardRef<SurveyJSStepRef, SurveyJSStepProps>(
  ({ surveyConfig, onSubmit, onFormStateChange, defaultValues = {}, title, description }, ref) => {
    const [survey] = React.useState(() => {
      const model = new Model(surveyConfig);
      
      // Set default values
      Object.keys(defaultValues).forEach(key => {
        model.setValue(key, defaultValues[key]);
      });

      // Handle form state changes
      model.onValueChanged.add(() => {
        if (onFormStateChange) {
          const isValid = model.currentPage && model.currentPage.isCompleted;
          onFormStateChange({ isValid });
        }
      });

      // Handle form completion
      model.onComplete.add((sender) => {
        onSubmit(sender.data);
      });

      return model;
    });

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        survey.completeLastPage();
      },
    }), [survey]);

    return (
      <div className="flex-1 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs />
          {title && (
            <PageHeader
              title={title}
              description={description}
            />
          )}
          <div className="max-w-2xl mx-auto w-full">
            <Survey model={survey} />
          </div>
        </div>
      </div>
    );
  }
); 