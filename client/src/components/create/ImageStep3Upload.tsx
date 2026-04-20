/*
 * 图片编辑 - 步骤 3: 上传配图
 * 管理配图顺序，第1位为封面，支持拖拽上传配图
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  Save,
  Check,
  X,
  Info,
  Lightbulb,
  Pen,
} from "lucide-react";
import { useCreateContext, type SupportImage } from "@/contexts/CreateContext";
import { toast } from "sonner";

const DEFAULT_LABELS = ["产品细节图", "成分对比", "使用场景", "效果展示", "包装细节"];

const MOCK_SUPPORT_IMAGES: SupportImage[] = [
  { url: "https://placehold.co/300x400/f0f4ff/6b7280?text=product-1.jpg", label: "产品细节图" },
  { url: "https://placehold.co/300x400/f0f4ff/6b7280?text=compare.jpg", label: "成分对比" },
  { url: "https://placehold.co/300x400/f0f4ff/6b7280?text=scene.jpg", label: "使用场景" },
];

interface ImageStep3UploadProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ImageStep3Upload({ onNext, onBack }: ImageStep3UploadProps) {
  const { imageConfig, setImageConfig } = useCreateContext();

  const [supportImages, setSupportImages] = useState<SupportImage[]>(
    imageConfig.supportImages.length > 0 ? imageConfig.supportImages : MOCK_SUPPORT_IMAGES
  );

  const totalImages = 1 + supportImages.length; // 封面 + 配图

  const handleUpload = () => {
    if (supportImages.length >= 8) {
      toast.error("最多上传 8 张配图");
      return;
    }
    const nextLabel = DEFAULT_LABELS[supportImages.length] || `配图 ${supportImages.length + 1}`;
    const mockUrl = `https://placehold.co/300x400/f0f4ff/6b7280?text=img-${supportImages.length + 1}.jpg`;
    setSupportImages([...supportImages, { url: mockUrl, label: nextLabel }]);
    toast.success("配图上传成功");
  };

  const removeImage = (index: number) => {
    setSupportImages(supportImages.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setImageConfig({
      ...imageConfig,
      supportImages,
    });
    onNext();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left: Content (3/5) */}
      <div className="lg:col-span-3 space-y-7">
        {/* Section header */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">上传配图</h2>
          <p className="text-[11px] text-muted-foreground">
            推荐 3-5 张配图，拖拽调整顺序，第 1 位已是你设计的封面
          </p>
        </div>

        {/* Recommendation info */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            <span className="font-semibold">推荐配图顺序：</span>产品细节图 → 使用前后 / 成分 / 卖点图 → 使用场景图。3-6 张是黄金数量，太少显得敷衍，太多让人疲劳。
          </p>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Cover (slot 1) - always present */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-primary bg-primary/5">
            <div className="w-full h-full flex flex-col items-center justify-center p-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary text-center leading-tight">
                {imageConfig.mainText || "封面图"}
              </span>
              {imageConfig.subText && (
                <span className="text-[10px] text-primary/70 mt-0.5">{imageConfig.subText}</span>
              )}
            </div>
            {/* Number badge */}
            <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              1
            </span>
            {/* Status label */}
            <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-medium">
              封面 · 已完成
            </div>
          </div>

          {/* Support images */}
          {supportImages.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border/60 bg-secondary/20 group"
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {/* Number badge */}
              <span className="absolute top-2 left-2 w-5 h-5 rounded-md bg-foreground/70 text-white text-[10px] font-bold flex items-center justify-center">
                {i + 2}
              </span>
              {/* Remove button */}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                <span className="text-[10px] text-white font-medium">{img.label}</span>
              </div>
            </div>
          ))}

          {/* Add buttons for empty slots */}
          {supportImages.length < 8 && (
            <>
              <button
                onClick={handleUpload}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[10px]">添加第 {supportImages.length + 2} 张</span>
              </button>
              {supportImages.length < 7 && (
                <button
                  onClick={handleUpload}
                  className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-[10px]">添加第 {supportImages.length + 3} 张</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Upload status bar */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-white">
          <span className="text-sm text-muted-foreground">
            已上传 <span className="font-bold text-foreground">{supportImages.length}</span> 张配图，加上封面共{" "}
            <span className="font-bold text-foreground">{totalImages}</span> 张，建议 3-6 张最佳
          </span>
          <Button variant="outline" size="sm" className="bg-white" onClick={handleUpload}>
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            批量上传
          </Button>
        </div>
      </div>

      {/* Right: Tips (2/5) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="lg:col-span-2 space-y-5"
      >
        {/* Shooting tips */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-warm-orange/10 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-warm-orange" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              配图拍摄建议
            </span>
          </div>
          <div className="space-y-3">
            <TipItem
              title="光线自然，避免强逆光"
              text="自然光下的产品更真实，符合小红书用户审美"
            />
            <TipItem
              title="留白不要过多"
              text="信息流中图片较小，产品占画面 60% 以上辨识度最高"
            />
            <TipItem
              title="对比图用同机位"
              text="用前/用后同角度、同光线，说服力更强"
            />
          </div>
        </div>

        {/* Advanced editing hint */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex items-start gap-2">
            <Pen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">需要加文字、换背景？</p>
              <p className="text-[11px] text-blue-600/80 leading-relaxed">
                可在<span className="font-medium text-blue-600 underline underline-offset-2 cursor-pointer">进阶图片编辑器</span>中为配图加文字标注、调色、加贴纸等
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
            onClick={handleNext}
          >
            下一步：合成预览
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              className="bg-white"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              返回封面编辑
            </Button>
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => toast.success("草稿已保存")}
            >
              <Save className="w-4 h-4 mr-1.5" />
              保存草稿
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TipItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/40">
      <div className="text-xs font-semibold text-foreground mb-1">{title}</div>
      <div className="text-[11px] text-muted-foreground leading-relaxed">{text}</div>
    </div>
  );
}
