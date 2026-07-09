<template>
  <div class="battle-page">
    <h1>⚔️ Battle Arena</h1>

    <div class="top-bar">
      <button @click="$router.push('/home')">返回主页</button>
    </div>

    <div v-if="!battleState" class="enemy-list">
      <div v-for="enemy in enemyList" :key="enemy.enemyId" class="enemy-card">
        <div class="enemy-avatar">👹</div>
        <h3>{{ enemy.enemyName }}</h3>
        <p>Lv.{{ enemy.enemyLevel }}</p>
        <p>❤️ {{ enemy.maxHp }}</p>
        <p>💙 {{ enemy.maxMp }}</p>
        <p>⭐ EXP {{ enemy.expReward }}</p>
        <p>💰 Gold {{ enemy.goldReward }}</p>
        <button @click="startBattle(enemy.enemyId)">挑战</button>
      </div>
    </div>

    <div v-else class="fight-card">
      <div class="fighters">
        <div class="fighter">
          <div class="avatar"><HeroAvatar :job="battleState.hero.job" /></div>
          <h2>{{ battleState.hero.heroName }}</h2>
          <p>HP {{ battleState.hero.currentHp }} / {{ battleState.hero.maxHp }}</p>
          <div class="bar"><div class="hp" :style="{ width: heroHpPercent + '%' }"></div></div>
          <p>MP {{ battleState.hero.currentMp }} / {{ battleState.hero.maxMp }}</p>
          <div class="bar"><div class="mp" :style="{ width: heroMpPercent + '%' }"></div></div>
        </div>

        <div class="vs">VS</div>

        <div class="fighter">
          <div class="avatar">👹</div>
          <h2>{{ battleState.enemy.enemyName }}</h2>
          <p>HP {{ battleState.enemy.currentHp }} / {{ battleState.enemy.maxHp }}</p>
          <div class="bar"><div class="hp" :style="{ width: enemyHpPercent + '%' }"></div></div>
          <p>MP {{ battleState.enemy.currentMp }} / {{ battleState.enemy.maxMp }}</p>
          <div class="bar"><div class="mp" :style="{ width: enemyMpPercent + '%' }"></div></div>
        </div>
      </div>

      <h2 class="round">Round {{ battleState.round }} · {{ battleState.status }}</h2>

      <div v-if="battleState.status === 'FIGHTING'" class="actions">
        <button
          v-for="skill in battleState.hero.skills"
          :key="skill.skillSlot"
          :disabled="skill.currentCooldown > 0"
          @click="useSkill(skill.skillSlot)"
        >
          {{ skill.skillName }}
          <span v-if="skill.currentCooldown > 0">
            CD {{ skill.currentCooldown }}
          </span>
        </button>

        <button class="bag-btn" @click="openBackpack">🎒 背包</button>
      </div>

      <div v-else class="result">
        <h2 v-if="battleState.status === 'WIN'">🎉 Victory</h2>
        <h2 v-if="battleState.status === 'LOSE'">💀 Defeat</h2>
        <button @click="battleState = null">返回怪物列表</button>
      </div>

      <div class="logs">
        <h3>战斗日志</h3>
        <div v-for="(log, index) in battleState.logs" :key="index">
          {{ log }}
        </div>
      </div>
    </div>

    <div v-if="showBackpack" class="modal-mask">
      <div class="modal">
        <h2>🎒 战斗背包</h2>

        <div v-if="backpackList.length === 0" class="empty">
          背包为空
        </div>

        <div v-for="item in backpackList" :key="item.backpackId" class="bag-item">
          <div>
            <b>{{ item.itemName }}</b>
            <p>{{ item.itemType }} · x{{ item.quantity }}</p>
          </div>

          <button
            v-if="item.itemType === 'ITEM'"
            @click="useBagItem(item.backpackId)"
          >
            使用
          </button>
        </div>

        <button class="close-btn" @click="showBackpack = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { createBattle, battleAction } from "../api/battle";
import { getBackpackList } from "../api/backpack";
import { useItem } from "../api/item";
import request from "../api/request";
import HeroAvatar from "../components/HeroAvatar.vue";

const enemyList = ref([]);
const battleState = ref(null);
const showBackpack = ref(false);
const backpackList = ref([]);

const heroHpPercent = computed(() => {
  if (!battleState.value) return 0;
  return battleState.value.hero.currentHp / battleState.value.hero.maxHp * 100;
});

const heroMpPercent = computed(() => {
  if (!battleState.value) return 0;
  return battleState.value.hero.currentMp / battleState.value.hero.maxMp * 100;
});

const enemyHpPercent = computed(() => {
  if (!battleState.value) return 0;
  return battleState.value.enemy.currentHp / battleState.value.enemy.maxHp * 100;
});

const enemyMpPercent = computed(() => {
  if (!battleState.value) return 0;
  return battleState.value.enemy.currentMp / battleState.value.enemy.maxMp * 100;
});

const loadEnemies = async () => {
  const res = await request({
    url: "/enemy/list",
    method: "get"
  });
  enemyList.value = res.data.data;
};

const startBattle = async (enemyId) => {
  try {
    const res = await createBattle({ enemyId });
    battleState.value = res.data.data;
  } catch (e) {
    alert(e.response?.data?.message || "创建战斗失败");
  }
};

const useSkill = async (skillSlot) => {
  const res = await battleAction({
    battleId: battleState.value.battleId,
    skillSlot
  });

  battleState.value = res.data.data;
};

const openBackpack = async () => {
  const res = await getBackpackList();
  backpackList.value = res.data.data;
  showBackpack.value = true;
};

const useBagItem = async (backpackId) => {
  await useItem({ backpackId });
  const res = await getBackpackList();
  backpackList.value = res.data.data;
  alert("使用成功");
};

onMounted(() => {
  loadEnemies();
});
</script>

<style scoped>
.battle-page {
  min-height: 100vh;
  padding: 40px;
  background: radial-gradient(circle at top, #374151, #111827);
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 35px;
}

.enemy-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.enemy-card {
  padding: 28px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
}

.enemy-avatar {
  font-size: 60px;
}

.enemy-card button,
.actions button,
.result button,
.bag-item button,
.close-btn {
  border: none;
  border-radius: 10px;
  padding: 11px 20px;
  background: linear-gradient(90deg, #f97316, #ef4444);
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.fight-card {
  max-width: 1000px;
  margin: 0 auto;
  padding: 35px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.12);
}

.fighters {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.fighter {
  width: 300px;
  text-align: center;
}

.avatar {
  font-size: 80px;
}

.vs {
  font-size: 48px;
  font-weight: bold;
  color: #facc15;
}

.bar {
  height: 14px;
  background: #374151;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 15px;
}

.hp {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #fb7185);
}

.mp {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.round {
  text-align: center;
  margin: 30px 0;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.actions button:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.bag-btn {
  background: linear-gradient(90deg, #10b981, #059669) !important;
}

.result {
  text-align: center;
}

.logs {
  margin-top: 30px;
  padding: 18px;
  border-radius: 14px;
  background: #020617;
  color: #d1d5db;
  max-height: 280px;
  overflow-y: auto;
}

.logs div {
  padding: 5px 0;
  border-bottom: 1px solid #1f2937;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: 520px;
  padding: 28px;
  border-radius: 20px;
  background: #111827;
  color: white;
}

.bag-item {
  margin: 12px 0;
  padding: 14px;
  border-radius: 12px;
  background: #1f2937;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty {
  padding: 25px;
  text-align: center;
  color: #9ca3af;
}

.close-btn {
  margin-top: 20px;
  width: 100%;
  background: #6b7280;
}

.top-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
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
</style>