/*
 * Design: SaaS 工具站美学 - Hero 首屏
 * - 左文右图的非对称布局
 * - 柔和渐变背景
 * - 产品界面 mockup 展示
 */
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663319340501/HSq26w75LQs6d3FSyDF3sX/hero-bg-abstract-5XSBi9GhnYPDPgmTCgRgGm.webp";
const HERO_MOCKUP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663319340501/HSq26w75LQs6d3FSyDF3sX/hero-mockup-QRrKyuBhfd7BgpeVnwj6d5.webp";

export default function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section
      id="hero"
      className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo/5 rounded-full blur-3xl -z-10" />

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-primary/15 text-primary text-xs font-medium mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              AI 驱动的商家内容创作工具
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.2] tracking-tight text-foreground mb-5">
              帮商家更快产出
              <br />
              <span className="bg-gradient-to-r from-primary to-coral-dark bg-clip-text text-transparent">
                适合小红书的种草笔记
              </span>
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              从商品信息、竞品评论到内容生成，一站式完成商家内容创作。
              让不会写笔记的商家，也能产出高质量种草内容。
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-6 h-12"
                onClick={() => navigate("/create")}
              >
                立即体验
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/70 backdrop-blur-sm border-border/80 hover:bg-white px-6 h-12"
                onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="w-4 h-4 mr-1.5 text-primary" />
                查看创作流程
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-border/50">
              {[
                { value: "3 步", label: "完成笔记生成" },
                { value: "10 秒", label: "AI 生成速度" },
                { value: "多版本", label: "一键生成对比" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                >
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-white/60 bg-white">
              <img
                src={HERO_MOCKUP}
                alt="笔记灵感工坊产品界面"
                className="w-full h-auto"
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-xl shadow-black/8 border border-border/40 px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">笔记已生成</div>
                  <div className="text-[11px] text-muted-foreground">3 个版本可供选择</div>
                </div>
              </div>
            </motion.div>

            {/* Top-right floating element */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute -top-3 -right-3 bg-white rounded-lg shadow-lg shadow-black/5 border border-border/40 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground">AI 分析中</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
