/*
 * Context for sharing data across the 3-step create flow.
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
}

export interface ContentStrategy {
  noteType: string;
  toneStyle: string;
  perspective: string;
  heatLevel: number;
  generateCount: number;
  autoTags: boolean;
}

interface CreateContextType {
  productInfo: ProductInfo;
  setProductInfo: (info: ProductInfo) => void;
  contentStrategy: ContentStrategy;
  setContentStrategy: (strategy: ContentStrategy) => void;
}

const defaultProductInfo: ProductInfo = {
  name: "XX 品牌温和氨基酸洁面 100ml",
  sellingPoints: ["温和", "小红瓶", "学生党"],
  targetAudience: ["敏感肌", "学生"],
  wordCount: "300 – 450 字",
  priceRange: "¥59 – 79",
  competitorLinks: "",
  importFromLibrary: false,
};

const defaultContentStrategy: ContentStrategy = {
  noteType: "种草推荐",
  toneStyle: "亲切",
  perspective: "第一人称",
  heatLevel: 50,
  generateCount: 2,
  autoTags: true,
};

const CreateContext = createContext<CreateContextType | null>(null);

export function CreateProvider({ children }: { children: ReactNode }) {
  const [productInfo, setProductInfo] = useState<ProductInfo>(defaultProductInfo);
  const [contentStrategy, setContentStrategy] = useState<ContentStrategy>(defaultContentStrategy);

  return (
    <CreateContext.Provider
      value={{ productInfo, setProductInfo, contentStrategy, setContentStrategy }}
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
