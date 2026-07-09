<template>
  <div class="login-container">

    <el-card class="login-card">

      <h3>RPG Battle System</h3>

      <el-form>

        <el-form-item>

          <el-input
              v-model="username"
              placeholder="Username"
          />

        </el-form-item>

        <el-form-item>

          <el-input
              v-model="password"
              type="password"
              placeholder="Password"
              show-password
          />

        </el-form-item>

        <el-button
            type="primary"
            style="width:100%"
            @click="login"
        >
          Login
        </el-button>

        <div class="register-link">
          没有账号？
          <span @click="router.push('/register')">
            立即注册
          </span>
        </div>

      </el-form>

    </el-card>

  </div>
</template>

<script setup>

import { ref } from "vue";
import { login as loginApi } from "../api/user";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");

const login = async () => {
  const res = await loginApi({
    username: username.value,
    password: password.value
  })

  const token = res.data.data.token

  localStorage.setItem("token", token)

  window.location.href = "/home"
}

</script>

<style scoped>

.login-container{

    width:100vw;
    height:100vh;

    display:flex;

    justify-content:center;

    align-items:center;

    background:#f5f7fa;

}

.login-card{

    width:420px;

    padding:30px;

}

h1{

    text-align:center;

    margin-bottom:30px;

}

.register-link{

    margin-top:20px;

    text-align:center;

    color:#666;

}

.register-link span{

    color:#409EFF;

    cursor:pointer;

    font-weight:bold;

}

.register-link span:hover{

    text-decoration:underline;

}

</style>