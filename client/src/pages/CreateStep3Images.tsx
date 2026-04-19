/*
 * Step 3: 图片编辑
 * 小红书笔记图片编辑页面，包含 4 个子步骤：
 * 1. 制作封面图 - 上传产品图、场景描述、风格选择
 * 2. 封面文字与样式 - 选择封面、编辑文字、样式设置
 * 3. 上传配图 - 管理配图顺序和数量
 * 4. 合成预览 - 最终预览、评分、优化建议
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import CreateLayout from "@/components/create/CreateLayout";
import ImageSubStepNav from "@/components/create/ImageSubStepNav";
import ImageStep1Cover from "@/components/create/ImageStep1Cover";
import ImageStep2Text from "@/components/create/ImageStep2Text";
import ImageStep3Upload from "@/components/create/ImageStep3Upload";
import ImageStep4Preview from "@/components/create/ImageStep4Preview";
import { useCreateContext } from "@/contexts/CreateContext";

export default function CreateStep3Images() {
  const [, navigate] = useLocation();
  const { imageConfig, setImageConfig } = useCreateContext();

  const [subStep, setSubStep] = useState(imageConfig.imageSubStep || 1);

  const handleSubStepChange = (step: number) => {
    setSubStep(step);
    setImageConfig({ ...imageConfig, imageSubStep: step });
  };

  return (
    <CreateLayout currentStep={3} costCredits={imageConfig.imageCount}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">图片编辑</h1>
          <p className="text-sm text-muted-foreground">
            AI 帮你生成封面图，其他配图你自己上传，一步步完成点击率最高的图片组合
          </p>
        </div>

        {/* Sub-step navigation */}
        <ImageSubStepNav
          currentSubStep={subStep}
          onSubStepChange={handleSubStepChange}
        />

        {/* Sub-step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={subStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {subStep === 1 && (
              <ImageStep1Cover
                onNext={() => handleSubStepChange(2)}
                onBack={() => navigate("/create/strategy")}
                onSkip={() => navigate("/create/result")}
              />
            )}
            {subStep === 2 && (
              <ImageStep2Text
                onNext={() => handleSubStepChange(3)}
                onBack={() => handleSubStepChange(1)}
              />
            )}
            {subStep === 3 && (
              <ImageStep3Upload
                onNext={() => handleSubStepChange(4)}
                onBack={() => handleSubStepChange(2)}
              />
            )}
            {subStep === 4 && (
              <ImageStep4Preview
                onBack={() => handleSubStepChange(3)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </CreateLayout>
  );
}
