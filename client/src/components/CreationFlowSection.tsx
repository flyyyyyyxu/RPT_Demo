/*
 * Design: SaaS 工具站美学 - 创作流程展示区
 * - 基于真实产品 4 步流程：商品信息 → 内容策略 → 图片编辑 → 生成预览
 * - 横向流程卡片 + 放大的亮点说明
 */
import { motion } from "framer-motion";
import {
  Package,
  Settings2,
  ImageIcon,
  Eye,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: <Package className="w-5 h-5" />,
    title: "商品信息",
    desc: "录入商品名称、卖点、人群、价格",
    highlights: ["一键导入商品库", "智能识别核心卖点"],
    accent: "from-coral-light/50 to-transparent",
    iconBg: "bg-primary text-white",
    dotColor: "bg-primary",
  },
  {
    step: 2,
    icon: <Settings2 className="w-5 h-5" />,
    title: "内容策略",
    desc: "笔记风格 · 目标人群 · 内容语气",
    highlights: ["一键洞察竞品热点", "多维精细配置"],
    accent: "from-orange-50 to-transparent",
    iconBg: "bg-warm-orange text-white",
    dotColor: "bg-warm-orange",
  },
  {
    step: 3,
    icon: <ImageIcon className="w-5 h-5" />,
    title: "图片编辑",
    desc: "封面 · 文案 · 上传 · 预览",
    highlights: ["AI 生成封面", "模板一键套用"],
    accent: "from-indigo-50 to-transparent",
    iconBg: "bg-indigo text-white",
    dotColor: "bg-indigo",
  },
  {
    step: 4,
    icon: <Eye className="w-5 h-5" />,
    title: "生成预览",
    desc: "多版本对比、编辑、保存、发布",
    highlights: ["多版本智能对比", "一键发布小红书"],
    accent: "from-emerald/10 to-transparent",
    iconBg: "bg-emerald text-white",
    dotColor: "bg-emerald",
  },
];

export default function CreationFlowSection() {
  return (
    <section id="workflow" className="py-20 lg:py-28 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-4">
            创作流程
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            四步生成一篇高质量种草笔记
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            从商品信息到发布小红书，全链路可视化操作，像搭积木一样轻松
          </p>
        </motion.div>

        {/* Horizontal step flow */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-[44px] left-[8%] right-[8%] h-px bg-gradient-to-r from-primary/20 via-warm-orange/20 via-indigo/20 to-emerald/20" />

            <div className="grid lg:grid-cols-4 gap-5 lg:gap-6 relative">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Step number badge (sits on the connecting line) */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-[88px] h-[88px] rounded-2xl ${s.iconBg} flex flex-col items-center justify-center shadow-lg shadow-black/10 relative z-10`}>
                      <div className="text-[10px] font-bold opacity-80 tracking-wider mb-0.5">
                        STEP {s.step}
                      </div>
                      {s.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`group relative rounded-2xl border border-border/60 bg-white p-5 lg:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[200px]`}>
                    <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${s.accent} opacity-70`} />
                    <div className="relative">
                      <h3 className="text-base font-bold text-center mb-2">{s.title}</h3>
                      <p className="text-xs text-muted-foreground text-center leading-relaxed mb-4">
                        {s.desc}
                      </p>
                      <div className="pt-3 border-t border-border/40 space-y-2">
                        {s.highlights.map((h) => (
                          <div key={h} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-foreground/40 shrink-0 mt-0.5" />
                            <span className="text-xs text-foreground/70 leading-snug">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow between cards (desktop) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-[36px] -right-3 z-20">
                      <div className="w-6 h-6 rounded-full bg-white border border-border/60 flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 rounded-2xl bg-gradient-to-r from-coral-light/30 via-orange-50/40 to-indigo-50/40 border border-border/40 p-5 flex items-center justify-center flex-wrap gap-x-8 gap-y-3"
          >
            {[
              { label: "平均耗时", value: "< 3 分钟" },
              { label: "生成版本", value: "3 版本" },
              { label: "支持模式", value: "洞察 / 快速" },
              { label: "可直接发布", value: "小红书" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{m.label}</span>
                <span className="text-sm font-bold text-foreground">{m.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
