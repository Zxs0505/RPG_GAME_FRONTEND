<template>
  <div class="shop-page">
    <h1>🏪 商城</h1>

    <div class="gold-bar">💰 Gold：{{ hero.heroGold || 0 }}</div>
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

    <div class="top-bar">
      <button @click="$router.push('/home')">返回主页</button>
      <button @click="refreshPage">刷新</button>
    </div>

    <div v-if="shopList.length === 0" class="empty">
      商城暂无商品
    </div>

    <div class="shop-grid">
      <div
        v-for="goods in filterGoods()"
        :key="goods.shopId"
        class="shop-card"
        :class="getRarityBorder(goods.rarity)"
        @click="selectedGoods = goods"
      >
        <div class="icon">
          {{ goods.itemType === "ITEM" ? "🧪" : "🛡️" }}
        </div>

        <h2 :class="getRarityClass(goods.rarity)">
          {{ goods.itemName }}
        </h2>

        <p class="type">
          {{ goods.itemType === "ITEM" ? "道具" : "装备" }}
        </p>

        <p class="desc">{{ goods.description }}</p>

        <div class="stats">
          <span v-if="goods.hp > 0">❤️ HP +{{ goods.hp }}</span>
          <span v-if="goods.mp > 0">💙 MP +{{ goods.mp }}</span>
          <span v-if="goods.attack > 0">⚔️ Attack +{{ goods.attack }}</span>
          <span v-if="goods.defense > 0">🛡️ Defense +{{ goods.defense }}</span>
          <span v-if="goods.speed > 0">💨 Speed +{{ goods.speed }}</span>
        </div>

        <p class="price">💰 {{ goods.price }} Gold</p>

        <p v-if="goods.stock !== -1" class="stock">
          库存：{{ goods.stock }}
        </p>

        <div class="buy-box">
          <input
            v-model.number="buyQuantity[goods.shopId]"
            type="number"
            min="1"
          />

          <button @click.stop="handleBuy(goods)">
            购买
          </button>
        </div>
      </div>
    </div>
    <div
  v-if="selectedGoods"
  class="modal-mask"
  @click="selectedGoods = null"
>
  <div class="goods-modal" @click.stop>

    <button
      class="close-btn"
      @click="selectedGoods = null"
    >
      ×
    </button>

    <div class="modal-icon">
      {{ selectedGoods.itemType === "ITEM" ? "🧪" : "🛡️" }}
    </div>

    <h2 :class="getRarityClass(selectedGoods.rarity)">
      {{ selectedGoods.itemName }}
    </h2>

    <p class="modal-type">
      {{ selectedGoods.itemType === "ITEM" ? "道具" : "装备" }}
    </p>

    <p class="modal-desc">
      {{ selectedGoods.description }}
    </p>

    <div class="modal-stats">

        <div v-if="selectedGoods.hp">
            ❤️ HP +{{ selectedGoods.hp }}
        </div>

        <div v-if="selectedGoods.mp">
            💙 MP +{{ selectedGoods.mp }}
        </div>

        <div v-if="selectedGoods.attack">
            ⚔️ Attack +{{ selectedGoods.attack }}
        </div>

        <div v-if="selectedGoods.defense">
            🛡️ Defense +{{ selectedGoods.defense }}
        </div>

        <div v-if="selectedGoods.speed">
            💨 Speed +{{ selectedGoods.speed }}
        </div>

        </div>

            <h3 class="modal-price">
            💰 {{ selectedGoods.price }} Gold
            </h3>

        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getShopList, buyShopItem } from "../api/shop";
import { getCurrentHero } from "../api/hero";
import {getRarityClass,getRarityBorder} from "../utils/rarity";

const hero = ref({});
const shopList = ref([]);
const buyQuantity = ref({});
const selectedGoods = ref(null);
const currentTab = ref("ALL");

const filterGoods = () => {

  if (currentTab.value === "ALL") {
    return shopList.value;
  }

  if (currentTab.value === "ITEM") {
    return shopList.value.filter(i => i.itemType === "ITEM");
  }

  if (currentTab.value === "WEAPON") {
    return shopList.value.filter(
      i =>
        i.itemType === "EQUIPMENT" &&
        i.equipmentType === "WEAPON"
    );
  }

  if (currentTab.value === "ARMOR") {
    return shopList.value.filter(
      i =>
        i.itemType === "EQUIPMENT" &&
        i.equipmentType === "ARMOR"
    );
  }

  if (currentTab.value === "RING") {
    return shopList.value.filter(
      i =>
        i.itemType === "EQUIPMENT" &&
        i.equipmentType === "RING"
    );
  }

  if (currentTab.value === "SHOES") {
    return shopList.value.filter(
      i =>
        i.itemType === "EQUIPMENT" &&
        i.equipmentType === "SHOES"
    );
  }

  return shopList.value;
};

const loadHero = async () => {
  const res = await getCurrentHero();
  hero.value = res.data.data || {};
};

const loadShop = async () => {
  const res = await getShopList();
  shopList.value = res.data.data || [];

  shopList.value.forEach(item => {
    if (!buyQuantity.value[item.shopId]) {
      buyQuantity.value[item.shopId] = 1;
    }
  });
};

const refreshPage = async () => {
  await loadHero();
  await loadShop();
};

const handleBuy = async (goods) => {
  const quantity = buyQuantity.value[goods.shopId] || 1;

  if (quantity <= 0) {
    alert("购买数量必须大于0");
    return;
  }

  try {
    const res = await buyShopItem({
      shopId: goods.shopId,
      quantity
    });

    console.log("购买返回：", res.data);

    if (res.data.code !== 200) {
      alert(res.data.message || "购买失败");
      return;
    }

    await loadHero();
    await loadShop();

    console.log("已刷新金币和商城");

    alert("购买成功");
  } catch (e) {
    alert(e.response?.data?.message || "购买失败");
  }
};

onMounted(() => {
  refreshPage();
});
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  padding: 40px;
  background: radial-gradient(circle at top, #78350f, #020617);
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 46px;
}

.gold-bar {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #facc15;
  margin-bottom: 18px;
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

.shop-grid {
  max-width: 1150px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.shop-card {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
  transition: 0.2s;
  box-sizing: border-box;
}

.shop-card:hover {
  transform: translateY(-6px);
}

.icon {
  font-size: 58px;
  margin-bottom: 10px;
}

.type {
  color: #facc15;
  font-weight: bold;
}

.desc {
  color: #cbd5e1;
  min-height: 45px;
}

.stats {
  margin: 16px 0;
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.stats span {
  padding: 7px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}

.price {
  font-size: 20px;
  color: #facc15;
  font-weight: bold;
}

.stock {
  color: #cbd5e1;
}

.buy-box {
  margin-top: 18px;
  display: flex;
  gap: 10px;
}

.buy-box input {
  width: 80px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  text-align: center;
}

.buy-box button {
  flex: 1;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.empty {
  text-align: center;
  margin-top: 100px;
  color: #cbd5e1;
  font-size: 22px;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.goods-modal {
  width: 420px;
  background: #1f2937;
  border-radius: 20px;
  padding: 30px;
  color: white;
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 18px;
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
}

.modal-icon {
  font-size: 70px;
}

.modal-type {
  color: gold;
  font-weight: bold;
  margin-top: 8px;
}

.modal-desc {
  color: #cbd5e1;
  margin: 15px 0;
}

.modal-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.modal-stats div {
  background: rgba(255,255,255,.1);
  padding: 10px;
  border-radius: 10px;
}

.modal-price {
  color: gold;
  margin-top: 20px;
}

.tab-bar{
    display:flex;
    justify-content:center;
    gap:15px;
    margin-bottom:25px;
    flex-wrap:wrap;
}

.tab-bar button{
    padding:10px 22px;
    border:none;
    border-radius:999px;
    background:#374151;
    color:white;
    cursor:pointer;
    transition:.2s;
}

.tab-bar button:hover{
    background:#4b5563;
}

.tab-bar button.active{
    background:#f59e0b;
    color:#fff;
}
</style>