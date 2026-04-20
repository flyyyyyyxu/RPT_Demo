import { Sparkles, Save, User, Check } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface CreateLayoutProps {
  currentStep: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}

const steps = [
  { id: 1, label: "商品信息", path: "/create" },
  { id: 2, label: "内容策略", path: "/create/strategy" },
  { id: 3, label: "图片编辑", path: "/create/images" },
  { id: 4, label: "生成预览", path: "/create/result" },
];

export default function CreateLayout({ currentStep, children, rightAction }: CreateLayoutProps) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Single unified header with steps inline */}
      <header className="h-14 border-b border-border/50 bg-white flex items-center px-4 lg:px-6 shrink-0 gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-foreground hidden sm:inline">种草机</span>
        </a>

        {/* Step indicator — centered, fills remaining space */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => step.id < currentStep && navigate(step.path)}
                  className={step.id < currentStep ? "cursor-pointer" : "cursor-default"}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold tracking-tight transition-all ${
                        step.id < currentStep
                          ? "bg-primary/15 text-primary"
                          : step.id === currentStep
                          ? "bg-primary text-white shadow-md shadow-primary/30"
                          : "bg-secondary text-muted-foreground/60"
                      }`}
                    >
                      {step.id < currentStep ? <Check className="w-3 h-3" strokeWidth={3} /> : step.id}
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-tight hidden md:inline transition-colors ${
                        step.id === currentStep
                          ? "text-foreground"
                          : step.id < currentStep
                          ? "text-foreground/70"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </button>

                {i < steps.length - 1 && (
                  <div
                    className={`w-8 lg:w-12 h-px mx-2 shrink-0 ${
                      step.id < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          {rightAction}
          <button
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => toast.success("草稿已保存")}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">保存草稿</span>
          </button>
          <button
            onClick={() => navigate("/account")}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
