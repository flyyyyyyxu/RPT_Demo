/*
 * Account page - 我的账号
 * Simple placeholder with user info and settings
 */
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  FileText,
  Package,
  BarChart3,
  Settings,
  CreditCard,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const menuItems = [
  { icon: FileText, label: "我的笔记", desc: "查看已生成的笔记和草稿", count: "12 篇" },
  { icon: Package, label: "商品库", desc: "管理已导入的商品", count: "5 个" },
  { icon: BarChart3, label: "数据看板", desc: "查看笔记发布效果" },
  { icon: CreditCard, label: "额度管理", desc: "查看和购买生成额度", count: "32 / 50" },
  { icon: Settings, label: "账号设置", desc: "修改个人信息和偏好" },
];

export default function Account() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-white flex items-center px-4 lg:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          返回首页
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold">笔记灵感工坊</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">商家用户</h1>
              <p className="text-sm text-muted-foreground mt-0.5">merchant@example.com</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  专业版
                </span>
                <span className="text-[11px] text-muted-foreground">
                  剩余额度 32 / 50
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu items */}
        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              onClick={() => {
                if (item.label === "我的笔记") {
                  navigate("/");
                } else {
                  // toast would need import, just use simple approach
                }
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-white hover:border-primary/20 hover:bg-primary/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left flex-1">
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              {item.count && (
                <span className="text-xs font-medium text-muted-foreground">{item.count}</span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </motion.button>
          ))}
        </div>

        {/* Quick action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8"
        >
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 h-12"
            onClick={() => navigate("/create")}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            新建笔记
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
