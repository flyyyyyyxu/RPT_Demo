/*
 * Design: SaaS 工具站美学 - 底部 CTA 区
 * - 渐变背景卡片
 * - 一句话总结 + 按钮
 */
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function CTASection() {
  const [, navigate] = useLocation();

  return (
    <section id="cta" className="py-20 lg:py-28 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="relative rounded-3xl overflow-hidden p-10 lg:p-16 shadow-xl shadow-black/5">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-coral-light via-white to-indigo-light" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,68,90,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,70,229,0.06),transparent_50%)]" />
            <div className="absolute inset-0 border border-white/60 rounded-3xl" />

            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg shadow-primary/10 mb-7"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-tight">
                让商家从会卖货，
                <br />
                <span className="bg-gradient-to-r from-primary to-coral-dark bg-clip-text text-transparent">
                  变成也会做内容。
                </span>
              </h2>

              <p className="text-muted-foreground mb-9 max-w-md mx-auto leading-relaxed">
                无需专业写手，无需反复修改。用 AI 洞察驱动内容创作，让每一篇笔记都精准触达目标用户。
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-8 h-12 text-base"
                  onClick={() => navigate("/create")}
                >
                  立即体验
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm border-border/80 px-8 h-12 text-base"
                  onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
                >
                  查看 Demo
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
