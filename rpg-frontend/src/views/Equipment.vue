<template>
  <div class="equipment-page">
    <h1>🛡️ 装备</h1>

    <div class="top-bar">
      <button @click="$router.push('/home')">返回主页</button>
      <button @click="loadData">刷新</button>
    </div>

    <h2>当前装备</h2>

    <div v-if="equippedList.length === 0" class="empty">
      当前没有装备
    </div>

    <div class="equip-grid">
      <div
        v-for="equip in equippedList"
        :key="equip.heroEquipmentId"
        class="equip-card equipped"
      >
        <div class="icon">🛡️</div>

      <h2 :class="getRarityClass(equip.equipmentVO.rarity)">
        {{ equip.equipmentVO.equipName }}
      </h2>
        <p class="slot">位置：{{ equip.equipSlot }}</p>
        <p>稀有度：{{ equip.equipmentVO.rarity }}</p>

        <div class="stats">
          <span>⚔️ {{ equip.equipmentVO.attack }}</span>
          <span>🛡️ {{ equip.equipmentVO.defense }}</span>
          <span>❤️ {{ equip.equipmentVO.hp }}</span>
          <span>💙 {{ equip.equipmentVO.mp }}</span>
          <span>💨 {{ equip.equipmentVO.speed }}</span>
        </div>

        <button class="unequip-btn" @click="handleUnequip(equip.heroEquipmentId)">
          卸下
        </button>
      </div>
    </div>

    <h2 class="section-title">背包装备</h2>

    <div v-if="equipmentBackpackList.length === 0" class="empty">
      背包里没有装备
    </div>

    <div class="equip-grid">
      <div
        v-for="item in equipmentBackpackList"
        :key="item.backpackId"
        class="equip-card"
      >
        <div class="icon">🎒</div>

        <h2 :class="getRarityClass(item.rarity)">
          {{ item.itemName }}
        </h2>
        <p class="slot">数量：x{{ item.quantity }}</p>

        <button class="equip-btn" @click="handleEquip(item.backpackId)">
          装备
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getBackpackList } from "../api/backpack";
import request from "../api/request";

const equippedList = ref([]);
const backpackList = ref([]);

const equipmentBackpackList = computed(() => {
  return backpackList.value.filter(item => item.itemType === "EQUIPMENT");
});

const loadEquipped = async () => {
  const res = await request({
    url: "/heroEquipment/list",
    method: "get"
  });

  equippedList.value = res.data.data;
};

const loadBackpack = async () => {
  const res = await getBackpackList();
  backpackList.value = res.data.data;
};

const loadData = async () => {
  await loadEquipped();
  await loadBackpack();
};

const handleEquip = async (backpackId) => {
  try {
    await request({
      url: "/heroEquipment/equip",
      method: "post",
      data: { backpackId }
    });

    alert("装备成功");
    loadData();
  } catch (e) {
    alert(e.response?.data?.message || "装备失败");
  }
};

const handleUnequip = async (heroEquipmentId) => {
  try {
    await request({
      url: "/heroEquipment/unequip",
      method: "post",
      data: { heroEquipmentId }
    });

    alert("卸下成功");
    loadData();
  } catch (e) {
    alert(e.response?.data?.message || "卸下失败");
  }
};

const getRarityClass = (rarity) => {
  switch (rarity) {
    case "COMMON":
      return "common";

    case "UNCOMMON":
      return "uncommon";

    case "RARE":
      return "rare";

    case "EPIC":
      return "epic";

    case "LEGENDARY":
      return "legendary";

    case "MYTHIC":
      return "mythic";

    default:
      return "";
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.equipment-page {
  min-height: 100vh;
  padding: 40px;
  background: radial-gradient(circle at top, #312e81, #020617);
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
}

h2 {
  text-align: center;
}

.section-title {
  margin-top: 50px;
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
  padding: 11px 24px;
  background: #1f2937;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.equip-grid {
  max-width: 1100px;
  margin: 25px auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.equip-card {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
  transition: 0.2s;
}

.equip-card:hover {
  transform: translateY(-6px);
}

.equipped {
  border: 1px solid rgba(250, 204, 21, 0.7);
}

.icon {
  font-size: 58px;
  margin-bottom: 10px;
}

.slot {
  color: #facc15;
  font-weight: bold;
}

.stats {
  margin: 20px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stats span {
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}

.equip-btn,
.unequip-btn {
  margin-top: 14px;
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 0;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.equip-btn {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.unequip-btn {
  background: linear-gradient(90deg, #ef4444, #f97316);
}

.empty {
  text-align: center;
  margin: 30px 0;
  color: #cbd5e1;
  font-size: 20px;
}

.common {
  color: #ffffff;
}

.uncommon {
  color: #22c55e;
}

.rare {
  color: #3b82f6;
}

.epic {
  color: #a855f7;
}

.legendary {
  color: #f59e0b;
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.8);
}

.mythic {
  color: #ef4444;
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
}
</style>