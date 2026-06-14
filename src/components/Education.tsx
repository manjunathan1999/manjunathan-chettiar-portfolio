import { motion } from 'motion/react';
import { GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { RESUME_DATA } from '@/src/constants';
import ScrollGlitchText from '@/src/components/ScrollGlitchText';

export default function Education() {
  return (
    <section className="py-[var(--spacing-section)] border-t-[3px] border-primary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Education list Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="flex items-center gap-3 border-b-2 border-primary pb-3 select-none">
              <div className="bg-primary text-primary-foreground p-1.5 border border-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase font-heading text-primary">
                <ScrollGlitchText text="Education Registry" />
              </h2>
            </div>

            {/* List */}
            <div className="space-y-6">
              {RESUME_DATA.education.map((edu, index) => (
                <div key={index} className="bg-background border-neo shadow-neo p-5 hover-lift">
                  <span className="font-mono text-[10px] text-muted-foreground font-bold uppercase block mb-1">
                    DEGREE_{RESUME_DATA.education.length - index} //
                  </span>
                  <h3 className="font-heading font-extrabold uppercase text-base sm:text-lg text-primary mb-1">
                    {edu.degree}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-mono font-bold uppercase mb-3">
                    {edu.institution}
                  </p>
                  <p className="font-mono text-xs font-bold border border-primary px-2.5 py-1 bg-secondary text-primary shadow-neo-sm w-fit select-none">
                    {edu.period}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="flex items-center gap-3 border-b-2 border-primary pb-3 select-none">
              <div className="bg-primary text-primary-foreground p-1.5 border border-primary">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase font-heading text-primary">
                <ScrollGlitchText text="Active Certifications" />
              </h2>
            </div>

            {/* List */}
            <div className="space-y-4">
              {RESUME_DATA.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 border-neo bg-background shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <CheckCircle2 className="mt-0.5 w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground font-bold block mb-0.5 uppercase select-none">
                      CREDENTIAL_0{index + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-mono font-bold text-primary leading-tight">
                      {cert}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
