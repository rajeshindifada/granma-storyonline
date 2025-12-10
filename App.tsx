import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, X, Search, User, Globe, Heart, Share2, 
  MessageSquare, Lock, PenTool, LayoutDashboard, 
  LogOut, Plus, Image as ImageIcon, Sparkles,
  ChevronRight, Twitter, Linkedin, Facebook
} from 'lucide-react';
import { CATEGORIES, INITIAL_ARTICLES, MOCK_AUTHOR } from './constants';
import { Article, ContentBlock, PageState } from './types';
import { generateSummary, suggestTags } from './services/geminiService';

// --- Sub-Components ---

// 1. Navigation Header
const Header = ({ 
  onNavigate, 
  toggleMenu, 
  isMenuOpen, 
  setLanguage, 
  lang 
}: { 
  onNavigate: (p: PageState) => void; 
  toggleMenu: () => void; 
  isMenuOpen: boolean;
  setLanguage: (l: 'en' | 'es') => void;
  lang: string;
}) => (
  <header className="fixed top-0 w-full z-50 bg-granma-black/95 border-b border-zinc-800 backdrop-blur-sm">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMenu}
          className="p-2 text-granma-green hover:bg-zinc-900 rounded-full transition-colors"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 
          onClick={() => onNavigate(PageState.HOME)} 
          className="text-2xl font-bold font-sans tracking-tighter text-white lowercase cursor-pointer select-none"
        >
          granma<span className="text-granma-green">story</span><span className="text-granma-yellow">online</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
           <button onClick={() => setLanguage('en')} className={lang === 'en' ? 'text-granma-green' : 'hover:text-white'}>EN</button>
           <span>/</span>
           <button onClick={() => setLanguage('es')} className={lang === 'es' ? 'text-granma-green' : 'hover:text-white'}>ES</button>
        </div>
        <button aria-label="Search" className="text-zinc-400 hover:text-granma-yellow transition-colors"><Search size={20} /></button>
        <button 
          aria-label="Login" 
          onClick={() => onNavigate(PageState.LOGIN)} 
          className="flex items-center gap-2 bg-granma-green text-black px-4 py-1.5 rounded-full text-sm font-bold lowercase hover:bg-green-400 transition-colors"
        >
          <User size={16} /> <span className="hidden sm:inline">Join</span>
        </button>
      </div>
    </div>
  </header>
);

// 2. Navigation Drawer (Mobile & Desktop)
const Drawer = ({ 
  isOpen, 
  onClose, 
  onNavigate,
  onCategorySelect 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onNavigate: (p: PageState) => void;
  onCategorySelect: (c: string) => void;
}) => (
  <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-granma-black`}>
    <div className="pt-24 px-6 pb-10 h-full overflow-y-auto">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-granma-yellow font-mono text-sm mb-6 uppercase tracking-widest">Sections</h3>
          <ul className="space-y-3">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button 
                  onClick={() => { onCategorySelect(cat); onClose(); }}
                  className="text-2xl md:text-3xl font-sans font-light lowercase text-zinc-300 hover:text-granma-green hover:pl-4 transition-all duration-200 block w-full text-left"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
           <h3 className="text-granma-yellow font-mono text-sm mb-6 uppercase tracking-widest">More</h3>
           <ul className="space-y-4 font-mono text-sm text-zinc-400">
             <li><button onClick={() => { onNavigate(PageState.ABOUT); onClose(); }} className="hover:text-white">About Us</button></li>
             <li><button onClick={() => { onNavigate(PageState.DONATE); onClose(); }} className="hover:text-white">Donate / Support</button></li>
             <li><button className="hover:text-white">Submit a Story</button></li>
             <li><button className="hover:text-white">Newsletter</button></li>
             <li><button className="hover:text-white">Terms & Privacy</button></li>
           </ul>
           
           <div className="mt-12">
             <h3 className="text-granma-yellow font-mono text-sm mb-4 uppercase tracking-widest">Follow Us</h3>
             <div className="flex gap-4 text-zinc-400">
               <Twitter size={20} className="hover:text-white cursor-pointer" />
               <Linkedin size={20} className="hover:text-white cursor-pointer" />
               <Facebook size={20} className="hover:text-white cursor-pointer" />
             </div>
           </div>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 self-start">
          <h3 className="text-white font-bold mb-2">Subscribe to Granma Story</h3>
          <p className="text-zinc-400 text-sm mb-4">Independent, radical journalism needs your support. Join our community today.</p>
          <button onClick={() => {onNavigate(PageState.DONATE); onClose();}} className="w-full bg-granma-yellow text-black font-bold py-3 px-4 rounded hover:bg-yellow-300 transition-colors lowercase">
            Become a Member
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 3. Article Card
const ArticleCard: React.FC<{ article: Article; onClick: () => void }> = ({ article, onClick }) => (
  <article 
    className="group cursor-pointer border-b border-zinc-800 pb-8 mb-8"
    onClick={onClick}
  >
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 overflow-hidden rounded-sm relative aspect-video md:aspect-[4/3]">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-granma-black/80 text-granma-green text-xs font-mono px-2 py-1 uppercase tracking-wide backdrop-blur-sm border border-granma-green/30">
          {article.category}
        </div>
      </div>
      <div className="w-full md:w-2/3 flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-sans font-bold leading-tight text-zinc-100 group-hover:text-granma-yellow transition-colors mb-3 lowercase">
          {article.title}
        </h2>
        <p className="font-serif text-zinc-400 text-lg leading-relaxed mb-4 line-clamp-2">
          {article.subtitle}
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          <span className="text-granma-green">{article.author.name}</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
          <span>•</span>
          <span>{article.publishDate}</span>
        </div>
      </div>
    </div>
  </article>
);

// 4. Featured Hero Article
const HeroArticle = ({ article, onClick }: { article: Article; onClick: () => void }) => (
  <div className="relative w-full h-[80vh] mb-16 group cursor-pointer overflow-hidden" onClick={onClick}>
    <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60" />
    <div className="absolute inset-0 bg-gradient-to-t from-granma-black via-granma-black/50 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20">
      <span className="inline-block bg-granma-yellow text-black text-xs font-bold px-3 py-1 mb-4 uppercase tracking-widest">
        Featured Story
      </span>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-white mb-6 leading-none lowercase max-w-5xl">
        {article.title}
      </h1>
      <p className="text-xl md:text-2xl text-zinc-300 font-serif max-w-2xl leading-relaxed">
        {article.subtitle}
      </p>
    </div>
  </div>
);

// 5. Article Reader
const ArticleReader = ({ article, onBack }: { article: Article; onBack: () => void }) => {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-granma-green font-mono text-sm mb-8 hover:underline">
        <ChevronRight className="rotate-180" size={16} /> Back to issues
      </button>

      <header className="mb-12 text-center">
        <span className="text-granma-yellow font-mono text-xs uppercase tracking-[0.2em] mb-4 block">
          {article.category}
        </span>
        <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-6 lowercase leading-tight">
          {article.title}
        </h1>
        <p className="text-xl md:text-2xl font-serif text-zinc-400 leading-relaxed mb-8">
          {article.subtitle}
        </p>

        <div className="flex items-center justify-center gap-4 py-6 border-y border-zinc-800">
           <img src={article.author.avatar} alt={article.author.name} className="w-12 h-12 rounded-full border border-zinc-700" />
           <div className="text-left">
             <div className="text-white font-bold font-sans">{article.author.name}</div>
             <div className="text-zinc-500 text-xs font-mono">{article.publishDate} • {article.readTime} min read</div>
           </div>
           <div className="ml-auto flex gap-2">
             <button className="p-2 text-zinc-400 hover:text-white"><Share2 size={20}/></button>
             <button className="p-2 text-zinc-400 hover:text-white"><Heart size={20}/></button>
           </div>
        </div>
      </header>

      <div className="font-serif text-lg md:text-xl text-zinc-300 leading-loose space-y-8">
        {article.content.map((block, idx) => {
          switch(block.type) {
            case 'paragraph': 
              return <p key={idx}>{block.content}</p>;
            case 'heading':
              return <h3 key={idx} className="text-2xl md:text-3xl font-sans font-bold text-white mt-8 lowercase">{block.content}</h3>;
            case 'quote':
              return (
                <blockquote key={idx} className="border-l-4 border-granma-yellow pl-6 py-2 my-8 italic text-xl md:text-2xl text-white">
                  "{block.content}"
                  {block.source && <footer className="text-sm font-mono text-granma-green mt-2 not-italic">— {block.source}</footer>}
                </blockquote>
              );
            case 'stats':
              return (
                 <div key={idx} className="my-10 bg-zinc-900 border border-zinc-800 p-6 rounded text-center">
                   <div className="text-4xl font-bold text-granma-green font-sans mb-2">{block.value}</div>
                   <div className="text-white font-bold uppercase tracking-wider text-sm mb-2">{block.title}</div>
                   <p className="text-zinc-500 text-sm">{block.desc}</p>
                 </div>
              );
            case 'image':
              return (
                <figure key={idx} className="my-8">
                  <img src={block.url} alt={block.alt} className="w-full rounded" />
                  {block.caption && <figcaption className="text-center text-xs text-zinc-500 mt-2 font-mono">{block.caption}</figcaption>}
                </figure>
              );
            default: return null;
          }
        })}
      </div>

      <div className="mt-16 pt-10 border-t border-zinc-800">
        <h3 className="text-white font-sans font-bold mb-6">Comments</h3>
        <div className="bg-zinc-900/50 p-6 rounded text-center text-zinc-400 border border-zinc-800 border-dashed">
          <MessageSquare className="mx-auto mb-2 opacity-50" />
          <p>Join the discussion. <span className="text-granma-green cursor-pointer hover:underline">Log in</span> to post a comment.</p>
        </div>
      </div>
    </div>
  );
};

// 6. Admin Dashboard (Simplified)
const AdminDashboard = ({ articles, setArticles, onExit }: { articles: Article[], setArticles: any, onExit: () => void }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setAiLoading(true);
    const summary = await generateSummary(newContent);
    // In a real app, we'd put this in a subtitle field
    alert(`AI Generated Summary:\n\n${summary}`);
    setAiLoading(false);
  };

  const handleSuggestTags = async () => {
     setAiLoading(true);
     const tags = await suggestTags(newTitle, 'Politics');
     alert(`AI Suggested Tags:\n\n${tags.join(', ')}`);
     setAiLoading(false);
  };

  const handlePublish = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/ /g, '-'),
      subtitle: 'Draft article generated from admin panel.',
      author: MOCK_AUTHOR,
      category: 'Politics',
      tags: ['new'],
      publishDate: new Date().toISOString().split('T')[0],
      readTime: 5,
      imageUrl: 'https://picsum.photos/800/400?random=10',
      isPremium: false,
      views: 0,
      content: [{ type: 'paragraph', content: newContent }]
    };
    setArticles([newArticle, ...articles]);
    setActiveTab('list');
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
          <div className="text-2xl font-bold text-white mb-10 lowercase">granma<span className="text-granma-yellow">admin</span></div>
          <nav className="space-y-2 flex-1">
            <button onClick={() => setActiveTab('list')} className={`w-full text-left p-3 rounded flex items-center gap-3 ${activeTab === 'list' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('create')} className={`w-full text-left p-3 rounded flex items-center gap-3 ${activeTab === 'create' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50'}`}>
              <PenTool size={18} /> Write Story
            </button>
            <button className="w-full text-left p-3 rounded flex items-center gap-3 hover:bg-zinc-800/50">
               <ImageIcon size={18} /> Media Library
            </button>
          </nav>
          <button onClick={onExit} className="mt-auto flex items-center gap-2 text-red-400 hover:text-red-300 p-2">
            <LogOut size={18} /> Exit Admin
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {activeTab === 'list' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Published Articles</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-950 text-xs uppercase text-zinc-500 font-mono">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Views</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(art => (
                      <tr key={art.id} className="border-t border-zinc-800 hover:bg-zinc-800/30">
                        <td className="p-4 font-bold text-white truncate max-w-xs">{art.title}</td>
                        <td className="p-4 text-sm">{art.author.name}</td>
                        <td className="p-4 font-mono text-granma-green">{art.views}</td>
                        <td className="p-4 text-zinc-500 text-sm">{art.publishDate}</td>
                        <td className="p-4"><button className="text-blue-400 hover:underline text-xs">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">New Story</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2 font-mono">Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 p-4 text-xl text-white focus:border-granma-green outline-none rounded"
                    placeholder="Enter article title..."
                  />
                  <button onClick={handleSuggestTags} disabled={aiLoading || !newTitle} className="mt-2 text-xs text-granma-yellow flex items-center gap-1 hover:underline">
                    <Sparkles size={12}/> {aiLoading ? 'Thinking...' : 'Ask AI for tags'}
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2 font-mono">Content Body</label>
                  <textarea 
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 p-4 h-64 text-zinc-300 font-serif focus:border-granma-green outline-none rounded resize-none"
                    placeholder="Start writing..."
                  />
                   <button onClick={handleGenerateSummary} disabled={aiLoading || !newContent} className="mt-2 text-xs text-granma-yellow flex items-center gap-1 hover:underline">
                    <Sparkles size={12}/> {aiLoading ? 'Thinking...' : 'Generate AI Summary'}
                  </button>
                </div>

                <div className="flex justify-end gap-4">
                  <button className="px-6 py-2 rounded border border-zinc-700 hover:bg-zinc-800">Save Draft</button>
                  <button onClick={handlePublish} className="px-6 py-2 rounded bg-granma-green text-black font-bold hover:bg-green-400">Publish Story</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [pageState, setPageState] = useState<PageState>(PageState.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  // Filter articles based on view
  const displayArticles = selectedCategory 
    ? articles.filter(a => a.category === selectedCategory || a.category.includes(selectedCategory)) 
    : articles;

  const featuredArticle = articles[0]; // Simplification for demo

  const handleNavigate = (state: PageState) => {
    setPageState(state);
    setIsMenuOpen(false);
    setSelectedCategory(null);
    setSelectedArticle(null);
    window.scrollTo(0, 0);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setPageState(PageState.ARTICLE);
    window.scrollTo(0, 0);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPageState(PageState.CATEGORY);
    window.scrollTo(0, 0);
  };

  // Login simulation (Admin)
  if (pageState === PageState.LOGIN) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-granma-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="z-10 bg-zinc-900/80 p-10 rounded border border-zinc-800 w-full max-w-md backdrop-blur-md">
          <h2 className="text-3xl font-bold text-white mb-8 text-center lowercase">granma<span className="text-granma-green">login</span></h2>
          <input type="email" placeholder="Email" className="w-full bg-black border border-zinc-700 p-3 mb-4 text-white outline-none focus:border-granma-green" />
          <input type="password" placeholder="Password" className="w-full bg-black border border-zinc-700 p-3 mb-6 text-white outline-none focus:border-granma-green" />
          <button onClick={() => setPageState(PageState.ADMIN)} className="w-full bg-granma-green text-black font-bold py-3 lowercase hover:bg-green-400 transition-colors">
            Access Dashboard
          </button>
          <button onClick={() => setPageState(PageState.HOME)} className="w-full mt-4 text-zinc-500 text-sm hover:text-white">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (pageState === PageState.ADMIN) {
    return <AdminDashboard articles={articles} setArticles={setArticles} onExit={() => setPageState(PageState.HOME)} />;
  }

  return (
    <div className="min-h-screen bg-granma-black text-granma-text font-sans selection:bg-granma-green selection:text-black">
      <Header 
        onNavigate={handleNavigate} 
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)} 
        isMenuOpen={isMenuOpen} 
        setLanguage={setLanguage}
        lang={language}
      />
      
      <Drawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={handleNavigate}
        onCategorySelect={handleCategorySelect}
      />

      <main className="min-h-screen">
        {pageState === PageState.ARTICLE && selectedArticle && (
          <ArticleReader article={selectedArticle} onBack={() => handleNavigate(PageState.HOME)} />
        )}

        {(pageState === PageState.HOME || pageState === PageState.CATEGORY) && (
          <>
            {/* Show Hero only on Home and if no category selected */}
            {!selectedCategory && <HeroArticle article={featuredArticle} onClick={() => handleArticleClick(featuredArticle)} />}
            
            <div className={`container mx-auto px-4 ${selectedCategory ? 'pt-24' : ''}`}>
              {selectedCategory && (
                <div className="mb-12 border-b border-zinc-800 pb-6">
                  <h1 className="text-5xl md:text-7xl font-bold text-white lowercase">{selectedCategory}</h1>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Feed */}
                <div className="lg:col-span-8">
                  {displayArticles.map(article => (
                     // Don't repeat hero in list on homepage
                     (!selectedCategory && article.id === featuredArticle.id) ? null : 
                     <ArticleCard key={article.id} article={article} onClick={() => handleArticleClick(article)} />
                  ))}
                  {displayArticles.length === 0 && (
                    <div className="text-zinc-500 py-20 text-center">No articles found in this category.</div>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-12">
                   {/* Donate Widget */}
                   <div className="bg-granma-yellow p-6 rounded-sm text-black">
                      <h3 className="text-2xl font-bold mb-2 lowercase">Support Radical Media</h3>
                      <p className="mb-4 font-serif leading-tight">We refuse corporate funding. Our survival depends on readers like you.</p>
                      <button className="w-full bg-black text-white font-bold py-3 uppercase text-xs tracking-widest hover:bg-zinc-800 transition-colors">
                        Donate Now
                      </button>
                   </div>

                   {/* Popular / Trending (Mock) */}
                   <div>
                     <h3 className="text-granma-green font-mono text-xs uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">Trending Now</h3>
                     <ul className="space-y-6">
                       {[1,2,3].map(i => (
                         <li key={i} className="group cursor-pointer">
                            <span className="text-zinc-600 font-bold text-xl mr-3 font-mono">0{i}</span>
                            <span className="text-white font-bold hover:text-granma-green transition-colors">
                              The commodification of queer pride: A marxist critique
                            </span>
                         </li>
                       ))}
                     </ul>
                   </div>

                   {/* Newsletter */}
                   <div className="bg-zinc-900 border border-zinc-800 p-6">
                     <h3 className="text-white font-bold mb-2">The Weekly Dispatch</h3>
                     <p className="text-sm text-zinc-400 mb-4">Best of the week, directly to your inbox. No spam, just struggle.</p>
                     <input type="email" placeholder="email address" className="w-full bg-black border border-zinc-700 p-2 mb-2 text-white outline-none" />
                     <button className="w-full bg-granma-green text-black font-bold py-2 uppercase text-xs">Subscribe</button>
                   </div>
                </aside>
              </div>
            </div>
          </>
        )}

        {/* Static Pages Placeholders */}
        {pageState === PageState.DONATE && (
          <div className="pt-32 pb-20 container mx-auto px-4 text-center">
            <h1 className="text-6xl font-bold text-white mb-6">Support Us</h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              Independent journalism is under attack. Help us keep the lights on and the stories free for everyone.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[5, 10, 25].map(amt => (
                <button key={amt} className="p-8 border border-zinc-700 hover:border-granma-yellow hover:bg-zinc-900 transition-all rounded">
                  <div className="text-4xl font-bold text-granma-green mb-2">${amt}</div>
                  <div className="text-zinc-500 text-sm uppercase tracking-wide">Monthly</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {pageState === PageState.ABOUT && (
          <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
             <h1 className="text-5xl font-bold text-white mb-8 lowercase">about us</h1>
             <div className="prose prose-invert prose-lg">
               <p>
                 Granma Story Online is a digital publication dedicated to the voices of the marginalized. 
                 We stand at the intersection of ecology, class struggle, and identity.
               </p>
               <p>
                 Our mission is to deconstruct the narratives of power and reconstruct a world built on 
                 justice, scientific literacy, and cultural pride.
               </p>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-black border-t border-zinc-900 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-6 lowercase">granma<span className="text-granma-green">story</span><span className="text-granma-yellow">online</span></h2>
          <div className="flex justify-center gap-8 mb-8 text-sm font-mono text-zinc-500">
             <a href="#" className="hover:text-granma-green">Home</a>
             <a href="#" className="hover:text-granma-green">About</a>
             <a href="#" className="hover:text-granma-green">Contact</a>
             <a href="#" className="hover:text-granma-green">Privacy Policy</a>
          </div>
          <p className="text-zinc-700 text-xs">
            © {new Date().getFullYear()} Granma Story Online. All rights reserved. 
            <br/>Designed for the people.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;