import { motion } from "framer-motion";
import { MessageSquare, Search, FileText, Download } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Enter Your Query",
    description: "Type or speak your legal question. Our AI understands natural language and extracts key issues, Acts, and keywords.",
  },
  {
    icon: Search,
    step: "02",
    title: "AI Searches & Ranks",
    description: "AutoCase searches across multiple databases, ranks cases by relevance, and identifies the most pertinent precedents.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Review & Analyze",
    description: "Get auto-generated briefs, compare precedents, explore statutes, and refine your research through interactive chat.",
  },
  {
    icon: Download,
    step: "04",
    title: "Export to PDF",
    description: "Download professionally formatted PDFs of any output—briefs, comparisons, chat transcripts, or complete reports.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Simple Workflow
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-6">
            From Query to
            <span className="text-gradient-gold"> Professional PDF</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps to transform your legal research into actionable insights.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="relative mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-card border border-border flex items-center justify-center mx-auto relative z-10">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
