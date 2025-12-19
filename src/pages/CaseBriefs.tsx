import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Search, Loader2, Download, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLegalAI } from "@/hooks/useLegalAI";
import { useToast } from "@/hooks/use-toast";

const CaseBriefs = () => {
  const [caseInput, setCaseInput] = useState("");
  const [briefContent, setBriefContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { streamQuery, isLoading } = useLegalAI();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleGenerateBrief = async () => {
    if (!caseInput.trim()) return;

    setIsGenerating(true);
    setBriefContent("");

    const prompt = `Generate a comprehensive case brief for: ${caseInput}. 
    Include all standard sections: Case Title, Citation, Court, Year, Issue, Facts, Arguments, Reasoning, Judgment, and Significance.`;

    await streamQuery(prompt, "brief", {
      onDelta: (text) => setBriefContent((prev) => prev + text),
      onDone: () => setIsGenerating(false),
      onError: (error) => {
        toast({ title: "Error", description: error, variant: "destructive" });
        setIsGenerating(false);
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
            Case Brief Generator
          </h1>
          <p className="text-muted-foreground">
            Generate structured legal briefs with AI analysis of cases.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Enter Case Details</h2>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={caseInput}
              onChange={(e) => setCaseInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateBrief()}
              placeholder="Enter case name or citation (e.g., 'Kesavananda Bharati v. State of Kerala')"
              className="pl-12 py-6 text-lg"
            />
          </div>
          <Button
            variant="hero"
            onClick={handleGenerateBrief}
            disabled={isGenerating || !caseInput.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Brief...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Generate Brief
              </>
            )}
          </Button>
        </motion.div>

        {/* Generated Brief */}
        {briefContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Generated Case Brief
              </h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {briefContent}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!briefContent && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Generate a Case Brief
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a case name or citation above to generate a structured legal brief with
              Issue, Facts, Reasoning, and Judgment.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CaseBriefs;
