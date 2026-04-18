/*
 * Design: SaaS 工具站美学 - 产品价值区
 * - 3 个价值卡片
 * - 简洁有力的表达
 */
import { motion } from "framer-motion";
import { PenLine, Target, Rocket } from "lucide-react";

const values = [
  {
    icon: <PenLine className="w-6 h-6" />,
    problem: "不会写",
    solution: "把商品信息转成可用内容",
    desc: "输入商品名称、卖点和人群信息，AI 自动生成符合小红书风格的种草笔记，降低创作门槛。",
    iconBg: "bg-primary/10 text-primary",
    gradient: "from-coral-light/40 to-transparent",
  },
  {
    icon: <Target className="w-6 h-6" />,
    problem: "写不准",
    solution: "从评论里提炼真实痛点和卖点",
    desc: "通过竞品评论洞察，自动提取用户高频痛点，让生成内容更贴近真实需求，避免自说自话。",
    iconBg: "bg-warm-orange/10 text-warm-orange",
    gradient: "from-orange-50/60 to-transparent",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    problem: "写不快",
    solution: "快速生成、编辑、保存、发布",
    desc: "一键生成多版本笔记，支持在线编辑和微调，直接保存草稿或发布到小红书，全流程提效。",
    iconBg: "bg-indigo/10 text-indigo",
    gradient: "from-indigo-50/60 to-transparent",
  },
];

export default function ValueSection() {
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
            产品价值
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            解决商家内容创作的三大痛点
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            从「不会写」到「写得好」，全链路提升商家内容创作能力
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {values.map((item, i) => (
            <motion.div
              key={item.problem}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative rounded-2xl border border-border/60 bg-white p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient background */}
              <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative">
                <div className={`w-13 h-13 rounded-2xl ${item.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="mb-3">
                  <span className="text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-md shadow-sm">
                    {item.problem}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-2.5 leading-snug">{item.solution}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
