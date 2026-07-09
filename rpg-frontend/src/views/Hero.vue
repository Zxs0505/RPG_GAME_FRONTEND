<template>
  <div class="hero-page">
    <h1>🧙 Hero Hall</h1>

    <div class="top-bar">
      <button @click="$router.push('/home')">返回主页</button>
      <button @click="loadHeroList">刷新</button>
    </div>

    <div class="create-card">
      <h2>创建新英雄</h2>

      <input v-model="heroName" placeholder="输入英雄名称" />

      <select v-model="job">
        <option value="WARRIOR">战士</option>
        <option value="MAGE">法师</option>
        <option value="ARCHER">弓箭手</option>
      </select>

      <button @click="handleCreateHero">创建英雄</button>
    </div>

    <div v-if="heroList.length === 0" class="empty">
      暂无英雄，请先创建一个英雄
    </div>

    <div class="hero-grid">
      <div
        v-for="hero in heroList"
        :key="hero.heroId"
        class="hero-card"
      >
        <div class="avatar">
            <HeroAvatar :job="hero.job"/>
        </div>

        <h3>{{ hero.heroName }}</h3>
        <p class="job">{{ hero.job }} · Lv.{{ hero.heroLevel }}</p>

        <div class="bar-box">
          <span>❤️ HP {{ hero.currentHp }} / {{ hero.maxHp }}</span>
          <div class="bar">
            <div
              class="hp"
              :style="{ width: getPercent(hero.currentHp, hero.maxHp) + '%' }"
            ></div>
          </div>
        </div>

        <div class="bar-box">
          <span>💙 MP {{ hero.currentMp }} / {{ hero.maxMp }}</span>
          <div class="bar">
            <div
              class="mp"
              :style="{ width: getPercent(hero.currentMp, hero.maxMp) + '%' }"
            ></div>
          </div>
        </div>

        <div class="stats">
          <div>⚔️ {{ hero.attack }}</div>
          <div>🛡️ {{ hero.defense }}</div>
          <div>💨 {{ hero.speed }}</div>
          <div>💰 {{ hero.heroGold }}</div>
          <div>⭐ {{ hero.heroExp }}</div>
        </div>

        <button class="select-btn" @click="handleSelectHero(hero.heroId)">
          设为当前英雄
        </button>

        <button class="delete-btn" @click="handleDeleteHero(hero.heroId)">
          删除英雄
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import request from "../api/request";
import mageImg from "../assets/mage.jpg";
import HeroAvatar from "../components/HeroAvatar.vue";

const heroList = ref([]);
const heroName = ref("");
const job = ref("WARRIOR");

const loadHeroList = async () => {
  const res = await request({
    url: "/hero/list",
    method: "get"
  });

  heroList.value = res.data.data;
};

const handleCreateHero = async () => {
  if (!heroName.value) {
    alert("请输入英雄名称");
    return;
  }

  try {
    await request({
      url: "/hero/create",
      method: "post",
      data: {
        heroName: heroName.value,
        job: job.value
      }
    });

    alert("创建成功");
    heroName.value = "";
    job.value = "WARRIOR";
    loadHeroList();
  } catch (e) {
    alert(e.response?.data?.message || "创建失败");
  }
};

const handleSelectHero = async (heroId) => {
  try {
    await request({
      url: "/hero/select",
      method: "post",
      data: { heroId }
    });

    alert("已设为当前英雄");
  } catch (e) {
    alert(e.response?.data?.message || "选择失败");
  }
};

const handleDeleteHero = async (heroId) => {
  if (!confirm("确定删除这个英雄吗？")) return;

  try {
    await request({
      url: `/hero/${heroId}`,
      method: "delete"
    });

    alert("删除成功");
    loadHeroList();
  } catch (e) {
    alert(e.response?.data?.message || "删除失败");
  }
};

const getPercent = (current, max) => {
  if (!max) return 0;
  return Math.min(100, (current / max) * 100);
};



onMounted(() => {
  loadHeroList();
});
</script>

<style scoped>
.hero-page {
  min-height: 100vh;
  padding: 40px;
  background: radial-gradient(circle at top, #1e3a8a, #020617);
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
}

.top-bar {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 30px;
}

.top-bar button,
.create-card button,
.select-btn,
.delete-btn {
  border: none;
  border-radius: 12px;
  padding: 12px 22px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.top-bar button {
  background: #1f2937;
}

.create-card {
  max-width: 720px;
  margin: 0 auto 35px;
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
}

.create-card input,
.create-card select {
  width: 220px;
  margin: 10px;
  padding: 13px;
  border: none;
  border-radius: 10px;
  outline: none;
}

.create-card button {
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.hero-grid {
  max-width: 1150px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 26px;
}

.hero-card {
  padding: 30px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.13);
  text-align: center;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.38);
  transition: 0.2s;
}

.hero-card:hover {
  transform: translateY(-6px);
}

.avatar {
  font-size: 70px;
  margin-bottom: 10px;
}

.job {
  color: #cbd5e1;
}

.bar-box {
  margin: 16px 0;
  text-align: left;
}

.bar-box span {
  font-size: 14px;
}

.bar {
  height: 14px;
  margin-top: 7px;
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
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.stats {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stats div {
  padding: 11px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}

.select-btn {
  margin-top: 22px;
  width: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
}

.delete-btn {
  margin-top: 12px;
  width: 100%;
  background: linear-gradient(90deg, #ef4444, #b91c1c);
}

.empty {
  text-align: center;
  margin: 60px 0;
  font-size: 22px;
  color: #cbd5e1;
}
</style>