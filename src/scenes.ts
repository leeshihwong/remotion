export const FPS = 30;
export const DURATION_IN_FRAMES = 3690;

export type CaptionAnchor =
  | "bottomFloating"
  | "sideLeft"
  | "sideRight"
  | "centerLower";

export type LayoutVariant =
  | "HeroProduct"
  | "ProblemCloud"
  | "NutritionMatrix"
  | "RecipeFlow"
  | "ComparisonMerge"
  | "SoftCTA";

export type SceneTheme = "warm" | "junior" | "yogurt" | "blend" | "cta";

export type AccentMotion =
  | "dualSpin"
  | "wordDepth"
  | "goldSweep"
  | "milkFlow"
  | "bridgeMerge"
  | "ctaLift";

export type ProductKind = "junior" | "yogurt" | "both" | "none";

export type CaptionChunk = {
  text: string;
  startMs: number;
  endMs: number;
  highlight?: string[];
};

export type NutritionItem = {
  label: string;
  value: string;
  note?: string;
};

export type Scene = {
  id: string;
  indexLabel: string;
  durationSec: number;
  title: string;
  eyebrow: string;
  screenText: string;
  keywords: string[];
  voiceover: string;
  layoutVariant: LayoutVariant;
  captionAnchor: CaptionAnchor;
  accentMotion: AccentMotion;
  voiceoverFile: string;
  captionChunks: CaptionChunk[];
  theme: SceneTheme;
  visualFocus: ProductKind;
  nutritionItems?: NutritionItem[];
  recipeSteps?: string[];
  cloudWords?: string[];
};

const chunkTimes = (durationSec: number, texts: string[]): CaptionChunk[] => {
  const segment = (durationSec * 1000) / texts.length;

  return texts.map((text, index) => ({
    text,
    startMs: Math.round(segment * index),
    endMs: Math.round(segment * (index + 1)),
  }));
};

export const scenes: Scene[] = [
  {
    id: "scene-01-hook",
    indexLabel: "01",
    durationSec: 8,
    title: "孩子营养，贵在日常",
    eyebrow: "Family Nutrition",
    screenText: "不是偶尔吃好\n而是每天稳定补充",
    keywords: ["稳定补充", "长期坚持"],
    voiceover:
      "孩子的营养，不是今天吃好一顿就够。真正让家长安心的，是每天能不能稳定补、能不能坚持。",
    layoutVariant: "HeroProduct",
    captionAnchor: "centerLower",
    accentMotion: "dualSpin",
    voiceoverFile: "voiceover/kids-nutrition/scene-01.mp3",
    captionChunks: [
      {
        text: "孩子的营养，不是今天吃好一顿就够。",
        startMs: 0,
        endMs: 3900,
        highlight: ["营养"],
      },
      {
        text: "更重要的是每天稳定补充、长期坚持。",
        startMs: 3900,
        endMs: 8000,
        highlight: ["稳定补充", "坚持"],
      },
    ],
    theme: "warm",
    visualFocus: "both",
  },
  {
    id: "scene-02-problems",
    indexLabel: "02",
    durationSec: 10,
    title: "很多家长都会遇到",
    eyebrow: "Daily Concerns",
    screenText: "",
    keywords: ["挑食", "零食多", "吸收一般"],
    voiceover:
      "如果你家孩子挑食、零食多，或者你一直在意他的营养、吸收和肠道状态，这条内容可以慢慢听完。",
    layoutVariant: "ProblemCloud",
    captionAnchor: "sideLeft",
    accentMotion: "wordDepth",
    voiceoverFile: "voiceover/kids-nutrition/scene-02.mp3",
    captionChunks: [
      {
        text: "挑食、零食多、吸收一般，很多家庭都会遇到。",
        startMs: 0,
        endMs: 5200,
        highlight: ["挑食", "吸收"],
      },
      {
        text: "这条内容可以慢慢听完。",
        startMs: 5200,
        endMs: 10000,
      },
    ],
    theme: "warm",
    visualFocus: "none",
    cloudWords: ["挑食", "零食多", "吸收一般", "肠道状态", "成长阶段"],
  },
  {
    id: "scene-03-junior-positioning",
    indexLabel: "03",
    durationSec: 10,
    title: "儿倍：日常营养打底",
    eyebrow: "PowerCocktail Junior",
    screenText: "3-12 岁儿童\n日常营养补充",
    keywords: ["3-12 岁", "每日补充"],
    voiceover:
      "PowerCocktail Junior，也就是我们常说的儿倍，定位不是代替吃饭，而是给三到十二岁孩子做日常营养打底。",
    layoutVariant: "HeroProduct",
    captionAnchor: "sideRight",
    accentMotion: "goldSweep",
    voiceoverFile: "voiceover/kids-nutrition/scene-03.mp3",
    captionChunks: chunkTimes(10, [
      "儿倍不是代替吃饭。",
      "它更像 3-12 岁孩子的日常营养打底。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 1 ? ["3-12 岁", "打底"] : ["不是"],
    })),
    theme: "junior",
    visualFocus: "junior",
    nutritionItems: [
      { label: "适合阶段", value: "3-12 岁" },
      { label: "日常方向", value: "营养打底" },
    ],
  },
  {
    id: "scene-04-junior-support",
    indexLabel: "04",
    durationSec: 11,
    title: "儿倍四维支持",
    eyebrow: "Four Dimensions",
    screenText: "吸收、骨骼\n抗氧化、能量",
    keywords: ["吸收", "骨骼", "抗氧化", "能量"],
    voiceover:
      "它的逻辑分四层：先照顾肠道和吸收，再支持骨骼体格，同时补充抗氧化营养，最后让 B 族帮助把营养转成日常精力。",
    layoutVariant: "NutritionMatrix",
    captionAnchor: "bottomFloating",
    accentMotion: "goldSweep",
    voiceoverFile: "voiceover/kids-nutrition/scene-04.mp3",
    captionChunks: chunkTimes(11, [
      "先照顾肠道和吸收。",
      "再支持骨骼体格、抗氧化营养和日常能量。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["吸收"] : ["骨骼", "能量"],
    })),
    theme: "junior",
    visualFocus: "junior",
    nutritionItems: [
      { label: "能量入口", value: "肠道吸收" },
      { label: "成长支架", value: "骨骼体格" },
      { label: "日常防护", value: "抗氧化营养" },
      { label: "学习精力", value: "能量代谢" },
    ],
  },
  {
    id: "scene-05-junior-ingredients",
    indexLabel: "05",
    durationSec: 11,
    title: "成分逻辑，不堆概念",
    eyebrow: "Ingredient Logic",
    screenText: "膳食纤维 + 矿物质\n再加植物营养",
    keywords: ["阿拉伯胶", "钙镁D", "锌铜硒"],
    voiceover:
      "成分上，阿拉伯胶是膳食纤维；钙、镁、维生素 D 关注骨骼；锌、铜、硒和多种蔬果植物营养，做更底层的日常支持。",
    layoutVariant: "NutritionMatrix",
    captionAnchor: "sideLeft",
    accentMotion: "goldSweep",
    voiceoverFile: "voiceover/kids-nutrition/scene-05.mp3",
    captionChunks: chunkTimes(11, [
      "阿拉伯胶是膳食纤维。",
      "钙镁 D、锌铜硒和蔬果植物营养，做日常支持。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["阿拉伯胶"] : ["钙镁 D", "锌铜硒"],
    })),
    theme: "junior",
    visualFocus: "junior",
    nutritionItems: [
      { label: "膳食纤维", value: "阿拉伯胶" },
      { label: "骨骼关注", value: "钙 + 镁 + D" },
      { label: "微量支持", value: "锌 / 铜 / 硒" },
      { label: "植物来源", value: "蔬果植物营养" },
    ],
  },
  {
    id: "scene-06-junior-usage",
    indexLabel: "06",
    durationSec: 9,
    title: "儿倍怎么喝",
    eyebrow: "Daily Habit",
    screenText: "每天 1 次\n果汁口感，孩子爱喝",
    keywords: ["每天 1 次", "果汁口感", "孩子爱喝"],
    voiceover:
      "儿倍的开始方式很简单：每天一次就可以。它是果汁口感，孩子接受度比较高，也更容易变成每天的小习惯。",
    layoutVariant: "RecipeFlow",
    captionAnchor: "sideRight",
    accentMotion: "goldSweep",
    voiceoverFile: "voiceover/kids-nutrition/scene-06.mp3",
    captionChunks: [
      {
        text: "每天 1 次就可以。",
        startMs: 0,
        endMs: 4200,
        highlight: ["每天 1 次"],
      },
      {
        text: "果汁口感，孩子爱喝，也更容易坚持。",
        startMs: 4200,
        endMs: 9000,
        highlight: ["果汁口感", "孩子爱喝"],
      },
    ],
    theme: "junior",
    visualFocus: "junior",
    recipeSteps: ["每天 1 次", "冲调饮用", "果汁口感", "变成小习惯"],
  },
  {
    id: "scene-07-yogurt-positioning",
    indexLabel: "07",
    durationSec: 9,
    title: "酸奶粉：放进家庭饮食",
    eyebrow: "Feel-Good Yoghurt",
    screenText: "不是硬吃营养品\n而是放进日常餐桌",
    keywords: ["早餐", "加餐", "下午茶"],
    voiceover:
      "另一款 Feel-Good Yoghurt 酸奶粉，更像家庭饮食补充。它不是让孩子硬吃营养品，而是把补充放进早餐、加餐和下午茶。",
    layoutVariant: "HeroProduct",
    captionAnchor: "sideLeft",
    accentMotion: "milkFlow",
    voiceoverFile: "voiceover/kids-nutrition/scene-07.mp3",
    captionChunks: chunkTimes(9, [
      "酸奶粉更像家庭饮食补充。",
      "把补充放进早餐、加餐和下午茶。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["家庭饮食"] : ["早餐", "下午茶"],
    })),
    theme: "yogurt",
    visualFocus: "yogurt",
  },
  {
    id: "scene-08-yogurt-ingredients",
    indexLabel: "08",
    durationSec: 11,
    title: "酸奶粉成分逻辑",
    eyebrow: "Gut Friendly",
    screenText: "益生菌 + 益生元\n肠道友好，更好坚持",
    keywords: ["四联益生菌", "菊粉", "乳清蛋白"],
    voiceover:
      "它的核心是四联益生菌加菊粉益生元，再配合乳清蛋白、钙镁磷酸盐和维生素 B3，重点放在肠道友好和日常饮食质量。",
    layoutVariant: "NutritionMatrix",
    captionAnchor: "bottomFloating",
    accentMotion: "milkFlow",
    voiceoverFile: "voiceover/kids-nutrition/scene-08.mp3",
    captionChunks: chunkTimes(11, [
      "核心是四联益生菌加菊粉益生元。",
      "再配合乳清蛋白、钙镁磷酸盐和维生素 B3。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["益生菌", "益生元"] : ["乳清蛋白", "B3"],
    })),
    theme: "yogurt",
    visualFocus: "yogurt",
    nutritionItems: [
      { label: "肠道友好", value: "四联益生菌" },
      { label: "益生菌食物", value: "菊粉益生元" },
      { label: "饮食质量", value: "乳清蛋白" },
      { label: "日常营养", value: "钙镁磷酸盐" },
    ],
  },
  {
    id: "scene-09-yogurt-recipe",
    indexLabel: "09",
    durationSec: 10,
    title: "家里怎么做",
    eyebrow: "Simple Recipe",
    screenText: "1L 牛奶 + 1 袋粉\n酸奶机约 12 小时",
    keywords: ["1L 牛奶", "1 袋粉", "12 小时"],
    voiceover:
      "做法也容易记：一升牛奶加一袋酸奶粉，搅匀后放酸奶机静置约十二小时，做好后冷藏五到七天。",
    layoutVariant: "RecipeFlow",
    captionAnchor: "sideRight",
    accentMotion: "milkFlow",
    voiceoverFile: "voiceover/kids-nutrition/scene-09.mp3",
    captionChunks: chunkTimes(10, [
      "1L 牛奶加 1 袋酸奶粉。",
      "酸奶机约 12 小时，做好后冷藏 5-7 天。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["1L", "1 袋"] : ["12 小时", "5-7 天"],
    })),
    theme: "yogurt",
    visualFocus: "yogurt",
    recipeSteps: ["1L 牛奶", "1 袋酸奶粉", "酸奶机约 12 小时", "冷藏 5-7 天"],
  },
  {
    id: "scene-10-comparison",
    indexLabel: "10",
    durationSec: 10,
    title: "一款打底，一款补充",
    eyebrow: "How They Work Together",
    screenText: "儿倍管每天怎么补\n酸奶粉管家里怎么坚持",
    keywords: ["儿倍", "酸奶粉"],
    voiceover:
      "两款放在一起看，儿倍偏每日营养打底，酸奶粉偏肠道和家庭饮食补充。一个管每天怎么补，一个管家里怎么坚持。",
    layoutVariant: "ComparisonMerge",
    captionAnchor: "centerLower",
    accentMotion: "bridgeMerge",
    voiceoverFile: "voiceover/kids-nutrition/scene-10.mp3",
    captionChunks: chunkTimes(10, [
      "儿倍偏每日营养打底。",
      "酸奶粉偏肠道和家庭饮食补充。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["儿倍", "打底"] : ["酸奶粉", "补充"],
    })),
    theme: "blend",
    visualFocus: "both",
  },
  {
    id: "scene-11-care",
    indexLabel: "11",
    durationSec: 11,
    title: "如果你也在意这些",
    eyebrow: "For Caring Families",
    screenText: "关注成长、肠道和吸收\n就可以进一步了解",
    keywords: ["成长阶段", "肠道状态", "长期习惯"],
    voiceover:
      "如果你平时就会关注孩子吃得够不够、吸收好不好，或者想把日常补充做得更简单，这两款就值得进一步了解。",
    layoutVariant: "ProblemCloud",
    captionAnchor: "bottomFloating",
    accentMotion: "wordDepth",
    voiceoverFile: "voiceover/kids-nutrition/scene-11.mp3",
    captionChunks: chunkTimes(11, [
      "关注孩子吃得够不够、吸收好不好。",
      "也想把日常补充做得更简单。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["吸收"] : ["更简单"],
    })),
    theme: "warm",
    visualFocus: "none",
    cloudWords: ["成长阶段", "肠道状态", "吸收", "日常补充", "长期习惯"],
  },
  {
    id: "scene-12-cta",
    indexLabel: "12",
    durationSec: 10,
    title: "看完问我",
    eyebrow: "Next Step",
    screenText: "先看家庭情况\n再判断从哪款开始",
    keywords: ["先看情况", "再判断"],
    voiceover:
      "如果你听完觉得像你家的情况，直接问我。先看孩子年龄、饮食和肠道状态，再判断从哪款开始。",
    layoutVariant: "SoftCTA",
    captionAnchor: "centerLower",
    accentMotion: "ctaLift",
    voiceoverFile: "voiceover/kids-nutrition/scene-12.mp3",
    captionChunks: chunkTimes(10, [
      "听完觉得像你家的情况，直接问我。",
      "先看家庭情况，再判断从哪款开始。",
    ]).map((chunk, index) => ({
      ...chunk,
      highlight: index === 0 ? ["问我"] : ["先看", "再判断"],
    })),
    theme: "cta",
    visualFocus: "both",
  },
];

export const sceneStarts = scenes.reduce<number[]>((acc, scene, index) => {
  if (index === 0) {
    return [0];
  }

  return [...acc, acc[index - 1] + scenes[index - 1].durationSec * FPS];
}, []);

export const totalSceneSeconds = scenes.reduce(
  (sum, scene) => sum + scene.durationSec,
  0,
);

export const toFrame = (seconds: number) => Math.round(seconds * FPS);
