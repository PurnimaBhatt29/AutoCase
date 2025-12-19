import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileDown, Download, Trash2, Loader2, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Brief {
  id: string;
  case_title: string;
  citation: string | null;
  court: string | null;
  created_at: string;
}

const SavedReports = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBriefs();
    }
  }, [user]);

  const fetchBriefs = async () => {
    try {
      const { data, error } = await supabase
        .from("case_briefs")
        .select("id, case_title, citation, court, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBriefs(data || []);
    } catch (error) {
      console.error("Error fetching briefs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBrief = async (id: string) => {
    try {
      const { error } = await supabase
        .from("case_briefs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setBriefs((prev) => prev.filter((b) => b.id !== id));
      toast({ title: "Deleted", description: "Report removed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  if (authLoading || isLoading) {
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
            Saved Reports
          </h1>
          <p className="text-muted-foreground">
            Access and download your saved case briefs and research reports.
          </p>
        </motion.div>

        {briefs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {briefs.map((brief, index) => (
              <motion.div
                key={brief.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-6 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {brief.case_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {brief.citation || brief.court || "Case Brief"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {new Date(brief.created_at).toLocaleDateString("en-IN")}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBrief(brief.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileDown className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              No Saved Reports
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Your saved case briefs and research reports will appear here.
            </p>
            <Button variant="hero" onClick={() => navigate("/dashboard/briefs")}>
              Generate a Case Brief
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedReports;
