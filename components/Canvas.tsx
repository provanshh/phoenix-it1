import React, { useRef, useState } from 'react';
import { Block, BlockContent, BlockStyles } from '../types';
import { BlockWrapper } from './BlockWrapper';
import { Download, Monitor, Smartphone, Tablet, Undo, Redo, Moon, Sun, Layers, X, GripHorizontal, Sparkles } from 'lucide-react';
import { cn } from '../utils';

interface CanvasProps {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDropBlock: (e: React.DragEvent, index?: number) => void;
  onReorderBlock: (dragIndex: number, hoverIndex: number) => void;
  onDeleteBlock: (id: string) => void;
  updateBlockContent: (id: string, content: Partial<BlockContent>) => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onAiOpen: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  blocks,
  selectedId,
  onSelect,
  onDropBlock,
  onReorderBlock,
  onDeleteBlock,
  updateBlockContent,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isDarkMode,
  toggleDarkMode,
  onAiOpen
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showStructure, setShowStructure] = useState(false);
  const [structureDragIndex, setStructureDragIndex] = useState<number | null>(null);

  // Main Canvas Drag Handlers
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverIndex(null);
      
      const draggedBlockType = e.dataTransfer.getData('blockType');
      if (draggedBlockType) {
          onDropBlock(e, index);
      } else {
          const draggedIndexStr = e.dataTransfer.getData('dragIndex');
          if (draggedIndexStr) {
              const draggedIndex = parseInt(draggedIndexStr);
              onReorderBlock(draggedIndex, index);
          }
      }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
     e.preventDefault();
     const draggedBlockType = e.dataTransfer.getData('blockType');
     if (draggedBlockType) {
         onDropBlock(e); // Append to end
     }
  };
  
  const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('dragIndex', index.toString());
      e.dataTransfer.effectAllowed = 'move';
  };

  // Structure List Drag Handlers
  const handleStructureDragStart = (e: React.DragEvent, index: number) => {
      setStructureDragIndex(index);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleStructureDrop = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (structureDragIndex !== null && structureDragIndex !== index) {
          onReorderBlock(structureDragIndex, index);
      }
      setStructureDragIndex(null);
  };

  const handleStructureDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 dark:bg-gray-950 overflow-hidden relative transition-colors duration-200">
      {/* Canvas Header / Toolbar */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-4">
           {/* Device Toggles */}
           <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button 
                onClick={() => setDevice('desktop')}
                className={cn("p-2 rounded-md transition", device === 'desktop' ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}
                title="Desktop View"
            >
                <Monitor size={18} />
            </button>
            <button 
                onClick={() => setDevice('mobile')}
                className={cn("p-2 rounded-md transition", device === 'mobile' ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}
                title="Mobile View"
            >
                <Smartphone size={18} />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
             <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 transition"
                title="Undo"
             >
                <Undo size={18} />
             </button>
             <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 transition"
                title="Redo"
             >
                <Redo size={18} />
             </button>
          </div>

           <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

           {/* Structure Toggle */}
            <button
                onClick={() => setShowStructure(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                title="Manage Layers"
            >
                <Layers size={16} />
                <span>Layers</span>
                <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-1.5 rounded-full text-xs min-w-[1.2rem] text-center">{blocks.length}</span>
            </button>

            {/* AI Magic Build Button */}
            <button
                onClick={onAiOpen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition transform"
                title="Generate with AI"
            >
                <Sparkles size={16} fill="currentColor" />
                <span>Magic Build</span>
            </button>

        </div>
        
        <div className="flex items-center gap-4">
             {/* Dark Mode Toggle */}
             <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Toggle Dark Mode"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
                onClick={onExport}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                <Download size={16} /> Export
            </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        className="flex-1 overflow-y-auto p-8 flex justify-center perspective-1000 bg-gray-100 dark:bg-gray-950 transition-colors"
        onClick={() => onSelect('')}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
      >
        <div 
            className={cn(
                "bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 min-h-[calc(100vh-8rem)] relative",
                device === 'desktop' ? 'w-full max-w-[1200px]' : 
                'w-[375px]'
            )}
        >
            {blocks.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 pointer-events-none border-2 border-dashed border-gray-300 dark:border-gray-700 m-4 rounded-xl">
                    <p className="text-xl font-medium">Drag components here</p>
                    <p className="text-sm mt-1">or use <strong className="text-purple-500">Magic Build</strong> to generate</p>
                </div>
            )}

            {blocks.map((block, index) => (
                <div key={block.id} className="relative">
                    {/* Drop Indicator */}
                    {dragOverIndex === index && (
                        <div className="h-1 bg-blue-500 absolute top-0 left-0 right-0 z-50 pointer-events-none shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                    
                    <BlockWrapper
                        index={index}
                        block={block}
                        isSelected={selectedId === block.id}
                        onSelect={onSelect}
                        onDelete={onDeleteBlock}
                        updateContent={updateBlockContent}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        isMobileView={device === 'mobile'}
                    />
                </div>
            ))}
        </div>
      </div>

      {/* Structure View Modal */}
      {showStructure && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-end p-4 animate-fade-in">
              <div className="w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 h-full max-h-[600px] flex flex-col overflow-hidden animate-slide-in-right">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                          <Layers size={18} className="text-blue-500" /> Page Structure
                      </h3>
                      <button 
                        onClick={() => setShowStructure(false)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
                      >
                          <X size={18} />
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                      {blocks.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-sm">No blocks added yet.</div>
                      ) : (
                          <div className="space-y-2">
                              {blocks.map((block, idx) => (
                                  <div 
                                    key={block.id}
                                    draggable
                                    onDragStart={(e) => handleStructureDragStart(e, idx)}
                                    onDragOver={handleStructureDragOver}
                                    onDrop={(e) => handleStructureDrop(e, idx)}
                                    onClick={() => onSelect(block.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border cursor-move transition-all select-none group",
                                        selectedId === block.id 
                                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                                            : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700",
                                        structureDragIndex === idx ? "opacity-50 dashed border-2" : ""
                                    )}
                                  >
                                      <div className="text-gray-400 group-hover:text-blue-500">
                                          <GripHorizontal size={16} />
                                      </div>
                                      <div className="flex-1">
                                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">{block.type}</div>
                                          <div className="text-xs text-gray-400 font-mono">#{block.id.slice(0,4)}</div>
                                      </div>
                                      <div className="text-xs text-gray-300 font-bold">
                                          {idx + 1}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};