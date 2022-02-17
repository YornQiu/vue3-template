<script setup>
import TheHeader from '@/components/layout/TheHeader.vue';
import TheAside from '@/components/layout/TheAside.vue';
</script>

<template>
  <TheHeader />
  <TheAside />
  <main class="layout-content">
    <router-view />
  </main>
</template>
