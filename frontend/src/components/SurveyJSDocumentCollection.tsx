import React from 'react';
import { Serializer, QuestionFactory } from 'survey-core';
import { Question } from 'survey-core';
import { SurveyQuestionElementBase } from 'survey-react-ui';
import { ReactQuestionFactory } from 'survey-react-ui';
import { DocumentCollectionStep } from './DocumentCollectionStep';

// Custom SurveyJS question class for document collection
export class DocumentCollectionQuestion extends Question {
  public getType(): string {
    return "document-collection";
  }

  public get hasInput(): boolean {
    return false;
  }

  public get isReadOnly(): boolean {
    return false;
  }

  // This determines if the question is "complete" for SurveyJS validation
  public get isCompleted(): boolean {
    // For now, always return true to allow navigation
    return true;
  }
}

// Register the custom question type with SurveyJS
Serializer.addClass(
  "document-collection",
  [],
  function() {
    return new DocumentCollectionQuestion("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("document-collection", (name) => {
  return new DocumentCollectionQuestion(name);
});

// Class-based React component that extends SurveyQuestionElementBase
export class SurveyQuestionDocumentCollection extends SurveyQuestionElementBase {
  constructor(props: React.ComponentProps<typeof SurveyQuestionElementBase>) {
    super(props);
  }

  get question() {
    return this.questionBase;
  }

  renderElement() {
    // Get URL params for navigation
    const params = new URLSearchParams(window.location.search);
    const applicationId = params.get('id') || undefined;
    const applicationType = params.get('type') || undefined;

    return (
        <DocumentCollectionStep 
          applicationId={applicationId}
          applicationType={applicationType}
        />
    );
  }
}

// Register the React component with SurveyJS
ReactQuestionFactory.Instance.registerQuestion("document-collection", (props) => {
  return React.createElement(SurveyQuestionDocumentCollection, props);
}); 