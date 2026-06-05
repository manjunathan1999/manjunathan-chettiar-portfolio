import { motion } from 'motion/react';
import { ExternalLink, FolderCode, ArrowUpRight } from 'lucide-react';
import { RESUME_DATA } from '@/src/constants';
import GithubGraph from '@/src/components/GithubGraph';
import { audioSystem } from '@/src/lib/audio';

export default function Projects() {
  return (
    <section id="projects" className="py-[var(--spacing-section)] border-t-[3px] border-primary bg-secondary/10">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-block bg-primary text-primary-foreground font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider border border-primary">
              INDEX_04 // WORK_PORTFOLIO
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase font-heading text-primary">
              Project Experiences
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-mono leading-relaxed max-w-2xl">
              An index of built microservices, computer vision pipelines, anomaly filtering mechanisms, and localized LLM stream utilities.
            </p>
          </motion.div>
        </div>

        {/* Live GitHub contributions integration */}
        <div className="max-w-6xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <GithubGraph />
          </motion.div>
        </div>

        {/* Modular Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {RESUME_DATA.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-full bg-background border-neo shadow-neo hover-lift p-6 flex flex-col justify-between">
                <div>
                  
                  {/* Card Icon & Header */}
                  <div className="flex items-center justify-between border-b-2 border-primary pb-4 mb-4 select-none">
                    <div className="bg-secondary p-2.5 border border-primary text-primary">
                      <FolderCode className="h-5 w-5" />
                    </div>
                    <a
                      href="https://github.com/manjunathan1999"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => audioSystem.playClick()}
                      className="p-1 px-2 border border-primary text-xs font-mono font-bold flex items-center gap-1 bg-background hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                      title="Inspect Codebase"
                    >
                      <span>CODE</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold uppercase font-heading tracking-tight mb-2 text-primary">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-mono mb-4">
                    {project.description}
                  </p>

                </div>

                {/* Sub-details checklist */}
                <div className="border-t border-dashed border-primary/20 pt-4">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono block mb-2 select-none">
                    Key Features:
                  </span>
                  <ul className="space-y-1.5 pl-1.5 font-mono">
                    {project.details.map((detail, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary shrink-0">+</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
