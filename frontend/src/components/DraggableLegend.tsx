import React, { useState, useRef } from 'react';

interface DraggablePosition {
  x: number;
  y: number;
}

interface DraggableLegendProps {
  children: React.ReactNode;
  title: string;
}

const DraggableLegend: React.FC<DraggableLegendProps> = ({ children, title }) => {
  const [position, setPosition] = useState<DraggablePosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const legendRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={legendRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
      }}
      className="bg-gray-900 rounded-lg border border-gray-700 shadow-lg max-w-sm"
    >
      {/* Draggable Header */}
      <div
        onMouseDown={handleMouseDown}
        className={`bg-gray-800 rounded-t-lg p-3 border-b border-gray-700 cursor-grab active:cursor-grabbing flex items-center justify-between ${
          isDragging ? 'opacity-80' : ''
        }`}
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📋</span>
          {title}
        </h2>
        <div className="text-xs text-gray-400">
          <span className="inline-block px-2 py-1 bg-gray-700 rounded">Drag to move</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-sm max-h-96 overflow-y-auto">{children}</div>
    </div>
  );
};

export default DraggableLegend;
