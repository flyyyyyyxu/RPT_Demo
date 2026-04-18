/*
 * Design: SaaS 工具站美学 - 洞察分析页示意（核心亮点区）
 * - 三栏布局：关键词输入 | 痛点分析 | 内容建议
 * - 仿真后台界面风格
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingDown, MessageCircle, Lightbulb, BarChart3 } from "lucide-react";

const painPoints = [
  { label: "太油", percent: 75, count: 453 },
  { label: "容易闷痘", percent: 60, count: 362 },
  { label: "持妆一般", percent: 50, count: 301 },
  { label: "妆感厚重", percent: 40, count: 241 },
];

const reviews = [
  { text: "上脸刚开始还行，下午就出油了", sentiment: "negative" },
  { text: "敏感肌用着有点闷", sentiment: "negative" },
  { text: "遮瑕还可以，但整体妆感偏厚", sentiment: "mixed" },
  { text: "包装不错，但效果没有预期惊艳", sentiment: "mixed" },
];

const suggestions = [
  { title: "强调清爽不闷", desc: "突出产品的轻薄质地和透气感", priority: "高" },
  { title: "强调轻薄妆感", desc: "用真实上妆效果对比展示", priority: "高" },
  { title: "避免夸大持妆效果", desc: "真实描述持妆时长，建立信任", priority: "中" },
  { title: "真实体验口吻表达", desc: "像朋友分享，不要硬广感", priority: "中" },
];

const keywords = ["平价粉底液", "敏感肌面霜", "水润遮瑕", "不含酒精"];

export default function InsightSection() {
  const [activeKeywords, setActiveKeywords] = useState<string[]>(["平价粉底液", "敏感肌面霜"]);
  const [searchValue, setSearchValue] = useState("");

  const toggleKeyword = (kw: string) => {
    setActiveKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  };

  return (
    <section id="insight" className="py-20 lg:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-primary/15 text-primary text-xs font-medium mb-4 shadow-sm">
            <BarChart3 className="w-3.5 h-3.5" />
            核心亮点
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            竞品评论洞察，驱动内容生成
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            从真实用户评价中提炼痛点与卖点，让 AI 生成更有针对性的种草内容
          </p>
        </motion.div>

        {/* Simulated Dashboard Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="rounded-t-2xl bg-[#e8e8e8] border border-b-0 border-black/5 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-inner" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white/90 rounded-lg px-5 py-1.5 text-xs text-muted-foreground border border-black/5 max-w-sm w-full text-center flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                app.notecraft.cn/insight
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="rounded-b-2xl border border-t-0 border-black/5 bg-white shadow-2xl shadow-black/8 overflow-hidden">
            <div className="grid lg:grid-cols-[260px_1fr_340px]">
              {/* Left: Keyword Input */}
              <div className="p-6 border-r border-border/50 bg-[#fafafa]">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-primary" />
                  竞品关键词
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="输入关键词..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {keywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => toggleKeyword(kw)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        activeKeywords.includes(kw)
                          ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                          : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {kw}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="text-[11px] text-muted-foreground mb-3">
                    已选择 {activeKeywords.length} 个关键词
                  </div>
                  <button className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                    开始分析
                  </button>
                </div>
              </div>

              {/* Center: Pain Point Analysis */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold">高频痛点分析</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                    基于 1,357 条评论
                  </span>
                </div>

                {/* Bar chart */}
                <div className="space-y-5 mb-7">
                  {painPoints.map((point, i) => (
                    <div key={point.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{point.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {point.count} 条
                          </span>
                          <span className="text-xs font-bold text-primary w-8 text-right">{point.percent}%</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${point.percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reviews */}
                <div className="border-t border-border/50 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">用户真实评价摘录</span>
                  </div>
                  <div className="space-y-2">
                    {reviews.map((review, i) => (
                      <div
                        key={i}
                        className="text-xs text-foreground/70 bg-secondary/50 rounded-lg px-3.5 py-2.5 border-l-[3px] border-primary/25 hover:bg-secondary/80 transition-colors"
                      >
                        <span className="text-foreground/50">"</span>
                        {review.text}
                        <span className="text-foreground/50">"</span>
                        <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
                          review.sentiment === "negative"
                            ? "bg-red-50 text-red-400"
                            : "bg-yellow-50 text-yellow-600"
                        }`}>
                          {review.sentiment === "negative" ? "负面" : "中性"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: AI Suggestions */}
              <div className="p-6 border-l border-border/50 bg-gradient-to-b from-orange-50/30 to-white">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-warm-orange/10 flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-warm-orange" />
                  </div>
                  <span className="text-sm font-bold">AI 内容建议</span>
                </div>
                <div className="space-y-3">
                  {suggestions.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                      className="bg-white rounded-xl p-4 border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-warm-orange/10 flex items-center justify-center text-warm-orange text-[10px] font-bold group-hover:bg-warm-orange group-hover:text-white transition-colors">
                            {i + 1}
                          </div>
                          <span className="text-sm font-semibold">{item.title}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          item.priority === "高"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {item.priority}优先
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-7 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
