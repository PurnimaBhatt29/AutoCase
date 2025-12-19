import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Scale,
  BookOpen,
  MessageSquare,
  Upload,
  Mic,
  FileDown,
  Clock,
  Sparkles,
  GitCompare,
  Quote,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Federated Search",
    description: "Search across Indian Kanoon, Judis, Bare Acts, and more in a single query.",
  },
  {
    icon: FileText,
    title: "Auto Brief Generator",
    description: "Generate structured case briefs with issues, facts, reasoning, and citations.",
  },
  {
    icon: GitCompare,
    title: "Precedent Comparison",
    description: "Compare cases side-by-side with highlighted differences and principles.",
  },
  {
    icon: BookOpen,
    title: "Acts & Statutes RAG",
    description: "Retrieve relevant sections from IPC, CrPC, Constitution, and 20+ Acts.",
  },
  {
    icon: Scale,
    title: "Legal Opinion AI",
    description: "Get AI-generated legal opinions with interpretations and outcome predictions.",
  },
  {
    icon: Upload,
    title: "Document Analysis",
    description: "Upload contracts, judgments, or FIRs for OCR extraction and issue spotting.",
  },
  {
    icon: Mic,
    title: "Voice Research",
    description: "Speak your queries and receive narrated summaries and case briefs.",
  },
  {
    icon: Quote,
    title: "Citation Formatter",
    description: "Extract and format citations in Bluebook, Indian Legal, or custom styles.",
  },
  {
    icon: Clock,
    title: "Doctrine Timeline",
    description: "Visualize the evolution of legal principles through landmark judgments.",
  },
  {
    icon: MessageSquare,
    title: "Chat Research Mode",
    description: "Interactive Q&A with AI that builds arguments and cites relevant cases.",
  },
  {
    icon: FileDown,
    title: "Universal PDF Export",
    description: "Export any output—briefs, comparisons, chats—to professional PDFs.",
  },
  {
    icon: Sparkles,
    title: "Smart Ranking",
    description: "Cases ranked by relevance, court hierarchy, recency, and citation strength.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Features = () => {
  return (
    <section id="features" className="relative py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-midnight-light/30 to-background" />
      
      <div className="container relative z-10 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Comprehensive Toolkit
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need for
            <span className="text-gradient-gold"> Legal Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From research to brief generation, AutoCase covers every aspect of legal work 
            with AI precision and professional PDF exports.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative glass p-6 rounded-2xl h-full hover-lift border-transparent hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
