import { create } from 'zustand';

/**
 * Centralized store for the Faucet Fixer flow.
 *
 * This small store keeps track of the user's selected issue and the
 * photo they capture or pick. When the user chooses an issue on the
 * decision tree screen, `issue` is set. When a photo is taken or
 * selected, `photoUri` is set. Storing these values centrally makes
 * it easy to reference them later, for example, when uploading to a
 * backend or displaying a summary.
 */
interface FlowState {
  /** The issue selected by the user from the decision tree. */
  issue: string | null;
  /** Update the current issue. */
  setIssue: (issue: string | null) => void;
  /** URI of the photo captured or selected by the user. */
  photoUri: string | null;
  /** Update the photo URI. */
  setPhotoUri: (uri: string | null) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  issue: null,
  setIssue: (issue) => set({ issue }),
  photoUri: null,
  setPhotoUri: (uri) => set({ photoUri: uri }),
}));