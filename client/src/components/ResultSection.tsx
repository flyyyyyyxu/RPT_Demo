/*
 * Design: SaaS 工具站美学 - AI 生成结果展示区
 * - 可编辑预览面板
 * - 多版本切换
 * - 小红书风格笔记预览
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Wand2,
  Save,
  Send,
  Copy,
  Hash,
  Heart,
  Star,
  BookmarkPlus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const versions = [
  {
    id: "v1",
    label: "V1",
    title: "混油皮亲测｜这款粉底液真的轻薄不闷痘！",
    content: `混油皮最近试了这款粉底液，整体是轻薄挂的，上脸不会特别闷，日常通勤妆够用了。

我的肤质是 T 区偏油、两颊偏干那种，之前用过好几款都容易午后脱妆。这款上脸第一感觉就是水润，不会有那种厚重的糊墙感。

用了大概一周，说说真实感受：
🔹 遮瑕力中等偏上，痘印基本能盖住
🔹 持妆大概 6-7 小时没问题，不补妆也不会特别拉胯
🔹 最喜欢的是妆感很自然，同事都说看不出来化了妆

不过也有小缺点，就是如果出汗比较多的话，T 区还是会有点泛油。建议搭配控油散粉使用。

总的来说，日常通勤、约会见朋友都够用了，性价比也不错。敏感肌的姐妹可以先在耳后试一下哦～`,
    tags: ["粉底液测评", "混油皮底妆", "平价好物", "通勤妆容", "真实分享"],
    score: 92,
  },
  {
    id: "v2",
    label: "V2",
    title: "学生党底妆分享｜百元粉底也能有高级感",
    content: `学生党的底妆预算有限，但谁说平价就不能有好妆效？

这款粉底液我已经用了快一个月了，最大的感受就是——轻薄。上脸完全没有负担感，像是给皮肤穿了一层薄纱。

几个让我回购的理由：
🔹 价格友好，学生党无压力
🔹 色号选择多，我选的自然色很贴肤
🔹 不搓泥不卡粉，新手也能驾驭
🔹 持妆效果超出预期，上午的课到下午都 OK

唯一要注意的是，干皮姐妹记得做好保湿打底，不然可能会有点拔干。

每天早上五分钟就能搞定底妆出门，真的太适合赶早课的我了！`,
    tags: ["学生党底妆", "平价粉底液", "百元好物", "新手化妆", "开学季"],
    score: 88,
  },
  {
    id: "v3",
    label: "V3",
    title: "敏感肌友好｜终于找到不闷痘的粉底了",
    content: `作为一个敏感肌 + 混油皮，找到一款不闷痘的粉底真的太难了。

之前踩过很多雷，要么太厚重闷痘，要么遮瑕力不够。这款算是在两者之间找到了一个平衡点。

我的使用方法：
🔹 先用保湿水乳打底
🔹 取一泵用湿海绵拍开
🔹 重点部位可以叠加第二层
🔹 最后用散粉轻扫定妆

用了两周，脸上没有冒新痘，这对我来说已经是很大的加分项了。妆效方面属于奶油肌那种，不是很 matte 但也不会太水光。

如果你也是敏感肌在找底妆，可以考虑试试这款。记得先做过敏测试哦！`,
    tags: ["敏感肌底妆", "不闷痘粉底", "敏感肌护肤", "底妆分享", "护肤心得"],
    score: 90,
  },
];

export default function ResultSection() {
  const [activeVersion, setActiveVersion] = useState("v1");
  const currentVersion = versions.find((v) => v.id === activeVersion) || versions[0];

  return (
    <section id="result" className="py-20 lg:py-28 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            生成结果
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            AI 生成的种草笔记预览
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            支持多版本对比、编辑微调和一键发布
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            {/* Main Preview */}
            <div className="rounded-2xl border border-border/60 bg-white shadow-xl shadow-black/5 overflow-hidden">
              {/* Toolbar */}
              <div className="px-5 py-3.5 border-b border-border/50 bg-[#fafafa] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium mr-1">版本：</span>
                  {versions.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVersion(v.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeVersion === v.id
                          ? "bg-primary text-white shadow-sm shadow-primary/20"
                          : "bg-white text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs bg-white"
                    onClick={() => toast.info("正在重新生成...")}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    重新生成
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs bg-white"
                    onClick={() => toast.info("微调功能即将上线")}
                  >
                    <Wand2 className="w-3.5 h-3.5 mr-1" />
                    微调内容
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                {/* Title */}
                <div className="mb-1.5">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">标题</span>
                </div>
                <h3 className="text-xl font-bold mb-6 pb-5 border-b border-border/30 leading-snug">
                  {currentVersion.title}
                </h3>

                {/* Body */}
                <div className="mb-1.5">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">正文</span>
                </div>
                <div className="text-sm leading-[1.8] text-foreground/75 whitespace-pre-line mb-7 bg-secondary/20 rounded-xl p-5 border border-border/30">
                  {currentVersion.content}
                </div>

                {/* Tags */}
                <div className="mb-1.5">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">话题标签</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-7">
                  {currentVersion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-coral-light/60 text-primary text-xs font-medium border border-primary/10 hover:bg-coral-light transition-colors"
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2.5 pt-5 border-t border-border/30">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                    onClick={() => toast.success("笔记已发布！")}
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    发布
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white"
                    onClick={() => toast.success("已保存为草稿")}
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    保存草稿
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white"
                    onClick={() => toast.info("已生成 3 个版本，请在右侧切换查看")}
                  >
                    <Copy className="w-4 h-4 mr-1.5" />
                    生成多版本
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Version Cards */}
            <div className="space-y-3">
              <div className="text-sm font-bold text-foreground mb-2">多版本预览</div>
              {versions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVersion(v.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                    activeVersion === v.id
                      ? "border-primary/30 bg-gradient-to-r from-coral-light/40 to-white shadow-md ring-1 ring-primary/10"
                      : "border-border bg-white hover:border-primary/20 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      activeVersion === v.id
                        ? "bg-primary text-white"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {v.label}
                    </span>
                    {activeVersion === v.id && (
                      <span className="text-[10px] text-primary font-semibold">当前查看</span>
                    )}
                  </div>
                  <div className="text-sm font-semibold line-clamp-2 mb-1.5">{v.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {v.content.substring(0, 60)}...
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-border/30">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Heart className="w-3 h-3" /> 预估互动高
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Star className="w-3 h-3 text-warm-orange" />
                      <span className="font-semibold text-foreground">{v.score}</span>分
                    </span>
                  </div>
                </button>
              ))}

              {/* Tip card */}
              <div className="rounded-xl bg-secondary/40 border border-border/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookmarkPlus className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">使用提示</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  不满意当前结果？可以返回调整内容策略配置，或使用「微调内容」功能进行局部修改。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
