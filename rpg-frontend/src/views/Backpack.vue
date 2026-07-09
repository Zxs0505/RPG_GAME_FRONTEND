<template>
  <div class="backpack-page">
    <h1>🎒 背包</h1>

    <div class="top-bar">
      <button @click="$router.push('/home')">返回主页</button>
      <button @click="loadData">刷新</button>
    </div>

    <div class="backpack-layout">
      <section class="bag-panel">

        <div class="tab-bar">

          <button
              :class="{active:currentTab==='ALL'}"
              @click="currentTab='ALL'">
              全部
          </button>

          <button
              :class="{active:currentTab==='ITEM'}"
              @click="currentTab='ITEM'">
              道具
          </button>

          <button
              :class="{active:currentTab==='WEAPON'}"
              @click="currentTab='WEAPON'">
              武器
          </button>

          <button
              :class="{active:currentTab==='ARMOR'}"
              @click="currentTab='ARMOR'">
              防具
          </button>

          <button
              :class="{active:currentTab==='RING'}"
              @click="currentTab='RING'">
              饰品
          </button>

          <button
              :class="{active:currentTab==='SHOES'}"
              @click="currentTab='SHOES'">
              鞋子
          </button>

        </div>

        <div class="bag-grid">
          <div
            v-for="item in getFilteredBackpack()"
            :key="item.backpackId"
            class="bag-slot"
            :class="getRarityBorder(item.rarity)"
            @click="selectedItem = item"
          >
            <div class="item-icon">
              {{ item.itemType === "ITEM" ? "🧪" : "🛡️" }}
            </div>
            <div class="item-name" :class="getRarityClass(item.rarity)">
              {{ item.itemName }}
            </div>
            <div class="item-count">x{{ item.quantity }}</div>
          </div>

          <div
            v-for="n in emptySlots"
            :key="'empty-' + n"
            class="bag-slot empty-slot"
          >
            空
          </div>
        </div>
      </section>

      <section class="equip-panel">
      <div v-if="hero" class="mini-hero">
        <div class="mini-avatar">🧙</div>

        <div class="mini-info">
          <h3>{{ hero.heroName }}</h3>
          <p>{{ hero.job }} · Lv.{{ hero.heroLevel }}</p>
        </div>

        <div class="mini-stats">
          <span>❤️ {{ hero.currentHp }}/{{ hero.maxHp }}</span>
          <span>💙 {{ hero.currentMp }}/{{ hero.maxMp }}</span>
          <span>⚔️ {{ hero.attack }}</span>
          <span>🛡️ {{ hero.defense }}</span>
        </div>
      </div>
        <h2>当前装备</h2>

        <div class="equip-slots">
          <div
            v-for="slot in equipSlots"
            :key="slot"
            class="equip-slot"
          >
            <div class="slot-title">{{ slot }}</div>

            <div v-if="getEquipped(slot)" class="equipped-item">
              <div class="item-icon">🛡️</div>
              <div :class="getRarityClass(getEquipped(slot).equipmentVO.rarity)">
                {{ getEquipped(slot).equipmentVO.equipName }}
              </div>

              <button
                class="unequip-btn"
                @click="handleUnequip(getEquipped(slot).heroEquipmentId)"
              >
                卸下
              </button>
            </div>

            <div v-else class="empty-equip">
              未装备
            </div>
          </div>
        </div>

        <div v-if="selectedItem" class="detail-card">
          <h2>物品详情</h2>

          <div class="detail-icon">
            {{ selectedItem.itemType === "ITEM" ? "🧪" : "🛡️" }}
          </div>

          <h3 :class="getRarityClass(selectedItem.rarity)">
            {{ selectedItem.itemName }}
          </h3>
          <p>类型：{{ selectedItem.itemType === "ITEM" ? "道具" : "装备" }}</p>
          <p>数量：x{{ selectedItem.quantity }}</p>
          <p v-if="selectedItem.itemType==='ITEM'">
              <div v-if="selectedItem.hp > 0">
                  ❤️ HP +{{ selectedItem.hp }}
              </div>

              <div v-if="selectedItem.mp > 0">
                  💙 MP +{{ selectedItem.mp }}
              </div>

              <div v-if="selectedItem.attack > 0">
                  ⚔️ 攻击 +{{ selectedItem.attack }}
              </div>

              <div v-if="selectedItem.defense > 0">
                  🛡️ 防御 +{{ selectedItem.defense }}
              </div>

              <div v-if="selectedItem.speed > 0">
                  💨 速度 +{{ selectedItem.speed }}
              </div>
          </p>

          <p v-if="selectedItem.itemType==='EQUIPMENT'">
              属性：{{ getEquipmentEffect(selectedItem) }}
          </p>

          <button
            v-if="selectedItem.itemType === 'ITEM'"
            class="use-btn"
            @click="handleUseItem(selectedItem.backpackId)"
          >
            使用
          </button>

          <button
            v-if="selectedItem.itemType === 'EQUIPMENT'"
            class="equip-btn"
            @click="handleEquip(selectedItem.backpackId)"
          >
            装备
          </button>
        </div>

        <div v-else class="detail-card empty-detail">
          点击左侧背包物品查看详情
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getBackpackList } from "../api/backpack";
import { useItem } from "../api/item";
import request from "../api/request";
import { getCurrentHero } from "../api/hero";
import { getRarityClass, getRarityBorder, getRarityName } from "../utils/rarity";

const hero = ref(null);
const currentTab = ref("ALL");

const getFilteredBackpack = () => {
  if (currentTab.value === "ALL") {
    return backpackList.value;
  }

  if (currentTab.value === "ITEM") {
    return backpackList.value.filter(item => item.itemType === "ITEM");
  }

  return backpackList.value.filter(item =>
    item.itemType === "EQUIPMENT" &&
    item.equipType === currentTab.value
  );
};

const loadHero = async () => {
  const res = await getCurrentHero();
  hero.value = res.data.data || null;
};

const backpackList = ref([]);
const equippedList = ref([]);
const selectedItem = ref(null);

const equipSlots = ["WEAPON", "ARMOR", "RING", "SHOES"];

const emptySlots = computed(() => {
  const total = 24;
  return Math.max(total - getFilteredBackpack().length, 0);
});

const loadBackpack = async () => {
  const res = await getBackpackList();
  backpackList.value = res.data.data || [];

  if (selectedItem.value) {
    const exist = backpackList.value.find(
      item => item.backpackId === selectedItem.value.backpackId
    );
    selectedItem.value = exist || null;
  }
};

const loadEquipped = async () => {
  const res = await request({
    url: "/heroEquipment/list",
    method: "get"
  });

  equippedList.value = res.data.data || [];
};

const loadData = async () => {
  await loadHero();
  await loadBackpack();
  await loadEquipped();
};

const getEquipped = (slot) => {
  return equippedList.value.find(item => item.equipSlot === slot);
};

const handleUseItem = async (backpackId) => {
  try {
    await useItem({ backpackId });
    alert("使用成功");
    await loadData();
  } catch (e) {
    alert(e.response?.data?.message || "使用失败");
  }
};

const handleEquip = async (backpackId) => {
  try {
    await request({
      url: "/heroEquipment/equip",
      method: "post",
      data: { backpackId }
    });

    alert("装备成功");
    selectedItem.value = null;
    await loadData();
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
    await loadData();
  } catch (e) {
    alert(e.response?.data?.message || "卸下失败");
  }
};

const getItemEffect = (item) => {
  if (!item) return "";

  switch (item.effectType) {
    case "HP":
      return `恢复HP ${item.effectValue}`;

    case "MP":
      return `恢复MP ${item.effectValue}`;

    case "ATTACK":
      return `攻击 +${item.effectValue}`;

    case "DEFENSE":
      return `防御 +${item.effectValue}`;

    default:
      return item.effectValue;
  }
};

const getEquipmentEffect = (item) => {

    const list = [];

    if (item.attack)
        list.push(`攻击 +${item.attack}`);

    if (item.defense)
        list.push(`防御 +${item.defense}`);

    if (item.hp)
        list.push(`生命 +${item.hp}`);

    if (item.mp)
        list.push(`法力 +${item.mp}`);

    if (item.speed)
        list.push(`速度 +${item.speed}`);

    return list.join(" / ");
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.backpack-page {
  min-height: 100vh;
  padding: 40px;
  background: radial-gradient(circle at top, #334155, #020617);
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

.top-bar button {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  background: #1f2937;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.backpack-layout {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 28px;
}

.bag-panel,
.equip-panel {
  padding: 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
}

.bag-panel h2,
.equip-panel h2 {
  text-align: center;
  margin-bottom: 22px;
}

.bag-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.bag-slot {
  min-height: 115px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.bag-slot:hover {
  transform: translateY(-4px);
  border-color: #facc15;
}

.empty-slot {
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.item-icon {
  font-size: 34px;
  margin-bottom: 8px;
}

.item-name {
  font-weight: bold;
}

.item-count {
  color: #facc15;
  margin-top: 5px;
}

.equip-slots {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.equip-slot {
  min-height: 135px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.85);
  text-align: center;
}

.slot-title {
  color: #facc15;
  font-weight: bold;
  margin-bottom: 12px;
}

.empty-equip {
  color: #94a3b8;
  margin-top: 25px;
}

.unequip-btn,
.use-btn,
.equip-btn {
  margin-top: 12px;
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 10px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.unequip-btn {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
}

.use-btn {
  background: linear-gradient(90deg, #10b981, #059669);
}

.equip-btn {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.detail-card {
  margin-top: 24px;
  padding: 22px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.9);
  text-align: center;
}

.detail-icon {
  font-size: 46px;
  margin-bottom: 10px;
}

.empty-detail {
  color: #94a3b8;
}

.mini-stats {
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.mini-stats span {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  font-size: 14px;
}

.tab-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0 20px;
}

.tab-bar button {
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  background: #374151;
  color: white;
  cursor: pointer;
  transition: .2s;
}

.tab-bar button:hover {
  background: #4b5563;
}

.tab-bar button.active {
  background: #f59e0b;
}
</style>