/*
 * 图片编辑 - 步骤 4: 合成预览
 * 展示最终图片组合、整组评分、优化建议
 */
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Pen,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Star,
} from "lucide-react";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface ImageStep4PreviewProps {
  onBack: () => void;
}

export default function ImageStep4Preview({ onBack }: ImageStep4PreviewProps) {
  const [, navigate] = useLocation();
  const { imageConfig } = useCreateContext();

  const coverImage = imageConfig.generatedImages[0] || "https://placehold.co/300x400/ffe0e6/e8445a?text=Cover";
  const supportImages = imageConfig.supportImages.length > 0
    ? imageConfig.supportImages
    : [
        { url: "https://placehold.co/300x400/f0f4ff/6b7280?text=product-1.jpg", label: "产品细节图" },
        { url: "https://placehold.co/300x400/f0f4ff/6b7280?text=compare.jpg", label: "成分对比" },
        { url: "https://placehold.co/300x400/f0f4ff/6b7280?text=scene.jpg", label: "使用场景" },
      ];

  const mainTextStyleLabel = (() => {
    const map: Record<string, string> = {
      "bold-shadow": "粗体",
      "stroke": "描边",
      "gradient": "渐变",
      "sticker": "贴纸",
    };
    return map[imageConfig.mainTextStyle] || "粗体";
  })();

  const subTextStyleLabel = (() => {
    const map: Record<string, string> = {
      "handwrite": "手写",
      "minimal": "简约",
      "bold": "粗体",
      "sticker": "贴纸",
    };
    return map[imageConfig.subTextStyle] || "手写";
  })();

  const handleFinish = () => {
    navigate("/create/result");
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left: Preview (3/5) */}
      <div className="lg:col-span-3 space-y-7">
        {/* Section header */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">合成预览</h2>
          <p className="text-[11px] text-muted-foreground">
            以下是最终发布到小红书的完整图片组，按左上角序号排列
          </p>
        </div>

        {/* Image preview grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Cover */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-primary bg-primary/5">
            <img src={coverImage} alt="" className="w-full h-full object-cover" />
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-black/10">
              <span className="text-white text-sm font-bold text-center drop-shadow-lg leading-tight">
                {imageConfig.mainText || "姐妹们!这瓶我回购3次了"}
              </span>
              {imageConfig.subText && (
                <span className="text-white/80 text-[10px] mt-1 drop-shadow-md">
                  {imageConfig.subText}
                </span>
              )}
            </div>
            {/* Number badge */}
            <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              1
            </span>
            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2.5 pt-6">
              <p className="text-[10px] text-white/90 leading-relaxed">
                {imageConfig.aspectRatio || "3:4"} · 主文字{mainTextStyleLabel} + 副标题{subTextStyleLabel}
              </p>
            </div>
          </div>

          {/* Support images */}
          {supportImages.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border/60 bg-secondary/20"
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {/* Number badge */}
              <span className="absolute top-2 left-2 w-5 h-5 rounded-md bg-foreground/70 text-white text-[10px] font-bold flex items-center justify-center">
                {i + 2}
              </span>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2.5 pt-6">
                <p className="text-[10px] text-white font-medium">{img.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons per image */}
        <div className="grid grid-cols-4 gap-3">
          {/* Cover actions */}
          <div className="flex gap-1.5">
            <button
              onClick={() => toast.info("编辑封面")}
              className="flex-1 py-1.5 rounded-lg border border-border/60 bg-white text-[10px] font-medium text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-1"
            >
              <Pen className="w-3 h-3" />
              编辑
            </button>
            <button
              onClick={() => toast.info("换一版")}
              className="flex-1 py-1.5 rounded-lg border border-border/60 bg-white text-[10px] font-medium text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              换一版
            </button>
            <button
              onClick={() => toast.info("下载")}
              className="py-1.5 px-2 rounded-lg border border-border/60 bg-white text-[10px] font-medium text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
          {/* Support image actions */}
          {supportImages.map((_, i) => (
            <div key={i} className="flex gap-1.5">
              <button
                onClick={() => toast.info("加文字")}
                className="flex-1 py-1.5 rounded-lg border border-border/60 bg-white text-[10px] font-medium text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-1"
              >
                <Pen className="w-3 h-3" />
                加文字
              </button>
              <button
                onClick={() => toast.info("下载")}
                className="py-1.5 px-2 rounded-lg border border-border/60 bg-white text-[10px] font-medium text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Advanced editing hint */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
          <Pen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            <span className="font-semibold">需要更精细调整？</span>打开<span className="font-medium text-blue-600 underline underline-offset-2 cursor-pointer">进阶图片编辑器</span>可自由调整文字位置、字号、颜色、加贴纸、换背景、统一滤镜等，商家常用的自定义能力都在这里
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            className="bg-white"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            返回上传配图
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => toast.info("打开进阶编辑器")}
            >
              <Pen className="w-4 h-4 mr-1.5" />
              打开进阶编辑器
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 px-6"
              onClick={handleFinish}
            >
              完成 · 生成笔记
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right: Scoring + Suggestions (2/5) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="lg:col-span-2 space-y-5"
      >
        {/* Overall score */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">整组评分</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-4 rounded-xl border border-border/60 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">综合预测</div>
              <div className="text-2xl font-bold text-emerald-600">A+</div>
            </div>
            <div className="p-4 rounded-xl border border-border/60 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">预测点赞</div>
              <div className="text-2xl font-bold text-primary">1.4k</div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            基于同类目最近 30 天爆款数据估算，仅供参考
          </p>
        </div>

        {/* Optimization suggestions */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <span className="text-sm font-bold mb-4 block">优化建议</span>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-emerald-700">封面文字字数合适</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-emerald-700">图片数量在黄金区间</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/50">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-700">建议为配图加文字标注，提升收藏率</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
