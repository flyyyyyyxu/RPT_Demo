/*
 * Design: SaaS 工具站美学 - 创作流程共享布局
 * - 顶部导航栏（简化版）
 * - 4步骤指示器：商品信息 → 内容策略 → 图片生成 → 生成预览
 * - 内容区域
 */
import { Sparkles, Save, User, Check } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface CreateLayoutProps {
  currentStep: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  costCredits?: number;
}

const steps = [
  { id: 1, label: "商品信息", path: "/create" },
  { id: 2, label: "内容策略", path: "/create/strategy" },
  { id: 3, label: "图片编辑", path: "/create/images" },
  { id: 4, label: "生成预览", path: "/create/result" },
];

export default function CreateLayout({ currentStep, children, rightAction, costCredits = 2 }: CreateLayoutProps) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="h-14 border-b border-border/50 bg-white flex items-center px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-2.5 mr-8">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">种草机</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {["新建笔记", "我的笔记", "商品库", "数据"].map((item, i) => (
            <button
              key={item}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                i === 0
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
              onClick={() => {
                if (i === 0) return;
                toast.info("功能即将上线");
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Cost display */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-md">
            <span>本次预计消耗</span>
            <span className="font-bold text-primary">{costCredits}</span>
            <span>额度</span>
          </div>
          {rightAction}
          <button
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => toast.success("草稿已保存")}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">保存草稿</span>
          </button>
          <button
            onClick={() => navigate("/account")}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Step indicator */}
      <div className="border-b border-border/40 bg-white py-4 shrink-0">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.id < currentStep) navigate(step.path);
                  }}
                  className={`flex items-center gap-2 ${
                    step.id < currentStep ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step.id < currentStep
                        ? "bg-primary text-white"
                        : step.id === currentStep
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      step.id === currentStep
                        ? "text-foreground"
                        : step.id < currentStep
                        ? "text-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={`w-10 sm:w-16 lg:w-20 h-px mx-2 sm:mx-3 ${
                      step.id < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
