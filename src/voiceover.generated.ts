export const voiceoverDurations: Record<string, number> = {
  "scene-01-hook": 7.992,
  "scene-02-problems": 8.424,
  "scene-03-junior-positioning": 8.664,
  "scene-04-junior-support": 10.080,
  "scene-05-junior-ingredients": 11.064,
  "scene-06-junior-usage": 9.048,
  "scene-07-yogurt-positioning": 10.056,
  "scene-08-yogurt-ingredients": 10.584,
  "scene-09-yogurt-recipe": 8.856,
  "scene-10-comparison": 10.224,
  "scene-11-care": 8.952,
  "scene-12-cta": 8.784,
};

export type GeneratedVoiceoverCaption = {
  text: string;
  startMs: number;
  endMs: number;
};

export const voiceoverCaptions: Record<string, GeneratedVoiceoverCaption[]> = {
  "scene-01-hook": [{"text":"孩子的营养，不是今天吃好一顿就够。","startMs":100,"endMs":3264},{"text":"真正让家长安心的，是每天能不能稳定补、能不能坚持。","startMs":3214,"endMs":7924}],
  "scene-02-problems": [{"text":"如果你家孩子挑食、零食多，或者你一直在意他的营养、吸收和肠道状态，这条内容可以慢慢听完。","startMs":100,"endMs":8370}],
  "scene-03-junior-positioning": [{"text":"PowerCocktail Junior，也就是我们常说的儿倍，定位不是代替吃饭，而是给三到十二岁孩子做日常营养打底。","startMs":100,"endMs":8604}],
  "scene-04-junior-support": [{"text":"它的逻辑分四层：先照顾肠道和吸收，再支持骨骼体格，同时补充抗氧化营养，最后让 B 族帮助把营养转成日常精力。","startMs":100,"endMs":10022}],
  "scene-05-junior-ingredients": [{"text":"成分上，阿拉伯胶是膳食纤维；钙、镁、维生素 D 关注骨骼；锌、铜、硒和多种蔬果植物营养，做更底层的日常支持。","startMs":100,"endMs":11015}],
  "scene-06-junior-usage": [{"text":"儿倍的开始方式很简单：每天一次就可以。","startMs":100,"endMs":3721},{"text":"它是果汁口感，孩子接受度比较高，也更容易变成每天的小习惯。","startMs":3671,"endMs":8984}],
  "scene-07-yogurt-positioning": [{"text":"另一款 Feel-Good Yoghurt 酸奶粉，更像家庭饮食补充。","startMs":100,"endMs":4302},{"text":"它不是让孩子硬吃营养品，而是把补充放进早餐、加餐和下午茶。","startMs":4252,"endMs":9988}],
  "scene-08-yogurt-ingredients": [{"text":"它的核心是四联益生菌加菊粉益生元，再配合乳清蛋白、钙镁磷酸盐和维生素 B3，重点放在肠道友好和日常饮食质量。","startMs":100,"endMs":10524}],
  "scene-09-yogurt-recipe": [{"text":"做法也容易记：一升牛奶加一袋酸奶粉，搅匀后放酸奶机静置约十二小时，做好后冷藏五到七天。","startMs":100,"endMs":8805}],
  "scene-10-comparison": [{"text":"两款放在一起看，儿倍偏每日营养打底，酸奶粉偏肠道和家庭饮食补充。","startMs":100,"endMs":6668},{"text":"一个管每天怎么补，一个管家里怎么坚持。","startMs":6618,"endMs":10167}],
  "scene-11-care": [{"text":"如果你平时就会关注孩子吃得够不够、吸收好不好，或者想把日常补充做得更简单，这两款就值得进一步了解。","startMs":100,"endMs":8895}],
  "scene-12-cta": [{"text":"如果你听完觉得像你家的情况，直接问我。","startMs":100,"endMs":3766},{"text":"先看孩子年龄、饮食和肠道状态，再判断从哪款开始。","startMs":3716,"endMs":8727}],
};
