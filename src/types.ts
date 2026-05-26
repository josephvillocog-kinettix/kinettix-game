export interface SheetRow {
  Text: string;
  Keyword: string;
  Code: string;
  Enabled: boolean | string;
  Text2?: string;
  Keyword2?: string;
}

export interface ApiResponse {
  error?: string;
  data?: SheetRow[];
}

export type AppView = "list" | "challenge" | "unlocked";
