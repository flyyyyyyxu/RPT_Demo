/*
 * Product category presets — the single source of truth for:
 *   - category id enum (LLM 归类合约的合法输出集)
 *   - 卖点 / 人群候选池 (Step1 动态推荐)
 *   - driverType → 现有 DRIVER_STRATEGY_MAP 的接入点 (Step2 内容策略)
 *
 * 本文件只做数据声明，不 import 任何 React / 业务逻辑。
 * 新增或修改品类时：保证 id 唯一、keywords 非空、driverType 在 ContentDriverType 里。
 * 运行时兜底：见 FALLBACK_PRESET。
 */
import type { ContentDriverType } from "../types/contentStrategy";

export type CategoryPreset = {
  id: string;
  name: string;
  driverType: ContentDriverType;
  keywords: string[];
  sellingPoints: string[];
  audiences: string[];
};

export type CategoryOverride = {
  match: string[];
  addSellingPoints?: string[];
  addAudiences?: string[];
};

export const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    id: "skincare_cleanser",
    name: "护肤-洁面",
    driverType: "功能决策型",
    keywords: ["洗面奶", "洁面", "洁面乳", "洁颜", "氨基酸洁面", "泡沫洁面"],
    sellingPoints: ["温和清洁", "氨基酸", "敏感肌适用", "洗后不紧绷", "控油清爽", "保湿", "早晚可用", "大牌平替"],
    audiences: ["敏感肌", "学生党", "油皮", "干皮", "混合肌", "职场人", "宝妈"],
  },
  {
    id: "skincare_toner",
    name: "护肤-爽肤水/化妆水",
    driverType: "功能决策型",
    keywords: ["爽肤水", "化妆水", "精粹水", "柔肤水", "喷雾"],
    sellingPoints: ["补水保湿", "清爽好吸收", "舒缓维稳", "湿敷友好", "不黏腻", "换季可用", "敏感肌适用", "日常维稳"],
    audiences: ["干皮", "敏感肌", "学生党", "熬夜党", "换季人群", "新手护肤"],
  },
  {
    id: "skincare_serum",
    name: "护肤-精华",
    driverType: "功能决策型",
    keywords: ["精华", "精华液", "原液", "安瓶", "次抛"],
    sellingPoints: ["抗氧提亮", "补水修护", "维稳舒缓", "淡化暗沉", "改善粗糙", "成分党友好", "质地轻薄", "见效感强"],
    audiences: ["熬夜党", "暗沉肌", "敏感肌", "轻熟龄", "职场人", "成分党"],
  },
  {
    id: "skincare_lotion_cream",
    name: "护肤-乳液/面霜",
    driverType: "功能决策型",
    keywords: ["乳液", "面霜", "乳霜", "保湿霜", "修护霜", "身体乳"],
    sellingPoints: ["保湿锁水", "修护屏障", "滋润不厚重", "秋冬必备", "舒缓干燥", "敏感肌适用", "肤感好", "全家可用"],
    audiences: ["干皮", "敏感肌", "秋冬怕干人群", "宝妈", "学生党", "轻熟龄"],
  },
  {
    id: "skincare_sunscreen",
    name: "护肤-防晒",
    driverType: "功能决策型",
    keywords: ["防晒", "防晒霜", "防晒乳", "防晒喷雾", "隔离防晒"],
    sellingPoints: ["高倍防晒", "通勤友好", "不搓泥", "不假白", "成膜快", "清爽不油", "妆前友好", "户外可用"],
    audiences: ["学生党", "上班族", "油皮", "户外党", "通勤人群", "敏感肌"],
  },
  {
    id: "skincare_mask",
    name: "护肤-面膜",
    driverType: "场景种草型",
    keywords: ["面膜", "贴片面膜", "涂抹面膜", "睡眠面膜", "泥膜"],
    sellingPoints: ["急救补水", "舒缓维稳", "清洁毛孔", "熬夜救星", "上脸服帖", "肤感舒服", "约会前急救", "性价比高"],
    audiences: ["熬夜党", "学生党", "约会人群", "油皮", "敏感肌", "干皮"],
  },
  {
    id: "makeup_base",
    name: "彩妆-底妆",
    driverType: "功能决策型",
    keywords: ["粉底", "粉底液", "气垫", "遮瑕", "妆前乳", "隔离", "散粉", "粉饼"],
    sellingPoints: ["轻薄服帖", "自然不假面", "持妆在线", "遮瑕力好", "控油定妆", "通勤妆友好", "新手易上手", "黄皮友好"],
    audiences: ["学生党", "上班族", "新手化妆", "油皮", "混油皮", "黄皮女生"],
  },
  {
    id: "makeup_lips",
    name: "彩妆-唇部",
    driverType: "体验分享型",
    keywords: ["口红", "唇釉", "唇泥", "唇蜜", "润唇膏"],
    sellingPoints: ["显白提气色", "日常百搭", "不挑肤色", "素颜可涂", "成膜快", "不易沾杯", "质地高级", "热门色号"],
    audiences: ["黄皮女生", "学生党", "通勤人群", "约会人群", "化妆新手"],
  },
  {
    id: "makeup_eye",
    name: "彩妆-眼部",
    driverType: "功能决策型",
    keywords: ["眼影", "眼线", "睫毛膏", "眉笔", "眉粉", "卧蚕笔"],
    sellingPoints: ["新手友好", "配色实用", "不飞粉", "不晕染", "放大双眼", "日常妆容", "通勤可用", "性价比高"],
    audiences: ["学生党", "新手化妆", "通勤女生", "约会人群"],
  },
  {
    id: "beauty_tools",
    name: "美妆工具",
    driverType: "体验分享型",
    keywords: ["粉扑", "化妆刷", "美妆蛋", "睫毛夹", "镜子", "收纳盒彩妆"],
    sellingPoints: ["上妆服帖", "新手好用", "柔软亲肤", "方便清洗", "收纳整洁", "平价实用", "提升妆效"],
    audiences: ["新手化妆", "学生党", "日常通勤人群"],
  },
  {
    id: "haircare_shampoo",
    name: "洗护-洗发水",
    driverType: "体验分享型",
    keywords: ["洗发水", "洗发露", "头皮洗发", "控油洗发"],
    sellingPoints: ["控油蓬松", "清洁头皮", "去屑止痒", "洗后不干涩", "香味高级", "细软塌救星", "持久清爽", "日常通勤适合"],
    audiences: ["油头", "细软塌发质", "学生党", "上班族", "熬夜党"],
  },
  {
    id: "haircare_conditioner",
    name: "洗护-护发",
    driverType: "体验分享型",
    keywords: ["护发素", "发膜", "护发精油", "修护发膜", "护发喷雾"],
    sellingPoints: ["柔顺不毛躁", "修护受损", "改善打结", "顺滑有光泽", "烫染发友好", "香味持久", "不厚重"],
    audiences: ["长发女生", "烫染人群", "毛躁发质", "学生党", "上班族"],
  },
  {
    id: "bodycare",
    name: "身体护理",
    driverType: "体验分享型",
    keywords: ["沐浴露", "身体乳", "磨砂膏", "止汗露", "手霜"],
    sellingPoints: ["香味好闻", "保湿滋润", "去鸡皮", "清爽不黏", "留香持久", "秋冬必备", "洗感舒服", "约会氛围感"],
    audiences: ["女生", "学生党", "上班族", "秋冬干皮", "约会人群"],
  },
  {
    id: "oral_care",
    name: "口腔护理",
    driverType: "功能决策型",
    keywords: ["牙膏", "牙刷", "漱口水", "冲牙器", "牙线"],
    sellingPoints: ["清新口气", "温和护龈", "清洁到位", "牙渍护理", "便携日常", "口腔清爽", "电动省力"],
    audiences: ["上班族", "学生党", "正畸人群", "精致生活人群"],
  },
  {
    id: "fragrance_perfume",
    name: "香氛-香水",
    driverType: "情绪共鸣型",
    keywords: ["香水", "淡香水", "香氛喷雾", "香膏"],
    sellingPoints: ["高级感香调", "留香持久", "不容易撞香", "日常通勤", "约会氛围感", "清冷感", "甜妹感", "送礼合适"],
    audiences: ["女生", "男生", "上班族", "约会人群", "送礼人群", "精致生活人群"],
  },
  {
    id: "fragrance_home",
    name: "香氛-家居香氛",
    driverType: "情绪共鸣型",
    keywords: ["香薰", "香薰蜡烛", "无火香薰", "扩香", "香氛机"],
    sellingPoints: ["提升氛围感", "居家治愈", "颜值高", "香味高级", "放松助眠", "送礼友好", "拍照出片", "卧室必备"],
    audiences: ["租房党", "居家党", "送礼人群", "女生", "精致生活人群"],
  },
  {
    id: "clothing_top",
    name: "服饰-上衣",
    driverType: "场景种草型",
    keywords: ["T恤", "衬衫", "背心", "卫衣", "毛衣", "针织衫"],
    sellingPoints: ["百搭基础款", "显瘦", "版型好", "面料舒服", "通勤休闲都可", "上身显气质", "性价比高", "不挑人"],
    audiences: ["学生党", "上班族", "小个子", "微胖女生", "通勤人群"],
  },
  {
    id: "clothing_pants",
    name: "服饰-裤装/裙装",
    driverType: "场景种草型",
    keywords: ["裤子", "牛仔裤", "阔腿裤", "半身裙", "短裙", "长裙", "西装裤"],
    sellingPoints: ["显腿长", "修饰腿型", "高腰显瘦", "通勤百搭", "面料垂顺", "舒适好穿", "梨形友好", "小个子友好"],
    audiences: ["小个子", "梨形身材", "通勤女生", "学生党", "微胖女生"],
  },
  {
    id: "clothing_underwear_sleep",
    name: "服饰-内衣/睡衣/家居服",
    driverType: "场景种草型",
    keywords: ["内衣", "文胸", "内裤", "睡衣", "家居服", "吊带睡裙"],
    sellingPoints: ["舒适无束缚", "亲肤柔软", "透气不闷", "居家舒服", "显瘦显气色", "高颜值", "可外穿感", "秋冬保暖"],
    audiences: ["女生", "居家党", "怕冷人群", "宝妈", "学生党"],
  },
  {
    id: "clothing_socks",
    name: "服饰-袜子",
    driverType: "场景种草型",
    keywords: ["袜子", "中筒袜", "船袜", "长袜", "珊瑚绒袜", "堆堆袜"],
    sellingPoints: ["柔软亲肤", "保暖", "不勒脚", "吸汗透气", "居家舒适", "可爱百搭", "拍照出片", "性价比高"],
    audiences: ["学生党", "女生", "怕冷人群", "居家党", "宝妈", "老人"],
  },
  {
    id: "shoes",
    name: "鞋靴",
    driverType: "场景种草型",
    keywords: ["运动鞋", "小白鞋", "板鞋", "乐福鞋", "高跟鞋", "短靴", "拖鞋", "凉鞋"],
    sellingPoints: ["舒适好走", "百搭不挑衣服", "显腿长", "不磨脚", "轻便", "通勤可穿", "日常出片", "增高显高"],
    audiences: ["学生党", "上班族", "小个子", "通勤人群", "旅行党"],
  },
  {
    id: "bags",
    name: "包袋",
    driverType: "场景种草型",
    keywords: ["包", "托特包", "斜挎包", "双肩包", "腋下包", "通勤包", "化妆包"],
    sellingPoints: ["容量大", "通勤实用", "百搭高级", "轻便", "颜值高", "出门好搭", "学生上课可背", "性价比高"],
    audiences: ["学生党", "上班族", "通勤女生", "精致生活人群"],
  },
  {
    id: "accessories",
    name: "配饰",
    driverType: "情绪共鸣型",
    keywords: ["帽子", "围巾", "发夹", "发圈", "耳饰", "项链", "手链", "眼镜"],
    sellingPoints: ["提升穿搭完成度", "显脸小", "氛围感", "日常百搭", "拍照出片", "送礼合适", "精致感加分"],
    audiences: ["女生", "穿搭党", "学生党", "约会人群", "送礼人群"],
  },
  {
    id: "home_bedding",
    name: "家居-床品家纺",
    driverType: "场景种草型",
    keywords: ["四件套", "床单", "被套", "枕套", "毛毯", "凉席", "被子", "枕头"],
    sellingPoints: ["亲肤柔软", "睡感舒服", "颜值高", "提升卧室氛围", "四季可用", "机洗方便", "租房友好", "治愈感"],
    audiences: ["租房党", "宿舍党", "居家党", "女生", "新婚人群"],
  },
  {
    id: "home_storage",
    name: "家居-收纳整理",
    driverType: "场景种草型",
    keywords: ["收纳盒", "置物架", "整理箱", "化妆品收纳", "衣柜收纳", "桌面收纳"],
    sellingPoints: ["小空间友好", "提升整洁感", "分类清晰", "拿取方便", "桌面不乱", "租房神器", "高颜值收纳", "提升幸福感"],
    audiences: ["租房党", "宿舍党", "上班族", "居家整理人群", "宝妈"],
  },
  {
    id: "home_cleaning",
    name: "家居-清洁用品",
    driverType: "功能决策型",
    keywords: ["清洁剂", "湿巾", "洗衣液", "除菌喷雾", "拖把", "垃圾袋", "厨房清洁"],
    sellingPoints: ["去污力强", "省时省力", "居家必备", "味道不刺鼻", "日常高频使用", "收纳方便", "性价比高", "懒人友好"],
    audiences: ["宝妈", "租房党", "上班族", "居家党", "养宠家庭"],
  },
  {
    id: "home_kitchenware",
    name: "家居-厨房餐具",
    driverType: "场景种草型",
    keywords: ["水杯", "保温杯", "餐具", "锅", "平底锅", "刀具", "饭盒", "便当盒"],
    sellingPoints: ["颜值高", "实用耐用", "便携", "居家通勤两用", "清洗方便", "提升做饭幸福感", "适合带饭", "送礼友好"],
    audiences: ["上班族", "学生党", "租房党", "居家做饭人群", "宝妈"],
  },
  {
    id: "appliance_kitchen",
    name: "小家电-厨房",
    driverType: "功能决策型",
    keywords: ["空气炸锅", "咖啡机", "电饭煲", "豆浆机", "破壁机", "养生壶", "电蒸锅"],
    sellingPoints: ["操作简单", "提升做饭效率", "懒人友好", "颜值高", "小白也会用", "占地小", "提升生活感", "实用性强"],
    audiences: ["租房党", "上班族", "新手做饭人群", "居家党", "情侣", "宝妈"],
  },
  {
    id: "appliance_personal",
    name: "小家电-个护",
    driverType: "功能决策型",
    keywords: ["吹风机", "卷发棒", "直发梳", "美容仪", "剃须刀", "电动牙刷"],
    sellingPoints: ["快速省时", "使用方便", "护发不伤发", "精致感提升", "日常高频使用", "通勤早八友好", "颜值在线", "送礼合适"],
    audiences: ["女生", "男生", "早八人群", "上班族", "学生党", "送礼人群"],
  },
  {
    id: "appliance_home",
    name: "小家电-家居",
    driverType: "功能决策型",
    keywords: ["加湿器", "风扇", "取暖器", "吸尘器", "扫地机器人", "除湿机", "台灯"],
    sellingPoints: ["提升居家舒适度", "静音", "省空间", "懒人友好", "颜值高", "租房适用", "日常实用", "幸福感提升"],
    audiences: ["租房党", "居家党", "上班族", "宿舍党", "宝妈"],
  },
  {
    id: "digital_phone_accessories",
    name: "数码-手机周边",
    driverType: "功能决策型",
    keywords: ["手机壳", "充电宝", "数据线", "支架", "贴膜", "MagSafe", "手机挂绳"],
    sellingPoints: ["颜值高", "实用刚需", "便携", "日常高频使用", "保护性强", "手感好", "出门安心", "平价好物"],
    audiences: ["学生党", "上班族", "女生", "数码党", "通勤人群"],
  },
  {
    id: "digital_audio",
    name: "数码-耳机/音箱",
    driverType: "功能决策型",
    keywords: ["耳机", "蓝牙耳机", "头戴耳机", "音箱", "麦克风"],
    sellingPoints: ["音质好", "佩戴舒适", "通勤必备", "续航在线", "降噪实用", "颜值高", "学习办公都能用", "送礼合适"],
    audiences: ["学生党", "上班族", "通勤人群", "数码党", "送礼人群"],
  },
  {
    id: "digital_tablet_pc",
    name: "数码-平板/电脑周边",
    driverType: "功能决策型",
    keywords: ["键盘", "鼠标", "支架", "电脑包", "平板壳", "手写笔"],
    sellingPoints: ["办公学习效率提升", "便携", "桌搭友好", "高颜值", "保护性强", "宿舍办公适合", "通勤可带"],
    audiences: ["学生党", "上班族", "居家办公人群", "数码党"],
  },
  {
    id: "food_snacks",
    name: "食品-零食",
    driverType: "体验分享型",
    keywords: ["零食", "薯片", "饼干", "蛋糕", "海苔", "坚果", "辣条", "冻干零食"],
    sellingPoints: ["好吃不踩雷", "追剧必备", "解馋", "办公室囤货", "小包装方便", "性价比高", "回购率高", "适合分享"],
    audiences: ["学生党", "上班族", "追剧人群", "办公室人群", "囤货党"],
  },
  {
    id: "food_drink",
    name: "食品-饮品/冲调",
    driverType: "体验分享型",
    keywords: ["咖啡", "茶包", "奶茶", "果汁", "饮料", "燕麦片", "冲饮", "代餐奶昔"],
    sellingPoints: ["口感好", "早八续命", "通勤方便", "居家囤货", "低负担", "提神醒脑", "便携好冲泡", "日常回购"],
    audiences: ["学生党", "上班族", "早八人群", "健身人群", "居家党"],
  },
  {
    id: "pet_food",
    name: "宠物-主粮/零食",
    driverType: "功能决策型",
    keywords: ["猫粮", "狗粮", "宠物零食", "猫条", "罐头", "冻干", "主食罐"],
    sellingPoints: ["适口性好", "营养均衡", "配料安心", "毛孩子爱吃", "囤货友好", "高性价比", "多猫多狗家庭适合", "新手养宠友好"],
    audiences: ["养猫人", "养狗人", "新手铲屎官", "多宠家庭", "精细养宠人群"],
  },
  {
    id: "pet_supplies",
    name: "宠物-用品",
    driverType: "场景种草型",
    keywords: ["猫砂", "猫砂盆", "牵引绳", "宠物窝", "猫抓板", "玩具", "喂食器", "饮水机"],
    sellingPoints: ["解放双手", "实用耐用", "宠物友好", "清洁方便", "提升养宠幸福感", "颜值高", "省心省力", "居家整洁"],
    audiences: ["养猫人", "养狗人", "新手铲屎官", "上班族养宠家庭", "多宠家庭"],
  },
  {
    id: "pet_cleaning",
    name: "宠物-清洁护理",
    driverType: "功能决策型",
    keywords: ["宠物湿巾", "宠物沐浴露", "除臭喷雾", "梳毛", "牙膏宠物"],
    sellingPoints: ["温和安心", "除味效果好", "清洁方便", "日常高频", "养宠家庭刚需", "提升居家舒适度"],
    audiences: ["养猫人", "养狗人", "上班族养宠家庭", "精细养宠人群"],
  },
  {
    id: "mother_baby_babycare",
    name: "母婴-宝宝用品",
    driverType: "功能决策型",
    keywords: ["纸尿裤", "湿巾", "奶瓶", "围兜", "宝宝洗护", "辅食工具"],
    sellingPoints: ["温和安心", "宝妈省心", "日常刚需", "囤货友好", "使用方便", "高频消耗", "口碑稳定", "新手爸妈友好"],
    audiences: ["宝妈", "新手爸妈", "囤货家庭", "母婴家庭"],
  },
  {
    id: "mother_baby_maternity",
    name: "母婴-妈妈用品",
    driverType: "功能决策型",
    keywords: ["待产包", "吸奶器", "哺乳内衣", "防溢乳垫", "产后用品"],
    sellingPoints: ["实用省心", "待产必备", "减轻负担", "细节贴心", "高频使用", "提升体验感"],
    audiences: ["孕妈", "新手妈妈", "宝妈"],
  },
  {
    id: "sports_wear",
    name: "运动-服饰装备",
    driverType: "场景种草型",
    keywords: ["瑜伽裤", "运动内衣", "速干衣", "运动短裤", "防晒衣", "运动袜"],
    sellingPoints: ["显身材", "舒适贴合", "透气速干", "运动不束缚", "拍照出片", "日常运动都可穿", "版型好", "新手友好"],
    audiences: ["健身女生", "瑜伽人群", "跑步人群", "学生党", "上班族"],
  },
  {
    id: "sports_accessories",
    name: "运动-器材配件",
    driverType: "场景种草型",
    keywords: ["瑜伽垫", "水壶", "跳绳", "护腕", "运动包", "拉力带"],
    sellingPoints: ["居家运动方便", "新手入门", "便携", "日常坚持更容易", "实用性强", "性价比高"],
    audiences: ["健身新手", "居家运动人群", "学生党", "上班族"],
  },
];

export const FALLBACK_PRESET: CategoryPreset = {
  id: "general",
  name: "通用",
  driverType: "体验分享型",
  keywords: [],
  sellingPoints: ["高颜值", "实用", "性价比高", "日常必备", "使用方便", "送礼合适", "自用舒适", "口碑好"],
  audiences: ["学生党", "上班族", "女生", "男生", "居家人群", "新手", "送礼人群"],
};

export const CATEGORY_OVERRIDES: CategoryOverride[] = [
  {
    match: ["珊瑚绒", "加绒"],
    addSellingPoints: ["保暖", "居家舒适", "柔软亲肤"],
    addAudiences: ["怕冷人群", "居家党", "老人"],
  },
  {
    match: ["氨基酸", "敏感肌"],
    addSellingPoints: ["温和清洁", "敏感肌适用", "洗后不紧绷"],
    addAudiences: ["敏感肌", "学生党", "宝妈"],
  },
  {
    match: ["控油", "清爽"],
    addSellingPoints: ["控油清爽", "持久清爽"],
    addAudiences: ["油皮", "混油皮", "夏季通勤人群"],
  },
  {
    match: ["补水", "保湿"],
    addSellingPoints: ["补水保湿", "舒缓干燥", "日常维稳"],
    addAudiences: ["干皮", "换季人群", "熬夜党"],
  },
  {
    match: ["修护", "维稳"],
    addSellingPoints: ["修护屏障", "舒缓维稳", "敏感肌适用"],
    addAudiences: ["敏感肌", "换季人群", "屏障受损人群"],
  },
  {
    match: ["香味", "留香", "香氛"],
    addSellingPoints: ["香味高级", "留香持久", "氛围感强"],
    addAudiences: ["约会人群", "精致生活人群", "送礼人群"],
  },
  {
    match: ["通勤", "上班"],
    addSellingPoints: ["通勤友好", "日常实用", "省时方便"],
    addAudiences: ["上班族", "通勤人群", "早八人群"],
  },
  {
    match: ["学生", "宿舍"],
    addSellingPoints: ["性价比高", "平价实用", "宿舍友好"],
    addAudiences: ["学生党", "宿舍党", "新手"],
  },
  {
    match: ["便携", "随身"],
    addSellingPoints: ["便携", "出门好带", "日常高频使用"],
    addAudiences: ["通勤人群", "旅行党", "学生党"],
  },
  {
    match: ["送礼", "礼盒"],
    addSellingPoints: ["送礼合适", "颜值高", "有仪式感"],
    addAudiences: ["送礼人群", "约会人群", "节日送礼人群"],
  },
  {
    match: ["显瘦", "小个子"],
    addSellingPoints: ["显瘦", "修饰身材", "上身显气质"],
    addAudiences: ["小个子", "微胖女生", "通勤女生"],
  },
  {
    match: ["妈妈", "老人", "长辈"],
    addSellingPoints: ["全家可用", "温和安心", "实用贴心"],
    addAudiences: ["宝妈", "老人", "送长辈人群"],
  },
  {
    match: ["猫", "狗", "宠物"],
    addSellingPoints: ["养宠友好", "居家整洁", "省心省力"],
    addAudiences: ["养猫人", "养狗人", "养宠家庭"],
  },
];

export const CATEGORY_PRESET_IDS = CATEGORY_PRESETS.map((p) => p.id);

export function getPresetById(id: string): CategoryPreset | undefined {
  return CATEGORY_PRESETS.find((p) => p.id === id);
}

/*
 * Dev-only integrity check. Fails loudly in development if the preset table
 * drifts (duplicate ids, empty keywords, invalid driverType). Production
 * builds skip this — Vite dead-code-eliminates the branch.
 */
const VALID_DRIVER_TYPES: ContentDriverType[] = [
  "功能决策型",
  "体验分享型",
  "场景种草型",
  "情绪共鸣型",
];

export function validateCategoryPresets(presets: CategoryPreset[] = CATEGORY_PRESETS): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const p of presets) {
    if (seen.has(p.id)) errors.push(`duplicate id: ${p.id}`);
    seen.add(p.id);
    if (!p.id.trim()) errors.push(`empty id on preset "${p.name}"`);
    if (!p.name.trim()) errors.push(`empty name on preset "${p.id}"`);
    if (p.keywords.length === 0) errors.push(`empty keywords on preset "${p.id}"`);
    if (!VALID_DRIVER_TYPES.includes(p.driverType))
      errors.push(`invalid driverType "${p.driverType}" on preset "${p.id}"`);
    if (p.sellingPoints.length === 0)
      errors.push(`empty sellingPoints on preset "${p.id}"`);
    if (p.audiences.length === 0) errors.push(`empty audiences on preset "${p.id}"`);
  }
  return errors;
}

if (import.meta.env?.DEV) {
  const errors = validateCategoryPresets();
  if (errors.length > 0) {
    // Surface loudly during development; never crash the app.
    console.error("[productCategoryPresets] integrity check failed:\n" + errors.join("\n"));
  }
}
