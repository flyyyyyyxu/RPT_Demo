/*
 * 图片编辑子步骤导航条
 * 4个子步骤: 制作封面图 → 封面文字与样式 → 上传配图 → 合成预览
 */
import { ImageIcon, Type, Upload, Eye, Check } from "lucide-react";

interface ImageSubStepNavProps {
  currentSubStep: number;
  onSubStepChange: (step: number) => void;
}

const SUB_STEPS = [
  { id: 1, label: "制作封面图", icon: ImageIcon },
  { id: 2, label: "封面文字与样式", icon: Type },
  { id: 3, label: "上传配图", icon: Upload },
  { id: 4, label: "合成预览", icon: Eye },
];

export default function ImageSubStepNav({ currentSubStep, onSubStepChange }: ImageSubStepNavProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-2 shadow-sm mb-8">
      <div className="grid grid-cols-4 gap-1.5">
        {SUB_STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentSubStep;
          const isCompleted = step.id < currentSubStep;
          return (
            <button
              key={step.id}
              onClick={() => {
                if (step.id <= currentSubStep) onSubStepChange(step.id);
              }}
              className={`relative flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : isCompleted
                  ? "bg-primary/5 text-primary cursor-pointer hover:bg-primary/10"
                  : "text-muted-foreground/70 cursor-default"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isCompleted
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground/60"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </span>
              <span className="hidden sm:inline truncate">
                <span className="text-[10px] opacity-60 mr-1">0{step.id}</span>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
