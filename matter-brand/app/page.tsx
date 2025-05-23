'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import MainGrid from '@/app/components/MainGrid';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  return (
    <main className="flex h-screen">
      <Sidebar 
        width={sidebarWidth} 
        onWidthChange={setSidebarWidth}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <MainGrid selectedCategory={selectedCategory} />
    </main>
  );
}
