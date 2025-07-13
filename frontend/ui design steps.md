Suggested Order of Implementation (Foundational Approach)

1. Persistent, Context-Aware Stepper
   - Move the stepper to a layout component that wraps all application-related pages.
   - Ensure the stepper is always visible when working on an application (wizard, uploads, review, etc.).

2. Centralized Application State
   - Use a global store (e.g., Zustand) to track current step, section, and completion status.
   - Persist state to localStorage or backend for session continuity.

3. Composable Step/Section Model
   - Define steps/sections in a config object/array with metadata (title, fields, validation, etc.).
   - Render wizard and stepper dynamically from this config for easy updates.

4. Section Progress Calculation
   - Calculate and display partial progress for each section (e.g., 2/3 steps complete).
   - Pass an array of progress values (0–1) to the stepper for proportional fills.

5. Navigation & Validation
   - Allow users to click on completed/current sections in the stepper.
   - Prevent skipping ahead unless validation passes; show clear feedback if blocked.

6. Integration with Document Uploads & Other Processes
   - Treat uploads, reviews, and other processes as steps/sections in the config.
   - Stepper reflects progress through all parts of the application process.

7. Visual & UX Enhancements
   - Add subtle animations for progress.
   - Highlight the current section.
   - Add tooltips or helper text as needed.
   - Ensure responsive and accessible design.

8. Future-Proofing
   - Key all state by application ID to support multiple applications and resuming.
   - Design for easy extension to admin/partner views.

Optional: Clickable Sections
   - Allow users to jump to sections via the stepper, with validation.