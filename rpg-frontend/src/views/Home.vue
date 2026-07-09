<template>
  <div class="home-page">
    <div class="sidebar">
      <button @click="$router.push('/hero')">🧙 英雄</button>
      <button @click="$router.push('/battle')">⚔️ 战斗</button>
      <button @click="$router.push('/skill')">✨ 技能</button>
      <button @click="$router.push('/backpack')">🎒 背包</button>
      <button @click="$router.push('/shop')">🏪 商城</button>
      <button @click="$router.push('/history')">📜 战斗记录</button>
      <button @click="$router.push('/profile')">
        👤 个人主页
      </button>
    </div>

    <div class="main">
      <div v-if="hero" class="hero-card">
        <div class="avatar"><HeroAvatar :job="hero.job" /></div>

        <h3>{{ hero.heroName }}</h3>
        <p class="job">{{ hero.job }} · Lv.{{ hero.heroLevel }}</p>

        <div class="bar-box">
          <div class="bar-label">❤️ HP {{ hero.currentHp }} / {{ hero.maxHp }}</div>
          <div class="bar">
            <div class="hp" :style="{ width: hpPercent + '%' }"></div>
          </div>
        </div>

        <div class="bar-box">
          <div class="bar-label">💙 MP {{ hero.currentMp }} / {{ hero.maxMp }}</div>
          <div class="bar">
            <div class="mp" :style="{ width: mpPercent + '%' }"></div>
          </div>
        </div>

        <div class="stats">
          <div>⚔️ Attack <b>{{ hero.attack }}</b></div>
          <div>🛡️ Defense <b>{{ hero.defense }}</b></div>
          <div>💨 Speed <b>{{ hero.speed }}</b></div>
          <div>💰 Gold <b>{{ hero.heroGold }}</b></div>
          <div>⭐ Exp <b>{{ hero.heroExp }}</b></div>
        </div>

        <button class="battle-btn" @click="$router.push('/battle')">
          开始冒险
        </button>
      </div>

      <div v-else class="empty">
        <h2>还没有选择英雄</h2>
        <button @click="$router.push('/hero')">去选择英雄</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getCurrentHero } from "../api/hero";
import HeroAvatar from "../components/HeroAvatar.vue";

const hero = ref(null);

const hpPercent = computed(() => {
  if (!hero.value) return 0;
  return (hero.value.currentHp / hero.value.maxHp) * 100;
});

const mpPercent = computed(() => {
  if (!hero.value) return 0;
  return (hero.value.currentMp / hero.value.maxMp) * 100;
});

onMounted(async () => {
  try {
    const res = await getCurrentHero();
    hero.value = res.data.data;
  } catch (e) {
    hero.value = null;
  }
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #1f2933, #111827);
  color: white;
}

.sidebar {
  width: 260px;
  background: rgba(0, 0, 0, 0.35);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sidebar button {
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #f9fafb;
  color: #1f2937;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.sidebar button:hover {
  transform: translateX(6px);
  background: #fde68a;
}

.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-card {
  width: 430px;
  padding: 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  text-align: center;
  backdrop-filter: blur(10px);
}

.avatar {
  font-size: 80px;
  margin-bottom: 10px;
}

.hero-card h1 {
  margin: 10px 0 5px;
  font-size: 34px;
}

.job {
  color: #d1d5db;
  margin-bottom: 28px;
}

.bar-box {
  margin: 18px 0;
  text-align: left;
}

.bar-label {
  margin-bottom: 8px;
  font-size: 14px;
}

.bar {
  height: 16px;
  background: #374151;
  border-radius: 999px;
  overflow: hidden;
}

.hp {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #fb7185);
}

.mp {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.stats {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.stats div {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
}

.battle-btn {
  margin-top: 30px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.battle-btn:hover {
  opacity: 0.9;
}

.empty {
  text-align: center;
}

.empty button {
  margin-top: 20px;
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  background: #f59e0b;
  color: white;
  cursor: pointer;
}
</style>