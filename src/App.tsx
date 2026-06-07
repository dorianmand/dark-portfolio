import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SelectedWorks } from './components/SelectedWorks';
import { Journal } from './components/Journal';
import { Explorations } from './components/Explorations';
import { Stats } from './components/Stats';
import { Footer } from './components/Footer';
import { articles } from './data/articles';

function shouldSkipIntro() {
  const params = new URLSearchParams(window.location.search);
  return params.get('skipIntro') === '1' || window.location.hash.length > 0;
}

function renderMarkdown(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return (
        <h1 key={index} className="mb-8 text-4xl md:text-6xl">
          {line.replace('# ', '')}
        </h1>
      );
    }

    if (line.startsWith('## ')) {
      return (
        <h2 key={index} className="mb-4 mt-10 text-2xl md:text-3xl">
          {line.replace('## ', '')}
        </h2>
      );
    }

    if (!line.trim()) {
      return <br key={index} />;
    }

    return (
      <p key={index} className="mb-5 text-lg leading-8 text-muted">
        {line}
      </p>
    );
  });
}

function ArticlePage() {
  const slug = window.location.pathname.replace('/articles/', '');
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[900px] px-6 py-32 md:px-10">
          <h1 className="text-4xl md:text-6xl">Article not found</h1>
          <a href="/?skipIntro=1#news" className="mt-8 inline-block text-muted">
            ← Back to homepage
          </a>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[900px] px-6 py-32 md:px-10">
        <p className="mb-6 text-xs uppercase tracking-[0.2em] text-muted">
          {article.date} · {article.read}
        </p>

        <article>{renderMarkdown(article.content)}</article>

        <a href="/articles" className="mt-12 inline-block text-muted">
          ← Back to all articles
        </a>
      </main>
    </>
  );
}

function ArticlesIndexPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-6 py-32 md:px-10">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
          News
        </p>

        <h1 className="mb-12 text-5xl md:text-7xl">
          All <span className="font-serif italic">articles</span>
        </h1>

        <div className="space-y-4">
          {articles.map((article) => (
            <a
              key={article.slug}
              href={article.url}
              className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-black/5 p-4 transition hover:bg-black/10 sm:rounded-full"
            >
              <img
                src={article.image}
                alt=""
                className="h-20 w-20 shrink-0 rounded-full object-cover transition group-hover:scale-105"
              />

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base text-text-primary md:text-xl">
                  {article.title}
                </h2>

                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {article.date}
                </p>
              </div>

              <div className="hidden text-sm text-muted sm:block">
                {article.read}
              </div>

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-transparent text-black transition group-hover:translate-x-1">
                ↗
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

function HomePage() {
  const skipIntro = shouldSkipIntro();
  const [isLoading, setIsLoading] = useState(!skipIntro);
  const complete = useCallback(() => setIsLoading(false), []);

  useEffect(() => {
    if (!isLoading && window.location.hash) {
      const target = window.location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={complete} />}
      </AnimatePresence>

      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Hero />
          <Journal />
          <SelectedWorks />
          <Explorations />
          <Stats />
          <Footer />
        </motion.main>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const pathname = window.location.pathname;

  if (pathname === '/articles') {
    return <ArticlesIndexPage />;
  }

  if (pathname.startsWith('/articles/')) {
    return <ArticlePage />;
  }

  return <HomePage />;
}