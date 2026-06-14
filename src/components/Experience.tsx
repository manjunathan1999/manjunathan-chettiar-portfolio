import { motion } from 'motion/react';
import { Briefcase, ArrowUpRight, CheckSquare } from 'lucide-react';
import { RESUME_DATA } from '@/src/constants';
import ScrollGlitchText from '@/src/components/ScrollGlitchText';

export default function Experience() {
  return (
    <section id="experience" className="py-[var(--spacing-section)] border-primary bg-secondary/10">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-block bg-primary text-primary-foreground font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider border border-primary">
              INDEX_02 // SYSTEM_LOG_HISTORIC
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase font-heading text-primary">
              <ScrollGlitchText text="Work Experiences" />
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-mono leading-relaxed max-w-2xl">
              An chronological pipeline tracing architectural design achievements, API infrastructure, and microservices scaling logs.
            </p>
          </motion.div>
        </div>

        {/* Chronological Timeline list */}
        <div className="max-w-4xl mx-auto space-y-12 relative">
          
          {/* Vertical axis line for brutalist continuity */}
          <div className="absolute left-6 top-8 bottom-8 w-[3px] bg-primary/20 pointer-events-none hidden sm:block" />

          {RESUME_DATA.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-0 sm:pl-16"
            >
              {/* Floating icon representing temporal key-frames */}
              <div className="absolute left-1.5 top-1.5 size-9 border-2 border-primary bg-primary text-primary-foreground hidden sm:flex items-center justify-center shadow-neo-sm">
                <Briefcase className="h-4 w-4" />
              </div>

              {/* Work log card */}
              <div className="bg-background border-neo shadow-neo p-6 hover-lift">
                
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-primary pb-4 mb-4 select-none">
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground font-bold tracking-widest uppercase block mb-1">
                      LOG_ENTRY_{RESUME_DATA.experience.length - index} //
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold uppercase font-heading text-primary leading-tight">
                      {exp.title}
                    </h3>
                  </div>
                  <div className="font-mono text-xs font-bold border border-primary px-2.5 py-1 bg-secondary text-primary shadow-neo-sm h-fit shrink-0">
                    {exp.period}
                  </div>
                </div>

                {/* Co / Location */}
                <div className="text-sm font-mono font-bold text-primary mb-4 flex items-center justify-between select-none">
                  <span>&gt; {exp.company}</span>
                  <span className="opacity-60 text-xs">{exp.location}</span>
                </div>

                {/* Achievements block */}
                <ul className="space-y-3 font-mono">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-3">
                      <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
