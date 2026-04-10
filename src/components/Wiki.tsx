import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Book, Search, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
}

export default function Wiki() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase.from('wiki_articles').select('*');
    if (data) setArticles(data);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Climate Wiki</h2>
        <p className="text-xl font-bold text-gray-600 italic">"Knowledge is power. Too bad it won't stop the sea levels rising."</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search wiki..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="brutal-input w-full pl-10 text-sm"
            />
          </div>

          <div className="brutal-card p-4 bg-white">
            <h3 className="font-black uppercase text-sm mb-4 border-b-2 border-black pb-2">Articles</h3>
            <nav className="space-y-2">
              {filteredArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={cn(
                    "w-full text-left p-2 font-bold text-sm transition-all flex items-center justify-between",
                    selectedArticle?.id === article.id ? "bg-brutal-yellow border-2 border-black" : "hover:bg-gray-100"
                  )}
                >
                  <span className="truncate">{article.title}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
              {filteredArticles.length === 0 && (
                <p className="text-xs font-bold text-gray-400 italic">No articles found.</p>
              )}
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {selectedArticle ? (
            <div className="brutal-card bg-white min-h-[600px]">
              <div className="mb-8 border-b-4 border-black pb-6">
                <span className="px-3 py-1 bg-brutal-pink border-2 border-black font-black text-xs uppercase mb-4 inline-block">
                  {selectedArticle.category}
                </span>
                <h1 className="text-4xl font-black uppercase tracking-tight">{selectedArticle.title}</h1>
              </div>
              <div className="prose prose-lg max-w-none font-bold text-gray-700 leading-relaxed">
                {selectedArticle.content.split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="brutal-card bg-brutal-blue/10 min-h-[600px] flex flex-col items-center justify-center text-center p-12">
              <Book size={64} className="mb-6 opacity-20" />
              <h3 className="text-3xl font-black uppercase mb-4">Select an article</h3>
              <p className="text-xl font-bold text-gray-500 max-w-md">
                Pick something to read. Or don't. Ignorance is bliss until your basement floods.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
