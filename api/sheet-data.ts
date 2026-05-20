// Secure serverless function to proxy Google Sheets Apps Script data on Vercel deployments.

export default async function handler(req: any, res: any) {
  // Support primarily GET requests
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", ["GET", "HEAD"]);
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const sheetUrl = "https://script.google.com/macros/s/AKfycbxrEM1HxxFXPRgd0Nw0J4PN8IyDjU_qs8wK-vFjJ1kIDyBOmPDCM0rRSZvorcZRpwa1/exec";
    
    const response = await fetch(sheetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
      }
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script returned status ${response.status}`);
    }

    const rawText = await response.text();
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError: any) {
      throw new Error(`Failed to parse Apps Script response as JSON: ${parseError.message}`);
    }

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

    // Add browser cache or simple CORS head-room if helpful
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Content-Type", "application/json");
    
    res.status(200).json(sequencedData);
  } catch (error: any) {
    console.error("Vercel Serverless Function error fetching from Google Sheets:", error.message);
    res.status(500).json({ error: error.message });
  }
}
