/*
 * Design: SaaS 工具站美学 - 核心流程展示区
 * - 纵向流程图 + 分支结构
 * - 卡片 + 连接线 + 颜色区分
 * - 洞察模式(暖橙) vs 快速模式(靛蓝)
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Package,
  GitFork,
  Search,
  MessageSquareText,
  Zap,
  Settings2,
  Bot,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send,
  Save,
  Copy,
  ChevronDown,
} from "lucide-react";

type Mode = "insight" | "quick" | null;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function WorkflowSection() {
  const [activeMode, setActiveMode] = useState<Mode>(null);

  const isInsight = activeMode === "insight";
  const isQuick = activeMode === "quick";

  return (
    <section id="workflow" className="py-20 lg:py-28 bg-white">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-4">
            核心流程
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            从商品信息到种草笔记的完整路径
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            点击下方「洞察模式」或「快速模式」，查看两种创作路径的差异
          </p>
        </motion.div>

        {/* Flow Chart */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1-2: Entry + Product Info */}
          <div className="flex flex-col items-center gap-0">
            <FlowNode
              icon={<Store className="w-5 h-5" />}
              title="商家后台入口"
              desc="登录商家工作台"
              index={0}
              step={1}
            />
            <Connector />
            <FlowNode
              icon={<Package className="w-5 h-5" />}
              title="商品信息填写"
              desc="名称 · 卖点 · 人群 · 价格"
              index={1}
              step={2}
            />
            <Connector />

            {/* Step 3: Mode Selection */}
            <FlowNode
              icon={<GitFork className="w-5 h-5" />}
              title="选择创作模式"
              desc="根据需求选择不同路径"
              index={2}
              step={3}
            />
          </div>

          {/* Branch: Two modes */}
          <div className="relative mt-0">
            {/* Connector lines - SVG for cleaner rendering */}
            <div className="flex justify-center">
              <svg width="100%" height="48" className="max-w-lg" viewBox="0 0 500 48" preserveAspectRatio="xMidYMid meet">
                <line x1="250" y1="0" x2="250" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-border" />
                <line x1="125" y1="16" x2="375" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-border" />
                <line x1="125" y1="16" x2="125" y2="48" stroke="currentColor" strokeWidth="1.5" className={isInsight ? "text-warm-orange" : "text-border"} />
                <line x1="375" y1="16" x2="375" y2="48" stroke="currentColor" strokeWidth="1.5" className={isQuick ? "text-indigo" : "text-border"} />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-6 lg:gap-10">
              {/* Insight Mode */}
              <div className="flex flex-col items-center gap-0">
                <button
                  onClick={() => setActiveMode(activeMode === "insight" ? null : "insight")}
                  className="w-full max-w-xs"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-xl border-2 p-5 text-center transition-all duration-300 ${
                      isInsight
                        ? "border-warm-orange bg-gradient-to-b from-orange-50 to-white shadow-lg shadow-orange-100/50"
                        : "border-border bg-white hover:border-warm-orange/40 hover:shadow-md"
                    } ${isQuick ? "opacity-35 scale-[0.97]" : ""}`}
                  >
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 transition-colors ${
                      isInsight ? "bg-warm-orange text-white shadow-sm" : "bg-orange-50 text-warm-orange"
                    }`}>
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm mb-1">洞察模式</div>
                    <div className="text-xs text-muted-foreground">深度分析竞品评论</div>
                  </motion.div>
                </button>

                {/* Insight sub-steps */}
                <div className={`flex flex-col items-center gap-0 transition-all duration-300 w-full max-w-xs ${
                  isQuick ? "opacity-25" : ""
                }`}>
                  <Connector color={isInsight ? "orange" : "default"} />
                  <FlowNodeSmall
                    icon={<Search className="w-4 h-4" />}
                    title="输入竞品关键词"
                    active={isInsight}
                    color="orange"
                    index={3}
                  />
                  <Connector color={isInsight ? "orange" : "default"} />
                  <FlowNodeSmall
                    icon={<MessageSquareText className="w-4 h-4" />}
                    title="AI 评论痛点分析"
                    subtitle="提取高频痛点词"
                    active={isInsight}
                    color="orange"
                    index={4}
                  />
                </div>
              </div>

              {/* Quick Mode */}
              <div className="flex flex-col items-center gap-0">
                <button
                  onClick={() => setActiveMode(activeMode === "quick" ? null : "quick")}
                  className="w-full max-w-xs"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-xl border-2 p-5 text-center transition-all duration-300 ${
                      isQuick
                        ? "border-indigo bg-gradient-to-b from-indigo-50 to-white shadow-lg shadow-indigo-100/50"
                        : "border-border bg-white hover:border-indigo/40 hover:shadow-md"
                    } ${isInsight ? "opacity-35 scale-[0.97]" : ""}`}
                  >
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 transition-colors ${
                      isQuick ? "bg-indigo text-white shadow-sm" : "bg-indigo-50 text-indigo"
                    }`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm mb-1">快速模式</div>
                    <div className="text-xs text-muted-foreground">跳过分析直接生成</div>
                  </motion.div>
                </button>

                {/* Quick sub-step */}
                <div className={`flex flex-col items-center gap-0 transition-all duration-300 w-full max-w-xs ${
                  isInsight ? "opacity-25" : ""
                }`}>
                  <Connector color={isQuick ? "indigo" : "default"} />
                  <FlowNodeSmall
                    icon={<Zap className="w-4 h-4" />}
                    title="直接进入配置"
                    active={isQuick}
                    color="indigo"
                    index={3}
                  />
                  {/* Spacer to align with insight mode */}
                  <div className="h-[84px]" />
                </div>
              </div>
            </div>

            {/* Merge lines */}
            <div className="flex justify-center">
              <svg width="100%" height="40" className="max-w-lg" viewBox="0 0 500 40" preserveAspectRatio="xMidYMid meet">
                <line x1="125" y1="0" x2="125" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-border" />
                <line x1="375" y1="0" x2="375" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-border" />
                <line x1="125" y1="16" x2="375" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-border" />
                <line x1="250" y1="16" x2="250" y2="40" stroke="currentColor" strokeWidth="1.5" className="text-border" />
              </svg>
            </div>
          </div>

          {/* Steps 4-7: Merged path */}
          <div className="flex flex-col items-center gap-0">
            <FlowNode
              icon={<Settings2 className="w-5 h-5" />}
              title="内容策略配置"
              desc="笔记风格 · 目标人群层"
              index={5}
              step={4}
            />
            <Connector />
            <FlowNode
              icon={<Bot className="w-5 h-5" />}
              title="AI 笔记生成引擎"
              desc="基于策略智能生成内容"
              index={6}
              step={5}
              highlight
            />
            <Connector />
            <FlowNode
              icon={<Eye className="w-5 h-5" />}
              title="预览与编辑"
              desc="标题 · 正文 · 话题标签"
              index={7}
              step={6}
            />
            <Connector />

            {/* Satisfaction check */}
            <div className="relative w-full max-w-md">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={8}
                variants={fadeUp}
                className="rounded-xl border-2 border-dashed border-border bg-white p-5 text-center shadow-sm"
              >
                <div className="text-xs text-muted-foreground mb-2">步骤 7</div>
                <div className="font-bold text-sm mb-4">内容满意？</div>
                <div className="flex justify-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium bg-emerald/10 text-emerald px-3.5 py-2 rounded-lg border border-emerald/15">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    满意 → 输出结果
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium bg-secondary text-muted-foreground px-3.5 py-2 rounded-lg border border-border">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    不满意 → 调整再生成
                  </div>
                </div>
              </motion.div>
              {/* Loop arrow for "不满意" */}
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center">
                <svg width="52" height="90" viewBox="0 0 52 90" fill="none" className="text-muted-foreground/30">
                  <path d="M4 0 C4 25 48 25 48 45 C48 65 4 65 4 90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
                  <path d="M0 84 L4 90 L8 84" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="text-[10px] text-muted-foreground/50 mt-1 -rotate-90 absolute top-1/2 -translate-y-1/2 right-[-28px] whitespace-nowrap">
                  循环优化
                </span>
              </div>
            </div>

            <Connector />

            {/* Output branches */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-4">
                <ChevronDown className="w-5 h-5 text-muted-foreground/40 mx-auto" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Send className="w-4.5 h-4.5" />, label: "发布到小红书", isPrimary: true },
                  { icon: <Save className="w-4.5 h-4.5" />, label: "保存为草稿", isPrimary: false },
                  { icon: <Copy className="w-4.5 h-4.5" />, label: "生成多版本", isPrimary: false },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={9 + i}
                    variants={fadeUp}
                    className={`rounded-xl p-4 text-center shadow-sm border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      item.isPrimary
                        ? "bg-primary text-white border-primary/80"
                        : "bg-white text-foreground border-border"
                    }`}
                  >
                    <div className="flex justify-center mb-2.5">{item.icon}</div>
                    <div className="text-xs font-semibold">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Sub-components */
function FlowNode({
  icon,
  title,
  desc,
  index,
  step,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
  step: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      variants={fadeUp}
      className={`w-full max-w-md rounded-xl border bg-white p-5 flex items-center gap-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
        highlight ? "border-primary/30 ring-1 ring-primary/10 bg-gradient-to-r from-coral-light/30 to-white" : "border-border"
      }`}
    >
      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
        highlight
          ? "bg-primary text-white shadow-sm"
          : "bg-secondary text-muted-foreground"
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-bold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground/50 bg-secondary px-2 py-0.5 rounded shrink-0">
        {step}
      </span>
    </motion.div>
  );
}

function FlowNodeSmall({
  icon,
  title,
  subtitle,
  active,
  color,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  active: boolean;
  color: "orange" | "indigo";
  index: number;
}) {
  const colors = {
    orange: {
      activeBg: "bg-gradient-to-r from-orange-50 to-white border-warm-orange shadow-sm",
      iconBg: "bg-warm-orange text-white",
      defaultIconBg: "bg-orange-50 text-warm-orange",
    },
    indigo: {
      activeBg: "bg-gradient-to-r from-indigo-50 to-white border-indigo shadow-sm",
      iconBg: "bg-indigo text-white",
      defaultIconBg: "bg-indigo-50 text-indigo",
    },
  };
  const c = colors[color];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      variants={fadeUp}
      className={`w-full max-w-xs rounded-lg border p-3.5 flex items-center gap-3 transition-all duration-300 ${
        active ? c.activeBg : "border-border bg-white"
      }`}
    >
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        active ? c.iconBg : c.defaultIconBg
      }`}>
        {icon}
      </div>
      <div>
        <div className="font-medium text-xs">{title}</div>
        {subtitle && <div className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
    </motion.div>
  );
}

function Connector({ color }: { color?: "orange" | "indigo" | "default" }) {
  const lineColor =
    color === "orange"
      ? "bg-warm-orange/40"
      : color === "indigo"
        ? "bg-indigo/40"
        : "bg-border";
  return <div className={`w-px h-7 ${lineColor} transition-colors duration-300`} />;
}
