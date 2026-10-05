/* =========================================================
   成长记录 · 内容配置
   说明：所有“可改的文字和数据”都放在这个文件里。
   你（妈妈）以后想调整教材、目标、文案，只改这里就行，
   不用动 app.js / styles.css。
   ========================================================= */

const SITE = {
  childName: "宝贝",               // 孩子的昵称，随意改
  childAge: 8,
  childGrade: "三年级",
  school: "北京海淀外国语学校 · 德语双语班（德语+英语）",
  motto: "你不需要一天就变好，只需要今天比昨天多懂一点点。🌱",  // 首页英雄区引用
  version: "v2.0 · 2026年8月",
  startDate: "2026-08-04",        // 成长站启用日（用于“第 N 天”计数；按实际启用日改）
  schoolStart: "2026-09-01",      // 开学日（9 月 1 日开学；已开学后首页自动显示“已开学 X 天”）
  weeklyTheme: "开学第三周 · 习惯巩固与节奏稳定"   // 每周主题，按实际阶段改
};

/* 每日三件事（吃·睡·动）的目标设定 */
const DAILY_GOALS = {
  sleepTarget: "21:00",   // 目标入睡时间
  sleepHours: 9,          // 目标睡眠时长（小时）
  jumpRope: 50,           // 每日跳绳目标（个）
  englishReadMin: 15,     // 英语阅读目标（分钟）
  germanWords: 10         // 德语单词复习目标（个）
};

/* 积分规则（与规划文档一致，改数值即改奖励） */
const POINTS = {
  eatWell: 1,        // 好好吃饭：早餐选够 3 项（eat.bf 数量 ≥3）即 +1
  drinkWater: 1,     // 好好喝水（eat.waterOk）
  sleepBefore21: 2,   // 21:30 前睡觉（sleep.done，早睡打卡）
  jumpRope50: 2,      // 每天跳绳 50 个以上
  moveAny: 3,         // 任意运动：跑步/仰卧起坐/乒乓球/其他，做了就 +3（move.sports 非空）
  englishRead15: 1,   // 每天英语阅读 15 分钟
  finishHomework: 1,  // 每天完成作业
  germanReview: 2,    // 每天德语单词复习
  examPerfect: 5,     // 考试全对（+5，单项高分项）
  weeklyReview: 5     // 每周完成周看板复盘
};

/* ============ 积分等级（8 级阶梯） ============
   规则：每级「升到下一级」所需的【本级积分】，本级从 0 开始累计；
   升到下一级后，上一级的积分保留（计入总积分），新一级重新从 0 计。
   难度逐层加大：1→2 需 10，2→3 需 20，3→4 需 30，之后每级增量递增。
   满级（L8）累计需 10+20+30+45+65+90+120 = 380 分。 */
const LEVEL_STEPS = [10, 20, 30,45, 65, 90, 120];   // index i = 从 L(i+1) 升到 L(i+2) 所需积分
const LEVEL_NAMES = ["萌芽小超人","成长小超人","活力小超人","坚持小超人","闪耀小超人","卓越小超人","传奇小超人","超级小超人"];

/* ============ 专属徽章（单项完成好即可点亮） ============
   tiers = [铜, 银, 金] 达成阈值；src 为计算数据源（见 app.js computeBadges）。 */
const BADGES = [
  { id:"rope",    icon:"🪢", name:"跳绳小将",  tiers:[7,21,50],   src:"moveStreak",  label:"连续跳绳" },
  { id:"sleep",   icon:"💤", name:"早睡星人",  tiers:[7,21,50],   src:"sleepStreak", label:"连续早睡" },
  { id:"english", icon:"📚", name:"英语阅读侠", tiers:[10,30,60],  src:"englishDays", label:"英语阅读天数" },
  { id:"german",  icon:"🇩🇪", name:"德语达人",  tiers:[20,50,100], src:"germanWords", label:"已学德语词" },
  { id:"eat",     icon:"🍎", name:"健康饮食家", tiers:[14,30,60],  src:"eatDays",     label:"好好吃饭天数" },
  { id:"exam",    icon:"🏅", name:"全对王",    tiers:[1,3,10],    src:"examCount",   label:"考试全对次数" }
];

/* 积分兑换（改文字即可） */
const REWARDS = [
  { need: 20,  text: "周末多玩 30 分钟" },
  { need: 50,  text: "买一本喜欢的书" },
  { need: 100, text: "一次家庭外出活动（由你选地方）" },
  { need: 200, text: "一次大惊喜（和爸爸妈妈商量）" }
];

/* ============ 学习天地 · 数学 ============ */
const MATH = {
  book: "人教版 · 数学三年级上册（2025 秋版）",
  tip: "数学不要天天刷题：同类型题做 3 道吃透，胜过做 10 道半懂不懂。先做对，再做快。",
  units: [
    { n: 1, title: "观察物体", desc: "从不同方向看立体图形，培养空间想象；认识长方体纸盒的展开图。" },
    { n: 2, title: "混合运算", desc: "同级 / 两级运算的顺序、带小括号的计算，以及两步应用题。" },
    { n: 3, title: "毫米、分米和千米", desc: "认识毫米、分米、千米和吨；估测距离；曹冲称象里的等量代换。" },
    { n: 4, title: "多位数乘一位数", desc: "口算与笔算乘法（进位 / 连续进位 / 末尾 0），乘法估算；数字编码（编学号）。" },
    { n: 5, title: "线和角", desc: "线段、射线、直线；角的认识，区分直角、锐角、钝角。" },
    { n: 6, title: "分数的初步认识", desc: "几分之一 / 几分之几、大小比较、同分母加减、生活中的简单应用。" },
    { n: 7, title: "复习与关联", desc: "数与运算、数量关系、图形认识与测量；数学广角：搭配问题。" }
  ]
};

/* ============ 学习天地 · 英语 ============ */
const ENGLISH = {
  book: "人教版 PEP · 英语三年级上册（2024 秋新版）",
  note: "双轨并行：校内 PEP 教材 + 英语原版分级阅读（RAZ / 牛津树 / Epic!）。已报【高途刘薇雅思】线上课——随时可重启、加入班级，当作长线播种，不急。",
  units: [
    { n: 1, title: "Making friends", cn: "交朋友", a: "How do we greet friends?（怎么打招呼）", b: "How can we be a good friend?（怎样做个好朋友）", project: "做一张“交朋友”思维导图" },
    { n: 2, title: "Different families", cn: "不同的家庭", a: "Who lives with you?（谁和你住一起）", b: "How are families different?（家庭有什么不同）", project: "做一棵家庭树 family tree" },
    { n: 3, title: "Amazing animals", cn: "神奇的动物", a: "What pets do you know?（宠物）", b: "What wild animals do you know?（野生动物）", project: "做一本动物图册" },
    { n: 4, title: "Plants around us", cn: "身边的植物", a: "What do we get from plants?（植物给我们什么）", b: "How can we help plants?（怎么保护植物）", project: "做一个纸花园 paper garden" },
    { n: 5, title: "The colourful world", cn: "多彩的世界", a: "What colours do you see?（你看到什么颜色）", b: "How do colours help us?（颜色有什么用）", project: "做一本颜色翻翻书 colour flip book" },
    { n: 6, title: "Useful numbers", cn: "有用的数字", a: "When do we use numbers?（什么时候用数字）", b: "How useful are numbers?（数字多有用）", project: "做一张生日贺卡 birthday card" },
    { n: 0, title: "Revision", cn: "复习", a: "Being a good guest（做个好客人）", b: "", project: "本册综合复习" }
  ],
  readGoals: [
    { grade: "三年级", words: "70 万字 / 年", min: "15–20 分钟" },
    { grade: "四年级", words: "100 万字 / 年", min: "15–20 分钟" },
    { grade: "五年级", words: "120 万字 / 年", min: "20 分钟" },
    { grade: "六年级", words: "150 万字 / 年", min: "20 分钟" }
  ],
  ielts: [
    { stage: "3–4 年级", goal: "积累词汇和语感", action: "不急于考试，先大量阅读 + 听力输入" },
    { stage: "4–5 年级", goal: "考 PET（剑桥通用第二级）", action: "作为阶段性检测工具" },
    { stage: "5–6 年级", goal: "考 FCE（剑桥通用第三级）", action: "词汇量 5000+ 后，托福模考摸底" },
    { stage: "7 年级", goal: "托福首次模考 85+", action: "正式进入托福备考轨道" }
  ]
};

/* ============ 早餐打卡（只在家吃早餐） ============
   说明：奥奇平时只在家吃早餐；中晚餐都在学校，仅周五晚饭 + 周末在家。
   原则：面包/面条当底座，每餐加蛋 + 奶，粗粮藏进熟悉食物。 */
const BREAKFAST = {
  note: "🌞 早餐只在家吃（午晚餐都在学校，周五晚 + 周末才在家）—— 选一选今天吃了什么。面包/面条当底座，每餐加蛋 + 奶，粗粮藏进去 ❤️",
  favorites: [
    /* —— 他熟悉的主食底座 —— */
    { id:"daoxiaomian", name:"奶奶刀削面" },
    { id:"ramen",  name:"速食骨汤拉面" },
    { id:"bread",  name:"面包" },
    { id:"wmbread", name:"全麦面包" },
    { id:"noodle", name:"杂粮面/荞麦面" },
    /* —— 蛋白质（每天兜底） —— */
    { id:"egg_b",  name:"煮鸡蛋" },
    { id:"egg_p",  name:"荷包蛋" },
    { id:"soymilk", name:"豆浆" },
    { id:"milk",   name:"牛奶" },
    { id:"yogurt", name:"酸奶" },
    { id:"cheese", name:"奶酪" },
    { id:"nut",    name:"核桃/坚果碎" },
    /* —— 蔬菜 —— */
    { id:"veg",    name:"蔬菜" },
    /* —— 粗粮（多选鼓励） —— */
    { id:"coarse", name:"粗粮" },
    { id:"oat",    name:"即食燕麦" },
    { id:"sweetpotato", name:"蒸红薯" },
    { id:"corn",   name:"玉米" },
    { id:"pumpkin", name:"南瓜" },
    /* —— 水果 —— */
    { id:"banana", name:"香蕉" },
    { id:"berry",  name:"蓝莓" }
  ]
};

/* ============ 学习天地 · 德语 ============ */
const GERMAN = {
  exam: "Goethe-Zertifikat A1: Fit in Deutsch 1（歌德学院少儿 A1 考试）",
  school: "海淀外国语小学德语课：德语外教主讲 + 有留学经历的中教辅助，寓教于乐，从听说到读写，情景小剧场。学校是全国少数把二外覆盖幼儿园到高中的学校，并有 PASCH 项目认证。",
  textbooks: [
    "《Die Deutschprofis A1》（Klett，小学德语常见教材）",
    "《Bruno und ich》（德语入门，图文 + 游戏）",
    "《Prima aktiv / Prima – Los geht's!》（Cornelsen 少儿德语）",
    "备考：《Mit Erfolg zum Goethe-Zertifikat A1: Fit in Deutsch 1》(Klett, 2024)"
  ],
  note: "⚠️ 学校具体用书以老师开学通知为准，以上为同类型常见教材，供参考预习。",
  path: [
    { grade: "三年级", goal: "打好基础，准备 Goethe A1", week: "学校课程 + 周末 30 分钟" },
    { grade: "四年级", goal: "Goethe A1 考试", week: "加入单词卡片复习" },
    { grade: "五年级", goal: "Goethe A2 考试", week: "开始德语阅读" },
    { grade: "六年级", goal: "Goethe B1 考试", week: "德语成为你的“标签”" }
  ],
  leitner: [
    { box: 1, freq: "每天", what: "新学的 + 总记错的单词" },
    { box: 2, freq: "每 3 天", what: "答对 1 次的单词" },
    { box: 3, freq: "每 7 天", what: "答对 2 次的单词" },
    { box: 4, freq: "每 30 天", what: "已经熟练掌握的单词" }
  ],
  /* 背单词计划（结合海淀外国语节奏 + Fit in Deutsch 1 官方词表约 550 词） */
  plan: {
    goal: "A1 词表约 550 词 → 三年级学年吃下 300 词，四年级上学期考前收尾冲刺",
    daily: [
      { t: "3 分钟", d: "复习今天「到期」的盒子卡（站内卡片机自动排出）" },
      { t: "4 分钟", d: "学 2 个新词：跟读 → 念例句 → 抄 1 遍" },
      { t: "3 分钟", d: "亲子快问快答：家长说中文，孩子说德语（反过来也来一轮）" }
    ],
    week: [
      { d: "周一–周五", act: "每天 10 分钟三段式（放学加餐后、写作业前）" },
      { d: "周六", act: "20 分钟「主题清点日」：集中过一个主题（数字周/家庭周/食物周…）+ 补新词" },
      { d: "周日", act: "休息或德语儿歌 / 动画 15 分钟，不打卡不任务" }
    ],
    phases: [
      { p: "第 1–4 周 · 启动", d: "只做一件事：每天 10 分钟卡片机，把起步词全部升到 Box2，建立习惯" },
      { p: "第 5–16 周 · 跟课本走", d: "每学一课，把课本词汇表加进 content.js 的 words 数组（每次约 8–12 词），每天进 2 个新词" },
      { p: "寒假 · 冲刺 150 词", d: "主题周集中攻：一周一个主题 15–20 词，配合 Anki / 纸质盒子随时刷" },
      { p: "三年级末 · 300 词", d: "Box3 以上 ≥ 200 词；开始听 Fit in Deutsch 1 官方样题（歌德官网免费下载）" },
      { p: "四年级上 · A1 考试", d: "官方词表查漏补缺；口语按「自我介绍 + 互相提问 + 看图说」三段套路练" }
    ],
    exam: "Fit in Deutsch 1 四个部分：Hören 听（约15分钟）/ Lesen 读（约20分钟）/ Schreiben 写（约20分钟）/ Sprechen 说（约15分钟，小组形式）",
    physical: "实体盒子购买：淘宝 / 京东 / 拼多多搜「莱特纳盒子」或「索引卡盒 分格 A7」或「单词记忆卡盒」，10–40 元；卡片买 A7 索引卡（约 5 元/包）。也可自制：鞋盒 + 硬纸板隔 4 格，格上写 Box1–4。"
  },
  // 德语词库（可在下面数组随意增删；cat=主题, de=德语, art=词性, cn=中文, ex=例句）
  words: [
    /* —— 问候与礼貌 —— */
    { cat: "问候礼貌", de: "hallo", art: "", cn: "你好", ex: "Hallo! 你好！" },
    { cat: "问候礼貌", de: "tschüss", art: "", cn: "再见", ex: "Tschüss! 再见！" },
    { cat: "问候礼貌", de: "danke", art: "", cn: "谢谢", ex: "Danke! 谢谢！" },
    { cat: "问候礼貌", de: "bitte", art: "", cn: "请 / 不客气", ex: "Bitte. 请。" },
    { cat: "问候礼貌", de: "ja", art: "", cn: "是", ex: "Ja. 是的。" },
    { cat: "问候礼貌", de: "nein", art: "", cn: "不", ex: "Nein. 不是。" },
    { cat: "问候礼貌", de: "Entschuldigung", art: "die", cn: "抱歉 / 劳驾", ex: "Entschuldigung! 打扰一下！" },
    /* —— 人称 —— */
    { cat: "人称", de: "ich", art: "", cn: "我", ex: "Ich bin Leo. 我是 Leo。" },
    { cat: "人称", de: "du", art: "", cn: "你", ex: "Und du? 你呢？" },
    { cat: "人称", de: "wir", art: "", cn: "我们", ex: "Wir spielen. 我们在玩。" },
    /* —— 数字 1–10 —— */
    { cat: "数字", de: "eins", art: "", cn: "一", ex: "eins, zwei, drei 一、二、三" },
    { cat: "数字", de: "zwei", art: "", cn: "二", ex: "zwei Äpfel 两个苹果" },
    { cat: "数字", de: "drei", art: "", cn: "三", ex: "drei Bücher 三本书" },
    { cat: "数字", de: "vier", art: "", cn: "四", ex: "vier Stühle 四把椅子" },
    { cat: "数字", de: "fünf", art: "", cn: "五", ex: "fünf Finger 五根手指" },
    { cat: "数字", de: "sechs", art: "", cn: "六", ex: "Es ist sechs. 六点了。" },
    { cat: "数字", de: "sieben", art: "", cn: "七", ex: "sieben Tage 七天" },
    { cat: "数字", de: "acht", art: "", cn: "八", ex: "acht Uhr 八点" },
    { cat: "数字", de: "neun", art: "", cn: "九", ex: "neun Mal 九次" },
    { cat: "数字", de: "zehn", art: "", cn: "十", ex: "zehn Jahre alt 十岁" },
    /* —— 家庭 —— */
    { cat: "家庭", de: "die Mutter", art: "die", cn: "妈妈", ex: "Meine Mama. 我的妈妈。" },
    { cat: "家庭", de: "der Vater", art: "der", cn: "爸爸", ex: "Mein Papa. 我的爸爸。" },
    { cat: "家庭", de: "der Bruder", art: "der", cn: "哥哥 / 弟弟", ex: "Mein Bruder ist groß. 我哥哥很高。" },
    { cat: "家庭", de: "die Schwester", art: "die", cn: "姐姐 / 妹妹", ex: "Meine Schwester lernt. 我姐姐在学习。" },
    { cat: "家庭", de: "die Oma", art: "die", cn: "奶奶 / 外婆", ex: "Oma kocht. 奶奶在做饭。" },
    { cat: "家庭", de: "der Opa", art: "der", cn: "爷爷 / 外公", ex: "Opa liest. 爷爷在看书。" },
    { cat: "家庭", de: "die Familie", art: "die", cn: "家庭", ex: "Meine Familie. 我的家。" },
    { cat: "家庭", de: "der Freund", art: "der", cn: "朋友", ex: "Mein Freund. 我的朋友。" },
    /* —— 颜色 —— */
    { cat: "颜色", de: "rot", art: "", cn: "红色", ex: "Das ist rot. 这是红色。" },
    { cat: "颜色", de: "blau", art: "", cn: "蓝色", ex: "Das ist blau. 这是蓝色。" },
    { cat: "颜色", de: "gelb", art: "", cn: "黄色", ex: "Die Sonne ist gelb. 太阳是黄的。" },
    { cat: "颜色", de: "grün", art: "", cn: "绿色", ex: "Der Baum ist grün. 树是绿的。" },
    { cat: "颜色", de: "schwarz", art: "", cn: "黑色", ex: "Die Katze ist schwarz. 猫是黑的。" },
    { cat: "颜色", de: "weiß", art: "", cn: "白色", ex: "Der Schnee ist weiß. 雪是白的。" },
    /* —— 学校 —— */
    { cat: "学校", de: "die Schule", art: "die", cn: "学校", ex: "Zur Schule. 去学校。" },
    { cat: "学校", de: "der Lehrer", art: "der", cn: "男老师", ex: "Der Lehrer sagt Hallo. 老师说你好。" },
    { cat: "学校", de: "die Lehrerin", art: "die", cn: "女老师", ex: "Meine Lehrerin ist nett. 我的老师很友好。" },
    { cat: "学校", de: "das Buch", art: "das", cn: "书", ex: "Ein Buch. 一本书。" },
    { cat: "学校", de: "der Stift", art: "der", cn: "笔", ex: "Mein Stift ist neu. 我的笔是新的。" },
    { cat: "学校", de: "das Heft", art: "das", cn: "练习本", ex: "Ein neues Heft. 一个新本子。" },
    { cat: "学校", de: "die Tasche", art: "die", cn: "书包", ex: "Meine Tasche ist schwer. 我的书包很重。" },
    { cat: "学校", de: "der Tisch", art: "der", cn: "桌子", ex: "Das Buch ist auf dem Tisch. 书在桌上。" },
    { cat: "学校", de: "der Stuhl", art: "der", cn: "椅子", ex: "Der Stuhl ist braun. 椅子是棕的。" },
    /* —— 食物 —— */
    { cat: "食物", de: "das Wasser", art: "das", cn: "水", ex: "Wasser, bitte. 请给我水。" },
    { cat: "食物", de: "der Apfel", art: "der", cn: "苹果", ex: "Ein Apfel. 一个苹果。" },
    { cat: "食物", de: "die Banane", art: "die", cn: "香蕉", ex: "Die Banane ist gelb. 香蕉是黄的。" },
    { cat: "食物", de: "das Brot", art: "das", cn: "面包", ex: "Brot mit Käse. 面包配奶酪。" },
    { cat: "食物", de: "die Milch", art: "die", cn: "牛奶", ex: "Ich trinke Milch. 我喝牛奶。" },
    { cat: "食物", de: "der Saft", art: "der", cn: "果汁", ex: "Ein Saft, bitte. 请来一杯果汁。" },
    { cat: "食物", de: "das Ei", art: "das", cn: "鸡蛋", ex: "Zwei Eier. 两个鸡蛋。" },
    { cat: "食物", de: "der Käse", art: "der", cn: "奶酪", ex: "Käse schmeckt gut. 奶酪很好吃。" },
    /* —— 动物 —— */
    { cat: "动物", de: "der Hund", art: "der", cn: "狗", ex: "Der Hund ist groß. 狗很大。" },
    { cat: "动物", de: "die Katze", art: "die", cn: "猫", ex: "Die Katze ist klein. 猫很小。" },
    { cat: "动物", de: "das Pferd", art: "das", cn: "马", ex: "Das Pferd läuft schnell. 马跑得快。" },
    { cat: "动物", de: "der Vogel", art: "der", cn: "鸟", ex: "Der Vogel singt. 鸟在唱歌。" },
    { cat: "动物", de: "der Fisch", art: "der", cn: "鱼", ex: "Der Fisch schwimmt. 鱼在游泳。" },
    /* —— 身体 —— */
    { cat: "身体", de: "der Kopf", art: "der", cn: "头", ex: "Mein Kopf tut weh. 我头疼。" },
    { cat: "身体", de: "die Hand", art: "die", cn: "手", ex: " Gib mir die Hand. 牵着我。" },
    { cat: "身体", de: "das Auge", art: "das", cn: "眼睛", ex: "Die Augen sind braun. 眼睛是棕色的。" },
    { cat: "身体", de: "das Ohr", art: "das", cn: "耳朵", ex: "Große Ohren. 大耳朵。" },
    { cat: "身体", de: "der Fuß", art: "der", cn: "脚", ex: "Der Fuß ist kalt. 脚很冷。" },
    /* —— 衣服 —— */
    { cat: "衣服", de: "das T-Shirt", art: "das", cn: "T恤", ex: "Ein blaues T-Shirt. 一件蓝T恤。" },
    { cat: "衣服", de: "die Hose", art: "die", cn: "裤子", ex: "Die Hose ist neu. 裤子是新的。" },
    { cat: "衣服", de: "die Jacke", art: "die", cn: "外套", ex: "Die Jacke ist warm. 外套很暖。" },
    { cat: "衣服", de: "der Schuh", art: "der", cn: "鞋", ex: "Zwei Schuhe. 两只鞋。" },
    /* —— 常用动词 —— */
    { cat: "动词", de: "essen", art: "", cn: "吃", ex: "Ich esse Brot. 我在吃面包。" },
    { cat: "动词", de: "trinken", art: "", cn: "喝", ex: "Ich trinke Wasser. 我在喝水。" },
    { cat: "动词", de: "spielen", art: "", cn: "玩 / 踢（球）", ex: "Ich spiele Fußball. 我踢足球。" },
    { cat: "动词", de: "lesen", art: "", cn: "读 / 看（书）", ex: "Ich lese ein Buch. 我在看书。" },
    { cat: "动词", de: "schreiben", art: "", cn: "写", ex: "Ich schreibe meinen Namen. 我写我的名字。" },
    { cat: "动词", de: "malen", art: "", cn: "画画", ex: "Ich male ein Haus. 我画一栋房子。" },
    { cat: "动词", de: "singen", art: "", cn: "唱歌", ex: "Wir singen ein Lied. 我们唱一首歌。" },
    { cat: "动词", de: "schwimmen", art: "", cn: "游泳", ex: "Ich schwimme gern. 我喜欢游泳。" },
    { cat: "动词", de: "schlafen", art: "", cn: "睡觉", ex: "Die Katze schläft. 猫在睡觉。" },
    { cat: "动词", de: "laufen", art: "", cn: "跑 / 走路", ex: "Der Hund läuft. 狗在跑。" },
    /* —— 时间 —— */
    { cat: "时间", de: "heute", art: "", cn: "今天", ex: "Heute ist Montag. 今天星期一。" },
    { cat: "时间", de: "morgen", art: "", cn: "明天", ex: "Bis morgen! 明天见！" },
    { cat: "时间", de: "der Tag", art: "der", cn: "天 / 白天", ex: "Guten Tag! 日安！" },
    { cat: "时间", de: "die Woche", art: "die", cn: "星期 / 周", ex: "Eine Woche hat sieben Tage. 一周有七天。" },
    { cat: "时间", de: "jetzt", art: "", cn: "现在", ex: "Jetzt spielen wir. 现在我们玩。" },
    /* —— 形容词 —— */
    { cat: "形容词", de: "gut", art: "", cn: "好的", ex: "Das ist gut. 这很好。" },
    { cat: "形容词", de: "groß", art: "", cn: "大的 / 高的", ex: "Der Hund ist groß. 狗很大。" },
    { cat: "形容词", de: "klein", art: "", cn: "小的", ex: "Die Katze ist klein. 猫很小。" },
    { cat: "形容词", de: "neu", art: "", cn: "新的", ex: "Mein Stift ist neu. 我的笔是新的。" },
    { cat: "形容词", de: "alt", art: "", cn: "旧的 / 年长的", ex: "Das Buch ist alt. 这本书很旧。" },
    { cat: "形容词", de: "schön", art: "", cn: "美丽的", ex: "Die Blume ist schön. 花很美。" },
    { cat: "形容词", de: "kalt", art: "", cn: "冷的", ex: "Der Winter ist kalt. 冬天很冷。" },
    { cat: "形容词", de: "warm", art: "", cn: "暖和的", ex: "Die Jacke ist warm. 外套很暖。" },
    /* —— 自然 —— */
    { cat: "自然", de: "die Sonne", art: "die", cn: "太阳", ex: "Die Sonne scheint. 太阳在发光。" },
    { cat: "自然", de: "der Baum", art: "der", cn: "树", ex: "Der Baum ist grün. 树是绿的。" },
    { cat: "自然", de: "die Blume", art: "die", cn: "花", ex: "Eine schöne Blume. 一朵美丽的花。" }
  ]
};

/* ============ 运动能量站 ============ */
const SPORT = {
  benefits: [
    { icon: "🧠", t: "提升记忆力", d: "运动分泌 BDNF（脑源性神经营养因子），促进神经元生长" },
    { icon: "😊", t: "调节情绪", d: "产生多巴胺、血清素、内啡肽——“快乐三件套”" },
    { icon: "🎯", t: "提升专注力", d: "运动后立刻学习，效率更高" },
    { icon: "💪", t: "增强自控力", d: "锻炼前额叶皮层——大脑的“刹车系统”" },
    { icon: "😴", t: "改善睡眠", d: "户外运动 + 日照，提高深度睡眠质量" }
  ],
  levels: [
    { lv: "第一级 · 最小启动（第 1–2 周）", items: [
      { icon: "🪢", name: "每日跳绳", detail: "从 50 个 / 天开始，不追求速度", time: "3 分钟" },
      { icon: "🚶", name: "放学走路", detail: "放学后多走 10 分钟，不跑", time: "10 分钟" },
      { icon: "🧘", name: "睡前拉伸", detail: "3 个简单拉伸动作", time: "3 分钟" }
    ], goal: "先建立“我每天都在运动”的感觉，而不是“运动好累”。" },
    { lv: "第二级 · 习惯建立（第 3–8 周）", items: [
      { icon: "🪢", name: "跳绳升级", detail: "目标 100 个 / 天，画“勇攀高峰”记录表", time: "5 分钟" },
      { icon: "🏸", name: "羽毛球 / 壁球", detail: "周末亲子对打，室内不晒太阳", time: "30 分钟" },
      { icon: "🏊", name: "游泳", detail: "每周 1 次，当作玩水", time: "45 分钟" }
    ], goal: "让身体先体验愉悦感，再慢慢增加。" },
    { lv: "第三级 · 享受运动（第 9 周+）", items: [
      { icon: "🪢", name: "跳绳挑战", detail: "目标 150–200 个 / 天，计时挑战", time: "5–10 分钟" },
      { icon: "🏸", name: "羽毛球", detail: "周末固定 1 次，争取加入校队", time: "45 分钟" },
      { icon: "🏊", name: "游泳", detail: "学会 2 种泳姿", time: "45 分钟" }
    ], goal: "运动不是惩罚，而是“充电”。运动后立刻学习，效果最好！" }
  ],

  /* 日常运动（点选即打卡：做了任意一项就 +3 分；以后想加项目，往这里追加一行即可） */
  sports: [
    { id:"run",     icon:"🏃", name:"跑步" },
    { id:"situp",   icon:"💪", name:"仰卧起坐" },
    { id:"pingpong",icon:"🏓", name:"乒乓球" },
    { id:"other",   icon:"🤸", name:"其他运动" }
  ]
};

/* ============ 时间小管家 ============ */
const SCHEDULE = [
  { time: "7:00–7:30", act: "起床 + 洗漱 + 早餐", note: "早起是你一天效率的起点" },
  { time: "7:30–8:00", act: "上学路上", note: "可以听英语或德语音频" },
  { time: "8:00–16:00", act: "在校学习", note: "课间站起来活动" },
  { time: "16:00–16:30", act: "放学回家 + 小休", note: "吃点水果、喝水" },
  { time: "16:30–17:00", act: "运动时间 🏃", note: "跳绳 10 分钟 + 自由活动" },
  { time: "17:00–17:30", act: "洗澡 / 休息", note: "—" },
  { time: "17:30–18:30", act: "作业时间", note: "用番茄钟：专注 25 + 休息 5" },
  { time: "18:30–19:00", act: "晚餐", note: "—" },
  { time: "19:00–19:30", act: "英语 / 德语时间", note: "15 分钟阅读 + 15 分钟单词 / 音频" },
  { time: "19:30–20:00", act: "数学时间", note: "15–20 分钟，做 2–3 道趣味题" },
  { time: "20:00–20:30", act: "自由时间", note: "阅读、画画、玩" },
  { time: "20:30–20:45", act: "睡前准备", note: "刷牙、洗脸、拉伸" },
  { time: "20:45–21:00", act: "睡前阅读", note: "中文或英文故事书" },
  { time: "21:00", act: "熄灯睡觉 🌙", note: "目标：每天 9 小时睡眠！" }
];

/* ============ 成长里程碑 ============ */
const ACHIEVEMENTS = [
  { cat: "🏃 运动", bronze: "连续跳绳 7 天", silver: "连续跳绳 21 天", gold: "连续跳绳 50 天" },
  { cat: "📚 阅读", bronze: "读完 5 本书", silver: "读完 10 本书", gold: "读完 20 本书" },
  { cat: "🔢 数学", bronze: "完成 50 道题", silver: "完成 100 道题", gold: "完成 200 道题" },
  { cat: "💤 睡眠", bronze: "连续 7 天 21 点前睡", silver: "连续 21 天 21 点前睡", gold: "连续 50 天 21 点前睡" },
  { cat: "📝 德语", bronze: "学会 50 个单词", silver: "学会 100 个单词", gold: "学会 200 个单词" }
];

/* ============ 亲子加油站 ============ */
const PARENT = {
  roles: [
    "先能量，再学习。睡眠、运动、饮食是底层基础，优先于一切。先保障“不困、不累、不饿”，再谈学习。",
    "先关系，再要求。三年级是建立亲子信任的黄金窗口，多倾听，少说教。",
    "降低难度，让孩子赢。从“每天跳绳 50 个”开始，而不是“每天运动 1 小时”。",
    "做记录者，不是计划者。观察孩子在什么活动中更自信、更投入，而不是替他决定“应该学什么”。",
    "妈妈以身作则：雷打不动两个鸡蛋 + 一碗燕麦片，把健康饮食习惯活给孩子看。"
  ],
  fuels: [
    { icon: "😴", dim: "睡眠", goal: "每天 9–10 小时，21:00 前入睡", why: "深睡清理代谢废物、巩固记忆；睡前 1 小时无屏幕" },
    { icon: "🥗", dim: "饮食", goal: "三餐规律，蛋白质 + 蔬菜充足", why: "稳定血糖，保证注意力；深海鱼 / 核桃补 Omega-3" },
    { icon: "🏃", dim: "运动", goal: "每天至少 30 分钟，有氧 + 复杂运动结合", why: "促进 BDNF 分泌，提升前额叶自控力与海马体记忆力" }
  ],
  review: [
    { step: "第一步 · 先肯定进步（3 分钟）", qs: ["“这周你最棒的地方是______”", "“你比上周进步的是______”"] },
    { step: "第二步 · 看目标完成（5 分钟）", qs: ["运动目标完成了吗？", "阅读目标完成了吗？", "睡眠目标完成了吗？"] },
    { step: "第三步 · 定下周目标（5 分钟）", qs: ["下周最重要的 3 件事：", "1. ______   2. ______   3. ______"] },
    { step: "第四步 · 家长的承诺（2 分钟）", qs: ["“下周爸爸 / 妈妈会在______方面支持你。”"] }
  ]
};

/* ============ 健康饮食 · 方案中心（配合《8岁男孩健康饮食管理方案.md》） ============ */
const DIET = {
  kid: {
    age: 8, height: 130, weight: 28.5, bmi: 16.9,
    level: "正常偏高（约75–85百分位）",
    activity: "中等 · 上学 + 每天约1小时跑跳"
  },
  goal: "身高继续稳步增长，体重增速放缓（让身高追上来）——不减肥、不禁止。",
  principle: "替代 > 禁止，重组 > 删除，保留口感悄悄升级营养。",
  calories: "1500–1700 kcal/天 · 蛋白质 35–45g · 添加糖 <25g",

  /* 餐盘结构（主食 ½ → ⅓~⅖） */
  plate: [
    { name: "蔬菜",  pct: "⅖", val: 40, amount: "130g · 约一盘 40%", color: "#27AE60", tip: "先吃，吃不完的都算菜" },
    { name: "蛋白质", pct: "¼", val: 25, amount: "55g · 一掌心肉/鱼/蛋", color: "#FF8A3D", tip: "每餐必有一份" },
    { name: "主食",  pct: "⅓", val: 33, amount: "80g · 小半碗杂粮饭", color: "#8B5A2B", tip: "饿就加菜加蛋，不加饭" }
  ],

  /* 每日时间线 */
  dayFlow: [
    { time: "7:00–7:30", place: "🏠 家", item: "早餐", what: "面包/面条做底座 + 蛋白 + 粗粮", key: "面包选全麦、面条选杂粮，每餐加蛋 + 奶，粗粮藏进去" },
    { time: "12:00", place: "🏫 学校", item: "午餐", what: "按打饭口诀执行", key: "饭打 ⅔ 碗，菜打两样，有肉优先" },
    { time: "15:30–16:00", place: "🏫 学校", item: "放学加餐", what: "150–200kcal 合法零食", key: "在校日：学校小加餐（水果+坚果 / 牛奶+全麦饼干 / 红薯+蛋）；周五/周末可在家" },
    { time: "18:00–18:30", place: "🏫 学校", item: "晚餐", what: "蔬菜打底，蛋白足量，主食收尾", key: "周一~周四在校吃；周五晚餐 + 周末在家（放松不放纵）" }
  ],

  /* 加餐合法组合 */
  snacks: [
    { name: "水果 + 坚果", amount: "小苹果1个 + 原味坚果15g", kcal: "≈150", icon: "🍎" },
    { name: "奶 + 全麦饼干", amount: "纯牛奶200ml + 全麦饼干3–4片", kcal: "≈180", icon: "🥛" },
    { name: "红薯 + 蛋", amount: "蒸红薯半个 + 水煮蛋1个", kcal: "≈160", icon: "🍠" },
    { name: "酸奶 + 水果", amount: "无糖酸奶100g + 蓝莓小半碗", kcal: "≈130", icon: "🫐" }
  ],

  /* 碳水降级替换表 */
  swaps: [
    { old: "方便面", problem: "油炸面饼 + 高钠料包，一包钠≈全天一半", neu: "全麦挂面/荞麦面 + 自调汤底（生抽+香油+虾皮）", keep: "★★★★", how: "第1周白面掺半→第2周全换；料包从 ⅓ 减到 0" },
    { old: "白米饭", problem: "精制碳水，升糖快、饱腹感短", neu: "杂粮饭：白米2:糙米1:杂粮1（藜麦/燕麦/小米轮换）", keep: "★★★★", how: "4:1 → 3:1 → 2:1:1，三周渐进" },
    { old: "白馒头", problem: "精制碳水，升糖快", neu: "全麦馒头 / 杂面馒头（玉米面、荞麦面）", keep: "★★★", how: "先掺 3:1，再 1:1，给孩子适应期" },
    { old: "白面条", problem: "精制碳水", neu: "全麦面 / 荞麦面 / 杂面", keep: "★★★★", how: "直接换全麦挂面；拌面比汤面更好遮口感差" },
    { old: "薯片/虾条", problem: "空热量、高盐高脂、反式脂肪风险", neu: "烤馒头片 / 原味爆米花 / 原味坚果", keep: "★★★", how: "烤馒头片撒一点盐和孜然，脆度接近薯片" },
    { old: "甜饮料", problem: "游离糖超标，一罐糖超全天上限", neu: "无糖气泡水+柠檬 / 淡蜂蜜水 / 果汁兑水1:1", keep: "★★★", how: "气泡水替可乐；纯果汁必须兑水，每周≤2次" }
  ],

  /* 一周食谱（tabs 切换） */
  menu: [
    { id: "mon", day: "周一", tag: "在校日 · 仅早餐在家（午晚餐在校）", blocks: [
      { title: "🌞 早餐（刀削面日）", rows: [
        ["奶奶刀削面", "1碗", "传统最爱；可逐步掺 ⅓ 杂粮面"],
        ["荷包蛋", "1个", "优质蛋白，必加"],
        ["无糖豆浆", "250ml", "植物蛋白 + 钙"],
        ["焯青菜", "几根", "面里加一把绿叶菜"],
        ["（粗粮加码）蒸红薯", "半个", "想加粗粮时配"]
      ]}
    ]},
    { id: "tue", day: "周二", tag: "在校日 · 仅早餐在家（午晚餐在校）", blocks: [
      { title: "🌞 早餐（面包日）", rows: [
        ["面包", "2片", "白:全麦先 1:1 混搭，抹奶酪/花生酱"],
        ["荷包蛋", "1个", "煎/水煮均可"],
        ["无糖豆浆/牛奶", "250ml", "二选一"],
        ["核桃碎", "1小把（约15g）", "碾碎防呛，补好脂肪"]
      ]}
    ]},
    { id: "wed", day: "周三", tag: "在校日 · 仅早餐在家（午晚餐在校）", blocks: [
      { title: "🌞 早餐（骨汤拉面日 · 可控释放）", rows: [
        ["速食骨汤拉面", "1包（非油炸优先）", "每周可控 1–2 次，当“奖励面”"],
        ["荷包蛋", "1个", "加蛋补蛋白"],
        ["焯青菜", "一把", "面里加菜"],
        ["料包只放 ⅓", "自加虾皮/香油", "减钠，汤喝 ⅓ 碗就停"]
      ]}
    ]},
    { id: "thu", day: "周四", tag: "在校日 · 仅早餐在家（午晚餐在校）", blocks: [
      { title: "🌞 早餐（新尝试 · 杂粮面/荞麦面）", rows: [
        ["杂粮面/荞麦面", "1小碗（干面40g）", "口感接近普通面，易接受"],
        ["西红柿鸡蛋面", "加1个蛋", "汤里必加蛋"],
        ["荷包蛋", "1个", "兜底蛋白"],
        ["焯青菜", "几根", "—"]
      ]}
    ]},
    { id: "fri", day: "周五", tag: "在校日 · 早餐在家 + 周五晚餐在家（放松不放纵）", blocks: [
      { title: "🌞 早餐（新尝试 · 燕麦杯）", rows: [
        ["即食燕麦杯", "1杯", "燕麦 + 牛奶 + 香蕉 + 核桃碎，3分钟搞定"],
        ["荷包蛋", "1个", "蛋白兜底"],
        ["蒸红薯", "半个", "粗粮主角"],
        ["（备选）无糖豆浆", "250ml", "若燕麦用酸奶拌就免"]
      ]},
      { title: "🍽 周五晚餐（放松但不放纵）", rows: [
        ["杂粮饭/全麦面", "60–80g", "主食选一样"],
        ["孩子选爱吃的", "60–80g", "虾/鸡翅/牛排 任选1"],
        ["两种蔬菜", "150g", "1盘打底"],
        ["无糖气泡水", "150ml", "加分项：当饮料"]
      ]}
    ]},
    { id: "sat", day: "周六", tag: "健康日 · 全天在家", blocks: [
      { title: "🌞 早餐", rows: [
        ["全麦馒头", "半个", "或杂面馒头"],
        ["鸡蛋", "1个", "—"],
        ["牛奶", "200ml", "—"],
        ["圣女果", "8–10颗", "—"]
      ]},
      { title: "🍱 午餐", rows: [
        ["杂粮饭", "⅔碗", "—"],
        ["红烧排骨", "3–4块", "选瘦排"],
        ["炒油菜+凉拌豆腐丝", "150g", "—"]
      ]},
      { title: "🍎 放学加餐", rows: [
        ["蒸红薯", "半个", "+ 原味坚果1小把"]
      ]},
      { title: "🌙 晚餐", rows: [
        ["荞麦面（鸡丝黄瓜拌面）", "1小碗", "—"],
        ["焯西兰花", "130g", "—"],
        ["紫菜汤", "饭前半碗", "少盐"]
      ]}
    ]},
    { id: "sun", day: "周日", tag: "方便面赦免日 + 外出餐厅", blocks: [
      { title: "🌞 早餐", rows: [
        ["燕麦粥", "1碗", "—"],
        ["水煮蛋", "1个", "—"],
        ["牛奶", "200ml", "—"],
        ["香蕉", "半根", "—"]
      ]},
      { title: "🍜 方便面赦免日（每周1次，可控释放）", rows: [
        ["吃 1 包", "不续碗", "选「非油炸」面饼"],
        ["料包只放 ⅓–½", "自己加蛋+虾皮+青菜", "加1个蛋1撮虾皮1把青菜"],
        ["汤喝 ⅓ 碗就停", "配1个水果收尾", "之后不再加零食"]
      ]},
      { title: "🍽 外出餐厅（按类型点餐）", rows: [
        ["中餐", "清蒸鱼/白切鸡 + 蒜蓉蔬菜 + 小碗饭", "避：糖醋排骨、干锅、水煮鱼"],
        ["快餐", "烤鸡腿堡（去酱）+ 沙拉 + 牛奶", "避：炸鸡桶、大薯条、可乐"],
        ["火锅", "清汤锅 + 虾滑/牛肉卷/豆腐/大量蔬菜", "避：麻辣牛油锅、丸子、冰粉"],
        ["日料", "寿司4–5贯 + 味噌汤 + 毛豆", "避：天妇罗、焗烤类、含糖饮料"],
        ["面馆", "全麦面/荞麦面 + 卤蛋 + 焯青菜，面吃⅔", "避：大碗油泼面、加辣加油渣"]
      ]}
    ]}
  ],

  /* 打饭口诀（给孩子） */
  mantra: {
    title: "🍚 打饭口诀",
    lines: [
      { icon: "🍚", text: "饭打小碗三分二", note: "米饭别堆满，⅔ 碗就够" },
      { icon: "🥬", text: "菜打两样各两勺", note: "蔬菜必须两样，每样两勺起" },
      { icon: "🍗", text: "有肉有蛋先抢走", note: "蛋白质优先打，别最后才想起来" }
    ],
    steps: [
      "先喝两口汤",
      "菜吃一半再吃饭",
      "饭菜差不多了，肉蛋收尾吃饱"
    ],
    avoid: [
      "炸的不天天吃（炸鸡排、炸鱼饼一周最多1次）",
      "汁别拌饭（红烧汁、咖喱汁浇一点就行）",
      "甜的不当水喝（白水/牛奶/气泡水可以）"
    ]
  },

  /* 超市采购清单 */
  shopping: {
    buy: [
      "全麦挂面、荞麦面、全麦面包、全麦/杂面馒头",
      "糙米、燕麦片、小米、藜麦、玉米粒（配杂粮饭）",
      "红薯、紫薯、鲜玉米",
      "鸡蛋（常备15–20个）、纯牛奶、无糖酸奶",
      "豆腐、豆干、鸡胸肉、鸡腿、鲜鱼/虾仁、瘦牛肉",
      "时令绿叶菜、番茄、黄瓜、西葫芦、冬瓜",
      "苹果、香蕉、蓝莓、圣女果（做加餐）",
      "原味坚果（无盐无糖）、全麦饼干（全麦粉排第1位）",
      "生抽、醋、香油、虾皮（自调汤底）、无糖气泡水"
    ],
    less: [
      "非油炸方便面（每月限4–5包，周日赦免日用）",
      "全麦饼干（比薯片好，但含油糖，控量）",
      "奶酪片（高钙但也高脂，每周2–3片）",
      "100%纯果汁（必须兑水，每周不超2次）"
    ],
    no: [
      "油炸方便面（面饼油炸的那种）",
      "薯片、虾条、膨化食品",
      "辣条、魔芋爽等高钠零食",
      "可乐、雪碧、含糖果汁饮料",
      "蛋糕、奶油面包、甜甜圈",
      "火腿肠、午餐肉"
    ]
  },

  /* 零食配料表避雷（每100g标准） */
  label: {
    head: ["指标", "✅ 可以买", "⚠️ 勉强", "❌ 别买"],
    rows: [
      ["钠", "< 300mg", "300–600mg", "> 600mg"],
      ["糖", "< 5g", "5–15g", "> 15g"],
      ["脂肪", "< 10g", "10–20g", "> 20g"],
      ["反式脂肪", "0g", "—", "> 0g"],
      ["膳食纤维", "> 3g", "1–3g", "0g"]
    ],
    traps: [
      "「非油炸」≠ 低脂 → 看脂肪列",
      "「无蔗糖」≠ 无糖 → 可能加果葡糖浆",
      "「儿童食品」反而更甜 → 看配料表，别看包装"
    ]
  },

  /* 进度追踪参考 */
  tracking: {
    freq: "体重每 2 周 1 次（晨起空腹），身高每月 1 次（晚上量）",
    good: [
      "体重月增 0.2–0.3kg，身高月增 0.4–0.5cm → 身高在追赶，完美",
      "BMI 3 个月从 16.9 → 16.5 左右 → 方向对了",
      "腰围 3 个月不增或略降 → 内脏脂肪在控制",
      "不喊饿、精神好、运动不掉链子 → 方案可持续"
    ],
    warn: [
      "体重月增 >0.5kg 且身高 <0.3cm → 主食再减 ⅙ 碗，加菜加蛋",
      "经常喊饿/偷吃零食 → 加餐加 50kcal，别硬扛",
      "体重月降 >0.3kg（真掉秤）→ 8岁不能减重，主食加回 ⅓ 碗",
      "连续 2 个月身高零增长 → 蛋白钙加量，必要时看儿科"
    ]
  },

  /* ============ 家庭共识 & 老人指南 & 孩子接受度 ============ */
  family: {
    /* 共识 4 步法 */
    consensus: [
      { step: "换目标话术", bad: "「孩子太胖了，要控制饮食」", good: "「想让身高继续蹿起来，营养得跟上」", why: "老人一听「长高」立刻配合，一听「减肥」立刻反对" },
      { step: "给老人做饭指南", bad: "讲营养学、讲升糖指数", good: "给一张纸贴冰箱：每顿做什么、放多少", why: "老人照着做就行，别让他们「学」" },
      { step: "让老人参与追踪", bad: "不告诉老人结果", good: "每2周在孩子面前量身高，让老人看到数字涨", why: "老人看到「确实在长高」→ 从阻力变助力" },
      { step: "爸爸配合不拆台", bad: "当面说「差不多行了别那么严格」", good: "不在饭桌讨论、不带孩子买零食、带头吃杂粮饭", why: "爸爸一拆台，方案全废" }
    ],

    /* 老人做饭 4 原则 */
    cookRules: [
      { icon: "🍚", rule: "米饭掺一把粗粮", detail: "3勺白米 : 1勺糙米/小米/燕麦" },
      { icon: "🥩", rule: "每顿必有蛋白质", detail: "鸡蛋/鱼肉/鸡肉/豆腐，选1-2样" },
      { icon: "🥬", rule: "蔬菜要比肉多", detail: "蔬菜装1盘，肉装小半盘" },
      { icon: "🍜", rule: "面条别只煮面", detail: "加1把青菜、1个蛋" }
    ],

    /* 老人版份量参考 */
    cookPortions: [
      { item: "米饭", amount: "量杯半杯白米 + 1把粗粮", note: "够孩子+2大人" },
      { item: "蔬菜", amount: "2大把（约300g）", note: "一顿炒1盘半" },
      { item: "肉/鱼", amount: "孩子巴掌大的1块（50-60g）", note: "别「多炒点怕不够」" },
      { item: "鸡蛋", amount: "每天1-2个", note: "早1个，晚餐菜里可加1个" },
      { item: "面条", amount: "干面1小把（40-50g）", note: "成人一把的2/3" },
      { item: "油", amount: "炒一顿菜用1汤勺", note: "别倒一大勺" },
      { item: "盐", amount: "每顿小半勺（2-3g）", note: "孩子口味比大人淡" }
    ],

    /* 5道常做菜的微调 */
    dishFix: [
      { dish: "白米饭", old: "全白米", fix: "加1把小米或糙米，其他不变" },
      { dish: "西红柿鸡蛋面", old: "白面条+西红柿+鸡蛋", fix: "换全麦挂面，加1把小油菜" },
      { dish: "炒米饭", old: "剩白米饭+鸡蛋+火腿肠", fix: "杂粮剩饭+鸡蛋+蔬菜丁，火腿肠换虾仁" },
      { dish: "红烧肉/排骨", old: "多油多糖，肉多菜少", fix: "肉量减1/3，糖减半，多加1盘蔬菜" },
      { dish: "粥", old: "白米粥", fix: "小米粥 / 大米+燕麦粥（不额外加糖）" }
    ],

    /* 老人做饭 3 个不 */
    cookDonts: [
      { dont: "不要用汤泡饭", why: "不嚼就吞，胃不舒服还升糖快", instead: "饭和汤分开，先喝两口汤再吃饭" },
      { dont: "不要说「再吃点」", why: "孩子说饱了就是饱了", instead: "「那你吃两口菜再下桌」" },
      { dont: "不要把零食当奖励", why: "零食=好事，强化了零食地位", instead: "换「带你去公园/买本新书」" }
    ],

    /* 跟老人说话技巧 */
    talkTips: [
      { scene: "老人盛了满满一碗饭", bad: "「妈，别给他盛那么多！」", good: "「妈，给他盛 ⅔ 碗就行，不够我再添——让他自己学控制量」" },
      { scene: "老人买了方便面", bad: "「说了别买方便面！」", good: "「妈，这个留周日吃，平时我给他煮全麦面，他挺爱吃」" },
      { scene: "老人做了红烧肉", bad: "「太油了不健康」", good: "「妈做的肉特别香，我给孩子先盛2块，剩下咱们大人吃」" },
      { scene: "老人说「孩子瘦了」", bad: "「没有，是标准体重」", good: "「可能长高了吧，上周量又高了1cm——咱们量量看？」" }
    ],

    /* 孩子 6 招接受战术 */
    kidTactics: [
      { name: "渐进掺入法", icon: "📊", desc: "3周慢慢掺：白米4:糙米1 → 3:1 → 2:1:1，味蕾有2-3周适应期" },
      { name: "运动员话术", icon: "🏆", desc: "「国家队运动员都吃这个，长肌肉长身高」——别说「健康」，说「长高变强」" },
      { name: "先上菜后上饭", icon: "🥗", desc: "先端蔬菜和汤，5分钟后再端主食，饿了先吃菜，主食自然少吃" },
      { name: "给选择权", icon: "🤔", desc: "「今天吃杂粮饭还是荞麦面？」两个都行，有掌控感就不抗拒" },
      { name: "口感伪装", icon: "🎭", desc: "糙米提前泡2小时、全麦面做拌面、杂粮放粥里——别单独呈现" },
      { name: "保留方便面赦免日", icon: "🍜", desc: "每周日1次，让孩子参与选面饼+煮面，知道「周日还能吃」平时就不焦虑" }
    ],

    /* 孩子接受时间线 */
    kidTimeline: [
      { phase: "试探期", time: "第1-2周", status: "「饭不一样了」可能抗拒", focus: "比例极低(4:1)，别强调，混进去" },
      { phase: "适应期", time: "第3-4周", status: "吃出来了但能接受", focus: "用运动员话术，给选择权" },
      { phase: "习惯期", time: "第5-6周", status: "不再提了，正常吃", focus: "稳定比例，偶尔表扬「你长高了」" },
      { phase: "内化期", time: "第7-8周", status: "主动吃杂粮饭了", focus: "全家保持，别松懈回老习惯" }
    ],

    /* 孩子反抗应对 */
    kidReactions: [
      { says: "「我不要吃杂粮饭！」", bad: "「必须吃，不吃饿着」", good: "「行，今天白米饭也行，但我加了点小米——你尝尝，吃不出来吧？」" },
      { says: "「同学都吃方便面」", bad: "「别人家的事我不管」", good: "「周日你也能吃，咱们一起去超市选——平时吃全麦面，比方便面还好」" },
      { says: "「这个面不好吃」", bad: "「不好吃也得吃」", good: "「口感不一样？今天先吃一半，明天换个做法——拌面还是汤面？」" },
      { says: "「我不饿」", bad: "「必须吃！」", good: "「先喝两口汤，吃几口菜，饭不饿就不吃了」→ 别逼，但别给零食替代" },
      { says: "「我要吃零食」", bad: "「不能吃！马上吃饭」", good: "「先吃个苹果/喝杯牛奶，半小时后吃饭——零食留到放学加餐」" }
    ],

    /* 全家分工 */
    roles: [
      { role: "妈妈", does: "采购清单、做饭（工作日晚+周末）、追踪记录", notDoes: "说服老人（爸爸负责沟通）" },
      { role: "爸爸", does: "和老人沟通方案、不带零食回家、周末运动陪伴", notDoes: "具体做饭（除非妈妈忙不过来）" },
      { role: "老人", does: "按指南做饭（份量+搭配）、不额外给零食", notDoes: "制定方案、「创新菜」" },
      { role: "孩子", does: "自己打饭（按口诀）、周日选方便面口味", notDoes: "做饭、「决定吃什么」" }
    ]
  }
};
