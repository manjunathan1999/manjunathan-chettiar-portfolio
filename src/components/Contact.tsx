import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { RESUME_DATA } from '@/src/constants';
import confetti from 'canvas-confetti';
import { audioSystem } from '@/src/lib/audio';
import ScrollGlitchText from '@/src/components/ScrollGlitchText';

// Formspree endpoint — set VITE_FORMSPREE_ID in .env.local
const FORMSPREE_URL = `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID || 'YOUR_FORM_ID'}`;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    audioSystem.playClick();

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setIsSubmitted(true);
        audioSystem.playSuccess();
        form.reset();

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#000000', '#ffffff', '#888888'],
        });
      } else {
        const data = await response.json();
        setError(data?.errors?.[0]?.message || 'Transmission failed. Try again.');
        audioSystem.playError();
      }
    } catch (_) {
      setError('Network error. Check your connection and try again.');
      audioSystem.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-[var(--spacing-section)] border-t-[3px] border-primary bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Information Column (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-block bg-primary text-primary-foreground font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider border border-primary">
                INDEX_06 // SECURE_COMMS_LINK
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase font-heading text-primary select-none">
                <ScrollGlitchText text="Get In Touch" />
              </h2>
              
              <p className="text-sm sm:text-base text-muted-foreground font-mono leading-relaxed max-w-md">
                I am always open to discussing system architectures, performance optimizations, database scaling projects, or direct recruitment.
              </p>

              {/* Contact list keys */}
              <div className="space-y-4 pt-4 font-mono select-none">
                <div className="flex items-center gap-4 p-4 border-neo bg-background shadow-neo-sm h-18">
                  <div className="p-2 bg-secondary border border-primary text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">EMAIL CHANNELS</p>
                    <a href={`mailto:${RESUME_DATA.email}`} className="text-xs sm:text-sm font-bold text-primary underline hover:opacity-80 break-all">
                      {RESUME_DATA.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border-neo bg-background shadow-neo-sm h-18">
                  <div className="p-2 bg-secondary border border-primary text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">DIRECT TELEPHONY</p>
                    <span className="text-xs sm:text-sm font-bold text-primary">{RESUME_DATA.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border-neo bg-background shadow-neo-sm h-18">
                  <div className="p-2 bg-secondary border border-primary text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">DEPLOYMENT REGION</p>
                    <span className="text-xs sm:text-sm font-bold text-primary">Bengaluru, India</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Brutalist Contact Form (Right Column) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background border-neo shadow-neo p-6 sm:p-8 relative"
            >
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 select-none">
                  <div className="w-16 h-16 border-2 border-primary bg-secondary flex items-center justify-center mb-6 shadow-neo-sm">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl uppercase mb-2">Transmission Received</h3>
                  <p className="text-xs sm:text-sm font-mono text-muted-foreground mb-8 max-w-sm leading-relaxed">
                    Thank you. The signal was synchronized successfully. I will get back to your query as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="font-mono text-xs font-bold border-2 border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary transition-colors px-4 py-2 cursor-pointer shadow-neo-sm active:translate-y-0.5"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-primary">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. John Doe"
                        required
                        onInput={() => audioSystem.playKeystroke()}
                        className="w-full border-neo bg-background text-primary px-3 py-2 text-sm font-bold focus:outline-none focus:ring-0 rounded-none shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-primary">Your Email *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="e.g. john@domain.com"
                        required
                        onInput={() => audioSystem.playKeystroke()}
                        className="w-full border-neo bg-background text-primary px-3 py-2 text-sm font-bold focus:outline-none focus:ring-0 rounded-none shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-primary">Subject Track *</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Backend Architecture Inquiry"
                      required
                      onInput={() => audioSystem.playKeystroke()}
                      className="w-full border-neo bg-background text-primary px-3 py-2 text-sm font-bold focus:outline-none focus:ring-0 rounded-none shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-primary">Secure Signal Message *</label>
                    <textarea
                      name="message"
                      placeholder="Tell me about your architectural project objectives..."
                      onInput={() => audioSystem.playKeystroke()}
                      className="w-full min-h-[140px] border-neo bg-background text-primary px-3 py-2 text-sm font-bold focus:outline-none focus:ring-0 rounded-none shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                      required
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="text-xs font-mono text-red-500 border border-red-500 bg-red-500/10 px-3 py-2">
                      ⚠ {error}
                    </div>
                  )}
                  
                  {/* Brutalist Button */}
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground border-2 border-primary py-3.5 text-xs sm:text-sm font-extrabold uppercase flex items-center justify-center gap-2 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">ENGAGING TRANSPONDER...</span>
                    ) : (
                      <>
                        <span>Emit Signal</span>
                        <Send className="h-4 w-4 shrink-0" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
