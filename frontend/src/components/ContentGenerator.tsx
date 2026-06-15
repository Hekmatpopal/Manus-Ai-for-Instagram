'use client';

import { useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import { generateContent } from '@/lib/api';
import toast from 'react-hot-toast';
import { Loader2, Wand2, Save } from 'lucide-react';

const contentTypes = [
  { id: 'post', label: 'Single Post', description: 'One image + caption' },
  { id: 'carousel', label: 'Carousel', description: '5-10 slides' },
  { id: 'reel', label: 'Reel', description: 'Video script + visuals' },
  { id: 'story', label: 'Story', description: 'Multiple story slides' },
];

const tones = ['Professional', 'Casual', 'Humorous', 'Enthusiastic', 'Educational'];

const styles = ['Minimalist', 'Colorful', 'Modern', 'Vintage', 'Abstract'];

export function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('Enthusiastic');
  const [style, setStyle] = useState('Modern');
  const [includeImage, setIncludeImage] = useState(true);

  const { setGeneratedContent, setLoadingGenerating, addDraft } = useContentStore();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoadingGenerating(true);
    try {
      const content = await generateContent({
        topic,
        contentType,
        tone,
        style,
        includeImage,
      });

      setGeneratedContent(content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setLoadingGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    const { generatedContent } = useContentStore.getState();
    if (!generatedContent) {
      toast.error('No content to save');
      return;
    }
    addDraft(generatedContent);
    toast.success('Draft saved!');
  };

  const { loadingGenerating } = useContentStore();

  return (
    <div className="space-y-6">
      {/* Topic Input */}
      <div>
        <label className="block text-sm font-semibold mb-2">Topic or Idea</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'Top 5 AI tools for content creators' or 'Tips for using ChatGPT'"
          className="input w-full h-32 resize-none"
        />
      </div>

      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3">Content Type</label>
        <div className="grid grid-cols-2 gap-3">
          {contentTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                contentType === type.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <div className="font-semibold text-sm">{type.label}</div>
              <div className="text-xs text-white/50">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div>
        <label className="block text-sm font-semibold mb-2">Tone</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {tones.map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`py-2 px-3 rounded-lg text-sm transition-all ${
                tone === t
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-semibold mb-2">Visual Style</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {styles.map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`py-2 px-3 rounded-lg text-sm transition-all ${
                style === s
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Include Image Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="include-image"
          checked={includeImage}
          onChange={(e) => setIncludeImage(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="include-image" className="text-sm font-semibold">
          Generate AI Image (DALL-E)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleGenerate}
          disabled={loadingGenerating || !topic.trim()}
          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
        <button
          onClick={handleSaveDraft}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
}
