<template>
  <div class="skill-page">
    <h1>✨ Skill Hall</h1>

    <div class="top-bar">
      <button @click="$router.push('/home')">返回主页</button>
      <button @click="loadData">刷新</button>
    </div>

    <h2>已学习技能</h2>

    <div v-if="heroSkillList.length === 0" class="empty">
      当前英雄还没有学习技能
    </div>

    <div class="skill-grid">
      <div
        v-for="heroSkill in heroSkillList"
        :key="heroSkill.heroSkillId"
        class="skill-card learned"
      >
        <div class="icon">✨</div>

        <h2>{{ heroSkill.skill.skillName }}</h2>

        <p>类型：{{ heroSkill.skill.effectType }}</p>
        <p>效果值：{{ heroSkill.skill.effectValue }}</p>
        <p>MP消耗：{{ heroSkill.skill.mpCost }}</p>
        <p>冷却：{{ heroSkill.skill.cooldown }}</p>

        <p class="slot">
          当前技能栏：
          <span v-if="heroSkill.skillSlot === 0">未装备</span>
          <span v-else>Slot {{ heroSkill.skillSlot }}</span>
        </p>

        <div class="slot-buttons">
          <button @click="handleEquip(heroSkill.heroSkillId, 1)">Slot 1</button>
          <button @click="handleEquip(heroSkill.heroSkillId, 2)">Slot 2</button>
          <button @click="handleEquip(heroSkill.heroSkillId, 3)">Slot 3</button>
          <button @click="handleEquip(heroSkill.heroSkillId, 4)">Slot 4</button>
          <button class="remove-btn" @click="handleEquip(heroSkill.heroSkillId, 0)">
            卸下
          </button>
        </div>
      </div>
    </div>

    <h2 class="section-title">全部技能</h2>

    <div class="skill-grid">
      <div
        v-for="skill in allSkillList"
        :key="skill.skillId"
        class="skill-card"
      >
        <div class="icon">{{ getSkillIcon(skill.effectType) }}</div>

        <h2>{{ skill.skillName }}</h2>

        <p>类型：{{ skill.effectType }}</p>
        <p>效果值：{{ skill.effectValue }}</p>
        <p>MP消耗：{{ skill.mpCost }}</p>
        <p>冷却：{{ skill.cooldown }}</p>
        <p class="desc">{{ skill.skillDescription }}</p>

        <button
          v-if="isLearned(skill.skillId)"
          class="learned-btn"
          disabled
        >
          已学习
        </button>

        <button
          v-else-if="hero.heroLevel < skill.unlockLevel"
          class="learned-btn"
          disabled
        >
          Lv{{ skill.unlockLevel }} 解锁
        </button>

        <button
          v-else
          class="learn-btn"
          @click="handleLearn(skill.skillId)"
        >
          学习技能
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSkillList } from "../api/skill";
import { getHeroSkillList, learnSkill, equipSkill } from "../api/heroSkill";
import { getCurrentHero } from "../api/hero";

const allSkillList = ref([]);
const heroSkillList = ref([]);

const hero = ref({});

const loadData = async () => {

  const heroRes = await getCurrentHero();
  const skillRes = await getSkillList();
  const heroSkillRes = await getHeroSkillList();

  hero.value = heroRes.data.data;
  allSkillList.value = skillRes.data.data;
  heroSkillList.value = heroSkillRes.data.data;
};

const isLearned = (skillId) => {
  return heroSkillList.value.some(item => item.skill.skillId === skillId);
};

const handleLearn = async (skillId) => {
  try {
    await learnSkill({ skillId });
    alert("学习成功");
    loadData();
  } catch (e) {
    alert(e.response?.data?.message || "学习失败");
  }
};

const handleEquip = async (heroSkillId, skillSlot) => {
  try {
    await equipSkill({
      heroSkillId,
      skillSlot
    });

    alert("装备成功");
    loadData();
  } catch (e) {
    alert(e.response?.data?.message || "装备失败");
  }
};

const getSkillIcon = (effectType) => {
  if (effectType === "DAMAGE") return "🔥";
  if (effectType === "HEAL") return "❤️";
  if (effectType === "HEAL_HP") return "❤️";
  if (effectType === "HEAL_MP") return "💙";
  if (effectType === "HEAL_HP_MP") return "💖";
  if (effectType === "DEFENSE") return "🛡️";
  return "✨";
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.skill-page {
  min-height: 100vh;
  padding: 40px;
  background: radial-gradient(circle at top, #581c87, #020617);
  color: white;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 46px;
}

h2 {
  text-align: center;
}

.section-title {
  margin-top: 60px;
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

.skill-grid {
  max-width: 1150px;
  margin: 25px auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.skill-card {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
  transition: 0.2s;
}

.skill-card:hover {
  transform: translateY(-6px);
}

.learned {
  border: 1px solid rgba(250, 204, 21, 0.8);
}

.icon {
  font-size: 58px;
  margin-bottom: 12px;
}

.slot {
  color: #facc15;
  font-weight: bold;
}

.desc {
  color: #cbd5e1;
  min-height: 45px;
}

.learn-btn,
.learned-btn,
.slot-buttons button {
  border: none;
  border-radius: 10px;
  padding: 11px 18px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.learn-btn {
  width: 100%;
  margin-top: 14px;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.learned-btn {
  width: 100%;
  margin-top: 14px;
  background: #6b7280;
  cursor: default;
}

.slot-buttons {
  margin-top: 18px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.slot-buttons button {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.slot-buttons .remove-btn {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
}

.empty {
  text-align: center;
  margin: 40px 0;
  color: #cbd5e1;
  font-size: 20px;
}

</style>