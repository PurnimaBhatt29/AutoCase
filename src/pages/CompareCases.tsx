import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompare, Loader2, ArrowLeftRight } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLegalAI } from "@/hooks/useLegalAI";
import { useToast } from "@/hooks/use-toast";

const CompareCases = () => {
  const [case1, setCase1] = useState("");
  const [case2, setCase2] = useState("");
  const [comparison, setComparison] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { streamQuery } = useLegalAI();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleCompare = async () => {
    if (!case1.trim() || !case2.trim()) {
      toast({ title: "Error", description: "Please enter both cases to compare", variant: "destructive" });
      return;
    }

    setIsComparing(true);
    setComparison("");

    const prompt = `Compare these two Indian legal cases in detail:

Case 1: ${case1}
Case 2: ${case2}

Provide a structured comparison covering:
1. **Facts Comparison**: Key factual similarities and differences
2. **Legal Issues**: Compare the legal questions addressed
3. **Court & Jurisdiction**: Courts involved and their hierarchy
4. **Legal Principles**: Compare the legal principles applied
5. **Arguments**: Key arguments made in each case
6. **Reasoning**: Compare the judicial reasoning
7. **Judgments**: Compare the outcomes/holdings
8. **Precedential Value**: How each case affects the other or future cases
9. **Key Differences**: Most significant distinguishing factors
10. **Practical Implications**: How these cases might apply together

Format as a detailed legal analysis.`;

    await streamQuery(prompt, "chat", {
      onDelta: (text) => setComparison((prev) => prev + text),
      onDone: () => setIsComparing(false),
      onError: (error) => {
        toast({ title: "Error", description: error, variant: "destructive" });
        setIsComparing(false);
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
            Compare Cases
          </h1>
          <p className="text-muted-foreground">
            Compare legal principles, facts, and judgments between two cases.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Case 1
              </label>
              <Input
                value={case1}
                onChange={(e) => setCase1(e.target.value)}
                placeholder="e.g., Kesavananda Bharati v. State of Kerala"
                className="py-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Case 2
              </label>
              <Input
                value={case2}
                onChange={(e) => setCase2(e.target.value)}
                placeholder="e.g., Minerva Mills v. Union of India"
                className="py-4"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="hero"
              onClick={handleCompare}
              disabled={isComparing || !case1.trim() || !case2.trim()}
            >
              {isComparing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Comparing Cases...
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Compare Cases
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Comparison Result */}
        {comparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Comparison Analysis
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {comparison}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!comparison && !isComparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <GitCompare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Compare Two Cases
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter two case names or citations to get a detailed comparison of facts,
              legal principles, and judgments.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompareCases;
