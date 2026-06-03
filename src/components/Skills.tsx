import { motion } from 'motion/react';
import { RESUME_DATA } from '@/src/constants';
import { Sparkles, Code, Database, Layers, Terminal as ToolIcon, ShieldCheck } from 'lucide-react';
import { audioSystem } from '@/src/lib/audio';

const skillCategories = [
  { key: 'languages', label: 'Programming Languages', icon: Code },
  { key: 'frameworks', label: 'Frameworks', icon: Layers },
  { key: 'databases', label: 'Databases', icon: Database },
  { key: 'tools', label: 'Tools & Technologies', icon: ToolIcon },
  { key: 'devops', label: 'DevOps & Testing', icon: ShieldCheck },
];

export default function Skills() {
  return (
    <section id="skills" className="py-[var(--spacing-section)] border-t-[3px] border-primary">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <div className="inline-flex bg-primary text-primary-foreground font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider border border-primary">
              INDEX_03 // CORE_CAPABILITIES
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase font-heading text-primary">
              Technical Stack
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-mono leading-relaxed max-w-xl mx-auto">
              A comprehensive monospaced registry of specialized backend tools, languages, and containerization modules.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Skill Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            const skillsArray = (RESUME_DATA.skills as any)[category.key] || [];

            // Add libraries if tools is selected to balance the layout
            const displayedSkills = category.key === 'tools' 
              ? [...skillsArray, ...RESUME_DATA.skills.libraries]
              : skillsArray;

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="h-full bg-background border-neo shadow-neo p-5 flex flex-col justify-start">
                  
                  {/* Category Header */}
                  <div className="flex items-center gap-2.5 border-b-2 border-primary pb-3 mb-4 select-none">
                    <div className="bg-secondary p-1.5 border border-primary text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="font-heading font-extrabold uppercase text-sm text-primary tracking-tight">
                      {category.label}
                    </span>
                  </div>

                  {/* Badges Flow */}
                  <div className="flex flex-wrap gap-2">
                    {displayedSkills.map((skill: string) => (
                      <span
                        key={skill}
                        onMouseEnter={() => audioSystem.playKeystroke()}
                        className="font-mono text-xs font-bold border border-primary px-2.5 py-1 bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-default shadow-neo-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>
              </motion.div>
            );
          })}

          {/* Artificial Stats Brutalist Block for symmetry */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 5 * 0.05 }}
            className="hidden lg:block col-span-1"
          >
            <div className="h-full bg-primary text-primary-foreground border-neo p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-primary-foreground/30 pb-3 mb-4">
                  <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
                  <span className="font-heading font-extrabold uppercase text-sm tracking-tight">
                    Pipeline Metrics
                  </span>
                </div>
                <p className="font-mono text-xs leading-loose text-primary-foreground/80">
                  // AGENT_COMPLIANCE: 100%<br />
                  // DEV_LATENCY: LO_30_PCT<br />
                  // STACK_MODULARITY: HIGH<br />
                  // ENGINE: DETECTOR_v4.2
                </p>
              </div>
              <div className="font-mono text-[10px] text-primary-foreground/60 italic text-right mt-4">
                [ SECURE CONFIGURATION ENGAGED ]
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
