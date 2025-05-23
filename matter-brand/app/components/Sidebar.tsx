'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const categories = [
  'MUSIC',
  'MOVIES',
  'VIDEOS',
  'COLORS',
  'FONTS',
  'LITERATURE',
  'TEXTURES',
  'ITEMS',
  'FEELINGS',
  'SEASON, TEMPERATURE, WEATHER',
  'PROGRAMMING STUFF',
  'ACTIVITIES',
  'WEBSITES'
];

interface SidebarProps {
  width: number;
  onWidthChange: (width: number) => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

export default function Sidebar({ width, onWidthChange, selectedCategory, onCategorySelect }: SidebarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && sidebarRef.current) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
          onWidthChange(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onWidthChange]);

  if (!mounted) {
    return (
      <div
        ref={sidebarRef}
        className="relative h-full bg-secondary border-r border-primary/10"
        style={{ width: `${width}px` }}
      />
    );
  }

  return (
    <motion.div
      ref={sidebarRef}
      className="relative h-full bg-secondary border-r border-primary/10"
      style={{ width: `${width}px` }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">CATEGORIES</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`w-full text-left p-2 transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-secondary'
                  : 'hover:bg-primary/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div
        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20"
        onMouseDown={handleMouseDown}
      />
    </motion.div>
  );
} 
