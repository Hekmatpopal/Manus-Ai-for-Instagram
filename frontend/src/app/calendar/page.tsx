'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function CalendarPage() {
  const { drafts } = useContentStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  return (
    <div className="space-y-8 py-8">
      <div className="card border-l-4 border-l-purple-500">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-purple-400" />
          <h1 className="text-3xl font-bold">Content Calendar</h1>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-center mb-4 text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-purple-300">
                {day}
              </div>
            ))}
            {days.map(day => (
              <div
                key={day.toString()}
                className="aspect-square bg-white/5 rounded-lg p-2 text-center text-sm hover:bg-white/10 cursor-pointer transition-colors"
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Scheduled Posts</h2>
        <div className="space-y-4">
          {drafts.length === 0 ? (
            <p className="text-white/50 text-center py-8">No scheduled posts yet</p>
          ) : (
            drafts.map(draft => (
              <div key={draft.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">{draft.caption?.substring(0, 50)}...</p>
                  <p className="text-sm text-white/50 mt-1">
                    Scheduled for: {draft.scheduledDate || 'Not scheduled'}
                  </p>
                </div>
                <button className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
