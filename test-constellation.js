// 测试脚本 - 可以直接在浏览器控制台运行
// 这段代码不是游戏的必需部分，仅用于手动测试星魂系统

function testConstellationSystem() {
  console.log('开始测试星魂系统...');
  
  // 保存原始游戏状态
  const originalState = JSON.parse(JSON.stringify(gameState));
  
  // 重置测试环境
  gameState.characterInventory = {};
  gameState.tickets = 1000;
  
  // 选择一个UP角色进行测试
  const testCharName = '大黑塔';
  gameState.selectedUpChar = testCharName;
  
  console.log(`测试角色: ${testCharName}`);
  
  // 模拟多次抽到同一个角色
  console.log('模拟抽到同一个角色8次（应提升到6星魂上限）:');
  
  for (let i = 0; i < 8; i++) {
    // 强制获得测试角色
    const originalGetChar = getCharacterPullResult;
    getCharacterPullResult = () => testCharName;
    
    // 执行抽卡
    const result = performSinglePull();
    
    // 恢复原函数
    getCharacterPullResult = originalGetChar;
    
    const constellation = gameState.characterInventory[testCharName];
    const power = gameConfig.characters[testCharName].powerLevels[constellation];
    
    console.log(`第${i+1}次抽取: 星魂=${constellation}, 战斗力=${power.toFixed(2)}`);
  }
  
  console.log('测试完成！星魂等级应已达到上限6。');
  console.log('注意：此测试不会影响您的实际游戏进度。');
  
  // 恢复原始游戏状态
  gameState = originalState;
  updateUI();
}

// 使用方法：在浏览器控制台中输入 testConstellationSystem() 运行测试
console.log('测试脚本已加载。在控制台输入 testConstellationSystem() 测试星魂系统。');