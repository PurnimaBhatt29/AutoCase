import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing ${type} request for query: ${query}`);

    let systemPrompt = "";
    
    if (type === "search") {
      systemPrompt = `You are an expert Indian legal research assistant. Analyze the user's legal query and provide:
1. **Detected Issue**: The main legal issue or question being asked
2. **Relevant Keywords**: Key legal terms and concepts
3. **Applicable Acts**: Relevant Indian laws and statutes (IPC, CrPC, Constitution, etc.)
4. **Search Strategy**: How to approach finding relevant case law

Be concise and focus on Indian law. Format your response in markdown.`;
    } else if (type === "brief") {
      systemPrompt = `You are an expert Indian legal research assistant. Generate a comprehensive case brief with the following structure:
1. **Case Title & Citation**: Full case name and citation
2. **Court & Year**: Which court and when decided
3. **Issue**: The main legal question(s) before the court
4. **Facts**: Key facts of the case (brief summary)
5. **Arguments**: Main arguments by parties
6. **Reasoning**: Court's legal reasoning and analysis
7. **Judgment**: The decision/holding
8. **Significance**: Precedential value and impact

Format in clean markdown.`;
    } else if (type === "chat") {
      systemPrompt = `You are an expert Indian legal research assistant. You help lawyers, law students, and legal professionals with:
- Understanding legal concepts and principles
- Analyzing case law and statutes
- Providing legal research guidance
- Explaining Indian laws and their interpretations

Be accurate, cite relevant laws and cases when possible, and provide practical insights. Always clarify that you're providing general legal information, not legal advice.`;
    } else {
      systemPrompt = `You are an expert Indian legal research assistant specializing in case law, statutes, and legal analysis.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Legal AI error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
