export interface NoteVersion {
  id: string;
  label: string;
  style: string;
  stars: number;
  title: string;
  wordCount: number;
  topicCount: number;
  body: string;
  tags: string[];
  metrics: {
    hotWords: number;
    sentiment: number;
    predictLikes: string;
    riskWords: number;
  };
  suggestion: string;
}

export interface GenerateNotesRequest {
  productInfo: {
    name: string;
    description?: string;
    productKeywords?: string[];
    sellingPoints: string[];
    targetAudience: string[];
    wordCount: string;
    priceRange: string;
    category?: string;
    subcategory?: string;
    usageScenarios?: string[];
  };
  contentStrategy: {
    noteType: string;
    toneStyle: string;
    titleStyle: string;
    articleStyle: string;
    bodyStyle: string;
    customHighlights: string;
    customToneNotes: string;
    customAvoidances: string;
    emotionLevel: number;
    rhythmLevel: number;
  };
  selectedInsights?: CompetitorInsightItem[];
}

export interface GenerateNotesResponse {
  versions: NoteVersion[];
  error?: string;
}

export interface CompetitorInsightItem {
  label: string;
  detail: string;
  status: "adopted" | "pending" | "dismissed";
}

export interface CompetitorInsightRequest {
  competitorLinks: string;
  productName: string;
  productDescription?: string;
  productKeywords?: string[];
  sellingPoints: string[];
  category?: string;
  subcategory?: string;
  usageScenarios?: string[];
}

export interface CompetitorInsightInferredRequest {
  productName: string;
  productDescription?: string;
  productKeywords?: string[];
  sellingPoints: string[];
  targetAudience?: string[];
  category?: string;
  subcategory?: string;
  usageScenarios?: string[];
  priceRange?: string;
}

export interface CompetitorInsightResponse {
  insights: CompetitorInsightItem[];
  error?: string;
}
