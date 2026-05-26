export interface SheetRow {
  Text: string;
  Keyword: string;
  Code: string;
  Enabled: boolean | string;
}

export interface ApiResponse {
  error?: string;
  data?: SheetRow[];
}

export type AppView = "list" | "challenge" | "unlocked";
