<template>
  <div class="profile-page">
    <div class="profile-card">

      <button class="back-btn" @click="goHome">
        🎮 返回游戏
      </button>

      <h1>👤 个人主页</h1>

      <div class="name">{{ user.username }}</div>

        <div class="join-time">
            注册于 {{ user.createTime?.split("T")[0] }}
        </div>

      <div class="divider"></div>

      <div class="stat-row">🎮 已创建英雄：{{ user.heroCount || 0 }}</div>
      <div class="stat-row">🏆 战斗次数：{{ user.battleCount || 0 }}</div>
      <div class="stat-row">💰 累计获得金币：{{ user.totalGold || 0 }}</div>

      <div class="divider"></div>

      <button class="logout-btn" @click="logout">
        🚪 退出登录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserProfile } from "../api/user";

const router = useRouter();
const user = ref({});

const goHome = () => {
    router.push("/home");
};

const loadUser = async () => {
  const res = await getUserProfile();
  user.value = res.data.data || {};
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

onMounted(() => {
  loadUser();
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1f2937, #020617);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.profile-card {
  width: 480px;
  padding: 42px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 60px rgba(0,0,0,.4);
  text-align: center;
}

.back-btn {
  background: #374151;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 11px 18px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 22px;
}

h1 {
  font-size: 34px;
  margin: 10px 0 18px;
}

.name {
  font-size: 32px;
  font-weight: bold;
  margin-top: 10px;
}

.join-time {
  color: #cbd5e1;
  margin-top: 8px;
  font-size: 16px;
}

.divider {
  height: 1px;
  background: rgba(255,255,255,.18);
  margin: 28px 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,.1);
  border-radius: 14px;
  padding: 14px 20px;
  margin-bottom: 14px;
  font-size: 19px;
}

.logout-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(90deg, #ef4444, #991b1b);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>