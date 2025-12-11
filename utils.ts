import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Block } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
}

export function generateBlockStyleString(block: Block): string {
    const { styles } = block;
    const rgb = hexToRgb(styles.backgroundColor);
    const bgColor = rgb ? `rgba(${rgb}, ${styles.backgroundOpacity})` : styles.backgroundColor;
    
    const bgValue = styles.gradient ? styles.gradient : bgColor;
    const bgProperty = styles.gradient ? 'background' : 'background-color';

    return [
        `padding-top: ${styles.paddingTop}`,
        `padding-bottom: ${styles.paddingBottom}`,
        `margin-top: ${styles.marginTop}`,
        `margin-bottom: ${styles.marginBottom}`,
        `${bgProperty}: ${bgValue}`,
        `color: ${styles.textColor}`,
        styles.backgroundImage ? `background-image: url(${styles.backgroundImage})` : '',
        styles.backgroundSize ? `background-size: ${styles.backgroundSize}` : '',
        styles.backgroundRepeat ? `background-repeat: ${styles.backgroundRepeat}` : '',
        styles.backgroundPosition ? `background-position: ${styles.backgroundPosition}` : '',
    ].filter(Boolean).join('; ');
}

export function generateBlockHTML(block: Block): string {
    const { content } = block;
    const safe = (str: string) => str || '';

    // Helper to generate extra elements HTML
    const generateExtraElementsHTML = () => {
        if (!content.elements || !content.elements.length) return '';
        return content.elements.map((el: any) => {
            const alignClass = el.align === 'center' ? 'text-center' : el.align === 'right' ? 'text-right' : 'text-left';
            if (el.type === 'text') {
                return `<div class="w-full mt-4 ${alignClass}"><div class="text-lg inline-block">${safe(el.content)}</div></div>`;
            } else if (el.type === 'button') {
                return `<div class="w-full mt-4 ${alignClass}"><a href="${el.url || '#'}" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">${safe(el.text)}</a></div>`;
            }
            return '';
        }).join('');
    };

    let innerHTML = '';

    switch (block.type) {
      case 'header':
        innerHTML = `
    <div class="container mx-auto px-6 flex items-center justify-between flex-wrap gap-4 md:gap-0">
      <h2 class="text-2xl font-bold tracking-tight">${safe(content.logoText)}</h2>
      <nav class="hidden md:flex gap-8 items-center">
        ${content.navLinks.map((link: any) => `<a href="${link.url}" class="font-medium hover:text-blue-600 transition-colors">${safe(link.text)}</a>`).join('')}
        <a href="${content.buttonUrl}" class="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-md">${safe(content.buttonText)}</a>
      </nav>
      <!-- Mobile Menu Placeholder -->
      <div class="md:hidden text-2xl cursor-pointer">☰</div>
    </div>`;
        break;

      case 'hero':
        const alignClass = content.alignment === 'center' ? 'text-center items-center' : content.alignment === 'right' ? 'text-right items-end' : 'text-left items-start';
        innerHTML = `
    <div class="container mx-auto px-6 flex flex-col gap-6 py-12 md:py-20 ${alignClass}">
      <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">${safe(content.heading)}</h1>
      <p class="text-xl md:text-2xl opacity-70 max-w-2xl leading-relaxed">${safe(content.subheading)}</p>
      ${content.showButton ? `<div class="mt-6"><a href="${content.buttonUrl}" class="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition shadow-xl hover:-translate-y-1 inline-block">${safe(content.buttonText)}</a></div>` : ''}
    </div>`;
        break;

      case 'features':
        innerHTML = `
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">${safe(content.heading)}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${content.items.map((item: any) => `
        <div class="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-bold">i</div>
          <h3 class="text-xl font-bold mb-3">${safe(item.title)}</h3>
          <p class="text-gray-600 leading-relaxed">${safe(item.description)}</p>
        </div>`).join('')}
      </div>
    </div>`;
        break;

      case 'testimonials':
        innerHTML = `
        <div class="container mx-auto px-6">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">${safe(content.heading)}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${content.items.map((item: any) => `
                <div class="bg-gray-50 p-8 rounded-2xl relative">
                    <p class="text-lg italic text-gray-700 mb-6">"${safe(item.quote)}"</p>
                    <div class="flex items-center gap-3">
                         <div class="w-10 h-10 rounded-full bg-gray-300"></div>
                         <div>
                            <p class="font-bold text-sm">${safe(item.author)}</p>
                            <p class="text-xs text-gray-500 uppercase tracking-wide">${safe(item.role)}</p>
                         </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
        break;

      case 'pricing':
        innerHTML = `
        <div class="container mx-auto px-6">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">${safe(content.heading)}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                ${content.plans.map((plan: any) => `
                <div class="border border-gray-200 rounded-3xl p-8 hover:border-blue-500 hover:shadow-xl transition-all bg-white flex flex-col">
                    <h3 class="text-lg font-medium text-gray-500 mb-2">${safe(plan.name)}</h3>
                    <div class="text-5xl font-bold mb-6">${safe(plan.price)}</div>
                    <div class="space-y-3 mb-8 flex-1">
                        ${plan.features.map((f: string) => `<div class="flex items-center gap-3 text-gray-600"><span>✓</span><span>${f}</span></div>`).join('')}
                    </div>
                    <button class="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition">Choose ${safe(plan.name)}</button>
                </div>`).join('')}
            </div>
        </div>`;
        break;

      case 'video':
        innerHTML = `
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-8">${safe(content.heading)}</h2>
            <div class="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                <iframe class="w-full h-full" src="${content.videoUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
            <p class="mt-8 text-xl opacity-70 max-w-2xl mx-auto">${safe(content.description)}</p>
        </div>`;
        break;

      case 'contact':
        innerHTML = `
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-4xl font-bold mb-6">${safe(content.heading)}</h2>
                    <p class="text-xl text-gray-600 mb-8">${safe(content.subheading)}</p>
                </div>
                <form class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-4">
                    <input type="email" placeholder="Email Address" class="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    <textarea rows="4" placeholder="Message" class="w-full px-4 py-3 rounded-xl border border-gray-200"></textarea>
                    <button class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">${safe(content.buttonText)}</button>
                </form>
            </div>
        </div>`;
        break;

      case 'footer':
        innerHTML = `
        <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-current/10 pt-12">
                <p class="text-sm opacity-60">${safe(content.copyright)}</p>
                <div class="flex gap-8 flex-wrap justify-center">
                    ${content.links.map((link: any) => `<a href="${link.url}" class="text-sm font-medium opacity-60 hover:opacity-100 transition">${safe(link.text)}</a>`).join('')}
                </div>
            </div>
        </div>`;
        break;

      case 'cta':
         innerHTML = `
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl md:text-5xl font-bold mb-6">${safe(content.heading)}</h2>
          <p class="text-xl opacity-80 mb-10 max-w-2xl mx-auto">${safe(content.subheading)}</p>
          <button class="bg-white text-blue-900 px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-200 text-lg">${safe(content.buttonText)}</button>
        </div>`;
        break;
      
      case 'image-text':
        innerHTML = `
        <div class="container mx-auto px-6">
            <div class="flex flex-col gap-12 items-center ${content.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'}">
                <div class="flex-1 space-y-8">
                    <h2 class="text-4xl md:text-5xl font-bold leading-tight">${safe(content.heading)}</h2>
                    <p class="text-lg opacity-70 leading-relaxed">${safe(content.text)}</p>
                    <button class="text-blue-600 font-bold inline-flex items-center gap-2 text-lg">${safe(content.buttonText)} &rarr;</button>
                </div>
                <div class="flex-1 w-full">
                    <img src="${content.imageSrc}" class="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-video" />
                </div>
            </div>
        </div>`;
        break;

      case 'gallery':
        innerHTML = `
            <div class="container mx-auto px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold">${safe(content.heading)}</h2>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${content.images.map((src: string, idx: number) => `
                        <div class="rounded-xl overflow-hidden aspect-square hover:opacity-90 transition cursor-pointer">
                            <img src="${src}" alt="Gallery ${idx}" class="w-full h-full object-cover" />
                        </div>
                    `).join('')}
                </div>
            </div>`;
        break;

      case 'team':
         innerHTML = `
             <div class="container mx-auto px-6">
                 <div class="text-center mb-16">
                     <h2 class="text-3xl font-bold">${safe(content.heading)}</h2>
                 </div>
                 <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                     ${content.members.map((member: any) => `
                         <div class="text-center">
                             <div class="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                                 <img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover" />
                             </div>
                             <h3 class="text-xl font-bold">${safe(member.name)}</h3>
                             <p class="text-blue-600 font-medium">${safe(member.role)}</p>
                         </div>
                     `).join('')}
                 </div>
             </div>`;
        break;

      case 'blog':
        innerHTML = `
             <div class="container mx-auto px-6">
                 <div class="text-center mb-16">
                     <h2 class="text-3xl font-bold">${safe(content.heading)}</h2>
                 </div>
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                     ${content.posts.map((post: any) => `
                         <article class="group cursor-pointer">
                             <div class="bg-gray-100 rounded-2xl aspect-video mb-6 overflow-hidden">
                                 <div class="w-full h-full bg-gray-200 group-hover:scale-105 transition duration-500"></div>
                             </div>
                             <h3 class="text-xl font-bold mb-2 group-hover:text-blue-600 transition">${safe(post.title)}</h3>
                             <p class="text-gray-600 mb-4 line-clamp-2">${safe(post.excerpt)}</p>
                             <span class="text-sm font-bold underline decoration-2 decoration-blue-200 group-hover:decoration-blue-600 transition-all">Read Article</span>
                         </article>
                     `).join('')}
                 </div>
             </div>`;
        break;

      case 'newsletter':
        innerHTML = `
            <div class="container mx-auto px-6">
                <div class="bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div class="relative z-10 max-w-2xl mx-auto">
                        <h2 class="text-3xl md:text-4xl font-bold mb-4">${safe(content.heading)}</h2>
                        <p class="text-blue-100 text-lg mb-8">${safe(content.subheading)}</p>
                        <div class="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                            <input type="email" placeholder="${content.placeholder}" class="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50" />
                            <button class="px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition">${safe(content.buttonText)}</button>
                        </div>
                    </div>
                </div>
            </div>`;
        break;

      case 'faq':
        innerHTML = `
            <div class="container mx-auto px-6 max-w-3xl">
                 <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold">${safe(content.heading)}</h2>
                 </div>
                 <div class="space-y-4">
                    ${content.items.map((item: any) => `
                        <div class="border border-gray-200 rounded-xl p-6 bg-white/60">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-lg font-semibold pr-4">${safe(item.question)}</h3>
                                <span>▼</span>
                            </div>
                            <p class="text-gray-600">${safe(item.answer)}</p>
                        </div>
                    `).join('')}
                 </div>
            </div>`;
        break;

      default:
        innerHTML = '';
    }

    // Append extra elements if any, wrapping inner content
    // We inject extra elements at the end of the container, so we need to find the closing div of the container
    // This is a naive regex replacement but works for the predictable structure of the templates above.
    const extraHTML = generateExtraElementsHTML();
    if (extraHTML) {
        // Find the last closing div that closes the container
        const lastDivIndex = innerHTML.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
            innerHTML = innerHTML.slice(0, lastDivIndex) + extraHTML + innerHTML.slice(lastDivIndex);
        } else {
            innerHTML += extraHTML;
        }
    }
    
    return innerHTML;
}