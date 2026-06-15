'use client';

import { useState } from 'react';
import { ContentGenerator } from '@/components/ContentGenerator';
import { PreviewCard } from '@/components/PreviewCard';
import { useContentStore } from '@/store/contentStore';
import { Sparkles, Calendar, Download } from 'lucide-react';

export default function Home() {
  const { generatedContent, loadingGenerating } = useContentStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
      {/* Left side - Generator */}
      <div className="space-y-6">
        <div className="card border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Content Generator
            </h1>
          </div>
          <ContentGenerator />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="btn-primary flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button className="btn-primary flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="space-y-6">
        <div className="sticky top-24">
          {generatedContent ? (
            <PreviewCard content={generatedContent} />
          ) : (
            <div className="card h-96 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-white/50">Generate content to see preview here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
