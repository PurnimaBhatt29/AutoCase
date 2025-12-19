import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Search,
  FileText,
  GitCompare,
  BookOpen,
  MessageSquare,
  Upload,
  Mic,
  Clock,
  Settings,
  LogOut,
  ChevronLeft,
  Home,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Search, label: "Legal Query", path: "/dashboard/query" },
  { icon: FileText, label: "Case Briefs", path: "/dashboard/briefs" },
  { icon: GitCompare, label: "Compare Cases", path: "/dashboard/compare" },
  { icon: BookOpen, label: "Acts & Statutes", path: "/dashboard/statutes" },
  { icon: MessageSquare, label: "Chat Research", path: "/dashboard/chat" },
  { icon: Upload, label: "Upload Document", path: "/dashboard/upload" },
  { icon: Mic, label: "Voice Query", path: "/dashboard/voice" },
  { icon: Clock, label: "History", path: "/dashboard/history" },
  { icon: FileDown, label: "Saved Reports", path: "/dashboard/reports" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 z-40 glass-strong border-r border-border"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-gold-dark p-2 rounded-lg shrink-0">
                <Scale className="w-5 h-5 text-primary-foreground" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-serif text-xl font-bold text-foreground whitespace-nowrap overflow-hidden"
                  >
                    Auto<span className="text-gradient-gold">Case</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border space-y-1">
            <Link to="/dashboard/settings">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Settings className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Settings</span>}
              </div>
            </Link>
            <Link to="/">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <LogOut className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
              </div>
            </Link>

            {/* Collapse Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="w-full mt-2"
            >
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
                <ChevronLeft className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-[280px]"
        }`}
      >
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
};
