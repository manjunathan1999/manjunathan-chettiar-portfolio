import { useEffect } from 'react';
import { motion } from 'motion/react';
import { RESUME_DATA } from '@/src/constants';
import Navbar from '@/src/components/Navbar';
// import BlogPostCard from '@/src/components/BlogPostCard'; // blog section disabled
import Hero from '@/src/components/Hero';
import Experience from '@/src/components/Experience';
import Skills from '@/src/components/Skills';
import Projects from '@/src/components/Projects';
import Education from '@/src/components/Education';
import Contact from '@/src/components/Contact';
import Footer from '@/src/components/Footer';
import Hero3D from '@/src/components/Hero3D';
import { HelpCircle } from 'lucide-react';
import Lenis from 'lenis';

// Blog posts — kept for future use, section currently disabled
/* const blogPosts = [
  {
    title: "Optimizing LLM Latency with Asynchronous Task Queues",
    date: "March 15, 2026",
    content: `
# Optimizing LLM Latency

When building production-grade AI applications, latency is often the biggest bottleneck. In our recent project, we faced a challenge where direct LLM API calls were blocking our main application thread.

## The Solution: Asynchronous Processing

By implementing **Celery** with **Redis** as a message broker, we were able to offload heavy LLM tasks to background workers.

### Key Benefits:
- **Non-blocking UI**: Users get immediate feedback that their request is being processed.
- **Scalability**: We can easily spin up more workers to handle spikes in traffic.
- **Reliability**: Failed tasks can be automatically retried.

\`\`\`python
@app.post("/generate")
async function generate_text(prompt: str):
    # Offload to background worker
    task = process_llm_task.delay(prompt)
    return {"task_id": task.id}
\`\`\`

This simple architectural shift improved our system throughput by over 40%.
    `
  },
  {
    title: "Database Indexing: Scaling Relational Queries on Spanner",
    date: "April 28, 2026",
    content: `
# Scaling Relational Queries on Cloud Spanner

Distributed databases provide unprecedented availability, but querying them efficiently requires a deep understanding of indexing and split keys.

## Secondary Indexes vs. Primary Keys

While primary keys determine data distribution, secondary indexes allow fast lookups on non-key columns.

### Best Practices:
1. **Index Interleaving**: Interleave indexes when parent-child relationships exist.
2. **Use Storing Clauses**: Store commonly queried columns in the index itself to avoid extra lookups.
3. **Avoid Hotspotting**: Never use monotonically increasing values (like timestamps or auto-incrementing IDs) as primary keys.

\`\`\`sql
CREATE INDEX MyUserIndex 
ON Users(username) 
STORING (email, last_login_time);
\`\`\`

By storing the \`email\` and \`last_login_time\` in the index, we cut down our average query execution time from 45ms to 2.1ms.
    `
  },
  {
    title: "Web Audio Synthesis: Dynamic Feedback for Terminal UIs",
    date: "May 22, 2026",
    content: `
# Web Audio Synthesis for Immersive Terminals

Audio assets impose heavy latency and bandwidth costs. By synthesizing retro sound effects directly in the browser via the Web Audio API, we can achieve immediate feedback.

## Crafting the Soundwave

Using a simple OscillatorNode, we can program microsecond frequency sweeps to mimic magnetic mechanical keyboard switches.

### Oscillator Sweep Pattern:
- **Tone Type**: Sine or triangle for soft clicks, square or sawtooth for vintage microcomputers.
- **Frequency Sweep**: Exponential ramp from 1600Hz down to 600Hz over 30ms.
- **Gain Envelope**: Immediate start at 0.05 gain, decaying exponentially to zero.

\`\`\`typescript
const osc = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();

osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.03);

gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
\`\`\`

This delivers high-fidelity sound with exactly zero bytes of network transport!
    `
  }
]; */

export default function App() {
  useEffect(() => {
    // Initialise Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Watch for DOM / page height changes to update scroll container limits
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Support standard anchor click scrolls through Lenis animation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const elem = document.querySelector(id);
        if (elem) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: 0, duration: 1.2 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      resizeObserver.disconnect();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-primary selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Blinking CRT Scanline Overlay */}
      <div className="scanline" />
      
      {/* Navigation and progression gauges */}
      <Navbar />
      
      <main>
        {/* Full Viewport Matrix Hero & Terminal */}
        <Hero />
        
        {/* Split About Me with Embedded 3D Render Panel */}
        <section id="about" className="py-[var(--spacing-section)] relative z-20 border-b-[3px] border-primary">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column (Introduce textual content) */}
              <div className="lg:col-span-7 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <div className="inline-block bg-primary text-primary-foreground font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider border border-primary">
                    INDEX_01 // SECURE_WHOAMI_MANIFEST
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase font-heading text-primary leading-none">
                    About the Architect
                  </h2>
                  
                  <div className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-4">
                    <p>{RESUME_DATA.summary}</p>
                    <p className="border-l-2 border-primary pl-4 py-1 italic bg-secondary/50 font-semibold text-primary">
                      "I thrive on solving complex backend challenges and am passionate about 
                      building robust architectures that power the next generation of 
                      intelligent applications."
                    </p>
                    <p>
                      Specialized in writing asynchronous queues, parsing real-time analytics data pipelines, optimizing relational queries, and deploying secure container clusters.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right Column (WebGL Geo Viewer) */}
              <div className="lg:col-span-5 w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-background border-neo shadow-neo rounded-none overflow-hidden hover-lift">
                    {/* Console Header Bar */}
                    <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between pointer-events-none select-none">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary-foreground uppercase tracking-tight">
                        <HelpCircle className="size-3.5" />
                        <span>GL_RENDER_CODELOCK</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="size-2.5 bg-red-500 rounded-full" />
                        <span className="size-2.5 bg-yellow-400 rounded-full" />
                        <span className="size-2.5 bg-green-500 rounded-full" />
                      </div>
                    </div>
                    {/* Canvas Frame */}
                    <Hero3D />
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Chronological Logs, Stack Metrics, and Portfolios */}
        <Experience />
        <Skills />
        <Projects />
        <Education />

        {/* Neo-brutalist Technical Blog Section — commented out, not in use
        <section id="blog" className="py-[var(--spacing-section)] border-t-[3px] border-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="inline-block bg-primary text-primary-foreground font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider border border-primary">
                  INDEX_05 // CORE_WRITINGS
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase font-heading text-primary">
                  Insights & Writings
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground font-mono">
                  Sharing system logs, optimization reports, and database structuring paradigms.
                </p>
              </motion.div>
            </div>
            <div className="max-w-4xl mx-auto space-y-12">
              {blogPosts.map((post, index) => (
                <BlogPostCard key={index} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>
        */}

        {/* Dynamic Comms Channel */}
        <Contact />
      </main>

      {/* Footer system details */}
      <Footer />
    </div>
  );
}
