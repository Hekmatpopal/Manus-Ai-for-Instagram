'use client';

import { Trash2, Copy, Share2 } from 'lucide-react';
import { useContentStore } from '@/store/contentStore';

export default function DraftsPage() {
  const { drafts, removeDraft } = useContentStore();

  return (
    <div className="space-y-8 py-8">
      <div className="card border-l-4 border-l-purple-500">
        <h1 className="text-3xl font-bold mb-2">Saved Drafts</h1>
        <p className="text-white/50">Your saved content ideas and drafts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-white/50">No drafts saved yet. Generate and save your first content!</p>
          </div>
        ) : (
          drafts.map(draft => (
            <div key={draft.id} className="card group hover:border-purple-500 cursor-pointer">
              {draft.imageUrl && (
                <img
                  src={draft.imageUrl}
                  alt="Draft preview"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <p className="font-semibold line-clamp-3 mb-2">{draft.caption}</p>
              <p className="text-xs text-white/50 mb-4">
                Created: {new Date(draft.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button
                  onClick={() => removeDraft(draft.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 px-3 py-2 rounded-lg text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
