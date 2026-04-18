/*
 * Design: SaaS 工具站美学
 * - 简洁导航栏，固定顶部
 * - 导航项：功能介绍 / 创作流程 / 示例结果
 * - 右侧：开始生成按钮 + 头像
 */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const navItems = [
  { label: "功能介绍", href: "#hero" },
  { label: "创作流程", href: "#workflow" },
  { label: "示例结果", href: "#result" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goCreate = () => navigate("/create");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-border/50 shadow-sm shadow-black/3"
          : "bg-white/60 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20 group-hover:shadow-md group-hover:shadow-primary/25 transition-shadow">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            种草机
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/80"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA + Avatar */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-all"
            onClick={goCreate}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            开始生成
          </Button>
          <button
            onClick={() => navigate("/account")}
            className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors border border-border/50"
            title="我的账号"
          >
            <User className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary/80 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-left"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/account");
                }}
              >
                我的账号
              </button>
              <Button
                size="sm"
                className="mt-2 bg-primary hover:bg-primary/90 text-white shadow-sm"
                onClick={() => {
                  setMobileOpen(false);
                  goCreate();
                }}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                开始生成
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
