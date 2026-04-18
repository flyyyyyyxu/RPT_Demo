/*
 * Step 3: 图片生成
 * 小红书笔记图片生成/管理页面
 * 三种模式：AI 生成宣传图 / 上传宣传图 / 上传后 AI 修改
 * 考虑小红书图片特性：
 * - 封面图（3:4 竖版最佳）
 * - 正文配图（1:1 或 3:4）
 * - 文字叠加、滤镜风格
 * - 图片数量 1-9 张
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Upload,
  Wand2,
  Image as ImageIcon,
  Paintbrush,
  LayoutGrid,
  X,
  Plus,
  RefreshCw,
  Check,
  Eye,
  Download,
  Loader2,
  Camera,
  Palette,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";

const IMAGE_MODES = [
  {
    id: "ai-generate" as const,
    icon: Sparkles,
    title: "AI 生成宣传图",
    desc: "基于商品图和卖点，AI 自动生成小红书风格宣传图",
  },
  {
    id: "upload" as const,
    icon: Upload,
    title: "上传宣传图",
    desc: "直接上传已有的产品图或宣传素材",
  },
  {
    id: "edit" as const,
    icon: Wand2,
    title: "上传后 AI 修改",
    desc: "上传图片后，AI 帮你优化构图、添加文字、调整风格",
  },
];

const COVER_STYLES = [
  { id: "product-real", label: "产品实拍风", desc: "干净背景 + 产品特写" },
  { id: "lifestyle", label: "生活场景风", desc: "融入使用场景的氛围感" },
  { id: "flat-lay", label: "平铺摆拍风", desc: "俯拍角度 + 精致摆放" },
  { id: "comparison", label: "前后对比风", desc: "使用前后效果对比" },
  { id: "text-overlay", label: "文字海报风", desc: "大字标题 + 产品图" },
  { id: "collage", label: "拼图九宫格", desc: "多角度展示产品细节" },
];

const ASPECT_RATIOS = [
  { id: "3:4", label: "3:4", desc: "竖版（推荐封面）", recommended: true },
  { id: "1:1", label: "1:1", desc: "方形（配图通用）", recommended: false },
  { id: "4:3", label: "4:3", desc: "横版（对比图）", recommended: false },
];

const FILTER_STYLES = [
  "原图", "奶油感", "胶片感", "清冷感", "暖阳感", "高级灰",
];

// Mock generated images
const MOCK_GENERATED = [
  "https://placehold.co/360x480/fff5f5/e8445a?text=AI+Generated+1",
  "https://placehold.co/360x480/f0f5ff/4a6cf7?text=AI+Generated+2",
  "https://placehold.co/360x480/f5fff5/22c55e?text=AI+Generated+3",
];

export default function CreateStep3Images() {
  const [, navigate] = useLocation();
  const { imageConfig, setImageConfig, productInfo } = useCreateContext();

  const [mode, setMode] = useState<"ai-generate" | "upload" | "edit">(imageConfig.mode);
  const [coverStyle, setCoverStyle] = useState(imageConfig.coverStyle);
  const [aspectRatio, setAspectRatio] = useState(imageConfig.aspectRatio);
  const [imageCount, setImageCount] = useState(imageConfig.imageCount);
  const [filterStyle, setFilterStyle] = useState("原图");
  const [addText, setAddText] = useState(true);
  const [textContent, setTextContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>(imageConfig.uploadedImages);
  const [generatedImages, setGeneratedImages] = useState<string[]>(imageConfig.generatedImages);
  const [generating, setGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedImages(MOCK_GENERATED.slice(0, imageCount));
      setGenerating(false);
      toast.success(`已生成 ${imageCount} 张图片`);
    }, 3000);
  };

  const handleUpload = () => {
    const mockUrl = `https://placehold.co/360x480/fef3c7/d97706?text=Uploaded+${uploadedImages.length + 1}`;
    setUploadedImages([...uploadedImages, mockUrl]);
    toast.success("图片上传成功");
  };

  const toggleImageSelect = (index: number) => {
    const newSet = new Set(selectedImages);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedImages(newSet);
  };

  const allImages = mode === "upload" ? uploadedImages : generatedImages;

  const handleNext = () => {
    setImageConfig({
      mode,
      coverStyle,
      aspectRatio,
      imageCount,
      uploadedImages,
      generatedImages,
    });
    navigate("/create/result");
  };

  return (
    <CreateLayout currentStep={3} costCredits={mode === "ai-generate" ? 1 : 0}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">图片生成</h1>
          <p className="text-sm text-muted-foreground">
            为笔记准备封面图和配图。小红书封面推荐 3:4 竖版，配图建议 3-6 张。
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Config (3/5) */}
          <div className="lg:col-span-3 space-y-7">
            {/* Mode selection */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">选择方式</label>
              <div className="grid grid-cols-3 gap-3">
                {IMAGE_MODES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        mode === m.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/60 bg-white hover:border-primary/20"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${mode === m.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-sm font-bold mb-0.5">{m.title}</div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Generate mode config */}
            {mode === "ai-generate" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Cover style */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    图片风格
                    <span className="text-[11px] font-normal text-muted-foreground/60 ml-2">选择最适合你商品的展示方式</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {COVER_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setCoverStyle(style.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          coverStyle === style.id
                            ? "border-primary bg-primary/5"
                            : "border-border/60 bg-white hover:border-primary/20"
                        }`}
                      >
                        <div className="text-sm font-medium">{style.label}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect ratio */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">图片比例</label>
                  <div className="flex gap-3">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                          aspectRatio === ratio.id
                            ? "border-primary bg-primary/5"
                            : "border-border/60 bg-white hover:border-primary/20"
                        }`}
                      >
                        <div className="text-lg font-bold mb-0.5">{ratio.label}</div>
                        <div className="text-[11px] text-muted-foreground">{ratio.desc}</div>
                        {ratio.recommended && (
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            推荐
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image count */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-foreground">生成数量</label>
                    <span className="text-sm font-bold text-primary">{imageCount} 张</span>
                  </div>
                  <Slider
                    value={[imageCount]}
                    onValueChange={([v]) => setImageCount(v)}
                    min={1}
                    max={9}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                    <span>1 张</span>
                    <span>9 张</span>
                  </div>
                </div>

                {/* Filter style */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    滤镜风格
                    <span className="text-[11px] font-normal text-muted-foreground/60 ml-2">统一图片色调</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_STYLES.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterStyle(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          filterStyle === f
                            ? "bg-primary/10 text-primary border-primary/25 shadow-sm"
                            : "bg-white text-foreground/60 border-border hover:border-primary/20 hover:bg-primary/5"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text overlay toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-white">
                  <div>
                    <span className="text-sm font-medium">封面添加文字</span>
                    <span className="text-[11px] text-muted-foreground/60 ml-2">自动提取标题关键词</span>
                  </div>
                  <Switch checked={addText} onCheckedChange={setAddText} />
                </div>
                {addText && (
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="自定义封面文字（留空则自动生成）"
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                  />
                )}

                {/* Generate button */}
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 py-6 text-base"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI 正在生成图片...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      生成 {imageCount} 张图片
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Upload mode */}
            {mode === "upload" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/30 transition-colors">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm font-medium mb-1">拖拽图片到这里，或点击上传</p>
                  <p className="text-xs text-muted-foreground mb-4">支持 JPG、PNG、WEBP，单张不超过 10MB</p>
                  <Button variant="outline" onClick={handleUpload}>
                    <Upload className="w-4 h-4 mr-1.5" />
                    选择图片
                  </Button>
                </div>

                {uploadedImages.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">
                      已上传 {uploadedImages.length} 张
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative aspect-[3/4] rounded-xl border border-border/60 overflow-hidden group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          {i === 0 && (
                            <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-medium">
                              封面
                            </div>
                          )}
                        </div>
                      ))}
                      {uploadedImages.length < 9 && (
                        <button
                          onClick={handleUpload}
                          className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                        >
                          <Plus className="w-6 h-6" />
                          <span className="text-xs">添加</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Edit mode */}
            {mode === "edit" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/30 transition-colors">
                  <Paintbrush className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm font-medium mb-1">上传需要 AI 修改的图片</p>
                  <p className="text-xs text-muted-foreground mb-4">AI 将优化构图、添加文字、调整色调</p>
                  <Button variant="outline" onClick={handleUpload}>
                    <Upload className="w-4 h-4 mr-1.5" />
                    选择图片
                  </Button>
                </div>

                {uploadedImages.length > 0 && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-3 block">AI 修改选项</label>
                      <div className="space-y-2.5">
                        {[
                          { label: "优化构图", desc: "自动裁剪到最佳构图" },
                          { label: "添加文字", desc: "在图片上叠加标题或卖点" },
                          { label: "统一色调", desc: "让多张图片风格一致" },
                          { label: "去除背景", desc: "提取产品主体，替换干净背景" },
                        ].map((opt) => (
                          <div key={opt.label} className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-white">
                            <div>
                              <span className="text-sm font-medium">{opt.label}</span>
                              <span className="text-[11px] text-muted-foreground/60 ml-2">{opt.desc}</span>
                            </div>
                            <Switch defaultChecked={opt.label === "优化构图"} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 py-6 text-base"
                      onClick={() => {
                        setGenerating(true);
                        setTimeout(() => {
                          setGeneratedImages(MOCK_GENERATED.slice(0, uploadedImages.length));
                          setGenerating(false);
                          toast.success("AI 修改完成");
                        }, 2500);
                      }}
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          AI 正在修改...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          开始 AI 修改
                        </>
                      )}
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => navigate("/create/strategy")}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                返回上一步
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-white"
                  onClick={handleNext}
                >
                  跳过，稍后添加
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 px-6"
                  onClick={handleNext}
                  disabled={allImages.length === 0 && mode !== "upload"}
                >
                  下一步：生成预览
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Preview & Tips (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Generated images preview */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">图片预览</span>
              </div>

              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 flex flex-col items-center gap-3"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                    </div>
                    <p className="text-sm font-medium">AI 正在创作中...</p>
                    <p className="text-xs text-muted-foreground">预计 10-30 秒</p>
                    <div className="w-full max-w-[200px] h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "90%" }}
                        transition={{ duration: 3, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ) : allImages.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="grid grid-cols-2 gap-2.5">
                      {allImages.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => toggleImageSelect(i)}
                          className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            selectedImages.has(i)
                              ? "border-primary shadow-md"
                              : "border-transparent hover:border-primary/20"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          {selectedImages.has(i) && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {i === 0 && (
                            <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-medium">
                              封面
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white"
                        onClick={handleGenerate}
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        重新生成
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white"
                        onClick={() => toast.info("Feature coming soon")}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        下载全部
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-10 text-center"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-secondary/60 flex items-center justify-center">
                      <ImageIcon className="w-7 h-7 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">暂无图片</p>
                    <p className="text-xs text-muted-foreground/60">
                      {mode === "ai-generate" ? "配置参数后点击生成" : "上传图片后预览"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">小红书图片指南</span>
              </div>
              <div className="space-y-3">
                <TipItem
                  title="封面图决定点击率"
                  text="3:4 竖版封面在信息流中占比最大，点击率比横版高 40%"
                />
                <TipItem
                  title="图片数量 3-6 张最佳"
                  text="太少信息不足，太多用户疲劳。详情图 + 效果图 + 使用场景图是黄金组合"
                />
                <TipItem
                  title="封面文字要大且醒目"
                  text="小红书用户在信息流中快速滑动，封面文字建议 6-12 个字，字号要大"
                />
                <TipItem
                  title="统一色调提升专业感"
                  text="同一篇笔记的图片保持统一滤镜和色调，让内容看起来更精致"
                />
              </div>
            </div>

            {/* Product images from Step1 */}
            {productInfo.productImages.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold">已有商品图</span>
                  <span className="text-[11px] text-muted-foreground">来自 Step 1</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {productInfo.productImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border/40">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </CreateLayout>
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
