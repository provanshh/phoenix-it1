import React, { useState } from 'react';
import { BlockType } from '../types';
import { 
  Menu, 
  Sparkles, 
  LayoutGrid, 
  Quote, 
  Video, 
  Megaphone, 
  Mail, 
  CreditCard, 
  HelpCircle, 
  LayoutTemplate, 
  Image, 
  Users, 
  FileText, 
  Newspaper,
  SplitSquareHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils';

const TOOLS: { type: BlockType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'header', label: 'Navigation Bar', icon: <Menu size={20} />, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400' },
  { type: 'hero', label: 'Hero Section', icon: <Sparkles size={20} />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' },
  { type: 'features', label: 'Features Grid', icon: <LayoutGrid size={20} />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
  { type: 'testimonials', label: 'Testimonials', icon: <Quote size={20} />, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400' },
  { type: 'video', label: 'Video Embed', icon: <Video size={20} />, color: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  { type: 'cta', label: 'Call to Action', icon: <Megaphone size={20} />, color: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' },
  { type: 'contact', label: 'Contact Form', icon: <Mail size={20} />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
  { type: 'pricing', label: 'Pricing Table', icon: <CreditCard size={20} />, color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' },
  { type: 'faq', label: 'FAQ Section', icon: <HelpCircle size={20} />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' },
  { type: 'footer', label: 'Footer', icon: <LayoutTemplate size={20} />, color: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  { type: 'gallery', label: 'Image Gallery', icon: <Image size={20} />, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' },
  { type: 'team', label: 'Team Members', icon: <Users size={20} />, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400' },
  { type: 'blog', label: 'Blog Article', icon: <FileText size={20} />, color: 'bg-lime-100 text-lime-600 dark:bg-lime-900/50 dark:text-lime-400' },
  { type: 'newsletter', label: 'Newsletter', icon: <Newspaper size={20} />, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400' },
  { type: 'image-text', label: 'Image & Text', icon: <SplitSquareHorizontal size={20} />, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400' },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div 
        className={cn(
            "bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 transition-all duration-300 relative",
            isCollapsed ? "w-20" : "w-64"
        )}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md text-gray-500 dark:text-gray-400 hover:text-blue-600 z-50"
      >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={cn("p-6 border-b border-gray-100 dark:border-gray-800 flex items-center overflow-hidden whitespace-nowrap", isCollapsed ? "justify-center px-0" : "")}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-blue-200 dark:shadow-blue-900/30 shadow-lg shrink-0">Z</div>
            {!isCollapsed && <h1 className="font-bold text-xl text-gray-800 dark:text-white transition-opacity duration-300">Zenith</h1>}
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar overflow-x-hidden">
        {!isCollapsed && <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2 truncate">Components</p>}
        <div className="space-y-2">
          {TOOLS.map((tool) => (
            <div
              key={tool.type}
              draggable
              onDragStart={(e) => onDragStart(e, tool.type)}
              title={isCollapsed ? tool.label : undefined}
              className={cn(
                  "group flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-grab active:cursor-grabbing transition-all duration-200 select-none",
                  isCollapsed ? "justify-center px-0" : ""
              )}
            >
              <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm shrink-0`}>
                {tool.icon}
              </div>
              {!isCollapsed && (
                  <span className="font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate">{tool.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {!isCollapsed && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs text-center text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            Drag components to canvas
          </div>
      )}
    </div>
  );
};