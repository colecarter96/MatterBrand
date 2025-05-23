'use client';

import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { motion, AnimatePresence } from 'framer-motion';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface MainGridProps {
  selectedCategory: string | null;
}

interface Tile {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  category: string | null;
}

const getDefaultLayout = (numTiles: number, existingTiles: Tile[] = []): Tile[] => {
  // Total grid is 12 columns wide and 8 rows high
  const newTiles: Tile[] = [];
  
  // Get the default layout for the new number of tiles
  const defaultLayout = (() => {
    switch (numTiles) {
      case 1:
        return [{ i: '1', x: 1, y: 0, w: 10, h: 7, category: null }];
      case 2:
        return [
          { i: '1', x: 0, y: 0, w: 5, h: 7, category: null },
          { i: '2', x: 7, y: 0, w: 5, h: 7, category: null }
        ];
      case 3:
        return [
          { i: '1', x: 0, y: 0, w: 5, h: 3, category: null },
          { i: '2', x: 0, y: 4, w: 5, h: 3, category: null },
          { i: '3', x: 7, y: 0, w: 5, h: 7, category: null }
        ];
      case 4:
        return [
          { i: '1', x: 0, y: 0, w: 5, h: 3, category: null },
          { i: '2', x: 7, y: 0, w: 5, h: 3, category: null },
          { i: '3', x: 0, y: 4, w: 5, h: 3, category: null },
          { i: '4', x: 7, y: 4, w: 5, h: 3, category: null }
        ];
      case 5:
        return [
          { i: '1', x: 0, y: 0, w: 3, h: 3, category: null },
          { i: '2', x: 4, y: 0, w: 3, h: 3, category: null },
          { i: '3', x: 8, y: 0, w: 3, h: 3, category: null },
          { i: '4', x: 0, y: 4, w: 5, h: 3, category: null },
          { i: '5', x: 7, y: 4, w: 5, h: 3, category: null }
        ];
      default:
        return [];
    }
  })();

  // Map existing tiles to new positions while preserving their content
  existingTiles.forEach((existingTile, index) => {
    if (index < numTiles) {
      const defaultTile = defaultLayout[index];
      newTiles.push({
        ...defaultTile,
        category: existingTile.category
      });
    }
  });

  // Add any new tiles needed
  for (let i = existingTiles.length; i < numTiles; i++) {
    newTiles.push(defaultLayout[i]);
  }

  return newTiles;
};

export default function MainGrid({ selectedCategory }: MainGridProps) {
  const [numTiles, setNumTiles] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>(getDefaultLayout(1));
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [isInitialLayout, setIsInitialLayout] = useState(true);
  const [isHandleMode, setIsHandleMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddTile = useCallback(() => {
    if (numTiles < 5) {
      setIsInitialLayout(true);
      setNumTiles(prev => prev + 1);
    }
  }, [numTiles]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        setIsHandleMode(prev => !prev);
      }
      if (e.key.toLowerCase() === 't' && numTiles < 5) {
        handleAddTile();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleAddTile]);

  useEffect(() => {
    if (isInitialLayout) {
      setTiles(prev => getDefaultLayout(numTiles, prev));
    }
  }, [numTiles, isInitialLayout]);

  const handleLayoutChange = (layout: any) => {
    if (!isHandleMode) return;
    setIsInitialLayout(false);
    setTiles(prev => prev.map((tile, index) => ({
      ...tile,
      ...layout[index]
    })));
  };

  const handleDragStop = (layout: any, oldItem: any, newItem: any) => {
    if (!isHandleMode) return;
    if (selectedCategory) {
      setTiles(prev => prev.map(tile => 
        tile.i === newItem.i ? { ...tile, category: selectedCategory } : tile
      ));
    }
  };

  const handleTileMouseDown = (tileId: string) => {
    if (isHandleMode) return;
    setSelectedTile(tileId);
  };

  const handleTileMouseUp = (tileId: string) => {
    if (isHandleMode) return;
    if (selectedCategory && selectedTile === tileId) {
      setTiles(prev => prev.map(tile => 
        tile.i === tileId ? { ...tile, category: selectedCategory } : tile
      ));
    }
    setSelectedTile(null);
  };

  const handleDeleteTile = (e: React.MouseEvent, tileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow deletion in handle mode
    if (!isHandleMode) return;
    
    // Get the current tiles without the deleted one
    const remainingTiles = tiles.filter(tile => tile.i !== tileId);
    const newNumTiles = remainingTiles.length;
    
    // Get the default layout for the remaining number of tiles
    const defaultLayout = getDefaultLayout(newNumTiles);
    
    // Map the remaining tiles to their new positions while preserving their content
    const newTiles = defaultLayout.map((defaultTile, index) => ({
      ...defaultTile,
      category: remainingTiles[index]?.category || null
    }));
    
    setNumTiles(newNumTiles);
    setTiles(newTiles);
    setSelectedTile(null);
  };

  const renderTileContent = (category: string | null, tileId: string) => {
    const DeleteButton = () => (
      <button
        onClick={(e) => handleDeleteTile(e, tileId)}
        className={`absolute -bottom-8 right-0 z-[100] p-1.5 bg-secondary/80 hover:bg-secondary border border-primary/10 rounded-md transition-colors ${
          !isHandleMode ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    );

    if (!category) return (
      <div className="relative h-full">
        <div className="text-accent">Select a category</div>
        <DeleteButton />
      </div>
    );

    switch (category) {
      case 'MUSIC':
        return (
          <div className="relative w-full h-full">
            {isHandleMode && (
              <div className="absolute inset-0 z-10 cursor-move bg-primary/5" />
            )}
            <iframe
              src="https://open.spotify.com/embed/playlist/547oddbhReyozD8Amu9VYl"
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ pointerEvents: isHandleMode ? 'none' : 'auto' }}
            />
            <DeleteButton />
          </div>
        );
      case 'COLORS':
        return (
          <div className="relative grid grid-cols-2 gap-2 p-4 h-full">
            {['#000000', '#FFFFFF', '#666666', '#999999'].map((color) => (
              <div key={color} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 border border-primary/10"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{color}</span>
              </div>
            ))}
            {isHandleMode && (
              <div className="absolute inset-0 z-10 cursor-move bg-primary/5" />
            )}
            <DeleteButton />
          </div>
        );
      default:
        return (
          <div className="relative p-4 h-full">
            {category} content coming soon...
            {isHandleMode && (
              <div className="absolute inset-0 z-10 cursor-move bg-primary/5" />
            )}
            <DeleteButton />
          </div>
        );
    }
  };

  if (!mounted) {
    return (
      <div className="flex-1 relative h-full">
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <div className="text-sm text-accent">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative h-full">
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <div className="text-sm text-accent">
          Press 'H' to {isHandleMode ? 'disable' : 'enable'} drag mode
          {numTiles < 5 && <span className="ml-2">• Press 'T' to add tile</span>}
        </div>
        <select
          value={numTiles}
          onChange={(e) => {
            setIsInitialLayout(true);
            setNumTiles(Number(e.target.value));
          }}
          className="bg-secondary border border-primary/10 p-2"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Tile{num !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTile}
          disabled={numTiles >= 5}
          className={`p-2 border border-primary/10 transition-colors ${
            numTiles >= 5 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-primary/5'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      <ResponsiveGridLayout
        className="layout h-full"
        layouts={{ lg: tiles }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={handleLayoutChange}
        onDragStop={handleDragStop}
        isDraggable={isHandleMode}
        isResizable={isHandleMode}
        margin={[16, 24]}
        containerPadding={[16, 16]}
        useCSSTransforms={true}
        preventCollision={true}
        compactType={null}
      >
        {tiles.map((tile) => (
          <div
            key={tile.i}
            className={`bg-secondary border border-primary/10 transition-colors ${
              selectedTile === tile.i ? 'ring-2 ring-primary' : ''
            }`}
            onMouseDown={() => handleTileMouseDown(tile.i)}
            onMouseUp={() => handleTileMouseUp(tile.i)}
          >
            {renderTileContent(tile.category, tile.i)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
} 