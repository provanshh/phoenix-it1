import React, { useState } from 'react';
import { Block, BlockStyles } from '../types';
import { Sliders, Palette, Layout, Type as TypeIcon, Image as ImageIcon, Code, Sparkles, ChevronLeft, ChevronRight, Copy, Check, Plus, AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';
import { ICON_MAP } from './BlockRenderer';
import { cn, generateBlockHTML, generateBlockStyleString } from '../utils';

interface PropertiesPanelProps {
  block: Block | null;
  updateBlockStyles: (id: string, styles: Partial<BlockStyles>) => void;
  updateBlockContent: (id: string, content: any) => void;
}

const PALETTES = [
  { name: 'Clean', bg: '#ffffff', text: '#1a202c' },
  { name: 'Dark', bg: '#111827', text: '#f9fafb' },
  { name: 'Ocean', bg: '#eff6ff', text: '#1e3a8a' },
  { name: 'Rose', bg: '#fff1f2', text: '#881337' },
  { name: 'Slate', bg: '#f8fafc', text: '#334155' },
  { name: 'Teal', bg: '#f0fdfa', text: '#134e4a' },
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ block, updateBlockStyles, updateBlockContent }) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'html'>('style');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (!block) {
    return (
      <div className={cn("bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full transition-all duration-300 relative", isCollapsed ? "w-12 items-center" : "w-80")}>
         <button 
            onClick={toggleCollapse}
            className="absolute -left-3 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md text-gray-500 dark:text-gray-400 hover:text-blue-600 z-50"
         >
            {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
         </button>
         {!isCollapsed && (
            <div className="flex flex-col items-center justify-center text-center text-gray-400 h-full p-8">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Sliders size={32} />
                </div>
                <p>Select a block on the canvas to edit its properties.</p>
            </div>
         )}
      </div>
    );
  }

  const { styles, content } = block;

  const handleChange = (key: keyof BlockStyles, value: any) => {
    updateBlockStyles(block.id, { [key]: value });
  };

  const handleContentChange = (key: string, value: any) => {
    updateBlockContent(block.id, { [key]: value });
  };

  const handleItemUpdate = (arrayKey: string, index: number, itemKey: string, value: any) => {
      const newArray = [...content[arrayKey]];
      newArray[index] = { ...newArray[index], [itemKey]: value };
      updateBlockContent(block.id, { [arrayKey]: newArray });
  };

  const handleAddElement = (type: 'text' | 'button') => {
      const currentElements = content.elements || [];
      const newElement = type === 'text' 
          ? { type: 'text', content: 'New Text Block', align: 'center' } 
          : { type: 'button', text: 'New Button', url: '#', align: 'center' };
      
      updateBlockContent(block.id, { elements: [...currentElements, newElement] });
  };

  const handleRemoveElement = (index: number) => {
      const currentElements = content.elements || [];
      const newElements = currentElements.filter((_, i) => i !== index);
      updateBlockContent(block.id, { elements: newElements });
  };

  const handleElementAlign = (index: number, align: 'left' | 'center' | 'right') => {
      const currentElements = content.elements || [];
      const newElements = [...currentElements];
      newElements[index] = { ...newElements[index], align };
      updateBlockContent(block.id, { elements: newElements });
  };

  const applyPalette = (bg: string, text: string) => {
      updateBlockStyles(block.id, { backgroundColor: bg, textColor: text, gradient: undefined });
  };

  const toggleGradient = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          let newGradient = `linear-gradient(135deg, ${styles.backgroundColor} 0%, rgba(255,255,255,0) 100%)`;
          if (styles.backgroundColor === '#ffffff') {
              newGradient = 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)';
          } else if (styles.backgroundColor === '#111827') {
              newGradient = 'linear-gradient(135deg, #111827 0%, #1f2937 100%)';
          }
          handleChange('gradient', newGradient);
      } else {
          handleChange('gradient', undefined);
      }
  };

  // Helper to parse rem values for input
  const getRemValue = (val: string) => {
      return parseFloat(val.replace('rem', '')) || 0;
  };

  const handleCopyHtml = () => {
    const html = `<section style="${generateBlockStyleString(block)}">\n${generateBlockHTML(block)}\n</section>`;
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-xl z-20 transition-all duration-300 relative", isCollapsed ? "w-12" : "w-80")}>
      <button 
        onClick={toggleCollapse}
        className="absolute -left-3 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md text-gray-500 dark:text-gray-400 hover:text-blue-600 z-50"
      >
          {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {isCollapsed ? (
          <div className="flex flex-col items-center pt-16 gap-4">
              <button onClick={() => { setActiveTab('style'); setIsCollapsed(false); }} title="Style" className={cn("p-2 rounded-lg", activeTab === 'style' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-500")}><Palette size={20} /></button>
              <button onClick={() => { setActiveTab('layout'); setIsCollapsed(false); }} title="Layout" className={cn("p-2 rounded-lg", activeTab === 'layout' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-500")}><Layout size={20} /></button>
              <button onClick={() => { setActiveTab('html'); setIsCollapsed(false); }} title="HTML Code" className={cn("p-2 rounded-lg", activeTab === 'html' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-500")}><Code size={20} /></button>
          </div>
      ) : (
          <>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <h2 className="font-bold text-sm text-gray-800 dark:text-white flex items-center justify-between">
                <span>Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1)}</span>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 px-2 py-1 rounded-full">#{block.id.slice(0,4)}</span>
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-3 text-xs font-medium flex justify-center items-center gap-2 transition-colors ${activeTab === 'style' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'}`}
                >
                <Palette size={14} /> Style
                </button>
                <button
                onClick={() => setActiveTab('layout')}
                className={`flex-1 py-3 text-xs font-medium flex justify-center items-center gap-2 transition-colors ${activeTab === 'layout' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'}`}
                >
                <Layout size={14} /> Layout
                </button>
                <button
                onClick={() => setActiveTab('html')}
                className={`flex-1 py-3 text-xs font-medium flex justify-center items-center gap-2 transition-colors ${activeTab === 'html' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'}`}
                >
                <Code size={14} /> HTML
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                
                {activeTab === 'style' && (
                <>
                    {/* Add Elements Section */}
                    <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                         <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                             <Plus size={14} className="text-blue-500" /> Add Content
                         </label>
                         <div className="grid grid-cols-2 gap-2">
                             <button 
                                onClick={() => handleAddElement('text')}
                                className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition"
                             >
                                 <TypeIcon size={14} /> Text
                             </button>
                             <button 
                                onClick={() => handleAddElement('button')}
                                className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition"
                             >
                                 <div className="w-3 h-3 bg-blue-500 rounded-[2px]"></div> Button
                             </button>
                         </div>

                         {/* List Added Elements */}
                         {content.elements && content.elements.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {content.elements.map((el: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            {el.type === 'text' ? <TypeIcon size={12} className="text-gray-400"/> : <div className="w-3 h-3 bg-blue-400 rounded-[1px]"/>}
                                            <span className="text-xs text-gray-600 dark:text-gray-300 capitalize font-medium">{el.type}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 p-0.5">
                                            <button 
                                                onClick={() => handleElementAlign(i, 'left')} 
                                                className={cn("p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800", el.align === 'left' ? 'text-blue-500' : 'text-gray-400')}
                                                title="Align Left"
                                            >
                                                <AlignLeft size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleElementAlign(i, 'center')} 
                                                className={cn("p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800", el.align === 'center' ? 'text-blue-500' : 'text-gray-400')}
                                                title="Align Center"
                                            >
                                                <AlignCenter size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleElementAlign(i, 'right')} 
                                                className={cn("p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800", el.align === 'right' ? 'text-blue-500' : 'text-gray-400')}
                                                title="Align Right"
                                            >
                                                <AlignRight size={12} />
                                            </button>
                                            <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-0.5" />
                                            <button 
                                                onClick={() => handleRemoveElement(i)} 
                                                className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-gray-400 transition"
                                                title="Remove"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         )}
                    </div>

                    {/* Quick Palettes */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Quick Palettes</label>
                        <div className="grid grid-cols-3 gap-2">
                            {PALETTES.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => applyPalette(p.bg, p.text)}
                                    className="text-xs border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1.5 hover:border-blue-400 hover:scale-105 transition shadow-sm"
                                    style={{ backgroundColor: p.bg, color: p.text }}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />

                    {/* Gradient Toggle */}
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                            <Sparkles size={12} className="text-purple-500" /> Subtle Gradient
                        </label>
                        <input 
                            type="checkbox" 
                            checked={!!styles.gradient}
                            onChange={toggleGradient}
                            className="accent-blue-600 h-4 w-4 rounded"
                        />
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />

                    {/* Background Color */}
                    <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Background Color</label>
                    <div className="flex items-center gap-2">
                        <input
                        type="color"
                        value={styles.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5"
                        />
                        <input
                        type="text"
                        value={styles.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="flex-1 text-sm border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white rounded-full px-3 py-2 font-mono uppercase"
                        />
                    </div>
                    </div>

                    {/* Opacity */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">BG Opacity</label>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(styles.backgroundOpacity * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={styles.backgroundOpacity}
                            onChange={(e) => handleChange('backgroundOpacity', parseFloat(e.target.value))}
                            className="w-full accent-blue-600"
                        />
                    </div>

                    {/* Text Color */}
                    <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Text Color</label>
                    <div className="flex items-center gap-2">
                        <input
                        type="color"
                        value={styles.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5"
                        />
                        <input
                        type="text"
                        value={styles.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="flex-1 text-sm border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white rounded-full px-3 py-2 font-mono uppercase"
                        />
                    </div>
                    </div>

                    {/* Background Image */}
                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                        <ImageIcon size={12} /> Background Image
                    </label>
                    <input
                        type="text"
                        placeholder="https://..."
                        value={styles.backgroundImage || ''}
                        onChange={(e) => handleChange('backgroundImage', e.target.value)}
                        className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <select 
                            value={styles.backgroundSize} 
                            onChange={(e) => handleChange('backgroundSize', e.target.value)}
                            className="text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-2 py-1.5"
                        >
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                        </select>
                        <select 
                            value={styles.backgroundRepeat} 
                            onChange={(e) => handleChange('backgroundRepeat', e.target.value)}
                            className="text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-2 py-1.5"
                        >
                            <option value="no-repeat">No Repeat</option>
                            <option value="repeat">Repeat</option>
                        </select>
                    </div>
                    </div>
                </>
                )}

                {activeTab === 'layout' && (
                <>
                    <div className="space-y-4">
                    
                    {/* Padding Controls */}
                    <div className="space-y-2">
                         <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Padding (REM)</label>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                            <label className="text-xs text-gray-400">Top</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={getRemValue(styles.paddingTop)}
                                    onChange={(e) => handleChange('paddingTop', `${e.target.value}rem`)}
                                    className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 pr-8"
                                />
                                <span className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">rem</span>
                            </div>
                            </div>
                            <div className="space-y-1">
                            <label className="text-xs text-gray-400">Bottom</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={getRemValue(styles.paddingBottom)}
                                    onChange={(e) => handleChange('paddingBottom', `${e.target.value}rem`)}
                                    className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 pr-8"
                                />
                                <span className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">rem</span>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Margin Controls */}
                    <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                         <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Margin (REM)</label>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                            <label className="text-xs text-gray-400">Top</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={getRemValue(styles.marginTop)}
                                    onChange={(e) => handleChange('marginTop', `${e.target.value}rem`)}
                                    className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 pr-8"
                                />
                                <span className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">rem</span>
                            </div>
                            </div>
                            <div className="space-y-1">
                            <label className="text-xs text-gray-400">Bottom</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={getRemValue(styles.marginBottom)}
                                    onChange={(e) => handleChange('marginBottom', `${e.target.value}rem`)}
                                    className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 pr-8"
                                />
                                <span className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">rem</span>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Alignment Controls */}
                    {block.content.alignment && (
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2 block">Text Alignment</label>
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => handleContentChange('alignment', align)}
                                        className={`flex-1 text-xs py-1.5 rounded-md capitalize transition ${block.content.alignment === align ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                        
                        {/* Image Controls */}
                        {block.type === 'image-text' && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide block">Image Layout</label>
                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                    <button
                                        onClick={() => handleContentChange('imagePosition', 'left')}
                                        className={`flex-1 text-xs py-1.5 rounded-md ${block.content.imagePosition === 'left' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        Image Left
                                    </button>
                                    <button
                                        onClick={() => handleContentChange('imagePosition', 'right')}
                                        className={`flex-1 text-xs py-1.5 rounded-md ${block.content.imagePosition === 'right' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        Image Right
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Image Source URL</label>
                                    <input
                                        type="text"
                                        value={block.content.imageSrc}
                                        onChange={(e) => handleContentChange('imageSrc', e.target.value)}
                                        className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-2 py-1.5"
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Feature Icons Selection */}
                        {block.type === 'features' && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide block">Feature Icons</label>
                                {block.content.items.map((item: any, idx: number) => (
                                    <div key={idx} className="space-y-1">
                                        <label className="text-xs text-gray-500 dark:text-gray-400 block truncate">Item {idx + 1}: {item.title}</label>
                                        <select 
                                            value={item.icon || 'layout'}
                                            onChange={(e) => handleItemUpdate('items', idx, 'icon', e.target.value)}
                                            className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-2 py-1.5"
                                        >
                                            {Object.keys(ICON_MAP).map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
                )}

                {activeTab === 'html' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Block HTML</label>
                        <button 
                            onClick={handleCopyHtml}
                            className={cn("text-xs flex items-center gap-1 font-medium transition", copied ? "text-green-600" : "text-blue-600 hover:text-blue-700")}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="relative">
                        <pre className="w-full h-80 text-[10px] font-mono border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 overflow-auto whitespace-pre-wrap custom-scrollbar">
                            {`<section style="${generateBlockStyleString(block)}">\n${generateBlockHTML(block)}\n</section>`}
                        </pre>
                    </div>
                    <div className="text-xs text-gray-400 italic">
                        This HTML includes current content and inline styles.
                    </div>
                </div>
                )}

            </div>
          </>
      )}
    </div>
  );
};