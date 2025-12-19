import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Mic,
  Filter,
  Scale,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLegalAI } from "@/hooks/useLegalAI";
import { useToast } from "@/hooks/use-toast";

const courtFilters = [
  "All Courts",
  "Supreme Court",
  "High Courts",
  "District Courts",
  "Tribunals",
];

const actFilters = [
  "All Acts",
  "IPC",
  "CrPC",
  "Constitution",
  "Contract Act",
  "IT Act",
  "Family Law",
];

const LegalQuery = () => {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { streamQuery, isLoading } = useLegalAI();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setShowResults(true);
    setAiResponse("");
    
    await streamQuery(query, "search", {
      onDelta: (text) => setAiResponse((prev) => prev + text),
      onError: (error) => toast({ title: "Error", description: error, variant: "destructive" }),
    });
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
            Legal Query
          </h1>
          <p className="text-muted-foreground">
            Search across Indian Kanoon, Judis, Bare Acts, and more.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter your legal query... (e.g., 'Right to Privacy under Article 21')"
              className="pl-12 pr-24 py-6 text-lg bg-background/50 border-border focus:border-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Mic className="w-5 h-5" />
              </Button>
              <Button variant="hero" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {courtFilters.map((court) => (
                <Button
                  key={court}
                  variant={court === "All Courts" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs"
                >
                  {court}
                </Button>
              ))}
            </div>
            <div className="w-px h-6 bg-border hidden md:block" />
            <div className="flex flex-wrap gap-2">
              {actFilters.slice(0, 4).map((act) => (
                <Button
                  key={act}
                  variant={act === "All Acts" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs"
                >
                  {act}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="text-xs">
                +{actFilters.length - 4} more
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* AI Analysis */}
            <div className="glass rounded-xl p-6 mb-6 border-l-4 border-primary">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Scale className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    AI Query Analysis
                  </h3>
                  {aiResponse ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {aiResponse}
                      </div>
                    </div>
                  ) : isLoading ? (
                    <p className="text-sm text-muted-foreground">Analyzing your query...</p>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Start Your Research
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a legal query above to search across Indian Kanoon, Judis, Bare Acts, 
              and other legal databases.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LegalQuery;
