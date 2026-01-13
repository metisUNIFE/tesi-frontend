<script setup>
import { ref } from 'vue';
import MovieAnalyzer from './components/movieAnalyzer.vue';
import HistoryView from './components/historyView.vue';

const currentPage = ref('dashboard');
</script>

<template>
  <main>
    <nav class="navbar">
      <div class="logo">AI Review Analysis</div>
      <div class="links">
        <button
            @click="currentPage = 'dashboard'"
            :class="{ active: currentPage === 'dashboard' }"
        >Nuova Analisi</button>

        <button
            @click="currentPage = 'history'"
            :class="{ active: currentPage === 'history' }"
        >Cronologia</button>
      </div>
    </nav>

    <div class="content">
      <MovieAnalyzer v-if="currentPage === 'dashboard'" />
      <HistoryView v-if="currentPage === 'history'" />
    </div>
  </main>
</template>

<style>
.navbar {
  background: #333;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo { font-weight: bold; font-size: 1.2rem; }
.links button {
  background: none;
  border: none;
  color: #ccc;
  font-size: 1rem;
  margin-left: 20px;
  cursor: pointer;
  padding: 5px 10px;
}
.links button.active {
  color: white;
  border-bottom: 2px solid #2196f3;
}
.content { padding: 20px; }
</style>