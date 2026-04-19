/*
 * 图片编辑子步骤导航条
 * 4个子步骤: 制作封面图 → 封面文字与样式 → 上传配图 → 合成预览
 */

interface ImageSubStepNavProps {
  currentSubStep: number;
  onSubStepChange: (step: number) => void;
}

const SUB_STEPS = [
  { id: 1, label: "制作封面图" },
  { id: 2, label: "封面文字与样式" },
  { id: 3, label: "上传配图" },
  { id: 4, label: "合成预览" },
];

export default function ImageSubStepNav({ currentSubStep, onSubStepChange }: ImageSubStepNavProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-1.5 shadow-sm mb-8">
      <div className="grid grid-cols-4 gap-1">
        {SUB_STEPS.map((step) => {
          const isActive = step.id === currentSubStep;
          const isCompleted = step.id < currentSubStep;
          return (
            <button
              key={step.id}
              onClick={() => {
                if (step.id <= currentSubStep) onSubStepChange(step.id);
              }}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : isCompleted
                  ? "bg-primary/5 text-primary cursor-pointer hover:bg-primary/10"
                  : "text-muted-foreground cursor-default"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isCompleted
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.id
                )}
              </span>
              <span className="hidden sm:inline truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
