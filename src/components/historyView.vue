<script setup>
import { ref, onMounted} from 'vue';
import api from '@/service/api.js';

const historyList = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try{
    const response = await api.history.getAll();
    historyList.value = response.data;
  }catch (e) {
    console.error(e);
  }finally{
    isLoading.value = false;
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('it-IT',{
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};
</script>

<template>
  <div class="history-container">
    <h2>Cronologia ricerche</h2>

    <div v-if="isLoading">Caricamento</div>

    <table v-else class="history-table">
      <thead>
      <tr>
        <th>Data</th>
        <th>Film</th>
        <th>Recensioni analizzate</th>
        <th>Gradimento in %</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="item in historyList" :key="item.id">
          <td>{{formatDate(item.date)}}</td>
          <td class="title-cell">{{item.title}}</td>
          <td>{{item.totalReviews}}</td>
          <td>
            <span class="score-badge"
                  :class="{
                    'high' : item.score >= 70,
                    'mid' : item.score >= 40 && item.score < 70,
                    'low' :item.score < 40
                  }">
              {{item.score}}%
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="historyList.length === 0 && !isLoading">Nessuna ricerca salvata.</p>
  </div>


</template>

<style scoped>
.history-container { max-width: 800px; margin: 0 auto; text-align: center; }
.history-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
th { background-color: #f8f9fa; color: #666; font-weight: 600; }
.title-cell { font-weight: bold; color: #333; text-transform: capitalize; }

.score-badge { padding: 5px 10px; border-radius: 20px; color: white; font-weight: bold; font-size: 0.9rem; }
.high { background-color: #4caf50; }
.mid { background-color: #ff9800; }
.low { background-color: #f44336; }
</style>