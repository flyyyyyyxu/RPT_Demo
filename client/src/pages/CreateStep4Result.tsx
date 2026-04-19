/*
 * Step 4: 生成预览
 * Layout per reference screenshot:
 * Row 1: 3 version summary cards (horizontal)
 * Row 2: 3 feed preview cards with edit button (horizontal)
 * Row 3: 3 AI insight panels (horizontal)
 * Row 4: Quick tweak bar (spans all 3 columns)
 * 
 * Changes:
 * - 6.1 Three versions laid out horizontally
 * - 6.2 手动编辑 → 再生成一版（消耗1额度）
 * - 6.3 再次生成 → 重新生成（消耗2额度）
 * - 6.4 卡片视角旁有编辑按钮
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Star,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Shield,
  Sparkles,
  Edit3,
  RefreshCw,
  Send,
  Save,
  Clock,
  ChevronRight,
  Zap,
  BarChart3,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";

interface VersionData {
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


const QUICK_TWEAKS = [
  "更口语化",
  "加一段使用前后对比",
  "结尾改成问句",
  "自定义",
];

export default function CreateStep4Result() {
  const [, navigate] = useLocation();
  const { productInfo, contentStrategy } = useCreateContext();
  const [activeVersion, setActiveVersion] = useState(0);
  const [tweakVersion, setTweakVersion] = useState(0);
  const [customTweak, setCustomTweak] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [versions, setVersions] = useState<VersionData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [genError, setGenError] = useState<string | null>(null);

  const generateNotes = useCallback(async () => {
    setLoading(true);
    setGenError(null);
    try {
      const res = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productInfo, contentStrategy }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "生成失败");
      setVersions(data.versions);
    } catch (e: any) {
      setGenError(e.message ?? "笔记生成失败，请重试");
      toast.error("笔记生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [productInfo, contentStrategy]);

  useEffect(() => {
    generateNotes();
  }, []);

  if (loading) {
    return (
      <CreateLayout currentStep={4} costCredits={0}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-24 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">AI 正在创作你的笔记…</h2>
            <p className="text-sm text-muted-foreground">正在生成 3 个不同风格的版本，请稍候（约 10-20 秒）</p>
          </div>
          <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "90%" }}
              transition={{ duration: 15, ease: "easeOut" }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            {["亲切种草", "干货科普", "真实日记"].map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 }}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      </CreateLayout>
    );
  }

  if (genError || !versions) {
    return (
      <CreateLayout currentStep={4} costCredits={0}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-24 flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="w-12 h-12 text-amber-400" />
          <h2 className="text-lg font-bold">生成遇到了问题</h2>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            {genError || "未知错误"}
          </p>
          <Button onClick={generateNotes} className="bg-primary text-white mt-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新生成
          </Button>
        </div>
      </CreateLayout>
    );
  }

  return (
    <CreateLayout currentStep={4} costCredits={0}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight">生成预览</h1>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium border border-emerald-200">
              生成完成 · 3 版
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            对比三个版本的笔记，查看 AI 洞察数据，选择最佳版本发布。
          </p>
        </div>

        {/* Row 1: Version summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {versions.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActiveVersion(i)}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                activeVersion === i
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60 bg-white hover:border-primary/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    activeVersion === i ? "bg-primary text-white" : "bg-secondary text-foreground"
                  }`}>
                    {v.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{v.style}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`w-3 h-3 ${si < v.stars ? "text-amber-400 fill-amber-400" : "text-border"}`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2">{v.title}</h3>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{v.wordCount} 字</span>
                <span>{v.topicCount} 话题</span>
              </div>
            </button>
          ))}
        </div>

        {/* Row 2: Feed preview cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {versions.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
                <span className="text-[11px] text-muted-foreground">
                  拟真发布预览 · 小红书 FEED 卡片角
                </span>
                <button
                  onClick={() => toast.info("编辑功能即将上线")}
                  className="flex items-center gap-1 text-[11px] text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  编辑
                </button>
              </div>

              {/* Cover image placeholder */}
              <div className="mx-4 mt-4 aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary/80 to-secondary flex flex-col items-center justify-center border border-border/30">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">COVER · 封面图占位</span>
                <span className="text-[10px] text-muted-foreground/50 mt-0.5">支持上传或 AI 生成封面</span>
              </div>

              {/* Content */}
              <div className="px-4 py-3">
                <h3 className="text-sm font-bold leading-snug mb-2">{v.title}</h3>
                <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-[12]">
                  {v.body}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {v.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Engagement prediction */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" /> {v.metrics.predictLikes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" /> 320
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5" /> 88
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60">预测数据</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 3: AI Insight panels */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {versions.map((v, i) => (
            <div
              key={v.id}
              className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">AI 洞察 · 编辑工具</span>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <MetricCard
                  icon={<TrendingUp className="w-3.5 h-3.5 text-primary" />}
                  label="命中热词"
                  value={String(v.metrics.hotWords)}
                  color="text-foreground"
                />
                <MetricCard
                  icon={<Heart className="w-3.5 h-3.5 text-primary" />}
                  label="情感正向"
                  value={`${v.metrics.sentiment}%`}
                  color="text-primary"
                />
                <MetricCard
                  icon={<Star className="w-3.5 h-3.5 text-amber-500" />}
                  label="预测点赞"
                  value={v.metrics.predictLikes}
                  color="text-foreground"
                />
                <MetricCard
                  icon={<Shield className="w-3.5 h-3.5 text-emerald-500" />}
                  label="风险词"
                  value={String(v.metrics.riskWords)}
                  color={v.metrics.riskWords > 0 ? "text-primary" : "text-emerald-500"}
                />
              </div>

              {/* Suggestion */}
              <div className="p-2.5 rounded-lg bg-secondary/50 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{v.suggestion}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 4: Quick tweak bar (spans all columns) */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            {/* Left: tweaks */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">AI 快速微调</span>
              </div>

              {/* Version tabs */}
              <div className="flex gap-2 mb-4">
                {versions.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setTweakVersion(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      tweakVersion === i
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white text-foreground border-border hover:border-foreground/20"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Tweak buttons */}
              <div className="flex flex-wrap gap-2">
                {QUICK_TWEAKS.map((tweak) => (
                  <button
                    key={tweak}
                    onClick={() => {
                      if (tweak === "自定义") {
                        setShowCustomInput(!showCustomInput);
                      } else {
                        toast.success(`正在对 V${tweakVersion + 1} 执行「${tweak}」`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border border-border/60 bg-white hover:border-primary/20 hover:bg-primary/5 transition-all"
                  >
                    {tweak}
                  </button>
                ))}
              </div>

              {/* Custom tweak input */}
              {showCustomInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex gap-2"
                >
                  <input
                    type="text"
                    value={customTweak}
                    onChange={(e) => setCustomTweak(e.target.value)}
                   placeholder="输入自定义微调指令，如 加入更多 emoji"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                  />
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white px-4"
                    onClick={() => {
                      if (customTweak.trim()) {
                        toast.success(`正在对 V${tweakVersion + 1} 执行自定义微调`);
                        setCustomTweak("");
                      }
                    }}
                  >
                    执行
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Right: action buttons */}
            <div className="shrink-0 w-56 space-y-2.5">
              <button
                onClick={() => toast.info("再生成一版（消耗 1 额度）")}
                className="w-full text-left px-4 py-2.5 rounded-xl border border-primary/20 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                再生成一版
                <span className="text-[11px] text-primary/60 ml-1">（消耗 1 额度）</span>
              </button>
              <button
                onClick={generateNotes}
                className="w-full text-left px-4 py-2.5 rounded-xl border border-primary/20 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                重新生成
                <span className="text-[11px] text-primary/60 ml-1">（消耗 2 额度）</span>
              </button>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                onClick={() => toast.success("已加入发布队列")}
              >
                <Send className="w-4 h-4 mr-1.5" />
                定时发布到小红书
              </Button>
              <button
                onClick={() => toast.success("已保存为草稿")}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                或 保存为草稿
              </button>
              <button
                onClick={() => navigate("/create/images")}
                className="w-full flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                <ArrowLeft className="w-3 h-3" />
                返回修改策略
              </button>
            </div>
          </div>
        </div>
      </div>
    </CreateLayout>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="p-2.5 rounded-lg bg-secondary/40">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}
