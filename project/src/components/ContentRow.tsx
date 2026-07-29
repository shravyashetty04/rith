import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Title } from '../types';
import MovieCard from './MovieCard';

interface Props {
  title: string;
  titles: (Title & { progress?: number })[];
  variant?: 'default' | 'large' | 'ranked';
  onSeeAll?: () => void;
}

export default function ContentRow({ title, titles, variant = 'default', onSeeAll }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);

    // Track scroll state
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  useEffect(() => {
    update();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [titles]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (!titles.length) return null;

  return (
    <section className="group/row relative py-4 sm:py-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
          {title}
        </h2>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-xs sm:text-sm text-brand-500 hover:text-brand-400 font-semibold transition-colors"
        >
          {isExpanded ? 'Show Less' : 'View All'}
        </button>
      </div>

      {isExpanded ? (
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${
            variant === 'ranked'
              ? 'gap-x-12 sm:gap-x-14 lg:gap-x-16 gap-y-8 pl-8 sm:pl-10 lg:pl-12'
              : 'gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8'
          } pt-2 pb-6`}
        >
          {titles.map((t, i) => (
            <MovieCard
              key={t.id}
              title={t}
              rank={variant === 'ranked' ? i + 1 : undefined}
              size={variant === 'large' ? 'large' : 'default'}
              progress={t.progress}
            />
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden px-1 pb-6 -mb-6">
          <div
            ref={scrollRef}
            className={`flex overflow-x-auto no-scrollbar pb-6 pt-2 snap-x snap-mandatory ${
              variant === 'ranked'
                ? 'gap-12 sm:gap-14 lg:gap-16 pl-8 sm:pl-10 lg:pl-12 pr-6'
                : 'gap-3 sm:gap-4'
            } ${isScrolling ? 'pointer-events-none' : ''}`}
          >
            {titles.map((t, i) => (
              <MovieCard
                key={t.id}
                title={t}
                rank={variant === 'ranked' ? i + 1 : undefined}
                size={variant === 'large' ? 'large' : 'default'}
                progress={t.progress}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
