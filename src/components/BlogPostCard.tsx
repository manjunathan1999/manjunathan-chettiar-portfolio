import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { BookOpen } from 'lucide-react';

interface BlogPostCardProps {
  post: {
    title: string;
    date: string;
    content: string;
  };
  index: number;
}

export default function BlogPostCard({ post, index }: BlogPostCardProps) {
  return (
    <motion.div
      id={`blog-post-${index}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-background border-neo shadow-neo p-6 sm:p-8 hover-lift relative overflow-hidden"
    >
      {/* Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-primary pb-4 mb-6 select-none gap-3">
        <div className="font-mono text-xs font-bold space-y-1">
          <div className="text-muted-foreground uppercase">SIGNAL_METRIC // INDEX_{index + 1}</div>
          <div className="text-xs text-primary/80 tracking-widest font-extrabold uppercase">POSTED // {post.date}</div>
        </div>
        <div className="flex items-center gap-4 text-primary font-mono text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5 bg-secondary border border-primary px-2.5 py-1 shadow-neo-sm">
            <BookOpen className="size-3.5 text-primary" />
            <span className="uppercase tracking-tight text-[10px]">EST_BANDWIDTH // {Math.floor(post.content.length / 450) + 2} MIN READ</span>
          </div>
        </div>
      </div>

      {/* HTML Content (Optimized Markdown container) */}
      <article className="prose dark:prose-invert max-w-none font-mono">
        <div className="markdown-body select-text text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-normal">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </motion.div>
  );
}
