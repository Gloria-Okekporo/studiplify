import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-24 lg:w-32 border-r border-border/40 bg-white/50 flex flex-col items-center py-10 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl mb-10" />
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-10 h-10 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Skeleton */}
        <div className="h-20 lg:h-28 border-b border-border/20 flex items-center justify-between px-8 lg:px-12 animate-pulse">
          <div className="w-48 h-8 bg-gray-200 rounded-lg" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full" />
            <div className="w-10 h-10 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto p-8 lg:px-12 space-y-8 animate-pulse">
          {/* Hero Section Skeleton */}
          <div className="h-64 bg-gray-100 rounded-[3rem] w-full" />
          
          {/* Insight Widget Skeleton */}
          <div className="h-32 bg-gray-50 rounded-[2.5rem] w-full border border-gray-100" />

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-white border border-gray-100 rounded-[2.5rem]" />
              ))}
              <div className="md:col-span-3 h-32 bg-white border border-gray-100 rounded-[3rem]" />
            </div>
            <div className="lg:col-span-4 h-full min-h-[400px] bg-white border border-gray-100 rounded-[3rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
