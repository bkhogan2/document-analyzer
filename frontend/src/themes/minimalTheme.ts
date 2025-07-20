// Design system ready SurveyJS theme
export const minimalTheme = {
  cssVariables: {
    // Root container - inherits from design system
    "--sjs-root-backcolor": "var(--ds-surface-background, white)",
    "--sjs-root-border-color": "var(--ds-border-color, transparent)",
    "--sjs-root-border-radius": "var(--ds-border-radius, 0)",
    "--sjs-root-padding": "var(--ds-spacing-none, 0)",
    "--sjs-root-shadow": "var(--ds-shadow-none, none)",
    
    // Container
    "--sjs-container-backcolor": "var(--ds-surface-background, white)",
    "--sjs-container-border-color": "var(--ds-border-color, transparent)",
    "--sjs-container-border-radius": "var(--ds-border-radius, 0)",
    "--sjs-container-padding": "var(--ds-spacing-none, 0)",
    "--sjs-container-shadow": "var(--ds-shadow-none, none)",
    
    // Page
    "--sjs-page-backcolor": "var(--ds-surface-background, white)",
    "--sjs-page-border-color": "var(--ds-border-color, transparent)",
    "--sjs-page-border-radius": "var(--ds-border-radius, 0)",
    "--sjs-page-padding": "var(--ds-spacing-none, 0)",
    "--sjs-page-shadow": "var(--ds-shadow-none, none)",
    
    // Question
    "--sjs-question-backcolor": "var(--ds-surface-background, white)",
    "--sjs-question-border-color": "var(--ds-border-color, transparent)",
    "--sjs-question-border-radius": "var(--ds-border-radius, 0)",
    "--sjs-question-padding": "var(--ds-spacing-none, 0)",
    "--sjs-question-shadow": "var(--ds-shadow-none, none)",
    
    // Survey title (matches your app's h1 styling)
    "--sjs-survey-title-color": "var(--ds-text-primary, #1f2937)",
    "--sjs-survey-title-font-size": "var(--ds-text-3xl, 1.875rem)",
    "--sjs-survey-title-font-weight": "var(--ds-font-semibold, 600)",
    "--sjs-survey-title-padding": "var(--ds-spacing-none, 0) 0 var(--ds-spacing-lg, 1rem) 0",
    
    // Page title (for individual page titles)
    "--sjs-page-title-color": "var(--ds-text-primary, #1f2937)",
    "--sjs-page-title-font-size": "var(--ds-text-2xl, 1.5rem)",
    "--sjs-page-title-font-weight": "var(--ds-font-semibold, 600)",
    "--sjs-page-title-padding": "var(--ds-spacing-none, 0) 0 var(--ds-spacing-lg, 1rem) 0",
    
    // Survey description (matches your app's description styling)
    "--sjs-survey-description-color": "var(--ds-text-secondary, #6b7280)",
    "--sjs-survey-description-font-size": "var(--ds-text-lg, 1.125rem)",
    "--sjs-survey-description-font-weight": "var(--ds-font-normal, 400)",
    "--sjs-survey-description-padding": "var(--ds-spacing-none, 0) 0 var(--ds-spacing-xl, 2rem) 0",
    
    // Question title (TurboTax-style sleek labels)
    "--sjs-question-title-color": "var(--ds-text-primary, #1f2937)",
    "--sjs-question-title-font-size": "var(--ds-text-sm, 0.875rem)",
    "--sjs-question-title-font-weight": "var(--ds-font-medium, 500)",
    "--sjs-question-title-font-family": "var(--ds-font-family, 'Avenir Next')",
    "--sjs-question-title-padding": "var(--ds-spacing-none, 0) 0 var(--ds-spacing-xs, 0.25rem) 0",
    
    // Question description
    "--sjs-question-description-color": "var(--ds-text-secondary, #6b7280)",
    "--sjs-question-description-font-size": "var(--ds-text-sm, 0.875rem)",
    "--sjs-question-description-padding": "var(--ds-spacing-none, 0) 0 var(--ds-spacing-md, 1rem) 0",
    
    // Input fields (TurboTax-style clean inputs)
    "--sjs-input-backcolor": "var(--ds-input-background, white)",
    "--sjs-input-border-color": "var(--ds-border-black, #000000)",
    "--sjs-input-border-radius": "var(--ds-border-radius-sm, 0.25rem)",
    "--sjs-input-padding": "var(--ds-spacing-sm, 0.5rem) var(--ds-spacing-md, 0.75rem)",
    "--sjs-input-font-size": "var(--ds-text-sm, 0.875rem)",
    "--sjs-input-color": "var(--ds-text-primary, #1f2937)",
    "--sjs-input-font-family": "var(--ds-font-family, 'Avenir Next')",
    
    // Input focus state (TurboTax-style light blue border)
    "--sjs-input-focus-backcolor": "var(--ds-input-background, white)",
    "--sjs-input-focus-border-color": "var(--ds-focus-blue, #3b82f6)",
    "--sjs-input-focus-shadow": "none",
    
    // Navigation buttons
    "--sjs-button-backcolor": "var(--ds-primary-color, #3b82f6)",
    "--sjs-button-border-color": "var(--ds-primary-color, #3b82f6)",
    "--sjs-button-border-radius": "var(--ds-border-radius-md, 0.375rem)",
    "--sjs-button-padding": "var(--ds-spacing-sm, 0.5rem) var(--ds-spacing-md, 1rem)",
    "--sjs-button-font-size": "var(--ds-text-sm, 0.875rem)",
    "--sjs-button-color": "var(--ds-primary-text, white)",
    "--sjs-button-font-weight": "var(--ds-font-medium, 500)",
    
    // Button hover state
    "--sjs-button-hover-backcolor": "var(--ds-primary-hover, #2563eb)",
    "--sjs-button-hover-border-color": "var(--ds-primary-hover, #2563eb)",
    
    // Progress bar
    "--sjs-progress-bar-backcolor": "var(--ds-surface-secondary, #e5e7eb)",
    "--sjs-progress-bar-border-color": "transparent",
    "--sjs-progress-bar-border-radius": "var(--ds-border-radius-md, 0.375rem)",
    "--sjs-progress-bar-padding": "var(--ds-spacing-xs, 0.25rem)",
    
    // Progress bar fill
    "--sjs-progress-bar-fill-backcolor": "var(--ds-primary-color, #3b82f6)",
    "--sjs-progress-bar-fill-border-color": "transparent",
    "--sjs-progress-bar-fill-border-radius": "var(--ds-border-radius-sm, 0.25rem)",
    
    // Progress text
    "--sjs-progress-text-color": "var(--ds-text-secondary, #6b7280)",
    "--sjs-progress-text-font-size": "var(--ds-text-sm, 0.875rem)",
    "--sjs-progress-text-font-weight": "var(--ds-font-medium, 500)",
  },
  themeName: "minimal"
}; 