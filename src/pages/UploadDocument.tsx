import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, X, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLegalAI } from "@/hooks/useLegalAI";
import { useToast } from "@/hooks/use-toast";

const UploadDocument = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { streamQuery } = useLegalAI();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysis("");

    // Read file content for text files
    if (selectedFile.type === "text/plain" || selectedFile.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result as string);
      };
      reader.readAsText(selectedFile);
    } else {
      setFileContent(`[${selectedFile.name}] - File uploaded. Analysis will be based on filename and type.`);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysis("");

    const prompt = `Analyze this legal document and provide a comprehensive analysis:

Document Name: ${file.name}
Document Type: ${file.type || "Unknown"}
${fileContent ? `Document Content Preview:\n${fileContent.substring(0, 2000)}...` : ""}

Please provide:
1. **Document Type Identification**: What type of legal document is this?
2. **Key Issues Spotted**: What are the main legal issues in this document?
3. **Relevant Sections**: What sections of Indian law apply?
4. **Risk Assessment**: Any potential legal risks or concerns?
5. **Recommendations**: Suggested actions or considerations
6. **Related Cases**: Any relevant case law that might apply
7. **Summary**: A brief summary of the document's legal significance`;

    await streamQuery(prompt, "chat", {
      onDelta: (text) => setAnalysis((prev) => prev + text),
      onDone: () => setIsAnalyzing(false),
      onError: (error) => {
        toast({ title: "Error", description: error, variant: "destructive" });
        setIsAnalyzing(false);
      },
    });
  };

  const removeFile = () => {
    setFile(null);
    setFileContent("");
    setAnalysis("");
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
            Upload Document
          </h1>
          <p className="text-muted-foreground">
            Upload legal documents for AI-powered analysis and issue spotting.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`glass rounded-2xl p-12 border-2 border-dashed transition-colors cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    or click to browse files
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supports PDF, DOC, DOCX, TXT
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="hero"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Analysis Result */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Document Analysis
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadDocument;
