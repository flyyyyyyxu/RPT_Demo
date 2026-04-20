/*
 * Design: SaaS 工具站美学 - 功能亮点区
 * - 左右布局：左侧 3 个亮点 Tab，右侧对应功能的真实页面布局 mockup
 * - 三大亮点：竞品洞察 / 多维精细配置策略 / 笔记预览对比
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Settings2,
  FileText,
  TrendingDown,
  MessageCircle,
  Lightbulb,
  Sparkles,
  Hash,
  Star,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

type FeatureKey = "insight" | "strategy" | "preview";

const features: {
  key: FeatureKey;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  desc: string;
  bullets: string[];
  accent: string;
  iconBg: string;
}[] = [
  {
    key: "insight",
    icon: <Search className="w-4 h-4" />,
    title: "竞品洞察",
    tagline: "从真实评论里提炼痛点",
    desc: "输入竞品关键词，AI 自动抓取并分析高频用户吐槽，生成内容方向建议。",
    bullets: [
      "一键分析 1000+ 条真实评论",
      "高频痛点可视化展示",
      "AI 建议带优先级排序",
    ],
    accent: "warm-orange",
    iconBg: "bg-warm-orange/10 text-warm-orange",
  },
  {
    key: "strategy",
    icon: <Settings2 className="w-4 h-4" />,
    title: "多维精细配置策略",
    tagline: "按需调教笔记风格",
    desc: "笔记风格、目标人群、内容语气多维度组合，开关式进阶配置，一套参数精准命中。",
    bullets: [
      "4×4×4 维度组合策略",
      "价格/场景/热门标签开关",
      "实时同步预览选择",
    ],
    accent: "primary",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    key: "preview",
    icon: <FileText className="w-4 h-4" />,
    title: "笔记预览对比",
    tagline: "多版本一眼挑最好",
    desc: "AI 一次生成 3 个版本笔记，支持标题/正文/标签可视化对比，择优保留、一键发布。",
    bullets: [
      "3 版本并排对比",
      "互动预估评分",
      "支持在线微调 + 发布",
    ],
    accent: "indigo",
    iconBg: "bg-indigo/10 text-indigo",
  },
];

export default function FeaturesSection() {
  const [active, setActive] = useState<FeatureKey>("insight");
  const current = features.find((f) => f.key === active)!;

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-primary/15 text-primary text-xs font-medium mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            功能亮点
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            三大核心能力，打造真正好用的种草工具
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            从洞察到生成再到对比，每一步都有为商家场景深度定制的亮点
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
          {/* Left: Feature tab list */}
          <div className="space-y-3">
            {features.map((f, i) => {
              const isActive = f.key === active;
              return (
                <motion.button
                  key={f.key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => setActive(f.key)}
                  className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 group ${
                    isActive
                      ? "bg-white border-primary/30 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                      : "bg-white/60 border-border/60 hover:bg-white hover:border-border hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/25 scale-110"
                          : f.iconBg
                      }`}
                    >
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">
                          0{i + 1}
                        </span>
                        <h3 className="text-sm font-bold">{f.title}</h3>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isActive ? "text-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {f.tagline}
                      </p>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/40">
                              {f.desc}
                            </p>
                            <div className="space-y-1.5 mt-3">
                              {f.bullets.map((b) => (
                                <div key={b} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                  <span className="text-[11px] text-foreground/70 leading-snug">
                                    {b}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Mockup preview */}
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Browser chrome wrapper */}
            <div className="rounded-t-2xl bg-[#e8e8e8] border border-b-0 border-black/5 px-4 py-2.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/90 rounded-md px-4 py-1 text-[11px] text-muted-foreground border border-black/5 max-w-xs w-full text-center">
                  app.notecraft.cn/{current.key}
                </div>
              </div>
            </div>

            <div className="rounded-b-2xl border border-t-0 border-black/5 bg-white shadow-2xl shadow-black/10 overflow-hidden">
              {active === "insight" && <InsightMockup />}
              {active === "strategy" && <StrategyMockup />}
              {active === "preview" && <PreviewMockup />}
            </div>

            {/* Floating highlight badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-3 -right-3 bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              核心亮点
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Mockups ─── */

function InsightMockup() {
  const painPoints = [
    { label: "太油", percent: 75, count: 453 },
    { label: "容易闷痘", percent: 60, count: 362 },
    { label: "持妆一般", percent: 50, count: 301 },
  ];
  const suggestions = [
    { title: "强调清爽不闷", priority: "高" },
    { title: "强调轻薄妆感", priority: "高" },
    { title: "避免夸大持妆", priority: "中" },
  ];

  return (
    <div className="grid md:grid-cols-[1fr_260px]">
      <div className="p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">高频痛点分析</span>
          </div>
          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            1,357 条评论
          </span>
        </div>

        <div className="space-y-4 mb-5">
          {painPoints.map((p, i) => (
            <div key={p.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-semibold">{p.label}</span>
                <span className="text-[11px] font-bold text-primary">{p.percent}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-bold">用户真实评价</span>
          </div>
          <div className="text-[11px] text-foreground/70 bg-secondary/50 rounded-md px-2.5 py-2 border-l-2 border-primary/30">
            "上脸刚开始还行，下午就出油了"
          </div>
        </div>
      </div>

      <div className="p-5 lg:p-6 border-l border-border/50 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="flex items-center gap-1.5 mb-4">
          <Lightbulb className="w-3.5 h-3.5 text-warm-orange" />
          <span className="text-xs font-bold">AI 内容建议</span>
        </div>
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={s.title} className="bg-white rounded-lg p-3 border border-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-warm-orange/10 text-warm-orange text-[9px] font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <span className="text-[11px] font-semibold">{s.title}</span>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    s.priority === "高"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StrategyMockup() {
  const [style, setStyle] = useState("真实分享");
  const [audience, setAudience] = useState("敏感肌");
  const [priceAdv, setPriceAdv] = useState(true);
  const [hot, setHot] = useState(true);

  const styles = ["真实分享", "种草推荐", "功效对比", "购物攻略"];
  const audiences = ["学生党", "上班族", "敏感肌", "油皮"];

  return (
    <div className="p-5 lg:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
            <Settings2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-bold">内容策略配置面板</span>
        </div>
        <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
          步骤 2/4
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs font-bold">笔记风格</span>
            <span className="text-[10px] text-muted-foreground">选择表达方式</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                  style === s
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-foreground/60 border-border hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs font-bold">目标人群</span>
            <span className="text-[10px] text-muted-foreground">核心受众</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {audiences.map((s) => (
              <button
                key={s}
                onClick={() => setAudience(s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                  audience === s
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-foreground/60 border-border hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border/40 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold">强调价格优势</div>
              <div className="text-[10px] text-muted-foreground">突出性价比</div>
            </div>
            <Switch checked={priceAdv} onCheckedChange={setPriceAdv} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold">加入热门标签</div>
              <div className="text-[10px] text-muted-foreground">推荐当下热门话题</div>
            </div>
            <Switch checked={hot} onCheckedChange={setHot} />
          </div>
        </div>

        <div className="border-t border-border/40 pt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-wrap">
            <span>已选择：</span>
            {[style, audience].map((t) => (
              <span key={t} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                {t}
              </span>
            ))}
          </div>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-white text-[11px] font-medium shadow-sm">
            <Sparkles className="w-3 h-3" />
            确认配置
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewMockup() {
  const versions = [
    {
      id: "v1",
      label: "V1",
      title: "混油皮亲测｜轻薄不闷痘！",
      summary: "混油皮最近试了这款粉底液，整体轻薄挂，上脸不会特别闷…",
      score: 92,
    },
    {
      id: "v2",
      label: "V2",
      title: "学生党底妆分享｜百元粉底",
      summary: "学生党的底妆预算有限，但谁说平价就不能有好妆效？…",
      score: 88,
    },
    {
      id: "v3",
      label: "V3",
      title: "敏感肌友好｜终于找到了",
      summary: "作为敏感肌 + 混油皮，找到一款不闷痘的粉底真的太难…",
      score: 90,
    },
  ];
  const [active, setActive] = useState("v1");
  const curr = versions.find((v) => v.id === active)!;
  const tags = ["粉底液测评", "混油皮底妆", "平价好物"];

  return (
    <div className="grid md:grid-cols-[1fr_180px]">
      <div className="p-5 lg:p-6 border-r border-border/50">
        <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-border/40">
          <span className="text-[10px] text-muted-foreground mr-1">版本：</span>
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                active === v.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="mb-1">
          <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
            标题
          </span>
        </div>
        <h3 className="text-sm font-bold mb-4 pb-3 border-b border-border/30 leading-snug">
          {curr.title}
        </h3>

        <div className="mb-1">
          <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
            正文
          </span>
        </div>
        <p className="text-[11px] leading-[1.75] text-foreground/75 bg-secondary/20 rounded-md p-3 border border-border/30 mb-3">
          {curr.summary}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-coral-light/60 text-primary text-[10px] font-medium border border-primary/10"
            >
              <Hash className="w-2.5 h-2.5" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 lg:p-5 bg-[#fafafa] space-y-2">
        <div className="text-[11px] font-bold mb-2">多版本对比</div>
        {versions.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            className={`w-full text-left rounded-lg border p-2.5 transition-all ${
              active === v.id
                ? "border-primary/30 bg-gradient-to-r from-coral-light/40 to-white shadow-sm ring-1 ring-primary/10"
                : "border-border bg-white hover:border-primary/20"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  active === v.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                }`}
              >
                {v.label}
              </span>
              <div className="flex items-center gap-0.5 ml-auto">
                <Star className="w-2.5 h-2.5 text-warm-orange" />
                <span className="text-[10px] font-bold">{v.score}</span>
              </div>
            </div>
            <div className="text-[10px] font-semibold line-clamp-1 text-foreground/80">
              {v.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
