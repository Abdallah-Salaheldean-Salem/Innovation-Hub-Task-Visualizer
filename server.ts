import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of GoogleGenAI to prevent crashing if key is not set immediately on startup
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Gemini AI automated reporting endpoint
  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { tasks, columns, reportType, customPrompt } = req.body;

      if (!tasks || !columns || !reportType) {
        return res.status(400).json({ error: "Missing tasks, columns or reportType in request body." });
      }

      let typePromptFocus = "";
      switch (reportType) {
        case "summary":
          typePromptFocus = "Provide a comprehensive Sprint/Project Status Summary. Highlight achievements, current progress rate, distribution of tasks by status, and overall project completion percentage.";
          break;
        case "bottlenecks":
          typePromptFocus = "Focus heavily on Bottleneck & Risk Analysis. Identify status piles (e.g., too many items in 'In Review'), high priority tasks that are overdue or nearing deadlines, uneven work distributions among assignees, and blocked workflows.";
          break;
        case "resources":
          typePromptFocus = "Focus on Resource Allocation, Velocity, and Hourly Estimates. Analyze estimated hours vs. actual hours logged (if any), compare work density across assignees, assess task complexity distribution, and suggest resource rebalancing or capacity changes.";
          break;
        case "custom":
          typePromptFocus = `Focus on the user's custom instructions: "${customPrompt || "General analysis"}". Tailor the KPIs, analysis, and recommendations precisely to this focus area.`;
          break;
        default:
          typePromptFocus = "Provide a general project status overview.";
      }

      const prompt = `You are an expert technical project manager, Scrum Master, and business analyst. 
Analyze the following project workspace data and generate an in-depth, professional, and highly actionable report.

Project Board Status Columns:
${JSON.stringify(columns, null, 2)}

Active Board Tasks:
${JSON.stringify(tasks, null, 2)}

Report Goal and Selected Focus:
${typePromptFocus}

Please deliver your analysis structured as a JSON response. The 'content' field must contain a professionally formatted markdown document.
Make sure the markdown uses rich typographic hierarchies (e.g., headings, bullet points, emphasized metrics in bold or blockquotes, tables if relevant) to make the report incredibly visually appealing when rendered. Do not repeat the general title or summary inside the 'content' field as they will be displayed separately in the UI.

In the 'suggestedActions' list, identify 2-4 highly concrete, specific next steps (e.g., 'Reassign Task X to spread load', 'Add daily standup to address Blocked tasks', 'Break down epic task Y into subtasks'). These suggestions should correspond to real issues detected in the task data. Each action must have a priority, recommended assignee (must be one of the existing assignees from the tasks or "Unassigned"), and a brief justified reason.

Return your response strictly as valid JSON matching this schema:
{
  "title": "A compelling, specific title for this report",
  "summary": "A professional 2-3 sentence executive summary of the board status and core findings.",
  "content": "Rich detailed markdown containing sections like: ### Core Progress Insights, ### Identified Bottlenecks & Risks, ### Strategic Recommendations.",
  "suggestedActions": [
    {
      "title": "Action title (e.g. Reassign task 'X')",
      "priority": "Low" | "Medium" | "High" | "Urgent",
      "assignee": "Assignee name or 'Unassigned'",
      "reason": "Specific data-driven reason why this is recommended"
    }
  ]
}`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Professional report title" },
              summary: { type: Type.STRING, description: "A high-level 2-3 sentence executive summary" },
              content: { type: Type.STRING, description: "In-depth analysis and details rendered in markdown" },
              suggestedActions: {
                type: Type.ARRAY,
                description: "Actionable concrete tasks suggested to optimize project velocity",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Action item title" },
                    priority: { type: Type.STRING, description: "Priority level: Low, Medium, High, or Urgent" },
                    assignee: { type: Type.STRING, description: "The owner recommended for this action" },
                    reason: { type: Type.STRING, description: "The core reason/justification based on task data" },
                  },
                  required: ["title", "priority", "assignee", "reason"],
                },
              },
            },
            required: ["title", "summary", "content", "suggestedActions"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini API");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({
        error: "Failed to generate report via Gemini.",
        details: error.message || error,
      });
    }
  });

  // Serve Vite in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express full-stack server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
