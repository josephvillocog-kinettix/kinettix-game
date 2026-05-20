import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route - Proxy to fetch sheet data securely and bypass browser CORS limits
  app.get("/api/sheet-data", async (req, res) => {
    try {
      console.log("Fetching Google Sheets Apps Script data...");
      
      // Set explicit non-caching headers to bypass any browser, CDN, or nginx caching
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      
      // Plain updated Google Sheet web app URL (as requested and tested successfully)
      const sheetUrl = "https://script.google.com/macros/s/AKfycbxrEM1HxxFXPRgd0Nw0J4PN8IyDjU_qs8wK-vFjJ1kIDyBOmPDCM0rRSZvorcZRpwa1/exec";
      
      // Append a cache-buster parameter to ensure Google Apps Script fetches the live data
      const separator = sheetUrl.includes("?") ? "&" : "?";
      const freshSheetUrl = `${sheetUrl}${separator}t=${Date.now()}`;
      
      const response = await fetch(freshSheetUrl, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(`Google Apps Script returned status ${response.status}`);
      }

      const rawText = await response.text();
      console.log("Successfully fetched raw text from Google Sheets Apps Script:", rawText);
      
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError: any) {
        throw new Error(`Failed to parse Apps Script response as JSON: ${parseError.message}. Response was: ${rawText}`);
      }

      console.log("Parsed Google Sheets Apps Script data:", data);

      if (data && typeof data === "object" && "error" in data) {
        throw new Error(`Google Sheets returned an error: ${data.error || JSON.stringify(data)}`);
      }

      // Explicitly normalize keys to: text, keyword, code, enabled in that exact sequence
      let rawList: any[] = [];
      if (Array.isArray(data)) {
        rawList = data;
      } else if (data && typeof data === "object") {
        const matchingKey = Object.keys(data).find(k => Array.isArray(data[k]));
        if (matchingKey) rawList = data[matchingKey];
      }

      const sequencedData = rawList.map((item: any) => {
        const rawEnabled = item.enabled !== undefined ? item.enabled : (item.Enabled !== undefined ? item.Enabled : true);
        const isEnabled = String(rawEnabled).toLowerCase().trim() === "true" || 
                          String(rawEnabled).toLowerCase().trim() === "yes" || 
                          String(rawEnabled).toLowerCase().trim() === "1" || 
                          rawEnabled === true;
        // Build object in the exact requested key sequence: text, keyword, code, enabled
        return {
          text: String(item.text || item.Text || "").trim(),
          keyword: String(item.keyword || item.Keyword || "").trim(),
          code: String(item.code || item.Code || "").trim(),
          enabled: isEnabled
        };
      });

      res.json(sequencedData);
    } catch (error: any) {
      console.error("Error proxying Google Sheets Apps Script data:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route - Simple health check endpoint for node validation
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Serve Vite app based on environment
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting Express server:", err);
});
