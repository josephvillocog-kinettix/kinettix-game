// Secure serverless function to proxy Google Sheets Apps Script data on Vercel deployments.

// Robust Base64 + Repeating-key XOR Decryption with fallback compatibility
function decryptField(cipherText: string, key: string = "Kinettix"): string {
  if (!cipherText) return "";
  const str = cipherText.trim();
  if (str.length === 0) return "";

  // Base64 regex check for valid base64 pattern (ignoring brief non-base64 characters)
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})?$/;
  if (str.length < 3 || !base64Regex.test(str)) {
    return cipherText;
  }

  try {
    let binary = "";
    if (typeof Buffer !== "undefined") {
      binary = Buffer.from(str, "base64").toString("binary");
    } else if (typeof atob !== "undefined") {
      binary = atob(str);
    } else {
      return cipherText;
    }

    // Try XOR decryption with repeating key "Kinettix"
    let decryptedXOR = "";
    for (let i = 0; i < binary.length; i++) {
      const charCode = binary.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decryptedXOR += String.fromCharCode(charCode);
    }

    // Validate if XOR decryption result yields only printable characters
    let isPrintable = true;
    for (let i = 0; i < decryptedXOR.length; i++) {
      const code = decryptedXOR.charCodeAt(i);
      // Clean ASCII printable range space (32) to tilde (126), plus common spacing: Tab (9), LF (10), CR (13)
      if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code > 126) {
        isPrintable = false;
        break;
      }
    }

    if (isPrintable && decryptedXOR.length > 0) {
      return decryptedXOR;
    }

    // Rollback 1: Try base64 decoding alone (case where Google Sheet encoded plain text directly)
    let plainBase64 = "";
    try {
      if (typeof Buffer !== "undefined") {
        plainBase64 = Buffer.from(str, "base64").toString("utf8");
      } else if (typeof atob !== "undefined") {
        plainBase64 = decodeURIComponent(escape(atob(str)));
      }
    } catch {
      plainBase64 = "";
    }

    let isPlainPrintable = true;
    if (plainBase64.length > 0) {
      for (let i = 0; i < plainBase64.length; i++) {
        const code = plainBase64.charCodeAt(i);
        if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code > 126) {
          isPlainPrintable = false;
          break;
        }
      }
    } else {
      isPlainPrintable = false;
    }

    if (isPlainPrintable) {
      return plainBase64;
    }

    return cipherText;
  } catch (err) {
    return cipherText;
  }
}

export default async function handler(req: any, res: any) {
  // Support primarily GET requests
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", ["GET", "HEAD"]);
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const sheetUrl = "https://script.google.com/macros/s/AKfycbxi1CJQrLEgDvM2xgQQSeEWfDrR3MbRtLlz3zUGtA7Ll1SX26htKXGKktUU8cEPqVRu/exec";
    
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
      // Build object and return raw key fields (text, keyword, code) to be decrypted in client
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
