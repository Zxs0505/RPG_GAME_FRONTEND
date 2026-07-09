<template>
  <div class="history-page">
    <h1>📜 Battle History</h1>

    <div class="top-bar">
      <button @click="$router.push('/home')">返回主页</button>
      <button @click="loadHistory">刷新</button>
    </div>

    <div v-if="historyList.length === 0" class="empty">
      暂无战斗记录
    </div>

    <div class="history-list">
      <div
        v-for="record in historyList"
        :key="record.recordId"
        class="history-card"
        :class="record.result === 'WIN' ? 'win' : 'lose'"
      >
        <div class="result-icon">
          {{ record.result === "WIN" ? "🏆" : "💀" }}
        </div>

        <div class="info">
          <h2>{{ record.result }}</h2>
          <p>怪物：{{ enemyMap[record.enemyId] || record.enemyId }}</p>
          <p>回合数：{{ record.rounds }}</p>
        </div>

        <div class="reward">
          <p>⭐ EXP +{{ record.expReward }}</p>
          <p>💰 Gold +{{ record.goldReward }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getBattleHistory } from "../api/battle";
import request from "../api/request";

const historyList = ref([]);

const enemyMap = ref({});

const loadHistory = async () => {
  const historyRes = await getBattleHistory();
  const enemyRes = await request({
    url: "/enemy/list",
    method: "get"
  });

  historyList.value = historyRes.data.data;

  const map = {};
  enemyRes.data.data.forEach(enemy => {
    map[enemy.enemyId] = enemy.enemyName;
  });

  enemyMap.value = map;
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  padding: 40px;
  background: radial-gradient(circle at top, #78350f, #020617);
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 46px;
}

.top-bar {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 35px;
}

.top-bar button {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  background: #1f2937;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.history-list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.history-card {
  padding: 24px 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
}

.history-card.win {
  border-left: 8px solid #22c55e;
}

.history-card.lose {
  border-left: 8px solid #ef4444;
}

.result-icon {
  font-size: 52px;
}

.info {
  flex: 1;
  margin-left: 25px;
}

.info h2 {
  margin-bottom: 8px;
}

.reward {
  text-align: right;
  color: #facc15;
  font-weight: bold;
}

.empty {
  text-align: center;
  margin-top: 100px;
  color: #cbd5e1;
  font-size: 22px;
}
</style>