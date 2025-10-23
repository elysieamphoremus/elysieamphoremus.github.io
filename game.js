// 定义所有可能的属性和命途
const ALL_PROPERTIES = ['风', '火', '雷', '冰', '物理', '虚数', '量子'];
const ALL_PATHS = ['巡猎', '智识', '毁灭', '同谐', '虚无', '丰饶', '存护', '记忆'];
const ALL_KEYWORDS = [...ALL_PROPERTIES, ...ALL_PATHS];

// 生成内鬼提示的函数
function generateLeakerTips() {
  // 初始化每个版本的内鬼提示库
  const leakerTipsByVersion = {};
  
  // 获取所有版本号并排序
  const versions = Object.keys(gameConfig.versions).sort((a, b) => parseFloat(a) - parseFloat(b));
  
  // 遍历每个版本，生成下一版本的内鬼提示
  for (let i = 0; i < versions.length - 1; i++) {
    const currentVer = versions[i];
    const nextVer = versions[i + 1];
    
    // 初始化内鬼提示库
    leakerTipsByVersion[currentVer] = {
      realAbyssTips: [],    // 忘却之庭真内鬼提示库
      realStoryTips: [],    // 虚构叙事真内鬼提示库
      fakeAbyssTips: [],    // 忘却之庭假内鬼提示库
      fakeStoryTips: []     // 虚构叙事假内鬼提示库
    };
    
    const nextVersionAbyss = gameConfig.versions[nextVer].abyss;
    
    // 处理忘却之庭
    const abyssChallenge = nextVersionAbyss.find(challenge => challenge.name === '忘却之庭');
    if (abyssChallenge && gameState.abyssBuffs[nextVer] && gameState.abyssBuffs[nextVer]['忘却之庭']) {
      let buffs = gameState.abyssBuffs[nextVer]['忘却之庭'];
      // 确保buffs是数组
      if (typeof buffs === 'string') {
        buffs = [buffs];
      }
      
      // 生成真内鬼提示
      buffs.forEach(buff => {
        const keywords = extractKeywords(buff);
        keywords.forEach(keyword => {
          leakerTipsByVersion[currentVer].realAbyssTips.push(`妮可少女：下版本的忘却之庭利好${keyword}角色`);
        });
      });
      
      // 添加特殊消息：妮可少女：太阳明天将从东边升起（用于低概率抽取）
      leakerTipsByVersion[currentVer].realAbyssTips.push("妮可少女：太阳明天将从东边升起");
      
      // 生成假内鬼提示
      const allKeywordsInBuffs = buffs.flatMap(buff => extractKeywords(buff));
      const fakeKeywords = ALL_KEYWORDS.filter(keyword => !allKeywordsInBuffs.includes(keyword));
      fakeKeywords.forEach(keyword => {
        leakerTipsByVersion[currentVer].fakeAbyssTips.push(`鹿娜：下版本的忘却之庭利好${keyword}角色`);
      });
      
      // 添加特殊消息：鹿娜：太阳明天将从西边升起（用于低概率抽取）
      leakerTipsByVersion[currentVer].fakeAbyssTips.push("鹿娜：太阳明天将从西边升起");
    }
    
    // 处理虚构叙事
    const storyChallenge = nextVersionAbyss.find(challenge => challenge.name === '虚构叙事');
    if (storyChallenge && gameState.abyssBuffs[nextVer] && gameState.abyssBuffs[nextVer]['虚构叙事']) {
      let buffs = gameState.abyssBuffs[nextVer]['虚构叙事'];
      // 确保buffs是数组
      if (typeof buffs === 'string') {
        buffs = [buffs];
      }
      
      // 生成真内鬼提示
      buffs.forEach(buff => {
        const keywords = extractKeywords(buff);
        keywords.forEach(keyword => {
          leakerTipsByVersion[currentVer].realStoryTips.push(`妮可少女：下版本的虚构叙事利好${keyword}角色`);
        });
      });
      
      // 添加特殊消息：妮可少女：太阳明天将从东边升起（用于低概率抽取）
      leakerTipsByVersion[currentVer].realStoryTips.push("妮可少女：太阳明天将从东边升起");
      
      // 生成假内鬼提示
      const allKeywordsInBuffs = buffs.flatMap(buff => extractKeywords(buff));
      const fakeKeywords = ALL_KEYWORDS.filter(keyword => !allKeywordsInBuffs.includes(keyword));
      fakeKeywords.forEach(keyword => {
        leakerTipsByVersion[currentVer].fakeStoryTips.push(`鹿娜：下版本的虚构叙事利好${keyword}角色`);
      });
      
      // 添加特殊消息：鹿娜：太阳明天将从西边升起（用于低概率抽取）
      leakerTipsByVersion[currentVer].fakeStoryTips.push("鹿娜：太阳明天将从西边升起");
    }
  }
  
  return leakerTipsByVersion;
}

// 从buff文本中提取关键词
function extractKeywords(buffText) {
  const keywords = [];
  
  // 检查所有关键词是否在buff文本中
  ALL_KEYWORDS.forEach(keyword => {
    if (buffText.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  return keywords;
}

// 从提示库中随机抽取一条提示
function getRandomTip(tipArray) {
  if (!tipArray || tipArray.length === 0) {
    return '暂无提示';
  }
  
  // 定义特殊消息
  const specialMessage1 = "妮可少女：太阳明天将从东边升起";
  const specialMessage2 = "鹿娜：太阳明天将从西边升起";
  
  // 检查是否包含特殊消息
  const hasSpecialMessage1 = tipArray.includes(specialMessage1);
  const hasSpecialMessage2 = tipArray.includes(specialMessage2);
  
  // 检查是否有任何特殊消息
  if (hasSpecialMessage1 || hasSpecialMessage2) {
    // 6%的概率返回特殊消息
    if (Math.random() < 0.06) {
      // 如果两条特殊消息都存在，随机选择一条
      if (hasSpecialMessage1 && hasSpecialMessage2) {
        return Math.random() < 0.5 ? specialMessage1 : specialMessage2;
      }
      // 否则返回存在的那条特殊消息
      return hasSpecialMessage1 ? specialMessage1 : specialMessage2;
    } else {
      // 94%的概率从非特殊消息中随机选择
      const normalTips = tipArray.filter(tip => tip !== specialMessage1 && tip !== specialMessage2);
      if (normalTips.length > 0) {
        const randomIndex = Math.floor(Math.random() * normalTips.length);
        return normalTips[randomIndex];
      }
    }
  }
  
  // 普通情况：随机选择一条提示
  const randomIndex = Math.floor(Math.random() * tipArray.length);
  return tipArray[randomIndex];
}

// 抽取温馨提示的函数
function drawWarmTips(currentVersion) {
  const tips = [];
  const versionConfig = gameConfig.versions[currentVersion];
  const leakerTips = gameState.leakerTips || {};
  const versionLeakerTips = leakerTips[currentVersion] || {};
  
  // 1. 从角色提示库抽取
  const characterTip = getRandomTip(versionConfig.characterTips);
  tips.push(characterTip);
  
  // 2. 从有趣提示库抽取
  const funnyTip = getRandomTip(versionConfig.funnyTips);
  tips.push(funnyTip);
  
  // 3. 从内鬼提示库抽取：先随机选择一个子库
  const leakerTipLibraries = [];
  
  // 收集所有非空的内鬼提示子库
  if (versionLeakerTips.realAbyssTips && versionLeakerTips.realAbyssTips.length > 0) {
    leakerTipLibraries.push(versionLeakerTips.realAbyssTips);
  }
  if (versionLeakerTips.realStoryTips && versionLeakerTips.realStoryTips.length > 0) {
    leakerTipLibraries.push(versionLeakerTips.realStoryTips);
  }
  if (versionLeakerTips.fakeAbyssTips && versionLeakerTips.fakeAbyssTips.length > 0) {
    leakerTipLibraries.push(versionLeakerTips.fakeAbyssTips);
  }
  if (versionLeakerTips.fakeStoryTips && versionLeakerTips.fakeStoryTips.length > 0) {
    leakerTipLibraries.push(versionLeakerTips.fakeStoryTips);
  }
  
  // 随机选择一个子库并抽取提示
  let leakerTip = '暂无内鬼消息';
  if (leakerTipLibraries.length > 0) {
    const randomLibrary = leakerTipLibraries[Math.floor(Math.random() * leakerTipLibraries.length)];
    leakerTip = getRandomTip(randomLibrary);
  } else if (['3.6', '3.7'].includes(currentVersion)) {
    // 对于3.6和3.7版本，从两条特殊消息中随机选择一条
    const specialMessages = ["鹿娜：太阳明天将从西边升起", "妮可少女：太阳明天将从东边升起"];
    leakerTip = specialMessages[Math.floor(Math.random() * specialMessages.length)];
  }
  tips.push(leakerTip);
  
  return tips;
}

// 更新温馨提示显示的函数
function updateWarmTips(currentVersion) {
  const tips = drawWarmTips(currentVersion);
  const tipsContainer = elements.warmTipsContent;
  
  if (tipsContainer) {
    // 清空容器
    tipsContainer.innerHTML = '';
    
    // 添加每条提示，并处理换行
    tips.forEach(tip => {
      const tipElement = document.createElement('p');
      // 替换换行符为<br>标签
      tipElement.innerHTML = tip.replace(/\n/g, '<br>');
      tipsContainer.appendChild(tipElement);
    });
  }
}

// 换一批提示的函数
function refreshWarmTips() {
  updateWarmTips(gameState.currentVersion);
}

// 更新所有内鬼提示显示的函数
function updateAllLeakerTips(currentVersion) {
  const tipsContainer = elements.allLeakerTipsContent;
  const leakerTips = gameState.leakerTips || {};
  const versionLeakerTips = leakerTips[currentVersion] || {};
  
  if (tipsContainer) {
    // 清空容器
    tipsContainer.innerHTML = '';
    
    // 创建所有内鬼提示的内容
    let allTipsHtml = '';
    
    // 添加忘却之庭真内鬼提示
    if (versionLeakerTips.realAbyssTips && versionLeakerTips.realAbyssTips.length > 0) {
      allTipsHtml += '<div class="leaker-tips-section">';
      allTipsHtml += '<h4>忘却之庭真内鬼消息</h4>';
      versionLeakerTips.realAbyssTips.forEach(tip => {
        allTipsHtml += `<p>${tip}</p>`;
      });
      allTipsHtml += '</div>';
    }
    
    // 添加虚构叙事真内鬼提示
    if (versionLeakerTips.realStoryTips && versionLeakerTips.realStoryTips.length > 0) {
      allTipsHtml += '<div class="leaker-tips-section">';
      allTipsHtml += '<h4>虚构叙事真内鬼消息</h4>';
      versionLeakerTips.realStoryTips.forEach(tip => {
        allTipsHtml += `<p>${tip}</p>`;
      });
      allTipsHtml += '</div>';
    }
    
    // 添加忘却之庭假内鬼提示
    if (versionLeakerTips.fakeAbyssTips && versionLeakerTips.fakeAbyssTips.length > 0) {
      allTipsHtml += '<div class="leaker-tips-section">';
      allTipsHtml += '<h4>忘却之庭假内鬼消息</h4>';
      versionLeakerTips.fakeAbyssTips.forEach(tip => {
        allTipsHtml += `<p>${tip}</p>`;
      });
      allTipsHtml += '</div>';
    }
    
    // 添加虚构叙事假内鬼提示
    if (versionLeakerTips.fakeStoryTips && versionLeakerTips.fakeStoryTips.length > 0) {
      allTipsHtml += '<div class="leaker-tips-section">';
      allTipsHtml += '<h4>虚构叙事假内鬼消息</h4>';
      versionLeakerTips.fakeStoryTips.forEach(tip => {
        allTipsHtml += `<p>${tip}</p>`;
      });
      allTipsHtml += '</div>';
    }
    
    // 如果没有内鬼提示，显示提示信息
    if (allTipsHtml === '') {
      allTipsHtml = '<p>暂无内鬼消息</p>';
    }
    
    // 设置内容
    tipsContainer.innerHTML = allTipsHtml;
  }
}

// 游戏配置
const gameConfig = {
  // 角色数据
  characters: {
    '刃': { name: '刃', element: '风', path: '毁灭', tags: ['常驻'], basePower: 80, powerLevels: [80, 96, 115.2, 138.24, 165.888, 199.0656, 238.8787] },
    '希儿': { name: '希儿', element: '量子', path: '巡猎', tags: ['常驻'], basePower: 80, powerLevels: [80, 96, 115.2, 138.24, 165.888, 199.0656, 238.8787] },
    '符玄': { name: '符玄', element: '量子', path: '存护', tags: ['常驻'], basePower: 80, powerLevels: [80, 96, 115.2, 138.24, 165.888, 199.0656, 238.8787] },
    '大黑塔': { name: '大黑塔', element: '冰', path: '智识', tags: [], basePower: 100, powerLevels: [100, 120, 144, 172.8, 207.36, 248.832, 298.5984] },
    '阿格莱雅': { name: '阿格莱雅', element: '雷', path: '记忆', tags: [], basePower: 100, powerLevels: [100, 120, 144, 172.8, 207.36, 248.832, 298.5984] },
    '缇宝': { name: '缇宝', element: '量子', path: '同谐', tags: [], basePower: 120, powerLevels: [120, 144, 172.8, 207.36, 248.832, 298.5984, 358.3181] },
    '万敌': { name: '万敌', element: '虚数', path: '毁灭', tags: [], basePower: 120, powerLevels: [120, 144, 172.8, 207.36, 248.832, 298.5984, 358.3181] },
    '遐蝶': { name: '遐蝶', element: '量子', path: '记忆', tags: [], basePower: 144, powerLevels: [144, 172.8, 207.36, 248.832, 298.5984, 358.3181, 429.9817] },
    '那刻夏': { name: '那刻夏', element: '风', path: '智识', tags: [], basePower: 144, powerLevels: [144, 172.8, 207.36, 248.832, 298.5984, 358.3181, 429.9817] },
    '风堇': { name: '风堇', element: '风', path: '记忆', tags: [], basePower: 172.8, powerLevels: [172.8, 207.36, 248.832, 298.5984, 358.3181, 429.9817, 515.978] },
    '赛飞儿': { name: '赛飞儿', element: '量子', path: '虚无', tags: [], basePower: 172.8, powerLevels: [172.8, 207.36, 248.832, 298.5984, 358.3181, 429.9817, 515.978] },
    '白厄': { name: '白厄', element: '物理', path: '毁灭', tags: [], basePower: 207.36, powerLevels: [207.36, 248.832, 298.5984, 358.3181, 429.9817, 515.978, 619.1736] },
    'Saber': { name: 'Saber', element: '风', path: '毁灭', tags: ['常驻'], basePower: 172.8, powerLevels: [172.8, 207.36, 248.832, 298.5984, 358.3181, 429.9817, 515.978] },
    'Archer': { name: 'Archer', element: '量子', path: '巡猎', tags: ['常驻', '免费'], basePower: 172.8, powerLevels: [172.8, 207.36, 248.832, 298.5984, 358.3181, 429.9817, 515.978] },
    '海瑟音': { name: '海瑟音', element: '物理', path: '虚无', tags: [], basePower: 248.832, powerLevels: [248.832, 298.5984, 358.3181, 429.9817, 515.978, 619.1736, 743.0084] },
    '刻律德菈': { name: '刻律德菈', element: '风', path: '同谐', tags: [], basePower: 248.832, powerLevels: [248.832, 298.5984, 358.3181, 429.9817, 515.978, 619.1736, 743.0084] },
    '长夜月': { name: '长夜月', element: '冰', path: '记忆', tags: [], basePower: 298.5984, powerLevels: [298.5984, 358.3181, 429.9817, 515.978, 619.1736, 743.0084, 891.61] },
    '丹恒·腾荒': { name: '丹恒·腾荒', element: '物理', path: '存护', tags: ['免费'], basePower: 298.5984, powerLevels: [298.5984, 358.3181, 429.9817, 515.978, 619.1736, 743.0084, 891.61] },
    '昔涟': { name: '昔涟', element: '冰', path: '记忆', tags: ['挚爱之人'], basePower: 358.3181, powerLevels: [358.3181, 429.9817, 515.978, 619.1736, 743.0084, 891.61, 1069.932] }
  },
  
  // 版本配置
  versions: {
    '3.0': {
      upChars: ['大黑塔', '阿格莱雅'],
      tickets: 700,
      abyss: [
        { name: '忘却之庭', standard: 180, bonus: { threshold: 220, tickets: 250 }, buff: '' }
      ],
      // 提示库
      characterTips: [
        '小小人偶：黑塔女士你的帽子怎么尖尖的',
        '小小人偶：黑塔女士举世无双!黑塔女士聪明绝顶！黑塔女士沉鱼落雁！'
      ],
      funnyTips: [
        '爵士豪毛：雅衣姐…我不想死…',
        '牢雅：孩子们，我的衣匠没有头',
        '第一位限五记忆：记忆的尽头是什么？你不用告诉我—我会自己去看。'
      ]
    },
    '3.1': {
      upChars: ['缇宝', '万敌'],
      tickets: 100,
      abyss: [
        { name: '忘却之庭', standard: 260, bonus: { threshold: 340, tickets: 250 }, buff: '命途为同谐的角色造成的伤害提高20％' }
      ],
      // 提示库
      characterTips: [
        '猫哥：缇宝一魂984%提升是无脑吹捧？！',
        '"我们"：是缇宝缇安缇宁缇宋缇宠缇宕…!'
      ],
      funnyTips: [
        '"我们"：是 缇定缇官缇实缇宜缇宙缇宗…!',
        '牢敌：孩子们，我脊柱侧弯'
      ]
    },
    '3.2': {
      upChars: ['遐蝶', '那刻夏', '大黑塔'],
      tickets: 100,
      abyss: [
        { name: '忘却之庭', standard: 350, bonus: { threshold: 550, tickets: 250 }, buff: '' }
      ],
      tip: '兔头：周年庆大C，属于超大杯！',
      // 提示库
      characterTips: [
        '逆蝶：你蝶来咯',
        '那刻夏：魔术技巧！',
        '不会吧：不会真有人抽复刻吧？'
      ],
      funnyTips: [
        '兔头：超大杯上！',
        '盲人姑娘：孩子们，我加强后约等于遐蝶',
        '那刻夏：请叫我阿那刻萨戈拉斯!'
      ]
    },
    '3.3': {
      upChars: ['风堇', '赛飞儿'],
      tickets: 100,
      abyss: [
        { name: '忘却之庭', standard: 400, bonus: { threshold: 650, tickets: 250 }, buff: '' },
        { name: '虚构叙事', standard: 300, bonus: { threshold: 500, tickets: 250 }, buff: '命途为智识的角色造成的伤害提高20％' }
      ],
      // 提示库
      characterTips: [
        '风宝：谁是翁法罗斯第一超模怪？',
        '风宝：哼 想逃？闪电炫风批！'
      ],
      funnyTips: [
        '二舅妈：谁找我借的膨胀罗斯落这了？',
        '爵士豪毛：雅衣姐…我不想死…'
      ]
    },
    '3.4': {
      upChars: ['白厄'],
      tickets: 100,
      freeChars: ['Archer'],
      abyss: [
        { name: '忘却之庭', standard: 600, bonus: { threshold: 900, tickets: 250 }, buff: '' },
        { name: '虚构叙事', standard: 500, bonus: { threshold: 800, tickets: 250 }, buff: '命途为智识的角色造成的伤害提高20％' }
      ],
      // 提示库
      characterTips: [
        '请输入文本',
        '白厄真名：卡厄斯兰那khaslana',
        '33550336'
      ],
      funnyTips: [
        '白厄：纳努克，我为你带来烩面了！',
        '我的天哪，救世主大人！：我的天哪，救世主大人！'
      ]
    },
    '3.5': {
      upChars: ['海瑟音', '刻律德菈'],
      tickets: 100,
      abyss: [
        { name: '忘却之庭', standard: 700, bonus: { threshold: 1100, tickets: 250 }, buff: '' },
        { name: '虚构叙事', standard: 650, bonus: { threshold: 1050, tickets: 250 }, buff: '命途为智识的角色造成的伤害提高20％' }
      ],
      // 提示库
      characterTips: [
        '剑旗爵：你，你可有何话说！',
        '神秘墨镜女子，神秘出手女子：等下一个天亮~'
      ],
      funnyTips: [
        '凯撒：再无话说，请速速动手！',
        '神秘音鲸女子：组一辈子dot队！'
      ]
    },
    '3.6': {
      upChars: ['长夜月', '丹恒·腾荒'],
      tickets: 100,
      freeChars: ['丹恒·腾荒'],
      abyss: [
        { name: '忘却之庭', standard: 900, bonus: { threshold: 1400, tickets: 250 }, buff: '' },
        { name: '虚构叙事', standard: 900, bonus: { threshold: 1400, tickets: 250 }, buff: '命途为智识的角色造成的伤害提高30％' }
      ],
      lockedTip: { text: '爱音：太阳将从东边升起', cost: 100 },
      // 提示库
      characterTips: [
        '37：我看谁敢说我傻了吧唧的？',
        '丹恒：击云连接大脑，化龙代替思考，化龙妙法2.0启动！'
      ],
      funnyTips: [
        '丹竖：我不是他',
        '丹撇：我不是他',
        '丹捺：我不是他'
      ]
    },
    '3.7': {
      upChars: ['昔涟'],
      tickets: 100,
      abyss: [
        { name: '异相仲裁', standard: 0, bonus: null, buff: '', isFinal: true }
      ],
      // 提示库
      characterTips: [
        '浪漫古士：这一定是不同以往的浪漫故事，你也是这么想的，对吧？',
        '迷迷：迷？迷迷~迷 迷迷迷迷…迷~！',
        '粉色小狗？粉色小海兔？粉色妖精？粉色哥布林！',
        '二舅妈：谁找我借的膨胀罗斯落这了？'
      ],
      funnyTips: [
        '圆头迷迭：哈基迷 南北路多~',
        '浪漫古士：这一定是不同以往的浪漫故事，你也是这么想的，对吧？',
        '3.7：爱如火大战恨如冰',
        '昔涟真名：哀丽昔·翁法罗缪斯 Elysie·Amphoremus'
      ]
    }
  }
};

// 游戏状态
let gameState = {
  currentVersion: '3.0',
  tickets: 700,
  characterInventory: {},
  pityCounter: 0,
  lastWasStandard: false,
  abyssProgress: {},
  revealedTips: [],
  selectedUpChar: null,
  usedAbyssCharacters: {}, // 记录各版本已在深渊中使用的角色
  abyssBuffs: {} // 存储各版本的深渊buff
};

// DOM 元素
const elements = {
  startScreen: document.getElementById('start-screen'),
  mainScreen: document.getElementById('main-screen'),
  abyssScreen: document.getElementById('abyss-screen'),
  endScreen: document.getElementById('end-screen'),
  startButton: document.getElementById('start-button'),
  currentVersion: document.getElementById('current-version'),
  ticketsCount: document.getElementById('tickets-count'),
  upCharacterList: document.getElementById('up-character-list'),
  singlePull: document.getElementById('single-pull'),
  tenPulls: document.getElementById('ten-pulls'),
  pullResult: document.getElementById('pull-result'),
  characterInventory: document.getElementById('character-inventory'),
  abyssList: document.getElementById('abyss-list'),
  allAbyssBuffs: document.getElementById('all-abyss-buffs'),
  nextVersion: document.getElementById('next-version'),
  jumpTo31: document.getElementById('jump-to-3-1'),
  jumpTo32: document.getElementById('jump-to-3-2'),
  jumpTo33: document.getElementById('jump-to-3-3'),
  jumpTo34: document.getElementById('jump-to-3-4'),
  jumpTo35: document.getElementById('jump-to-3-5'),
  jumpTo36: document.getElementById('jump-to-3-6'),
  jumpTo37: document.getElementById('jump-to-3-7'),
  abyssTitle: document.getElementById('abyss-title'),
  abyssBuff: document.getElementById('abyss-buff'),
  abyssStandard: document.getElementById('abyss-standard'),
  abyssCharacterSelect: document.getElementById('abyss-character-select'),
  selectedTeam: document.getElementById('selected-team'),
  startAbyss: document.getElementById('start-abyss'),
  backToMain: document.getElementById('back-to-main'),
  endResult: document.getElementById('end-result'),
  restartButton: document.getElementById('restart-button'),
  warmTipsCard: document.getElementById('warmTipsCard'),
  warmTipsContent: document.getElementById('warmTipsContent'),
  refreshTipsButton: document.getElementById('refresh-warm-tips'),
  allLeakerTipsCard: document.getElementById('allLeakerTipsCard'),
  allLeakerTipsContent: document.getElementById('allLeakerTipsContent')
};

// 深渊挑战状态
let abyssState = {
  currentAbyss: null,
  selectedCharacters: []
};

// 初始化游戏
function initGame() {
  // 设置事件监听器
  elements.startButton.addEventListener('click', startGame);
  elements.singlePull.addEventListener('click', () => performPulls(1));
  elements.tenPulls.addEventListener('click', () => performPulls(10));
  elements.nextVersion.addEventListener('click', goToNextVersion);
  elements.jumpTo31.addEventListener('click', () => jumpToVersion('3.1'));
  elements.jumpTo32.addEventListener('click', () => jumpToVersion('3.2'));
  elements.jumpTo33.addEventListener('click', () => jumpToVersion('3.3'));
  elements.jumpTo34.addEventListener('click', () => jumpToVersion('3.4'));
  elements.jumpTo35.addEventListener('click', () => jumpToVersion('3.5'));
  elements.jumpTo36.addEventListener('click', () => jumpToVersion('3.6'));
  elements.jumpTo37.addEventListener('click', () => jumpToVersion('3.7'));
  elements.startAbyss.addEventListener('click', challengeAbyss);
  elements.backToMain.addEventListener('click', showMainScreen);
  elements.restartButton.addEventListener('click', restartGame);
  // 添加温馨提示相关事件监听器
  elements.refreshTipsButton.addEventListener('click', refreshWarmTips);
  
  // 初始化深渊进度、已使用角色记录和深渊buff
  for (let version in gameConfig.versions) {
    gameState.abyssProgress[version] = {};
    gameState.usedAbyssCharacters[version] = [];
    gameState.abyssBuffs[version] = {};
    gameConfig.versions[version].abyss.forEach(abyss => {
      gameState.abyssProgress[version][abyss.name] = { completed: false, bonus: false };
    });
  }
  
  // 显示开始界面
  showScreen('start');
}

// 开始游戏
function startGame() {
  // 预抽取所有版本的深渊buff，包括未来版本
  preRollAllAbyssBuffs();
  
  // 生成所有版本的内鬼提示库并保存到gameState
  gameState.leakerTips = generateLeakerTips();
  
  updateUI();
  showScreen('main');
  // 显示初始600张专票提示
  showTicketsNotification(700, '初始专票');
}

// 显示指定屏幕
function showScreen(screenName) {
  // 隐藏所有屏幕
  elements.startScreen.classList.remove('active');
  elements.mainScreen.classList.remove('active');
  elements.abyssScreen.classList.remove('active');
  elements.endScreen.classList.remove('active');
  
  // 显示指定屏幕
  switch (screenName) {
    case 'start':
      elements.startScreen.classList.add('active');
      break;
    case 'main':
      elements.mainScreen.classList.add('active');
      updateUI();
      break;
    case 'abyss':
      elements.abyssScreen.classList.add('active');
      setupAbyssScreen();
      break;
    case 'end':
      elements.endScreen.classList.add('active');
      break;
  }
}

// 更新主界面
function updateUI() {
  elements.currentVersion.textContent = gameState.currentVersion;
  elements.ticketsCount.textContent = gameState.tickets;
  
  // 更新保底计数显示
  const pityCounter = document.getElementById('pity-counter');
  if (pityCounter) {
    pityCounter.textContent = gameState.pityCounter;
  }
  
  // 更新UP角色列表
  updateUpCharacterList();
  
  // 更新角色库存
  updateCharacterInventory();
  
  // 更新深渊列表
  updateAbyssList();
  
  // 更新全部版本深渊buff显示
  updateAllAbyssBuffs();
  
  // 更新下一版本按钮状态
  updateNextVersionButton();
  
  // 检查并添加版本提示
  checkVersionTips();
  
  // 更新温馨提示显示
  updateWarmTips(gameState.currentVersion);
  
  // 更新所有内鬼提示显示
  updateAllLeakerTips(gameState.currentVersion);
}

// 更新UP角色列表
function updateUpCharacterList() {
  const version = gameState.currentVersion;
  const upChars = gameConfig.versions[version].upChars;
  
  elements.upCharacterList.innerHTML = '';
  
  upChars.forEach(charName => {
    const char = gameConfig.characters[charName];
    const charCard = document.createElement('div');
    charCard.className = `character-card ${gameState.selectedUpChar === charName ? 'selected' : ''}`;
    charCard.innerHTML = `
      <div class="character-name">${char.name}</div>
      <div class="character-info">
        <div>基础战斗力: ${Math.floor(char.basePower)}W</div>
      </div>
    `;
    charCard.addEventListener('click', () => {
      gameState.selectedUpChar = charName;
      updateUpCharacterList();
    });
    elements.upCharacterList.appendChild(charCard);
  });
  
  // 如果没有选择UP角色，默认选择第一个
  if (!gameState.selectedUpChar && upChars.length > 0) {
    gameState.selectedUpChar = upChars[0];
    updateUpCharacterList();
  }
}

// 更新角色库存
function updateCharacterInventory() {
  elements.characterInventory.innerHTML = '';
  
  const inventory = gameState.characterInventory;
  const charKeys = Object.keys(inventory).sort((a, b) => {
    const powerA = gameConfig.characters[a].powerLevels[inventory[a]];
    const powerB = gameConfig.characters[b].powerLevels[inventory[b]];
    return powerB - powerA;
  });
  
  charKeys.forEach(charName => {
    const char = gameConfig.characters[charName];
    const constellation = inventory[charName];
    const power = char.powerLevels[constellation];
    
    const charCard = document.createElement('div');
    charCard.className = 'character-card';
    charCard.innerHTML = `
      <div class="character-name">${char.name}</div>
      <div class="character-info">
        <div>战斗力: ${Math.floor(power)}W</div>
        <div class="star-rating">⭐ × ${constellation}</div>
      </div>
    `;
    elements.characterInventory.appendChild(charCard);
  });
}

// 更新深渊列表
function updateAbyssList() {
  elements.abyssList.innerHTML = '';
  
  const version = gameState.currentVersion;
  const abyssList = gameConfig.versions[version].abyss;
  
  abyssList.forEach(abyss => {
    const progress = gameState.abyssProgress[version][abyss.name];
    const abyssCard = document.createElement('div');
    abyssCard.className = `abyss-card ${progress.completed ? 'completed' : ''}`;
    
    // 检查是否有预抽取的buff
    let displayBuff = abyss.buff;
    if (gameState.abyssBuffs[version] && gameState.abyssBuffs[version][abyss.name]) {
      displayBuff = gameState.abyssBuffs[version][abyss.name];
    }
    
    abyssCard.innerHTML = `
      <div class="abyss-title">${abyss.name}</div>
      <div class="abyss-info">
        <div>通关标准: ${abyss.isFinal ? '无' : `战斗力 ≥ ${abyss.standard}W`}</div>
        ${abyss.bonus ? `<div>满星奖励: 战斗力≥${abyss.bonus.threshold}W 额外奖励${abyss.bonus.tickets}张专票</div>` : ''}
        ${progress.completed ? '<div>状态: 已通关</div>' : '<div>状态: 未通关</div>'}
      </div>
      ${displayBuff ? `
        <div class="abyss-buff-info">
          ${displayBuff.split('，').map(buff => `<div>${buff}</div>`).join('')}
        </div>
      ` : ''}
    `;
    abyssCard.addEventListener('click', () => {
      if (!progress.completed || abyss.isFinal) {
        startAbyssChallenge(abyss);
      }
    });
    elements.abyssList.appendChild(abyssCard);
  });
}

// 更新全部版本深渊buff显示
function updateAllAbyssBuffs() {
  elements.allAbyssBuffs.innerHTML = '';
  
  // 遍历所有版本
  for (let version in gameConfig.versions) {
    const versionContainer = document.createElement('div');
    versionContainer.className = 'version-buff-container';
    versionContainer.innerHTML = `<h4 style="margin: 10px 0; color: #4a9eff;">${version}版本</h4>`;
    
    const abysses = gameConfig.versions[version].abyss;
    abysses.forEach(abyss => {
      const abyssBuffCard = document.createElement('div');
      abyssBuffCard.className = 'abyss-buff-card';
      
      // 获取显示的buff文本（优先使用预抽取的buff，如果没有则使用原始配置的buff）
      let buffText = abyss.buff || '无特殊Buff';
      
      // 检查是否有预抽取的buff
      if (gameState.abyssBuffs[version] && gameState.abyssBuffs[version][abyss.name]) {
        buffText = gameState.abyssBuffs[version][abyss.name];
      }
      
      // 处理多个buff的情况
      let buffHtml = '';
      if (buffText.includes('，')) {
        const buffs = buffText.split('，');
        buffHtml = buffs.map(buff => `<div class="buff-item" style="color: #a0c4ff; margin-left: 15px;">• ${buff}</div>`).join('');
      } else if (buffText !== '无特殊Buff') {
        buffHtml = `<div class="buff-item" style="color: #a0c4ff; margin-left: 15px;">• ${buffText}</div>`;
      }
      
      abyssBuffCard.innerHTML = `
        <div class="abyss-name" style="font-weight: bold; margin-bottom: 5px;">${abyss.name}</div>
        <div class="buff-list">
          ${buffHtml || `<div class="buff-item" style="color: #666; margin-left: 15px;">• ${buffText}</div>`}
        </div>
      `;
      
      versionContainer.appendChild(abyssBuffCard);
    });
    
    // 始终添加版本容器，无论是否有深渊buff
    elements.allAbyssBuffs.appendChild(versionContainer);
  }
}

// 更新下一版本按钮状态
function updateNextVersionButton() {
  const version = gameState.currentVersion;
  const nextVersionNum = parseFloat(version) + 0.1;
  const nextVersion = nextVersionNum.toFixed(1);
  
  // 检查是否是最后一个版本
  if (version === '3.7') {
    elements.nextVersion.disabled = true;
    elements.jumpTo37.disabled = true;
  } else {
    // 检查是否所有深渊都已完成
    const abyssList = gameConfig.versions[version].abyss;
    const allCompleted = abyssList.every(abyss => {
      return gameState.abyssProgress[version][abyss.name].completed || abyss.isFinal;
    });
    
    elements.nextVersion.disabled = !allCompleted;
    elements.jumpTo37.disabled = false; // 跳转到3.7版本按钮始终可用
  }
}

// 通用版本跳转函数
function jumpToVersion(version) {
  // 确认对话框
  if (confirm(`确定要直接跳转到${version}版本吗？这将跳过之前版本的所有内容。`)) {
    // 更新当前版本
    gameState.currentVersion = version;
    
    // 确保深渊进度和已使用角色记录已初始化
    if (!gameState.abyssProgress[version]) {
      gameState.abyssProgress[version] = {};
      gameConfig.versions[version].abyss.forEach(abyss => {
        gameState.abyssProgress[version][abyss.name] = { completed: false, bonus: false };
      });
    }
    
    if (!gameState.usedAbyssCharacters[version]) {
      gameState.usedAbyssCharacters[version] = [];
    }
    
    // 确保深渊buff记录已初始化
    if (!gameState.abyssBuffs[version]) {
      gameState.abyssBuffs[version] = {};
      // 只有当该版本还没有深渊buff时才预抽取
      preRollVersionAbyssBuffs(version);
    }
    
    // 更新界面
    updateUI();
    showPullResult(`成功跳转到${version}版本！`);
  }
}

// 检查并添加版本提示
function checkVersionTips() {
  const version = gameState.currentVersion;
  const versionConfig = gameConfig.versions[version];
  
  // 清除现有的提示
  const existingTips = document.querySelectorAll('.tip');
  existingTips.forEach(tip => tip.remove());
  
  // 添加普通提示 - 已隐藏
  /*
  if (versionConfig.tip && !gameState.revealedTips.includes(versionConfig.tip)) {
    const tipElement = document.createElement('div');
    tipElement.className = 'tip';
    tipElement.textContent = versionConfig.tip;
    elements.mainScreen.querySelector('.version-info').appendChild(tipElement);
    gameState.revealedTips.push(versionConfig.tip);
  }
  */
  
  // 添加需要解锁的提示 - 已隐藏
  /*
  if (versionConfig.lockedTip && !gameState.revealedTips.includes(versionConfig.lockedTip.text)) {
    const tipButton = document.createElement('button');
    tipButton.className = 'secondary-button';
    tipButton.textContent = `解锁提示 (${versionConfig.lockedTip.cost}专票)`;
    tipButton.addEventListener('click', () => {
      if (gameState.tickets >= versionConfig.lockedTip.cost) {
        gameState.tickets -= versionConfig.lockedTip.cost;
        const tipElement = document.createElement('div');
        tipElement.className = 'tip';
        tipElement.textContent = versionConfig.lockedTip.text;
        tipButton.parentNode.replaceChild(tipElement, tipButton);
        gameState.revealedTips.push(versionConfig.lockedTip.text);
        updateUI();
      } else {
        showPullResult('专票不足！');
      }
    });
    elements.mainScreen.querySelector('.version-info').appendChild(tipButton);
  }
  */
}

// 执行抽卡
function performPulls(count) {
  if (gameState.tickets < count) {
    showPullResult('专票不足！');
    return;
  }
  
  gameState.tickets -= count;
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const result = performSinglePull();
    results.push(result);
  }
  
  showPullResults(results);
  // updateUI()已在showPullResults中调用，避免重复更新
}

// 执行单次抽卡
function performSinglePull() {
  gameState.pityCounter++;
  
  // 计算抽中角色的概率
  let charProbability = 0.6;
  if (gameState.pityCounter > 73) {
    charProbability += (gameState.pityCounter - 73) * 6;
  }
  
  // 判断是否抽中角色
  if (Math.random() * 100 < charProbability) {
    gameState.pityCounter = 0;
    const charName = getCharacterPullResult();
    
    // 记录是否为新获得的角色
    const isNewCharacter = !(charName in gameState.characterInventory);
    
    // 更新角色库存
    if (isNewCharacter) {
      // 首次获得，设置为0星魂
      gameState.characterInventory[charName] = 0;
    } else {
      // 重复获得，提升星魂（上限为6）
      if (gameState.characterInventory[charName] < 6) {
        gameState.characterInventory[charName]++;
      }
    }
    
    const currentConstellation = gameState.characterInventory[charName];
    // 返回结果时包含是否为新角色的标记
    return { 
      type: 'character', 
      name: charName, 
      constellation: currentConstellation,
      isNew: isNewCharacter
    };
  } else {
    return { type: 'item', name: '材料' };
  }
}

// 获取角色抽卡结果
function getCharacterPullResult() {
  // 如果上次是常驻，本次必定是UP
  if (gameState.lastWasStandard) {
    gameState.lastWasStandard = false;
    return gameState.selectedUpChar;
  }
  
  // 50%概率UP角色，50%概率常驻角色
  if (Math.random() < 0.5) {
    // UP角色
    return gameState.selectedUpChar;
  } else {
    // 常驻角色
    gameState.lastWasStandard = true;
    const standardChars = Object.keys(gameConfig.characters).filter(charName => {
      const char = gameConfig.characters[charName];
      return char.tags.includes('常驻') && 
             // 3.4版本后才解锁Saber和Archer
             (!['Saber', 'Archer'].includes(charName) || 
              parseFloat(gameState.currentVersion) >= 3.4);
    });
    
    // 如果没有常驻角色，返回UP角色
    if (standardChars.length === 0) {
      return gameState.selectedUpChar;
    }
    
    return standardChars[Math.floor(Math.random() * standardChars.length)];
  }
}

// 显示抽卡结果
function showPullResults(results) {
  elements.pullResult.innerHTML = '';
  
  results.forEach(result => {
    const resultElement = document.createElement('div');
    resultElement.className = 'pull-result-item';
    
    if (result.type === 'character') {
      const char = gameConfig.characters[result.name];
      // 直接从result中获取isNew标记和constellation值
      const isNew = result.isNew !== undefined ? result.isNew : 
                   !(result.name in gameState.characterInventory) || 
                   gameState.characterInventory[result.name] === 0;
      const currentConstellation = result.constellation !== undefined ? 
                                 result.constellation : 
                                 (gameState.characterInventory[result.name] || 0);
      const power = char.powerLevels[currentConstellation];
      
      // 为角色获得提示添加特殊类名
      resultElement.className = 'pull-result-item character-result';
      resultElement.textContent = `获得角色：${result.name} (${char.element}/${char.path})`;
      resultElement.style.color = '#ffd700';
      
      if (isNew) {
        resultElement.textContent += ` - 首次获得！`;
      } else {
        resultElement.textContent += ` - 星魂提升至${currentConstellation}级！`;
      }
    } else {
      resultElement.textContent = `获得材料`;
    }
    
    elements.pullResult.appendChild(resultElement);
  });
  
  // 更新必要的UI元素，但不刷新温馨提示
  setTimeout(() => {
    elements.currentVersion.textContent = gameState.currentVersion;
    elements.ticketsCount.textContent = gameState.tickets;
    
    // 更新保底计数显示
    const pityCounter = document.getElementById('pity-counter');
    if (pityCounter) {
      pityCounter.textContent = gameState.pityCounter;
    }
    
    // 更新角色库存
    updateCharacterInventory();
    
    // 更新深渊列表
    updateAbyssList();
    
    // 更新全部版本深渊buff显示
    updateAllAbyssBuffs();
    
    // 更新下一版本按钮状态
    updateNextVersionButton();
    
    // 检查并添加版本提示
    checkVersionTips();
    
    // 更新所有内鬼提示显示
    updateAllLeakerTips(gameState.currentVersion);
  }, 0);
}

// 显示单行抽卡结果
function showPullResult(text) {
  elements.pullResult.innerHTML = '';
  const resultElement = document.createElement('div');
  resultElement.className = 'pull-result-item';
  resultElement.textContent = text;
  elements.pullResult.appendChild(resultElement);
}

// 显示专票获得提示
function showTicketsNotification(amount, source) {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'tickets-notification';
  
  // 创建大字显示专票数量
  const amountText = document.createElement('div');
  amountText.className = 'tickets-amount';
  amountText.textContent = `+${amount} 专票！`;
  notification.appendChild(amountText);
  
  // 创建小字显示来源
  if (source) {
    const sourceText = document.createElement('div');
    sourceText.className = 'tickets-source';
    sourceText.textContent = source;
    notification.appendChild(sourceText);
  }
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 2秒后移除元素
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// 显示赠送角色提示
function showCharacterGiftNotification(charName, source) {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'character-gift-notification';
  
  // 创建大字显示角色名称
  const charText = document.createElement('div');
  charText.className = 'character-gift-name';
  charText.textContent = `赠送角色：${charName}！`;
  notification.appendChild(charText);
  
  // 创建小字显示来源
  if (source) {
    const sourceText = document.createElement('div');
    sourceText.className = 'character-gift-source';
    sourceText.textContent = source;
    notification.appendChild(sourceText);
  }
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 2秒后移除元素
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// 开始深渊挑战
function startAbyssChallenge(abyss) {
  abyssState.currentAbyss = abyss;
  abyssState.selectedCharacters = [];
  showScreen('abyss');
}

// 预抽取所有版本的深渊buff
function preRollAllAbyssBuffs() {
  for (let version in gameConfig.versions) {
    // 使用单独的版本预抽取函数
    preRollVersionAbyssBuffs(version);
  }
}

// 设置深渊挑战界面
function setupAbyssScreen() {
  const abyss = abyssState.currentAbyss;
  const version = gameState.currentVersion;
  
  elements.abyssTitle.textContent = abyss.name;
  
  // 获取并显示已预抽取的buff
  let displayBuff = abyss.buff;
  if ((version === '3.0' || version === '3.1' || version === '3.2' || version === '3.3' || version === '3.4' || version === '3.5' || version === '3.6') && (abyss.name === '忘却之庭' || abyss.name === '虚构叙事') && gameState.abyssBuffs[version][abyss.name]) {
    displayBuff = gameState.abyssBuffs[version][abyss.name];
    // 临时保存到abyss对象中以便applyAbyssBuff函数使用
    abyss.buff = displayBuff;
  }
  
  // 修改为支持多条buff显示，并添加浅蓝色样式
  if (displayBuff) {
    // 检查是否有多个buff（包含逗号分隔符）
    if (displayBuff.includes('，')) {
      const buffs = displayBuff.split('，');
      elements.abyssBuff.innerHTML = `<strong style="color: #a0c4ff;">深渊祝福:</strong><br>`;
      buffs.forEach(buff => {
        elements.abyssBuff.innerHTML += `<span style="color: #a0c4ff;">${buff}</span><br>`;
      });
    } else {
      elements.abyssBuff.innerHTML = `<strong style="color: #a0c4ff;">深渊祝福:</strong> <span style="color: #a0c4ff;">${displayBuff}</span>`;
    }
  } else {
    elements.abyssBuff.textContent = '无特殊Buff';
  }
  
  if (abyss.isFinal) {
    elements.abyssStandard.textContent = '异相仲裁：展示你的最强阵容！';
    // 确保移除满星奖励元素，隐藏异相仲裁中的满星奖励
    const existingBonus = document.getElementById('abyss-bonus');
    if (existingBonus) {
      existingBonus.remove();
    }
  } else {
    elements.abyssStandard.textContent = `通关标准：队伍战斗力总和 ≥ ${abyss.standard}W`;
    // 添加满星奖励显示
    if (abyss.bonus) {
      const bonusInfo = document.createElement('div');
      bonusInfo.id = 'abyss-bonus';
      bonusInfo.textContent = `满星奖励：队伍战斗力≥${abyss.bonus.threshold}W 额外奖励${abyss.bonus.tickets}张专票`;
      bonusInfo.style.color = '#ffd700';
      bonusInfo.style.marginTop = '10px';
      // 确保只添加一次
      const existingBonus = document.getElementById('abyss-bonus');
      if (existingBonus) {
        existingBonus.remove();
      }
      elements.abyssStandard.after(bonusInfo);
    } else {
      // 如果没有满星奖励，移除可能存在的元素
      const existingBonus = document.getElementById('abyss-bonus');
      if (existingBonus) {
        existingBonus.remove();
      }
    }
  }
  
  // 更新可选角色列表
  updateAbyssCharacterSelect();
  
  // 更新已选角色显示
  updateSelectedTeamDisplay();
  
  // 更新挑战按钮状态
  updateAbyssChallengeButton();
}

// 更新深渊角色选择列表
function updateAbyssCharacterSelect() {
  elements.abyssCharacterSelect.innerHTML = '';
  
  const inventory = gameState.characterInventory;
  const charKeys = Object.keys(inventory).sort((a, b) => {
    const powerA = gameConfig.characters[a].powerLevels[inventory[a]];
    const powerB = gameConfig.characters[b].powerLevels[inventory[b]];
    return powerB - powerA;
  });
  
  charKeys.forEach(charName => {
    const char = gameConfig.characters[charName];
    const constellation = inventory[charName];
    const power = char.powerLevels[constellation];
    const isSelected = abyssState.selectedCharacters.includes(charName);
    // 检查角色是否已在当前版本的深渊中使用过
    const isUsed = gameState.usedAbyssCharacters[gameState.currentVersion].includes(charName);
    const charCard = document.createElement('div');
    charCard.className = `character-card ${isSelected ? 'selected' : ''} ${isUsed && !isSelected ? 'disabled' : ''}`;
    charCard.innerHTML = `
      <div class="character-name">${char.name}${isUsed && !isSelected ? ' (已使用)' : ''}</div>
      <div class="character-info">
        <div>战斗力: ${Math.floor(power)}W</div>
        <div class="star-rating">⭐ × ${constellation}</div>
      </div>
    `;
    
    // 只有未使用的角色或已选择的角色可以点击
    if (!isUsed || isSelected) {
      charCard.addEventListener('click', () => {
        toggleCharacterSelection(charName);
      });
    }
    elements.abyssCharacterSelect.appendChild(charCard);
  });
}

// 切换角色选择状态
function toggleCharacterSelection(charName) {
  const index = abyssState.selectedCharacters.indexOf(charName);
  
  if (index === -1) {
    // 选择角色，最多选4个
    if (abyssState.selectedCharacters.length < 4) {
      // 检查角色是否已在当前版本的深渊中使用过
      const isUsed = gameState.usedAbyssCharacters[gameState.currentVersion].includes(charName);
      if (!isUsed) {
        abyssState.selectedCharacters.push(charName);
      }
    }
  } else {
    // 取消选择
    abyssState.selectedCharacters.splice(index, 1);
  }
  
  updateAbyssCharacterSelect();
  updateSelectedTeamDisplay();
  updateAbyssChallengeButton();
}

// 更新已选队伍显示
function updateSelectedTeamDisplay() {
  elements.selectedTeam.innerHTML = '';
  
  if (abyssState.selectedCharacters.length === 0) {
    elements.selectedTeam.textContent = '请选择出战角色（1-4个）';
    return;
  }
  
  let totalPower = 0;
  let totalBuffedPower = 0;
  const abyss = abyssState.currentAbyss;
  
  abyssState.selectedCharacters.forEach(charName => {
    const char = gameConfig.characters[charName];
    const constellation = gameState.characterInventory[charName];
    const basePower = char.powerLevels[constellation];
    const buffedPower = applyAbyssBuff(char, basePower, abyss);
    
    totalPower += basePower;
    totalBuffedPower += buffedPower;
    
    const teamChar = document.createElement('div');
    teamChar.className = 'team-character';
    
    // 如果有buff且战斗力有变化，显示加成后的战斗力
    if (abyss.buff && buffedPower !== basePower) {
      teamChar.textContent = `${char.name} (${Math.floor(buffedPower)}W)`;
    } else {
      teamChar.textContent = `${char.name} (${Math.floor(basePower)}W)`;
    }
    
    elements.selectedTeam.appendChild(teamChar);
  });
  
  const powerDisplay = document.createElement('div');
  powerDisplay.style.marginTop = '10px';
  powerDisplay.style.fontWeight = 'bold';
  
  // 显示加成后的总战斗力
  if (abyss.buff && totalBuffedPower !== totalPower) {
    powerDisplay.textContent = `总战斗力: ${Math.floor(totalBuffedPower)}W`;
  } else {
    powerDisplay.textContent = `总战斗力: ${Math.floor(totalPower)}W`;
  }
  
  elements.selectedTeam.appendChild(powerDisplay);
}

// 更新深渊挑战按钮状态
function updateAbyssChallengeButton() {
  // 允许1-4个角色出战
  elements.startAbyss.disabled = abyssState.selectedCharacters.length === 0;
}

// 解析并应用深渊buff
function applyAbyssBuff(char, basePower, abyss) {
  // 获取当前版本
  const version = gameState.currentVersion;
  
  // 优先使用gameState.abyssBuffs中的预抽取buff
  let buffText = '';
  if (gameState.abyssBuffs[version] && gameState.abyssBuffs[version][abyss.name]) {
    buffText = gameState.abyssBuffs[version][abyss.name];
  } else {
    // 如果没有预抽取的buff，则使用abyss对象中的原始buff
    buffText = abyss.buff;
  }
  
  if (!buffText) return basePower;
  
  let finalPower = basePower;
  const buffs = buffText.split('，');
  
  buffs.forEach(buff => {
    // 处理命途相关buff
    if (buff.includes('命途为')) {
      const pathMatch = buff.match(/命途为(\S+)的角色造成的伤害提高(\d+)％/);
      if (pathMatch && pathMatch[1] === char.path) {
        const percentage = parseInt(pathMatch[2]) / 100;
        finalPower *= (1 + percentage);
      }
    }
    // 处理属性相关buff
    else if (buff.includes('属性为') && buff.includes('的角色')) {
      const elementMatch = buff.match(/属性为(\S+)的角色造成的伤害提高(\d+)％/);
      if (elementMatch && elementMatch[1] === char.element) {
        const percentage = parseInt(elementMatch[2]) / 100;
        finalPower *= (1 + percentage);
      }
    }
  });
  
  return finalPower;
}

// 挑战深渊
function challengeAbyss() {
  const abyss = abyssState.currentAbyss;
  
  // 计算队伍总战斗力（考虑buff加成）
  let totalPower = 0;
  let basePower = 0;
  
  abyssState.selectedCharacters.forEach(charName => {
    const char = gameConfig.characters[charName];
    const constellation = gameState.characterInventory[charName];
    const charBasePower = char.powerLevels[constellation];
    const charFinalPower = applyAbyssBuff(char, charBasePower, abyss);
    
    basePower += charBasePower;
    totalPower += charFinalPower;
  });
  
  // 如果有buff且总战斗力有变化，显示buff效果
  if (abyss.buff && totalPower !== basePower) {
    const buffBonus = totalPower - basePower;
    showPullResult(`深渊buff生效！战斗力提升：+${Math.floor(buffBonus)}W`);
  }
  
  // 检查是否是异相仲裁（最终关卡）
  if (abyss.isFinal) {
    // 创建详细的通关报告
    let teamHtml = '';
    abyssState.selectedCharacters.forEach(charName => {
      const char = gameConfig.characters[charName];
      const constellation = gameState.characterInventory[charName];
      const charPower = char.powerLevels[constellation];
      const charFinalPower = applyAbyssBuff(char, charPower, abyss);
      
      teamHtml += `
        <div class="team-member">
          <div class="member-name">${char.name}</div>
          <div class="member-details">
            <span>战斗力: ${Math.floor(charFinalPower)}W</span>
            <span>⭐ × ${constellation}</span>
            ${charFinalPower > charPower ? `<span class="power-buff">+${Math.floor(charFinalPower - charPower)}W</span>` : ''}
          </div>
        </div>
      `;
    });
    
    // 计算评级
    let rank = '';
    let rankColor = '';
    if (totalPower >= 3500) {
      rank = 'SSS';
      rankColor = '#ff6b6b';
    } else if (totalPower >= 3000) {
      rank = 'SS';
      rankColor = '#ff9f43';
    } else if (totalPower >= 2500) {
      rank = 'S';
      rankColor = '#feca57';
    } else if (totalPower >= 2000) {
      rank = 'A';
      rankColor = '#48dbfb';
    } else if (totalPower >= 1500) {
      rank = 'B';
      rankColor = '#1dd1a1';
    } else {
      rank = 'C';
      rankColor = '#5f27cd';
    }
    
    // 游戏结束 - 重新设计的通关画面
    elements.endResult.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="stat-label">0T总伤</span>
        <span class="stat-value">${Math.floor(totalPower)}W</span>
      </div>
      <div style="margin-bottom: 20px;">
        <span class="stat-label">剩余专票</span>
        <span class="stat-value" style="color: #ffd700; font-size: 0.9em;">${gameState.tickets}</span>
      </div>
      
      <div class="victory-team">
        <div class="team-members">
          ${teamHtml}
        </div>
      </div>
      
      <div class="victory-message">
        <p>银河战舰已成！恭迎星神归位！</p>
      </div>
    `;
    
    // 添加成就音效（模拟）
    setTimeout(() => {
      // 这里可以添加真实的音效播放代码
      console.log('播放胜利音效');
    }, 500);
    
    showScreen('end');
    return;
  }
  
  // 普通深渊挑战
  const success = totalPower >= abyss.standard;
  
  if (success) {
    // 标记为已完成
    gameState.abyssProgress[gameState.currentVersion][abyss.name].completed = true;
    
    // 记录使用过的角色到当前版本
    abyssState.selectedCharacters.forEach(charName => {
      if (!gameState.usedAbyssCharacters[gameState.currentVersion].includes(charName)) {
        gameState.usedAbyssCharacters[gameState.currentVersion].push(charName);
      }
    });
    
    // 检查是否获得额外奖励
    if (abyss.bonus && totalPower >= abyss.bonus.threshold) {
      gameState.tickets += abyss.bonus.tickets;
      showPullResult(`挑战成功！获得额外奖励 ${abyss.bonus.tickets} 专票！`);
      // 显示专票获得提示
      showTicketsNotification(abyss.bonus.tickets, `${abyss.name}额外奖励`);
    } else {
      showPullResult('挑战成功！');
    }
  } else {
    showPullResult(`挑战失败！需要战斗力 ≥ ${abyss.standard}W`);
  }
  
  updateUI();
  showScreen('main');
}

// 返回主界面
function showMainScreen() {
  // 直接显示主屏幕而不调用updateUI，避免刷新温馨提示
  elements.startScreen.classList.remove('active');
  elements.mainScreen.classList.remove('active');
  elements.abyssScreen.classList.remove('active');
  elements.endScreen.classList.remove('active');
  elements.mainScreen.classList.add('active');
  
  // 只更新必要的UI元素，不包括温馨提示
  elements.currentVersion.textContent = gameState.currentVersion;
  elements.ticketsCount.textContent = gameState.tickets;
  
  // 更新保底计数显示
  const pityCounter = document.getElementById('pity-counter');
  if (pityCounter) {
    pityCounter.textContent = gameState.pityCounter;
  }
  
  updateUpCharacterList();
  updateCharacterInventory();
  updateAbyssList();
  updateAllAbyssBuffs();
  updateNextVersionButton();
  checkVersionTips();
  // 不更新温馨提示，保留原来的提示
  updateAllLeakerTips(gameState.currentVersion);
}

// 预抽取指定版本的深渊buff
function preRollVersionAbyssBuffs(version) {
  const abysses = gameConfig.versions[version].abyss;
  
  abysses.forEach(abyss => {
    // 为3.0版本的忘却之庭实现特殊buff抽取
    if (version === '3.0' && abyss.name === '忘却之庭') {
      // 四条可选buff
      const possibleBuffs = [
        '命途为智识的角色造成的伤害提高20％',
        '属性为冰的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为雷的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.1版本的忘却之庭实现特殊buff抽取
    else if (version === '3.1' && abyss.name === '忘却之庭') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为智识的角色造成的伤害提高20％',
        '属性为冰的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为雷的角色造成的伤害提高20％',
        '命途为同谐的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％',
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为虚数的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.2版本的忘却之庭实现特殊buff抽取
    else if (version === '3.2' && abyss.name === '忘却之庭') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为智识的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％',
        '命途为同谐的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％',
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为虚数的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.3版本的忘却之庭实现特殊buff抽取
    else if (version === '3.3' && abyss.name === '忘却之庭') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为智识的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.3版本的虚构叙事实现特殊buff抽取
    else if (version === '3.3' && abyss.name === '虚构叙事') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为智识的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.4版本的忘却之庭实现特殊buff抽取
    else if (version === '3.4' && abyss.name === '忘却之庭') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.4版本的虚构叙事实现特殊buff抽取
    else if (version === '3.4' && abyss.name === '虚构叙事') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为记忆的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为量子的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.5版本的忘却之庭实现特殊buff抽取
    else if (version === '3.5' && abyss.name === '忘却之庭') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为同谐的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.5版本的虚构叙事实现特殊buff抽取
    else if (version === '3.5' && abyss.name === '虚构叙事') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为毁灭的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为同谐的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.6版本的忘却之庭实现特殊buff抽取
    else if (version === '3.6' && abyss.name === '忘却之庭') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为记忆的角色造成的伤害提高20％',
        '属性为冰的角色造成的伤害提高20％',
        '命途为存护的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为同谐的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
    // 为3.6版本的虚构叙事实现特殊buff抽取
    else if (version === '3.6' && abyss.name === '虚构叙事') {
      // 八条可选buff
      const possibleBuffs = [
        '命途为记忆的角色造成的伤害提高20％',
        '属性为冰的角色造成的伤害提高20％',
        '命途为存护的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为虚无的角色造成的伤害提高20％',
        '属性为物理的角色造成的伤害提高20％',
        '命途为同谐的角色造成的伤害提高20％',
        '属性为风的角色造成的伤害提高20％'
      ];
      
      // 随机抽取两条buff
      const selectedBuffs = [];
      while (selectedBuffs.length < 2) {
        const randomIndex = Math.floor(Math.random() * possibleBuffs.length);
        if (!selectedBuffs.includes(possibleBuffs[randomIndex])) {
          selectedBuffs.push(possibleBuffs[randomIndex]);
        }
      }
      
      // 保存抽取的buff
      gameState.abyssBuffs[version][abyss.name] = selectedBuffs.join('，');
    }
  });
}

// 进入下一版本
function goToNextVersion() {
  const currentVer = parseFloat(gameState.currentVersion);
  const nextVer = (currentVer + 0.1).toFixed(1);
  
  // 检查下一版本是否存在
  if (!gameConfig.versions[nextVer]) {
    showPullResult('已经是最新版本！');
    return;
  }
  
  // 只有当该版本还没有深渊buff时才预抽取
  if (!gameState.abyssBuffs[nextVer] || Object.keys(gameState.abyssBuffs[nextVer]).length === 0) {
    gameState.abyssBuffs[nextVer] = {};
    preRollVersionAbyssBuffs(nextVer);
  }
  
  // 更新版本和专票
  gameState.currentVersion = nextVer;
  const newTickets = gameConfig.versions[nextVer].tickets;
  gameState.tickets += newTickets;
  
  // 显示专票获得提示
  showTicketsNotification(newTickets, `${nextVer}版本奖励`);
  
  // 检查是否有免费角色赠送
  if (gameConfig.versions[nextVer].freeChars) {
    gameConfig.versions[nextVer].freeChars.forEach(charName => {
      if (!gameState.characterInventory[charName]) {
        gameState.characterInventory[charName] = 0;
        // 显示赠送角色提示
        showCharacterGiftNotification(charName, `${nextVer}版本赠送`);
      }
    });
  }
  
  // 重置UP角色选择
  gameState.selectedUpChar = gameConfig.versions[nextVer].upChars[0];
  
  updateUI();
}

// 重新开始游戏
function restartGame() {
  // 重置游戏状态
  gameState = {
    currentVersion: '3.0',
    tickets: 700,
    characterInventory: {},
    pityCounter: 0,
    lastWasStandard: false,
    abyssProgress: {},
    revealedTips: [],
    selectedUpChar: null,
    usedAbyssCharacters: {},
    abyssBuffs: {}
  };
  
  // 重置深渊状态
  abyssState = {
    currentAbyss: null,
    selectedCharacters: []
  };
  
  // 重新初始化深渊进度、已使用角色记录和深渊buff
  for (let version in gameConfig.versions) {
    gameState.abyssProgress[version] = {};
    gameState.usedAbyssCharacters[version] = [];
    gameState.abyssBuffs[version] = {};
    gameConfig.versions[version].abyss.forEach(abyss => {
      gameState.abyssProgress[version][abyss.name] = { completed: false, bonus: false };
    });
  }
  
  showScreen('start');
}

// 游戏启动
window.addEventListener('DOMContentLoaded', initGame);