export type BlockType = 
  | 'header' 
  | 'hero' 
  | 'features' 
  | 'testimonials' 
  | 'video' 
  | 'cta' 
  | 'contact' 
  | 'pricing' 
  | 'faq' 
  | 'footer' 
  | 'gallery' 
  | 'team' 
  | 'blog' 
  | 'newsletter'
  | 'image-text';

export interface BlockStyles {
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backgroundOpacity: number; // 0 to 1
  textColor: string;
  gradient?: string; // CSS gradient string
}

export interface BlockContent {
  [key: string]: any;
  elements?: Array<{ 
    type: 'text' | 'button'; 
    content?: string; 
    text?: string; 
    url?: string; 
    style?: any;
    align?: 'left' | 'center' | 'right';
  }>;
}

export interface Block {
  id: string;
  type: BlockType;
  styles: BlockStyles;
  content: BlockContent;
}

export const DEFAULT_STYLES: BlockStyles = {
  paddingTop: '0rem',
  paddingBottom: '0rem',
  marginTop: '0rem',
  marginBottom: '0rem',
  backgroundColor: '#ffffff',
  backgroundOpacity: 1,
  textColor: '#1a202c',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

// Default content for new blocks
export const DEFAULT_CONTENT: Record<BlockType, BlockContent> = {
  header: {
    logoText: 'Zenith',
    navLinks: [
      { text: 'Features', url: '#' },
      { text: 'Pricing', url: '#' },
      { text: 'About', url: '#' }
    ],
    buttonText: 'Sign Up',
    buttonUrl: '#',
    showThemeToggle: true
  },
  hero: {
    heading: 'Create with confidence.',
    subheading: 'A powerful builder for modern websites. Drag, drop, and deploy in minutes.',
    buttonText: 'Get Started',
    buttonUrl: '#',
    showButton: true,
    alignment: 'center'
  },
  features: {
    heading: 'Why choose us',
    items: [
      { title: 'Fast Performance', description: 'Optimized for speed and efficiency.', icon: 'zap' },
      { title: 'Responsive Design', description: 'Looks great on every device automatically.', icon: 'smartphone' },
      { title: 'Secure & Reliable', description: 'Built with security best practices in mind.', icon: 'shield' }
    ]
  },
  testimonials: {
    heading: 'Loved by thousands',
    items: [
      { quote: "This builder changed how I work. Simply amazing!", author: "Sarah J.", role: "Designer" },
      { quote: "The flexibility is unmatched. Highly recommended.", author: "Mike T.", role: "Developer" },
      { quote: "A game changer for our marketing team.", author: "Emily R.", role: "CMO" }
    ]
  },
  video: {
    heading: 'Watch it in action',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default placeholder
    description: 'See how our platform can transform your workflow.'
  },
  cta: {
    heading: 'Ready to dive in?',
    subheading: 'Join the community and start building today.',
    buttonText: 'Start Free Trial'
  },
  contact: {
    heading: 'Get in touch',
    subheading: 'We’d love to hear from you. Fill out the form below.',
    buttonText: 'Send Message',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: 'Your message...'
  },
  pricing: {
    heading: 'Simple Pricing',
    plans: [
      { name: 'Starter', price: '$0', features: ['1 Project', 'Basic Analytics', 'Community Support'] },
      { name: 'Pro', price: '$29', features: ['Unlimited Projects', 'Pro Analytics', 'Priority Support'] },
      { name: 'Enterprise', price: '$99', features: ['Custom Solutions', 'Dedicated Manager', '24/7 Support'] }
    ]
  },
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial on all plans.' },
      { question: 'Can I cancel anytime?', answer: 'Absolutely. There are no lock-in contracts.' },
      { question: 'Do you offer support?', answer: 'Yes, our team is available 24/7 to help you.' }
    ]
  },
  footer: {
    copyright: '© 2024 Zenith Builder.',
    links: [
      { text: 'Privacy Policy', url: '#' },
      { text: 'Terms of Service', url: '#' },
      { text: 'Contact', url: '#' }
    ]
  },
  gallery: {
    heading: 'Our Work',
    images: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
      'https://picsum.photos/400/300?random=4'
    ]
  },
  team: {
    heading: 'Meet the Team',
    members: [
      { name: 'Alex Doe', role: 'CEO', image: 'https://i.pravatar.cc/150?u=a' },
      { name: 'Sam Smith', role: 'CTO', image: 'https://i.pravatar.cc/150?u=b' },
      { name: 'Jordan Lee', role: 'Designer', image: 'https://i.pravatar.cc/150?u=c' },
      { name: 'Casey West', role: 'Developer', image: 'https://i.pravatar.cc/150?u=d' }
    ]
  },
  blog: {
    heading: 'Latest News',
    posts: [
      { title: 'The Future of Web Design', excerpt: 'Exploring the trends that will shape 2025.' },
      { title: 'Optimizing for Performance', excerpt: 'Tips and tricks to make your site fly.' },
      { title: 'Design Systems 101', excerpt: 'How to maintain consistency at scale.' }
    ]
  },
  newsletter: {
    heading: 'Stay Updated',
    subheading: 'Subscribe to our newsletter for the latest tips and news.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe'
  },
  'image-text': {
    heading: 'Visual Impact',
    text: 'Combine powerful imagery with compelling copy to engage your audience effectively.',
    imageSrc: 'https://picsum.photos/800/600',
    imagePosition: 'right', // 'left' | 'right'
    buttonText: 'Learn More'
  }
};