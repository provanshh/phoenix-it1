import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Block, BlockContent, BlockStyles, BlockType, DEFAULT_CONTENT, DEFAULT_STYLES } from './types';
import { generateId, hexToRgb, cn, generateBlockHTML, generateBlockStyleString } from './utils';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, Loader2, Send } from 'lucide-react';

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Undo/Redo History State
  const [history, setHistory] = useState<{ past: Block[][]; future: Block[][] }>({
    past: [],
    future: []
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Sync dark mode class to html element for Tailwind CDN support
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const saveToHistory = (currentBlocks: Block[]) => {
    setHistory(prev => ({
      past: [...prev.past, currentBlocks],
      future: []
    }));
  };

  const handleUndo = () => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    
    setHistory({
      past: newPast,
      future: [blocks, ...history.future]
    });
    setBlocks(previous);
  };

  const handleRedo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);

    setHistory(prev => ({
      past: [...prev.past, blocks],
      future: newFuture
    }));
    setBlocks(next);
  };

  const updateBlocksWithHistory = (newBlocks: Block[]) => {
    saveToHistory(blocks);
    setBlocks(newBlocks);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDropBlock = (e: React.DragEvent, index?: number) => {
    const type = e.dataTransfer.getData('blockType') as BlockType;
    if (!type) return;

    const newBlock: Block = {
      id: generateId(),
      type,
      styles: { ...DEFAULT_STYLES },
      content: JSON.parse(JSON.stringify(DEFAULT_CONTENT[type])), 
    };

    const newBlocks = [...blocks];
    if (typeof index === 'number') {
      newBlocks.splice(index, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    
    updateBlocksWithHistory(newBlocks);
    setSelectedId(newBlock.id);
  };

  const handleReorderBlock = (dragIndex: number, hoverIndex: number) => {
      const newBlocks = [...blocks];
      const [removed] = newBlocks.splice(dragIndex, 1);
      newBlocks.splice(hoverIndex, 0, removed);
      updateBlocksWithHistory(newBlocks);
  };

  const handleDeleteBlock = (id: string) => {
    const newBlocks = blocks.filter((b) => b.id !== id);
    updateBlocksWithHistory(newBlocks);
    if (selectedId === id) setSelectedId(null);
  };

  const updateBlockStyles = (id: string, styles: Partial<BlockStyles>) => {
    const newBlocks = blocks.map((b) => (b.id === id ? { ...b, styles: { ...b.styles, ...styles } } : b));
    updateBlocksWithHistory(newBlocks);
  };

  const updateBlockContent = (id: string, content: Partial<BlockContent>) => {
    const newBlocks = blocks.map((b) => {
        if (b.id !== id) return b;
        return {
            ...b,
            content: { ...b.content, ...content }
        };
    });
    updateBlocksWithHistory(newBlocks);
  };

  // AI Generation Logic
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const availableTypes = Object.keys(DEFAULT_CONTENT).join(', ');
      
      const systemInstruction = `You are an expert web designer assistant for a block-based website builder.
      The user will ask you to create a website section.
      
      You must select the most appropriate 'type' from this list: [${availableTypes}].
      
      You must return a JSON object with the following structure:
      {
        "type": "block_type_name",
        "content": { ...content_matching_default_structure_for_that_type ... },
        "styles": { ...optional_style_overrides_like_backgroundColor_textColor... }
      }

      Reference the following default content structures to ensure you use the correct keys for 'content':
      ${JSON.stringify(DEFAULT_CONTENT)}

      For 'styles', you can override 'backgroundColor', 'textColor', 'gradient', 'paddingTop', 'paddingBottom'.
      If the user asks for "dark mode" or specific colors, apply them in 'styles'.
      
      Do NOT wrap the response in markdown blocks (like \`\`\`json). Return raw JSON only.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: aiPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json"
        }
      });

      const responseText = response.text;
      if (responseText) {
          const generatedData = JSON.parse(responseText);
          
          if (generatedData.type && DEFAULT_CONTENT[generatedData.type as BlockType]) {
              const baseContent = DEFAULT_CONTENT[generatedData.type as BlockType];
              // Merge generated content with base defaults to ensure all keys exist
              const newContent = { ...baseContent, ...generatedData.content };
              
              const newBlock: Block = {
                  id: generateId(),
                  type: generatedData.type,
                  styles: { ...DEFAULT_STYLES, ...generatedData.styles },
                  content: newContent
              };

              const newBlocks = [...blocks, newBlock];
              updateBlocksWithHistory(newBlocks);
              setSelectedId(newBlock.id);
              setAiPrompt("");
              setIsAiModalOpen(false);
          } else {
              alert("AI response format was invalid. Please try again.");
          }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate content. Please verify API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const htmlContent = blocks.map(block => {
        const styleString = generateBlockStyleString(block);
        return `
  <!-- Block: ${block.type} -->
  <section id="${block.id}" style="${styleString}">
    ${generateBlockHTML(block)}
  </section>`;
    }).join('\n');

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      html { scroll-behavior: smooth; }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zenith-page.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  return (
    <div className={cn("flex h-screen w-full bg-white text-slate-900 font-sans transition-colors duration-300", isDarkMode ? "dark" : "")}>
      <Sidebar />
      <Canvas
        blocks={blocks}
        selectedId={selectedId}
        onSelect={handleSelect}
        onDropBlock={handleDropBlock}
        onReorderBlock={handleReorderBlock}
        onDeleteBlock={handleDeleteBlock}
        updateBlockContent={updateBlockContent}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onAiOpen={() => setIsAiModalOpen(true)}
      />
      <PropertiesPanel
        block={selectedBlock}
        updateBlockStyles={updateBlockStyles}
        updateBlockContent={updateBlockContent}
      />

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-scale-in">
              <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white relative">
                 <button 
                   onClick={() => setIsAiModalOpen(false)}
                   className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
                 >
                    <X size={18} />
                 </button>
                 <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <Sparkles size={24} /> Magic Build
                 </h2>
                 <p className="text-purple-100 text-sm">Describe the section you want to add, and AI will build it for you.</p>
              </div>
              <div className="p-6 space-y-4">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., A dark hero section with a bold headline about coffee..."
                    className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-base"
                    autoFocus
                  />
                  <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setIsAiModalOpen(false)}
                        className="px-5 py-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition font-medium"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating || !aiPrompt.trim()}
                        className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200 dark:shadow-none"
                      >
                          {isGenerating ? (
                              <>
                                <Loader2 size={18} className="animate-spin" /> Generating...
                              </>
                          ) : (
                              <>
                                <Send size={18} /> Generate
                              </>
                          )}
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;