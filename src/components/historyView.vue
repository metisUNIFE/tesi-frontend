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
  <div class="page-wrapper">
    <h2 class="titolo">Cronologia ricerche</h2>

    <div class="history-container">
      <div v-if="isLoading" class="loading-text">Caricamento...</div>

      <table v-else class="styled-table">
        <thead>
        <tr>
          <th>Data</th>
          <th>Film</th>
          <th>Recensioni</th>
          <th>Gradimento</th>
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
        <tr v-if="historyList.length === 0">
          <td colspan="4" style="text-align: center; padding: 20px;">Nessuna ricerca salvata.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.titolo {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.history-container {
  max-width: 900px;
  margin: 0 auto;
}

.loading-text {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

/* --- STILE TABELLA DARK --- */
.styled-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  /* MODIFICATO: Sfondo scuro come richiesto */
  background-color: #3a3a3a;
  /* MODIFICATO: Testo chiaro per leggibilità su sfondo scuro */
  color: #ecf0f1;

  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); /* Ombra leggermente più scura */
}

.styled-table thead {
  background-color: #555555; /* Header leggermente più scuro/blu */
  color: #ffffff;
}

.styled-table th,
.styled-table td {
  padding: 15px 20px;
  text-align: left;
}

/* Centratura colonne numeriche */
.styled-table th:nth-child(3),
.styled-table td:nth-child(3),
.styled-table th:nth-child(4),
.styled-table td:nth-child(4) {
  text-align: center;
}

/* MODIFICATO: Bordi più scuri e sottili per il tema dark */
.styled-table tbody tr {
  border-bottom: 1px solid #555;
}
.styled-table td {
  border-bottom: 1px solid #555;
}

.styled-table tbody tr:last-of-type td {
  border-bottom: none;
}

/* MODIFICATO: Hover effect più chiaro del background ma scuro */
.styled-table tbody tr:hover {
  background-color: #4a4a4a;
}

/* --- CELLE SPECIFICHE --- */
.title-cell {
  font-weight: bold;
  /* MODIFICATO: Colore ereditato (bianco) invece che blu scuro per leggibilità */
  color: inherit;
  text-transform: capitalize;
  font-size: 1.05rem;
}

.score-badge {
  padding: 6px 14px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  display: inline-block;
  min-width: 50px;
}

/* Colori dei badge (INVARIATI) */
.high { background-color: #4caf50; }
.mid { background-color: #ff9800; }
.low { background-color: #f44336; }
</style>