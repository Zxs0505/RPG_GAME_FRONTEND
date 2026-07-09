<template>
  <div class="register-page">
    <div class="register-card">
      <h1>📝 Register</h1>

      <input v-model="username" placeholder="请输入用户名" />

      <input
        v-model="password"
        type="password"
        placeholder="请输入密码"
      />

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="确认密码"
      />

      <button @click="handleRegister">注册</button>

      <p class="login-link" @click="$router.push('/login')">
        已有账号？返回登录
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { register } from "../api/user";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    alert("请填写完整信息");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("两次密码不一致");
    return;
  }

  const res = await register({
    username: username.value,
    password: password.value
  });

  if (res.data.code !== 200) {
    alert(res.data.message || "注册失败");
    return;
  }

  alert("注册成功，请登录");
  router.push("/login");
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1e3a8a, #020617);
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  width: 380px;
  padding: 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.12);
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,.4);
}

h1 {
  color: white;
  margin-bottom: 28px;
}

input {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
}

button {
  width: 100%;
  margin-top: 10px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.login-link {
  margin-top: 20px;
  color: #cbd5e1;
  cursor: pointer;
}

.login-link:hover {
  color: #facc15;
}
</style>