import React from 'react';
import { Block, BlockContent } from '../types';
import { Editable } from './Editable';
import { cn } from '../utils';
import { 
  Layout, 
  Check, 
  ChevronDown, 
  Send, 
  Star, 
  Mail, 
  Zap, 
  Smartphone, 
  Shield, 
  Globe, 
  BarChart, 
  Smile, 
  Play, 
  PenTool, 
  Layers, 
  Cpu 
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ElementType> = {
  layout: Layout,
  zap: Zap,
  smartphone: Smartphone,
  shield: Shield,
  globe: Globe,
  barChart: BarChart,
  smile: Smile,
  star: Star,
  send: Send,
  mail: Mail,
  play: Play,
  check: Check,
  penTool: PenTool,
  layers: Layers,
  cpu: Cpu
};

interface BlockRendererProps {
  block: Block;
  updateContent: (id: string, content: Partial<BlockContent>) => void;
  isMobileView?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, updateContent, isMobileView }) => {
  const { content } = block;

  const handleUpdate = (key: string, value: any) => {
    updateContent(block.id, { [key]: value });
  };

  const handleItemUpdate = (arrayKey: string, index: number, itemKey: string, value: any) => {
    const newArray = [...content[arrayKey]];
    newArray[index] = { ...newArray[index], [itemKey]: value };
    updateContent(block.id, { [arrayKey]: newArray });
  };

  const handleExtraElementUpdate = (index: number, key: string, value: any) => {
      if (!content.elements) return;
      const newElements = [...content.elements];
      newElements[index] = { ...newElements[index], [key]: value };
      updateContent(block.id, { elements: newElements });
  };

  const renderExtraElements = () => {
      if (!content.elements || !content.elements.length) return null;
      return (
          <div className="w-full flex flex-col items-center mt-6 gap-4">
              {content.elements.map((el: any, idx: number) => {
                  const alignClass = el.align === 'center' ? 'text-center' : el.align === 'right' ? 'text-right' : 'text-left';
                  if (el.type === 'text') {
                      return (
                          <div key={idx} className={cn("w-full", alignClass)}>
                              <Editable
                                tagName="div"
                                text={el.content || 'New Text'}
                                className="text-lg inline-block"
                                onChange={(val) => handleExtraElementUpdate(idx, 'content', val)}
                              />
                          </div>
                      );
                  } else if (el.type === 'button') {
                      return (
                          <div key={idx} className={cn("w-full", alignClass)}>
                              <button className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                                  <Editable
                                    tagName="span"
                                    text={el.text || 'Button'}
                                    onChange={(val) => handleExtraElementUpdate(idx, 'text', val)}
                                  />
                              </button>
                          </div>
                      );
                  }
                  return null;
              })}
          </div>
      );
  };

  const wrapWithExtra = (jsx: React.ReactNode) => {
      return (
          <>
            {jsx}
            {renderExtraElements()}
          </>
      );
  };

  // Utility helpers for simulated responsiveness
  const responsiveGrid = isMobileView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3";
  const responsiveGrid2 = isMobileView ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4";
  const responsiveFlex = isMobileView ? "flex-col" : "flex-col md:flex-row";
  const responsiveFlexReverse = isMobileView ? "flex-col" : (content.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse');
  const responsiveNav = isMobileView ? "hidden" : "hidden md:flex";

  switch (block.type) {
    case 'header':
      return wrapWithExtra(
        <div className="container mx-auto px-6 flex items-center justify-between flex-wrap gap-4 md:gap-0">
          <Editable
            tagName="h2"
            text={content.logoText}
            className="text-2xl font-bold tracking-tight"
            onChange={(val) => handleUpdate('logoText', val)}
          />
          <nav className={cn("gap-8 items-center", responsiveNav)}>
            {content.navLinks.map((link: any, i: number) => (
              <Editable
                key={i}
                tagName="a"
                text={link.text}
                className="font-medium hover:text-blue-600 transition-colors cursor-pointer"
                onChange={(val) => handleItemUpdate('navLinks', i, 'text', val)}
              />
            ))}
            {content.showThemeToggle && (
                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                    <span className="w-4 h-4 rounded-full bg-gray-400"></span>
                 </div>
            )}
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
               <Editable
                 tagName="span"
                 text={content.buttonText}
                 onChange={(val) => handleUpdate('buttonText', val)}
               />
            </button>
          </nav>
          {/* Mobile Menu Icon */}
          <div className={cn("text-2xl cursor-pointer", !isMobileView && "md:hidden")}>☰</div>
        </div>
      );

    case 'hero':
      return wrapWithExtra(
        <div className={cn("container mx-auto px-6 flex flex-col gap-6 py-12 md:py-20", 
            content.alignment === 'center' ? 'text-center items-center' : 
            content.alignment === 'right' ? 'text-right items-end' : 'text-left items-start'
        )}>
          <Editable
            tagName="h1"
            text={content.heading}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
            onChange={(val) => handleUpdate('heading', val)}
            placeholder="Enter Heading"
          />
          <Editable
            tagName="p"
            text={content.subheading}
            className="text-xl md:text-2xl opacity-70 max-w-2xl leading-relaxed"
            onChange={(val) => handleUpdate('subheading', val)}
            placeholder="Enter Subheading"
          />
          {content.showButton && (
            <div className="mt-6 flex gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <Editable
                    tagName="span"
                    text={content.buttonText}
                    onChange={(val) => handleUpdate('buttonText', val)}
                />
                </button>
            </div>
          )}
        </div>
      );

    case 'features':
      return wrapWithExtra(
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Editable
              tagName="h2"
              text={content.heading}
              className="text-3xl md:text-4xl font-bold mb-4"
              onChange={(val) => handleUpdate('heading', val)}
            />
          </div>
          <div className={cn("grid gap-8", responsiveGrid)}>
            {content.items.map((item: any, idx: number) => {
              const IconComponent = ICON_MAP[item.icon] || Layout;
              return (
                <div key={idx} className="p-8 rounded-2xl border border-gray-100 bg-white/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent size={28} />
                  </div>
                  <Editable
                    tagName="h3"
                    text={item.title}
                    className="text-xl font-bold mb-3"
                    onChange={(val) => handleItemUpdate('items', idx, 'title', val)}
                  />
                  <Editable
                    tagName="p"
                    text={item.description}
                    className="text-gray-600 leading-relaxed"
                    onChange={(val) => handleItemUpdate('items', idx, 'description', val)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
      
    case 'testimonials':
      return wrapWithExtra(
        <div className="container mx-auto px-6">
             <div className="text-center mb-16">
                <Editable
                    tagName="h2"
                    text={content.heading}
                    className="text-3xl md:text-4xl font-bold"
                    onChange={(val) => handleUpdate('heading', val)}
                />
             </div>
             <div className={cn("grid gap-8", responsiveGrid)}>
                {content.items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-gray-50/80 p-8 rounded-2xl relative">
                        <div className="text-yellow-400 mb-4 flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                        </div>
                        <Editable
                            tagName="p"
                            text={item.quote}
                            className="text-lg italic text-gray-700 mb-6"
                            onChange={(val) => handleItemUpdate('items', idx, 'quote', val)}
                        />
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-300" />
                             <div>
                                <Editable
                                    tagName="p"
                                    text={item.author}
                                    className="font-bold text-sm"
                                    onChange={(val) => handleItemUpdate('items', idx, 'author', val)}
                                />
                                <Editable
                                    tagName="p"
                                    text={item.role}
                                    className="text-xs text-gray-500 uppercase tracking-wide"
                                    onChange={(val) => handleItemUpdate('items', idx, 'role', val)}
                                />
                             </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
      );

    case 'video':
        return wrapWithExtra(
            <div className="container mx-auto px-6 text-center">
                 <Editable
                    tagName="h2"
                    text={content.heading}
                    className="text-3xl md:text-4xl font-bold mb-8"
                    onChange={(val) => handleUpdate('heading', val)}
                />
                <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                     <iframe 
                        className="w-full h-full"
                        src={content.videoUrl} 
                        title="Video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                     ></iframe>
                </div>
                 <Editable
                    tagName="p"
                    text={content.description}
                    className="mt-8 text-xl opacity-70 max-w-2xl mx-auto"
                    onChange={(val) => handleUpdate('description', val)}
                />
            </div>
        );

    case 'pricing':
        return wrapWithExtra(
            <div className="container mx-auto px-6">
                 <div className="text-center mb-16">
                    <Editable
                        tagName="h2"
                        text={content.heading}
                        className="text-3xl md:text-4xl font-bold"
                        onChange={(val) => handleUpdate('heading', val)}
                    />
                 </div>
                 <div className={cn("grid gap-8 max-w-6xl mx-auto", responsiveGrid)}>
                    {content.plans.map((plan: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-3xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col bg-white">
                             <Editable
                                tagName="h3"
                                text={plan.name}
                                className="text-lg font-medium text-gray-500 mb-2"
                                onChange={(val) => handleItemUpdate('plans', idx, 'name', val)}
                            />
                             <Editable
                                tagName="div"
                                text={plan.price}
                                className="text-5xl font-bold mb-6"
                                onChange={(val) => handleItemUpdate('plans', idx, 'price', val)}
                            />
                            <div className="flex-1 space-y-3 mb-8">
                                {plan.features.map((feat: string, fIdx: number) => (
                                    <div key={fIdx} className="flex items-center gap-3 text-gray-600">
                                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition">
                                Choose {plan.name}
                            </button>
                        </div>
                    ))}
                 </div>
            </div>
        );

    case 'faq':
        return wrapWithExtra(
            <div className="container mx-auto px-6 max-w-3xl">
                 <div className="text-center mb-12">
                    <Editable
                        tagName="h2"
                        text={content.heading}
                        className="text-3xl font-bold"
                        onChange={(val) => handleUpdate('heading', val)}
                    />
                 </div>
                 <div className="space-y-4">
                    {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-xl p-6 bg-white/60">
                            <div className="flex justify-between items-center mb-2">
                                <Editable
                                    tagName="h3"
                                    text={item.question}
                                    className="text-lg font-semibold pr-4"
                                    onChange={(val) => handleItemUpdate('items', idx, 'question', val)}
                                />
                                <ChevronDown className="text-gray-400" />
                            </div>
                            <Editable
                                tagName="p"
                                text={item.answer}
                                className="text-gray-600"
                                onChange={(val) => handleItemUpdate('items', idx, 'answer', val)}
                            />
                        </div>
                    ))}
                 </div>
            </div>
        );

    case 'gallery':
        return wrapWithExtra(
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <Editable
                        tagName="h2"
                        text={content.heading}
                        className="text-3xl font-bold"
                        onChange={(val) => handleUpdate('heading', val)}
                    />
                </div>
                <div className={cn("grid gap-4", responsiveGrid2)}>
                    {content.images.map((src: string, idx: number) => (
                        <div key={idx} className="rounded-xl overflow-hidden aspect-square hover:opacity-90 transition cursor-pointer">
                            <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        );

    case 'team':
         return wrapWithExtra(
             <div className="container mx-auto px-6">
                 <div className="text-center mb-16">
                     <Editable
                         tagName="h2"
                         text={content.heading}
                         className="text-3xl font-bold"
                         onChange={(val) => handleUpdate('heading', val)}
                     />
                 </div>
                 <div className={cn("grid gap-8", responsiveGrid2)}>
                     {content.members.map((member: any, idx: number) => (
                         <div key={idx} className="text-center">
                             <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                                 <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                             </div>
                             <Editable
                                 tagName="h3"
                                 text={member.name}
                                 className="text-xl font-bold"
                                 onChange={(val) => handleItemUpdate('members', idx, 'name', val)}
                             />
                             <Editable
                                 tagName="p"
                                 text={member.role}
                                 className="text-blue-600 font-medium"
                                 onChange={(val) => handleItemUpdate('members', idx, 'role', val)}
                             />
                         </div>
                     ))}
                 </div>
             </div>
         );

    case 'blog':
        return wrapWithExtra(
             <div className="container mx-auto px-6">
                 <div className="text-center mb-16">
                     <Editable
                         tagName="h2"
                         text={content.heading}
                         className="text-3xl font-bold"
                         onChange={(val) => handleUpdate('heading', val)}
                     />
                 </div>
                 <div className={cn("grid gap-8", responsiveGrid)}>
                     {content.posts.map((post: any, idx: number) => (
                         <article key={idx} className="group cursor-pointer">
                             <div className="bg-gray-100 rounded-2xl aspect-video mb-6 overflow-hidden">
                                 <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition duration-500" />
                             </div>
                             <Editable
                                 tagName="h3"
                                 text={post.title}
                                 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition"
                                 onChange={(val) => handleItemUpdate('posts', idx, 'title', val)}
                             />
                             <Editable
                                 tagName="p"
                                 text={post.excerpt}
                                 className="text-gray-600 mb-4 line-clamp-2"
                                 onChange={(val) => handleItemUpdate('posts', idx, 'excerpt', val)}
                             />
                             <span className="text-sm font-bold underline decoration-2 decoration-blue-200 group-hover:decoration-blue-600 transition-all">Read Article</span>
                         </article>
                     ))}
                 </div>
             </div>
        );

    case 'newsletter':
        return wrapWithExtra(
            <div className="container mx-auto px-6">
                <div className="bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <Editable
                            tagName="h2"
                            text={content.heading}
                            className="text-3xl md:text-4xl font-bold mb-4"
                            onChange={(val) => handleUpdate('heading', val)}
                        />
                        <Editable
                            tagName="p"
                            text={content.subheading}
                            className="text-blue-100 text-lg mb-8"
                            onChange={(val) => handleUpdate('subheading', val)}
                        />
                        <div className={cn("flex gap-3 max-w-md mx-auto", responsiveFlex)}>
                            <input 
                                type="email" 
                                placeholder={content.placeholder} 
                                className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50" 
                            />
                            <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition">
                                <Editable
                                    tagName="span"
                                    text={content.buttonText}
                                    onChange={(val) => handleUpdate('buttonText', val)}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

    case 'contact':
        return wrapWithExtra(
            <div className="container mx-auto px-6">
                 <div className={cn("grid gap-12 items-center", isMobileView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
                    <div>
                        <Editable
                            tagName="h2"
                            text={content.heading}
                            className="text-4xl font-bold mb-6"
                            onChange={(val) => handleUpdate('heading', val)}
                        />
                        <Editable
                            tagName="p"
                            text={content.subheading}
                            className="text-xl text-gray-600 mb-8"
                            onChange={(val) => handleUpdate('subheading', val)}
                        />
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Mail size={18} />
                                </div>
                                <span>contact@example.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" placeholder={content.emailPlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows={4} placeholder={content.messagePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                            </div>
                            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                <Editable
                                    tagName="span"
                                    text={content.buttonText}
                                    onChange={(val) => handleUpdate('buttonText', val)}
                                />
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        );

    case 'image-text':
      return wrapWithExtra(
        <div className="container mx-auto px-6">
          <div className={cn("flex gap-12 items-center", responsiveFlexReverse)}>
            <div className="flex-1 space-y-8">
               <Editable
                  tagName="h2"
                  text={content.heading}
                  className="text-4xl md:text-5xl font-bold leading-tight"
                  onChange={(val) => handleUpdate('heading', val)}
                />
                <Editable
                  tagName="p"
                  text={content.text}
                  className="text-lg opacity-70 leading-relaxed"
                  onChange={(val) => handleUpdate('text', val)}
                />
                 <button className="text-blue-600 font-bold inline-flex items-center gap-2 hover:gap-3 transition-all text-lg">
                   <Editable
                      tagName="span"
                      text={content.buttonText}
                      onChange={(val) => handleUpdate('buttonText', val)}
                   />
                   <span>→</span>
                </button>
            </div>
            <div className="flex-1 w-full">
              <img 
                src={content.imageSrc} 
                alt="Feature" 
                className="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-video transform hover:scale-[1.02] transition duration-500"
              />
            </div>
          </div>
        </div>
      );

    case 'cta':
        return wrapWithExtra(
            <div className="container mx-auto px-6 text-center">
                 <Editable
                  tagName="h2"
                  text={content.heading}
                  className="text-3xl md:text-5xl font-bold mb-6"
                  onChange={(val) => handleUpdate('heading', val)}
                />
                 <Editable
                  tagName="p"
                  text={content.subheading}
                  className="text-xl opacity-80 mb-10 max-w-2xl mx-auto"
                  onChange={(val) => handleUpdate('subheading', val)}
                />
                 <button className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-200 text-lg">
                    <Editable
                        tagName="span"
                        text={content.buttonText}
                        onChange={(val) => handleUpdate('buttonText', val)}
                    />
                 </button>
            </div>
        );

    case 'footer':
      return wrapWithExtra(
        <div className="container mx-auto px-6">
            <div className={cn("flex justify-between items-center gap-8 border-t border-current/10 pt-12", responsiveFlex)}>
                <div className={cn("text-center", !isMobileView && "md:text-left")}>
                     <span className="font-bold text-xl block mb-2">Zenith</span>
                    <Editable
                        tagName="p"
                        text={content.copyright}
                        className="text-sm opacity-60"
                        onChange={(val) => handleUpdate('copyright', val)}
                    />
                </div>
                <div className="flex gap-8">
                    {content.links.map((link: any, i: number) => (
                        <Editable
                            key={i}
                            tagName="a"
                            text={link.text}
                            className="text-sm font-medium opacity-60 hover:opacity-100 transition cursor-pointer"
                            onChange={(val) => handleItemUpdate('links', i, 'text', val)}
                        />
                    ))}
                </div>
            </div>
        </div>
      );

    default:
      return <div>Unknown Block Type</div>;
  }
};