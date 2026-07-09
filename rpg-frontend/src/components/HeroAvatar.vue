<template>
  <img :src="avatar" class="hero-avatar" />
</template>

<script setup>
import { computed } from "vue";

import warriorImg from "../assets/warrior.jpg";
import mageImg from "../assets/mage.jpg";
import archerImg from "../assets/archer.jpg";

const props = defineProps({
  job: String
});

const avatar = computed(() => {
  switch (props.job) {
    case "WARRIOR":
      return warriorImg;

    case "MAGE":
      return mageImg;

    case "ARCHER":
      return archerImg;

    default:
      return warriorImg;
  }
});
</script>

<style scoped>
.hero-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255,255,255,.25);
  box-shadow: 0 8px 20px rgba(0,0,0,.35);
}
</style>