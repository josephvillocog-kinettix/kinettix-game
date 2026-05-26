function decryptField(cipherText: string, key: string = "Kinettix"): string {
  if (!cipherText) return "";
  const str = cipherText.trim();
  if (str.length === 0) return "";

  try {
    let binary = "";
    if (typeof Buffer !== "undefined") {
      binary = Buffer.from(str, "base64").toString("binary");
    } else if (typeof atob !== "undefined") {
      binary = atob(str);
    } else {
      return cipherText;
    }

    let decryptedXOR = "";
    for (let i = 0; i < binary.length; i++) {
      const charCode = binary.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decryptedXOR += String.fromCharCode(charCode);
    }

    return decryptedXOR;
  } catch (err: any) {
    return "Error: " + err.message;
  }
}

const text2 = "HwELRRoREQxrCgIQEVQLHScGAAIHVB0Xax0GAFQdGhQqBwpFFxwAHS1JGQ0bBwxYKBsLBAAdHxE/EE4CAR0NHS9JGg0RVB0KIgsLS1Q8DFgjDAIVERBJFC4ICkUAHAxYPwwPCFhUDR04AAkLERBJDCMMThUbBx0LaxoGBAYRDVgkB04RHBFJGyQEHgQaDeKBsAtrLw8GERYGFyBJHgQTEUVYKgcKRRcGCB4/DApFABwMWB8ABQxZHQcLOwAcABBUGhAiGxoWVAABGT9JDQQGBhBYPwELRQcEAAoiHU4KElQdEC5JCxMRGh1Way4bAAcHSQwjDE4GHB0MHmsLCw0dGg1YPwELRQAGABou4oGwHUUQERoRLAcdSVQVGQg5Bg8GHFQBESZFTgQaEEkBJBwcRQYRHhk5DU4WHBUFFGsLC0UNGxwKOEc=";
const keyword2 = "OwgbCRs=";

console.log("Decrypted text2:", decryptField(text2));
console.log("Decrypted keyword2:", decryptField(keyword2));
