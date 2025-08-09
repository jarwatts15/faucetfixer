import { create } from 'zustand';

/**
 * Centralized store for the Faucet Fixer flow.
 *
 * This store keeps track of the user's selected issue, any captured/selected
 * photo, and optional intake form data. Centralizing state makes it easy to
 * reference later when navigating between screens or submitting to a backend.
 */
export interface IntakeData {
  fullName?: string;
  email?: string;
  issueDescription?: string;
}

interface FlowState {
  /** The issue selected by the user from the decision tree. */
  issue: string | null;
  /** Update the current issue. */
  setIssue: (issue: string | null) => void;
  /** URI of the photo captured or selected by the user. */
  photoUri: string | null;
  /** Update the photo URI. */
  setPhotoUri: (uri: string | null) => void;
  /** Base64 of the photo captured or selected by the user. */
  photoBase64: string | null;
  /** Update the base64 photo data. */
  setPhotoBase64: (base64: string | null) => void;
  /** Optional intake form data provided by the user. */
  intakeData: IntakeData | null;
  /** Update the intake form data. */
  setIntakeData: (data: IntakeData | null) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  issue: null,
  setIssue: (issue) => set({ issue }),
  photoUri: null,
  setPhotoUri: (uri) => set({ photoUri: uri }),
  photoBase64: null,
  setPhotoBase64: (base64) => set({ photoBase64: base64 }),
  intakeData: null,
  setIntakeData: (data) => set({ intakeData: data }),
}));