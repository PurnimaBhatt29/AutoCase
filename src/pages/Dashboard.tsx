import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  GitCompare,
  BookOpen,
  MessageSquare,
  Upload,
  Mic,
  ArrowRight,
  Clock,
  FileDown,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

const quickActions = [
  {
    icon: Search,
    title: "New Legal Query",
    description: "Search across multiple legal databases",
    path: "/dashboard/query",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: FileText,
    title: "Generate Brief",
    description: "Create structured case briefs with AI",
    path: "/dashboard/briefs",
    color: "from-success/20 to-success/5",
  },
  {
    icon: GitCompare,
    title: "Compare Precedents",
    description: "Side-by-side case comparison",
    path: "/dashboard/compare",
    color: "from-warning/20 to-warning/5",
  },
  {
    icon: MessageSquare,
    title: "Chat Research",
    description: "Interactive AI-powered research",
    path: "/dashboard/chat",
    color: "from-primary/20 to-primary/5",
  },
];

const recentActivity = [
  {
    type: "query",
    title: "Search: Right to Privacy Article 21",
    time: "2 hours ago",
    icon: Search,
  },
  {
    type: "brief",
    title: "Brief Generated: K.S. Puttaswamy v. Union of India",
    time: "Yesterday",
    icon: FileText,
  },
  {
    type: "comparison",
    title: "Compared: Maneka Gandhi vs Kesavananda Bharati",
    time: "2 days ago",
    icon: GitCompare,
  },
];

const stats = [
  { label: "Queries This Week", value: "24", trend: "+12%" },
  { label: "Briefs Generated", value: "8", trend: "+33%" },
  { label: "Cases Saved", value: "156", trend: "+5%" },
  { label: "PDFs Exported", value: "12", trend: "+20%" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Continue your legal research or start a new query.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass p-5 rounded-xl border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass p-6 rounded-xl h-full group cursor-pointer border border-transparent hover:border-primary/30 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Recent Activity
              </h2>
              <Link to="/dashboard/history">
                <Button variant="ghost" size="sm" className="group">
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="glass rounded-xl border border-border/50 divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <activity.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <FileDown className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Modules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              All Modules
            </h2>
            <div className="glass rounded-xl border border-border/50 p-4 space-y-2">
              {[
                { icon: Search, label: "Federated Search", path: "/dashboard/query" },
                { icon: FileText, label: "Brief Generator", path: "/dashboard/briefs" },
                { icon: GitCompare, label: "Compare Cases", path: "/dashboard/compare" },
                { icon: BookOpen, label: "Acts & Statutes", path: "/dashboard/statutes" },
                { icon: MessageSquare, label: "Chat Research", path: "/dashboard/chat" },
                { icon: Upload, label: "Document Upload", path: "/dashboard/upload" },
                { icon: Mic, label: "Voice Query", path: "/dashboard/voice" },
                { icon: Clock, label: "History", path: "/dashboard/history" },
              ].map((item, index) => (
                <Link key={index} to={item.path}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
