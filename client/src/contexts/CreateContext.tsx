/*
 * Context for sharing data across the 4-step create flow.
 * Steps: 商品信息 → 内容策略 → 图片生成 → 生成预览
 * Persists form state so users can go back/forward without losing data.
 */
import { createContext, useContext, useState, type ReactNode } from "react";

export interface ProductInfo {
  name: string;
  sellingPoints: string[];
  targetAudience: string[];
  wordCount: string;
  priceRange: string;
  competitorLinks: string;
  importFromLibrary: boolean;
  productImages: string[]; // uploaded product image URLs
  competitorInsight: CompetitorInsight | null;
}

export interface CompetitorInsight {
  generated: boolean;
  items: InsightItem[];
}

export interface InsightItem {
  label: string;
  detail: string;
  status: "adopted" | "pending" | "dismissed";
}

export interface ContentStrategy {
  noteType: string;
  toneStyle: string;
  titleStyle: string;
  articleStyle: string;
  emotionLevel: number;  // 情绪浓度: 0-100
  rhythmLevel: number;   // 节奏感: 0-100
  generateCount: number;
  autoTags: boolean;
}

export interface ImageGenConfig {
  mode: "ai-generate" | "upload" | "edit";
  coverStyle: string;
  aspectRatio: string;
  imageCount: number;
  uploadedImages: string[];
  generatedImages: string[];
}

interface CreateContextType {
  productInfo: ProductInfo;
  setProductInfo: (info: ProductInfo) => void;
  contentStrategy: ContentStrategy;
  setContentStrategy: (strategy: ContentStrategy) => void;
  imageConfig: ImageGenConfig;
  setImageConfig: (config: ImageGenConfig) => void;
}

const defaultProductInfo: ProductInfo = {
  name: "XX 品牌温和氨基酸洁面 100ml",
  sellingPoints: ["温和", "小红瓶", "学生党"],
  targetAudience: ["敏感肌", "学生"],
  wordCount: "300 – 450 字",
  priceRange: "¥59 – 79",
  competitorLinks: "",
  importFromLibrary: false,
  productImages: [],
  competitorInsight: null,
};

const defaultContentStrategy: ContentStrategy = {
  noteType: "种草推荐",
  toneStyle: "闺蜜安利感",
  titleStyle: "情绪共鸣型",
  articleStyle: "痛点式",
  emotionLevel: 50,
  rhythmLevel: 50,
  generateCount: 2,
  autoTags: true,
};

const defaultImageConfig: ImageGenConfig = {
  mode: "ai-generate",
  coverStyle: "产品实拍风",
  aspectRatio: "3:4",
  imageCount: 3,
  uploadedImages: [],
  generatedImages: [],
};

const CreateContext = createContext<CreateContextType | null>(null);

export function CreateProvider({ children }: { children: ReactNode }) {
  const [productInfo, setProductInfo] = useState<ProductInfo>(defaultProductInfo);
  const [contentStrategy, setContentStrategy] = useState<ContentStrategy>(defaultContentStrategy);
  const [imageConfig, setImageConfig] = useState<ImageGenConfig>(defaultImageConfig);

  return (
    <CreateContext.Provider
      value={{
        productInfo, setProductInfo,
        contentStrategy, setContentStrategy,
        imageConfig, setImageConfig,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
}

export function useCreateContext() {
  const ctx = useContext(CreateContext);
  if (!ctx) throw new Error("useCreateContext must be used within CreateProvider");
  return ctx;
}
