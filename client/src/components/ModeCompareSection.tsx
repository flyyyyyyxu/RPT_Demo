/*
 * Design: SaaS 工具站美学 - 两种模式对比区
 * - 左右对比卡片
 * - 暖橙(洞察) vs 靛蓝(快速)
 */
import { motion } from "framer-motion";
import { Search, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function ModeCompareSection() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-4">
            模式对比
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            两种创作模式，适配不同场景
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            根据商家实际需求，灵活选择创作路径
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* Insight Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="group rounded-2xl border-2 border-warm-orange/15 bg-white p-7 lg:p-8 hover:shadow-xl hover:shadow-orange-50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle gradient */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-orange-50/60 to-transparent" />

            <div className="relative">
              <div className="flex items-center gap-3.5 mb-7">
                <div className="w-13 h-13 rounded-2xl bg-warm-orange flex items-center justify-center shadow-lg shadow-orange-200/50 group-hover:scale-105 transition-transform">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">洞察模式</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">深度分析，精准生成</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[11px] font-bold text-warm-orange uppercase tracking-wider mb-3">适合场景</div>
                <div className="flex flex-wrap gap-2">
                  {["有竞品参考", "贴近用户痛点", "注重生成质量"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-orange-50 text-warm-orange text-xs font-medium border border-warm-orange/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[11px] font-bold text-warm-orange uppercase tracking-wider mb-3">核心特点</div>
                <div className="space-y-3">
                  {[
                    "多一步评论分析，挖掘真实痛点",
                    "自动提炼高频吐槽点",
                    "生成内容更有针对性",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-warm-orange shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-warm-orange group-hover:gap-2.5 transition-all">
                  了解洞察模式详情
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="group rounded-2xl border-2 border-indigo/15 bg-white p-7 lg:p-8 hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle gradient */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-50/60 to-transparent" />

            <div className="relative">
              <div className="flex items-center gap-3.5 mb-7">
                <div className="w-13 h-13 rounded-2xl bg-indigo flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">快速模式</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">简单配置，快速出稿</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[11px] font-bold text-indigo uppercase tracking-wider mb-3">适合场景</div>
                <div className="flex flex-wrap gap-2">
                  {["新手商家", "无明确竞品", "快速出稿需求"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo text-xs font-medium border border-indigo/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[11px] font-bold text-indigo uppercase tracking-wider mb-3">核心特点</div>
                <div className="space-y-3">
                  {[
                    "跳过评论分析，节省时间",
                    "直接配置内容策略",
                    "更快生成可用内容",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo group-hover:gap-2.5 transition-all">
                  了解快速模式详情
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
