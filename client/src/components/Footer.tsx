/*
 * Design: SaaS 工具站美学 - Footer
 */
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-border/50 bg-white">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/15">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">种草机</span>
          </div>
          <div className="text-xs text-muted-foreground">
            https://github.com/flyyyyyyxu/RPT_Demo.git · 面向小红书商家的 AI 内容创作工具
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            {["产品介绍", "使用帮助", "联系我们"].map((item) => (
              <button
                key={item}
                className="hover:text-foreground transition-colors"
                onClick={() => toast.info("功能即将上线")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border/30 text-center text-[11px] text-muted-foreground/60">
          本页面为产品概念演示，所有数据均为模拟示例
        </div>
      </div>
    </footer>
  );
}
