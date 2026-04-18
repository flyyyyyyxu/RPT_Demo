/*
 * Design: SaaS 工具站美学 - 内容策略配置区
 * - 仿真后台表单界面
 * - 标签选择器 + 开关 + 按钮组
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const styleOptions = ["真实分享", "种草推荐", "功效对比", "购物攻略"];
const audienceOptions = ["学生党", "上班族", "敏感肌", "油皮 / 混油皮"];
const toneOptions = ["真诚", "活泼", "专业", "朋友感"];

export default function StrategySection() {
  const [selectedStyle, setSelectedStyle] = useState("真实分享");
  const [selectedAudience, setSelectedAudience] = useState("敏感肌");
  const [selectedTone, setSelectedTone] = useState("真诚");
  const [priceAdvantage, setPriceAdvantage] = useState(true);
  const [useScenario, setUseScenario] = useState(false);
  const [hotTags, setHotTags] = useState(true);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-4">
            <Settings2 className="w-3.5 h-3.5" />
            策略配置
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            精细化内容策略配置
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            根据目标人群和内容风格，定制最适合的笔记生成策略
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-border/60 bg-white shadow-xl shadow-black/5 overflow-hidden">
            {/* Panel header */}
            <div className="px-6 py-4 border-b border-border/50 bg-[#fafafa] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold">内容策略配置面板</span>
              </div>
              <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-md font-medium">
                步骤 4/6
              </span>
            </div>

            <div className="p-6 lg:p-8 space-y-8">
              {/* 笔记风格 */}
              <ConfigGroup label="笔记风格" description="选择笔记的内容表达方式">
                <div className="flex flex-wrap gap-2.5">
                  {styleOptions.map((opt) => (
                    <TagButton
                      key={opt}
                      label={opt}
                      active={selectedStyle === opt}
                      onClick={() => setSelectedStyle(opt)}
                    />
                  ))}
                </div>
              </ConfigGroup>

              {/* 目标人群 */}
              <ConfigGroup label="目标人群" description="选择笔记面向的核心受众">
                <div className="flex flex-wrap gap-2.5">
                  {audienceOptions.map((opt) => (
                    <TagButton
                      key={opt}
                      label={opt}
                      active={selectedAudience === opt}
                      onClick={() => setSelectedAudience(opt)}
                    />
                  ))}
                </div>
              </ConfigGroup>

              {/* 内容语气 */}
              <ConfigGroup label="内容语气" description="设定笔记的整体语气风格">
                <div className="flex flex-wrap gap-2.5">
                  {toneOptions.map((opt) => (
                    <TagButton
                      key={opt}
                      label={opt}
                      active={selectedTone === opt}
                      onClick={() => setSelectedTone(opt)}
                    />
                  ))}
                </div>
              </ConfigGroup>

              {/* Divider */}
              <div className="border-t border-border/40" />

              {/* Toggle options */}
              <div className="space-y-5">
                <ToggleOption
                  label="强调价格优势"
                  description="在笔记中突出产品的性价比"
                  checked={priceAdvantage}
                  onChange={setPriceAdvantage}
                />
                <ToggleOption
                  label="突出使用场景"
                  description="加入具体的使用场景描述"
                  checked={useScenario}
                  onChange={setUseScenario}
                />
                <ToggleOption
                  label="加入热门标签建议"
                  description="自动推荐当前热门话题标签"
                  checked={hotTags}
                  onChange={setHotTags}
                />
              </div>
            </div>

            {/* Panel footer */}
            <div className="px-6 lg:px-8 py-4 border-t border-border/50 bg-[#fafafa] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>已选择：</span>
                {[selectedStyle, selectedAudience, selectedTone].map((item) => (
                  <span key={item} className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                    {item}
                  </span>
                ))}
              </div>
              <button className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                <Sparkles className="w-4 h-4" />
                确认配置，开始生成
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ConfigGroup({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-sm font-bold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      {children}
    </div>
  );
}

function TagButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
        active
          ? "bg-primary text-white border-primary shadow-md shadow-primary/15 scale-[1.02]"
          : "bg-white text-foreground/60 border-border hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function ToggleOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors -mx-3">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
