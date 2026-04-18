/*
 * Step 3: 生成预览
 * Layout: 三栏 - 版本列表 + 拟真发布预览(小红书feed) + AI洞察·编辑工具
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Star,
  Plus,
  Heart,
  Bookmark,
  MessageCircle,
  Sparkles,
  RefreshCw,
  Edit3,
  Send,
  Save,
  ChevronRight,
  Clock,
  TrendingUp,
  Shield,
  Lightbulb,
  Image as ImageIcon,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";

interface NoteVersion {
  id: string;
  type: string;
  title: string;
  body: string;
  tags: string[];
  wordCount: number;
  topicCount: number;
  rating: number;
  coverImages: number;
}

const VERSIONS: NoteVersion[] = [
  {
    id: "v1",
    type: "亲切种草",
    title: "姐妹们！这瓶洁面真的是我今年最爱没有之一",
    body: `作为敏感肌 + 学生党，我对洁面真的挑到不行…

最近用的这瓶 XX 氨基酸洁面，是真的 温和到让我这种爆痘期都能冲。

✨ 用感：泡沫细腻，洗完脸不拔干
✨ 成分：全氨基酸系，孕期也能用
✨ 性价比：60 块一大瓶，学生党友好

说实话一开始没抱太大期望，毕竟这个价位嘛。但用了两周，早上洗完脸摸着滑滑的，也没有紧绷感。

我现在早晚都用它，配合温水按摩一分钟，黑头都感觉少了一点（可能是心理作用哈哈）。

总之如果你也是敏感肌、预算有限，真的可以试试这瓶，不踩雷！`,
    tags: ["#敏感肌洁面", "#学生党平价", "#早八通勤", "#温和洁面", "#氨基酸洁面"],
    wordCount: 418,
    topicCount: 4,
    rating: 5,
    coverImages: 4,
  },
  {
    id: "v2",
    type: "干货科普",
    title: "氨基酸 vs 皂基，敏感肌别再冲错了",
    body: `每次看到有人说"洁面嘛随便用"，我都想说：成分真的很重要！

今天来聊聊氨基酸和皂基洁面的区别：

📌 皂基洁面：清洁力强，但容易破坏皮肤屏障
📌 氨基酸洁面：温和亲肤，适合敏感肌日常使用

最近在用的这款 XX 氨基酸洁面，pH 值接近皮肤本身，洗完不紧绷不假滑。

成分表很干净，没有酒精和香精，孕妈也能放心用。60 块的价格，性价比真的可以。

如果你是敏感肌或者换季容易过敏，建议先从氨基酸洁面开始，别一上来就用清洁力太强的。`,
    tags: ["#氨基酸洁面", "#敏感肌护肤", "#成分党"],
    wordCount: 462,
    topicCount: 3,
    rating: 4,
    coverImages: 3,
  },
  {
    id: "v3",
    type: "真实体验",
    title: "一月 30 天试用报告 · 敏感肌的真实感受",
    body: `这篇不是广告，纯分享我用了一个月的真实感受。

背景：混油敏感肌，换季必烂脸，之前用过好几款洁面都翻车了。

第 1 周：刚开始用觉得泡沫很绵密，洗感舒服，但没什么特别的
第 2 周：发现早上起来脸没那么油了，T 区出油明显减少
第 3 周：换季期间居然没有大面积爆痘，惊喜
第 4 周：皮肤状态稳定了很多，毛孔也没那么明显

总结：不是那种用完立马惊艳的产品，但胜在温和稳定。60 块的价格，学生党完全能接受。

适合人群：敏感肌、学生党、追求温和洁面的姐妹`,
    tags: ["#敏感肌洁面", "#学生党好物", "#真实测评", "#温和洁面", "#一月试用"],
    wordCount: 386,
    topicCount: 5,
    rating: 5,
    coverImages: 5,
  },
];

const QUICK_TWEAKS = [
  "更口语化",
  "加一段使用前后对比",
  "把结尾改成问句",
];

export default function CreateStep3() {
  const [, navigate] = useLocation();
  const { contentStrategy } = useCreateContext();
  const [activeVersion, setActiveVersion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [customTweak, setCustomTweak] = useState("");

  const version = VERSIONS[activeVersion];

  return (
    <CreateLayout
      currentStep={3}
      rightAction={
        <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-2">
          <span>耗时</span>
          <span className="font-bold text-foreground">7.2s</span>
          <span>·</span>
          <span>剩余</span>
          <span className="font-bold text-foreground">30 / 50</span>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1.5">
              笔记生成完成 · {VERSIONS.length} 版本
            </h1>
            <p className="text-sm text-muted-foreground">
              左侧切换版本，中间是拟真发布预览，右侧有 AI 洞察和编辑工具。
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Version list (3/12) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              版本列表
            </div>
            {VERSIONS.map((v, i) => (
              <motion.button
                key={v.id}
                onClick={() => setActiveVersion(i)}
                whileHover={{ scale: 1.01 }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  activeVersion === i
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border/60 bg-white hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                      activeVersion === i
                        ? "bg-primary text-white"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {v.id.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{v.type}</span>
                  <div className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3 h-3 ${
                          si < v.rating ? "text-warm-orange fill-warm-orange" : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-semibold leading-snug line-clamp-2 mb-1.5">
                  {v.title}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{v.wordCount} 字</span>
                  <span>{v.topicCount} 话题</span>
                </div>
              </motion.button>
            ))}

            <button
              onClick={() => toast.info("再生成一版（消耗 1 额度）")}
              className="w-full p-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              再生成一版
            </button>
          </div>

          {/* Center: Feed preview (5/12) */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              拟真发布预览 · 小红书 feed 卡片视角
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={version.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden"
              >
                {/* Cover image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-coral-light via-white to-indigo-light flex items-center justify-center relative overflow-hidden">
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, currentColor 20px, currentColor 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, currentColor 21px, currentColor 21px)', color: 'oklch(0.6 0.2 15)' }} />
                  <div className="text-center relative">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-lg flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="w-8 h-8 text-primary/40" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground/60">COVER · 封面图占位</span>
                    <p className="text-[10px] text-muted-foreground/40 mt-1">支持上传或 AI 生成封面</p>
                  </div>
                  {/* Image pagination dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {Array.from({ length: version.coverImages }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i === 0 ? "bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold leading-snug mb-4">{version.title}</h2>
                  <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line mb-5">
                    {version.body}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {version.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Engagement prediction */}
                  <div className="flex items-center gap-6 pt-4 border-t border-border/40 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Heart className="w-4 h-4" />
                      <span>1.2k</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Bookmark className="w-4 h-4" />
                      <span>320</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>88</span>
                    </div>
                    <span className="text-[11px] ml-auto">预测数据</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: AI Insight + Edit tools (4/12) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-4 space-y-5"
          >
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              AI 洞察 · 编辑工具
            </div>

            {/* Metrics */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  icon={<TrendingUp className="w-4 h-4 text-indigo" />}
                  label="命中热词"
                  value="4"
                />
                <MetricCard
                  icon={<Heart className="w-4 h-4 text-primary" />}
                  label="情绪正向"
                  value="92%"
                  valueColor="text-emerald"
                />
                <MetricCard
                  icon={<Star className="w-4 h-4 text-warm-orange" />}
                  label="预测点赞"
                  value="1.2k"
                />
                <MetricCard
                  icon={<Shield className="w-4 h-4 text-emerald" />}
                  label="风险词"
                  value="0"
                  valueColor="text-emerald"
                />
              </div>
              <div className="mt-4 p-3 rounded-xl bg-secondary/50">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-warm-orange shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    建议：在第 2 段补充"用量感"（1 泵够用 or 半泵），可进一步提升收藏率。
                  </p>
                </div>
              </div>
            </div>

            {/* Quick tweaks */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                快速微调
              </div>
              <div className="space-y-2">
                {QUICK_TWEAKS.map((tweak) => (
                  <button
                    key={tweak}
                    onClick={() => toast.success(`正在应用：${tweak}`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border/50 bg-white hover:border-primary/20 hover:bg-primary/5 transition-all text-sm"
                  >
                    <span>{tweak}</span>
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </button>
                ))}
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={customTweak}
                    onChange={(e) => setCustomTweak(e.target.value)}
                    placeholder="+ 自定义指令"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-dashed border-border text-sm focus:outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <Button
                variant="outline"
                className="w-full justify-center bg-white h-11"
                onClick={() => {
                  setIsEditing(!isEditing);
                  toast.info(isEditing ? "退出编辑模式" : "进入手动编辑模式");
                }}
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                手动编辑正文
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center bg-white h-11"
                onClick={() => toast.info("再次生成（消耗 1 额度）")}
              >
                <RefreshCw className="w-4 h-4 mr-1.5" />
                再次生成（用 1 额度）
              </Button>
              <Button
                className="w-full justify-center bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 h-12 text-base"
                onClick={() => toast.success("笔记已提交发布！")}
              >
                <Send className="w-4 h-4 mr-1.5" />
                定时发布到小红书
              </Button>
              <div className="text-center">
                <button
                  onClick={() => toast.success("已保存为草稿")}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  或 保存为草稿
                </button>
              </div>
            </div>

            {/* Back button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => navigate("/create/strategy")}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              返回修改策略
            </Button>
          </motion.div>
        </div>
      </div>
    </CreateLayout>
  );
}

/* --- Sub-components --- */

function MetricCard({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-secondary/40">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div className={`text-xl font-bold ${valueColor || "text-foreground"}`}>{value}</div>
    </div>
  );
}
