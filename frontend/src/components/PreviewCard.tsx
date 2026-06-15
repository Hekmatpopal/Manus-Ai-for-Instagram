'use client';

import { Download, Copy, Share2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Content } from '@/lib/types';

export function PreviewCard({ content }: { content: Content }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content.caption);
    toast.success('Caption copied!');
  };

  const handleDownload = async () => {
    if (!content.imageUrl) {
      toast.error('No image to download');
      return;
    }
    const a = document.createElement('a');
    a.href = content.imageUrl;
    a.download = `manus-post-${Date.now()}.jpg`;
    a.click();
    toast.success('Image downloading...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Manus AI',
        text: content.caption,
        url: window.location.href,
      });
    } else {
      toast.error('Share not supported on this device');
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Preview</h2>

      {/* Instagram Mockup */}
      <div className="bg-black rounded-xl overflow-hidden mb-6 border-8 border-gray-800 max-w-sm mx-auto">
        <div className="bg-gradient-to-b from-gray-900 to-black p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400"></div>
            <div>
              <div className="text-sm font-semibold text-white">manus.ai</div>
              <div className="text-xs text-gray-400">Original audio</div>
            </div>
          </div>
          <div className="text-white text-xl">...</div>
        </div>

        {/* Image */}
        {content.imageUrl && (
          <img
            src={content.imageUrl}
            alt="Generated content"
            className="w-full aspect-square object-cover"
          />
        )}

        {/* Caption */}
        <div className="p-3 text-white border-t border-gray-800">
          <div className="flex gap-3 mb-2">
            <Heart className="w-6 h-6 cursor-pointer hover:text-red-500" />
            <Share2 className="w-6 h-6 cursor-pointer" />
          </div>
          <div className="text-sm font-semibold mb-1">123,456 likes</div>
          <p className="text-sm line-clamp-3">
            <span className="font-semibold">manus.ai</span> {content.caption}
          </p>
        </div>
      </div>

      {/* Caption */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Caption</label>
        <div className="bg-white/5 p-4 rounded-lg text-white/90 min-h-24 max-h-40 overflow-y-auto">
          {content.caption}
        </div>
      </div>

      {/* Hashtags */}
      {content.hashtags && content.hashtags.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Hashtags</label>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map(tag => (
              <span key={tag} className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4 text-white/50">
        <div>Type: {content.type}</div>
        <div>Tone: {content.tone}</div>
        <div>Style: {content.style}</div>
        <div>Generated: {new Date(content.createdAt).toLocaleString()}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Copy className="w-4 h-4" /> Copy
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button
          onClick={handleShare}
          className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}
