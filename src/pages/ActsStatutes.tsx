import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLegalAI } from "@/hooks/useLegalAI";
import { useToast } from "@/hooks/use-toast";

const acts = [
  { name: "Indian Penal Code (IPC)", code: "IPC" },
  { name: "Code of Criminal Procedure (CrPC)", code: "CrPC" },
  { name: "Constitution of India", code: "Constitution" },
  { name: "Indian Contract Act", code: "Contract" },
  { name: "Information Technology Act", code: "IT Act" },
  { name: "Hindu Marriage Act", code: "HMA" },
  { name: "Indian Evidence Act", code: "Evidence" },
  { name: "Companies Act", code: "Companies" },
];

const ActsStatutes = () => {
  const [query, setQuery] = useState("");
  const [selectedAct, setSelectedAct] = useState("");
  const [result, setResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { streamQuery } = useLegalAI();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResult("");

    const actContext = selectedAct ? ` Focus specifically on the ${selectedAct}.` : "";
    const prompt = `Provide detailed information about the following legal query related to Indian statutes and acts:

Query: ${query}${actContext}

Include:
1. **Relevant Sections**: List all applicable sections with their full text
2. **Interpretation**: How courts have interpreted these sections
3. **Key Amendments**: Any important amendments to these sections
4. **Related Provisions**: Connected sections from the same or other acts
5. **Practical Application**: How these sections are applied in practice
6. **Important Case Law**: Key cases that have interpreted these provisions

Be precise and cite specific section numbers.`;

    await streamQuery(prompt, "chat", {
      onDelta: (text) => setResult((prev) => prev + text),
      onDone: () => setIsSearching(false),
      onError: (error) => {
        toast({ title: "Error", description: error, variant: "destructive" });
        setIsSearching(false);
      },
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Acts & Statutes
          </h1>
          <p className="text-muted-foreground">
            Search and retrieve sections from Indian laws with AI-powered interpretation.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          {/* Act Filters */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Filter by Act (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {acts.map((act) => (
                <Button
                  key={act.code}
                  variant={selectedAct === act.code ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedAct(selectedAct === act.code ? "" : act.code)}
                >
                  {act.code}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for sections, provisions, or legal concepts..."
              className="pl-12 py-6 text-lg"
            />
          </div>
          <Button variant="hero" onClick={handleSearch} disabled={isSearching || !query.trim()}>
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Statutes
              </>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Statute Analysis
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!result && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Search Indian Laws
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for specific sections, provisions, or legal concepts across IPC, CrPC,
              Constitution, and other Indian statutes.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ActsStatutes;
