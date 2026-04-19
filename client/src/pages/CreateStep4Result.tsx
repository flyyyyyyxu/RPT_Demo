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
  BarChart3,
  AlertTriangle,
  Check,
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

export default function CreateStep4Result() {
  const [, navigate] = useLocation();
  const { productInfo, contentStrategy } = useCreateContext();
  const [selectedVersions, setSelectedVersions] = useState<Set<number>>(new Set([0, 1, 2]));
  const [versions, setVersions] = useState<VersionData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [genError, setGenError] = useState<string | null>(null);

  const toggleVersion = (i: number) => {
    setSelectedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        if (next.size > 1) next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

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
      setSelectedVersions(new Set([0, 1, 2]));
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
      <CreateLayout currentStep={4}>
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
      <CreateLayout currentStep={4}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-24 flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="w-12 h-12 text-amber-400" />
          <h2 className="text-lg font-bold">生成遇到了问题</h2>
          <p className="text-sm text-muted-foreground text-center max-w-sm">{genError || "未知错误"}</p>
          <Button onClick={generateNotes} className="bg-primary text-white mt-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新生成
          </Button>
        </div>
      </CreateLayout>
    );
  }

  const selectedCount = selectedVersions.size;

  return (
    <CreateLayout currentStep={4}>
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
            点击版本卡片可多选，查看 AI 洞察数据，选择最佳版本发布。
          </p>
        </div>

        {/* Row 1: Version summary cards — multi-select */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {versions.map((v, i) => {
            const selected = selectedVersions.has(i);
            return (
              <button
                key={v.id}
                onClick={() => toggleVersion(i)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 relative ${
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 bg-white hover:border-primary/20"
                }`}
              >
                {/* Check indicator */}
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    selected ? "bg-primary" : "bg-secondary border border-border"
                  }`}
                >
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>

                <div className="flex items-center gap-2 mb-2 pr-6">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    selected ? "bg-primary text-white" : "bg-secondary text-foreground"
                  }`}>
                    {v.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{v.style}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
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
            );
          })}
        </div>

        {/* Row 2: Feed preview cards — engagement bar pinned to bottom */}
        <div className="grid grid-cols-3 gap-4 mb-6 items-stretch">
          {versions.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden flex flex-col"
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <span className="text-[11px] text-muted-foreground">
                  拟真发布预览 · 小红书 FEED 卡片
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
              <div className="mx-4 mt-4 shrink-0 aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary/80 to-secondary flex flex-col items-center justify-center border border-border/30">
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

              {/* Content — flex-1 keeps engagement bar at bottom */}
              <div className="flex-1 flex flex-col px-4 py-3">
                <h3 className="text-sm font-bold leading-snug mb-2">{v.title}</h3>
                <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-[10]">
                  {v.body}
                </div>
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
                {/* Engagement stats — mt-auto pins it to bottom */}
                <div className="mt-auto pt-3 border-t border-border/30 flex items-center justify-between">
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
          {versions.map((v) => (
            <div key={v.id} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">AI 洞察</span>
              </div>
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
              <div className="p-2.5 rounded-lg bg-secondary/50 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{v.suggestion}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="rounded-2xl border border-border/60 bg-white shadow-sm px-5 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: navigation + selected versions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/create/images")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回修改
              </button>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">已选</span>
                <div className="flex gap-1.5">
                  {versions.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => toggleVersion(i)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                        selectedVersions.has(i)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-muted-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">共 {selectedCount} 版</span>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={generateNotes}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-white text-sm font-medium text-foreground hover:border-foreground/20 hover:bg-secondary/40 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重新生成
              </button>
              <button
                onClick={() => toast.success("已保存为草稿")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-white text-sm font-medium text-foreground hover:border-foreground/20 hover:bg-secondary/40 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                保存草稿
              </button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 px-5"
                onClick={() => toast.success(`已将 ${selectedCount} 版笔记加入发布队列`)}
              >
                <Send className="w-4 h-4 mr-1.5" />
                发布到小红书
              </Button>
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
