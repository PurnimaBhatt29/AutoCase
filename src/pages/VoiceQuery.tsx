import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLegalAI } from "@/hooks/useLegalAI";
import { useToast } from "@/hooks/use-toast";

const VoiceQuery = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { streamQuery } = useLegalAI();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser. Try Chrome.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: "Error",
        description: `Voice recognition error: ${event.error}`,
        variant: "destructive",
      });
    };

    recognition.start();
  };

  const handleProcess = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    setResponse("");

    await streamQuery(transcript, "search", {
      onDelta: (text) => setResponse((prev) => prev + text),
      onDone: () => setIsProcessing(false),
      onError: (error) => {
        toast({ title: "Error", description: error, variant: "destructive" });
        setIsProcessing(false);
      },
    });
  };

  const speakResponse = () => {
    if (!response || !("speechSynthesis" in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
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
            Voice Query
          </h1>
          <p className="text-muted-foreground">
            Speak your legal query and get AI-powered responses.
          </p>
        </motion.div>

        {/* Voice Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8 text-center"
        >
          <motion.button
            onClick={startListening}
            disabled={isListening || isProcessing}
            whileTap={{ scale: 0.95 }}
            className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center transition-all ${
              isListening
                ? "bg-destructive animate-pulse"
                : "bg-gradient-to-br from-primary to-gold-dark hover:shadow-glow"
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </motion.button>

          <p className="text-muted-foreground mb-4">
            {isListening ? "Listening... Speak now" : "Tap to start speaking"}
          </p>

          {transcript && (
            <div className="glass rounded-xl p-4 text-left mb-4">
              <p className="text-sm text-muted-foreground mb-1">Your query:</p>
              <p className="text-foreground">{transcript}</p>
            </div>
          )}

          {transcript && !isListening && (
            <Button variant="hero" onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Query"
              )}
            </Button>
          )}
        </motion.div>

        {/* Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                AI Response
              </h2>
              <Button variant="outline" size="sm" onClick={speakResponse}>
                <Volume2 className="w-4 h-4 mr-2" />
                Read Aloud
              </Button>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VoiceQuery;
