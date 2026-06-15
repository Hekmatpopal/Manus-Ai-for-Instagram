import { create } from 'zustand';
import { Content, ContentDraft } from '@/lib/types';

interface ContentStore {
  generatedContent: Content | null;
  drafts: ContentDraft[];
  loadingGenerating: boolean;
  setGeneratedContent: (content: Content | null) => void;
  addDraft: (content: Content) => void;
  removeDraft: (id: string) => void;
  setLoadingGenerating: (loading: boolean) => void;
}

export const useContentStore = create<ContentStore>(set => ({
  generatedContent: null,
  drafts: [],
  loadingGenerating: false,
  setGeneratedContent: (content) => set({ generatedContent: content }),
  addDraft: (content) =>
    set(state => ({
      drafts: [
        ...state.drafts,
        {
          ...content,
          id: `draft-${Date.now()}`,
        } as ContentDraft,
      ],
    })),
  removeDraft: (id) =>
    set(state => ({
      drafts: state.drafts.filter(d => d.id !== id),
    })),
  setLoadingGenerating: (loading) => set({ loadingGenerating: loading }),
}));
