import React from 'react';
import { Block, BlockContent } from '../types';
import { BlockRenderer } from './BlockRenderer';
import { cn, hexToRgb } from '../utils';
import { Trash2, GripVertical } from 'lucide-react';

interface BlockWrapperProps {
  block: Block;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  updateContent: (id: string, content: Partial<BlockContent>) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  index: number;
  isMobileView?: boolean;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  updateContent,
  onDragStart,
  onDragOver,
  onDrop,
  index,
  isMobileView
}) => {
  const { styles } = block;
  
  // Calculate RGBA for opacity support if a hex color is provided
  const rgb = hexToRgb(styles.backgroundColor);
  const bgColor = rgb 
    ? `rgba(${rgb}, ${styles.backgroundOpacity})` 
    : styles.backgroundColor;

  // Prioritize gradient if it exists, otherwise use backgroundImage, then fall back to bgColor
  const background = styles.gradient || (styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined);

  const styleObj: React.CSSProperties = {
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
    backgroundColor: bgColor,
    backgroundImage: background,
    color: styles.textColor,
    backgroundSize: styles.backgroundSize,
    backgroundRepeat: styles.backgroundRepeat,
    backgroundPosition: styles.backgroundPosition,
  };

  return (
    <section
      className={cn(
        "builder-block relative group transition-all duration-300 border-2 ease-in-out",
        "hover:scale-[1.01] hover:shadow-xl hover:z-10",
        isSelected ? "border-blue-500 z-10 scale-[1.01] shadow-xl" : "border-transparent hover:border-blue-300"
      )}
      style={styleObj}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      {/* Selection UI Overlays - Visible only when selected or hovered */}
      <div className={cn(
          "absolute -top-3 -left-[2px] bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t-md flex items-center gap-2 transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <span className="font-mono uppercase text-[10px] tracking-wider">{block.type}</span>
      </div>

      <div className={cn(
          "absolute top-2 right-2 flex gap-2 transition-opacity bg-white/90 backdrop-blur rounded shadow-sm border border-gray-200 p-1",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
         <div className="cursor-move text-gray-500 hover:text-blue-600 p-1">
             <GripVertical size={16} />
         </div>
         <button 
            onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
            }}
            className="text-red-400 hover:text-red-600 p-1"
            title="Remove Block"
         >
            <Trash2 size={16} />
         </button>
      </div>

      {/* Content Renderer */}
      <BlockRenderer block={block} updateContent={updateContent} isMobileView={isMobileView} />
    </section>
  );
};