<script setup>
import {computed, ref} from 'vue';
import api from '@/service/api';

const movieTitle = ref('');
const isLoading = ref(false);
const stats = ref(null);
const reviewList = ref([]);

const handleAnalysis = async () => {
  if(!movieTitle.value) return;

  stats.value = null;
  reviewList.value = [];
  isLoading.value = true;

  try{
    const response = await api.analyzeAndStats(movieTitle.value);

    stats.value = response.data.stats;
    reviewList.value = response.data.reviews;

    if(!stats.value || stats.value.TOTALE=== 0 || !reviewList.value){
      stats.value = null;
      reviewList.value = null;
    }
  }catch(e){
    console.error(e);
  }finally {
    isLoading.value = false;
  }
};

const positivePercentage = computed(() => {
  if(!stats.value || stats.value.TOTALE === 0)return 0;

  const positivi = stats.value.POSITIVO || 0;
  const totale = stats.value.TOTALE;
  return Math.round((positivi/totale)*100);
});

const scoreColor = computed(() => {
  if(positivePercentage.value >= 70 ){
    return '#4caf50';
  }
  if(positivePercentage.value >= 40){
    return '#f18500';
  }
  return '#ea0000'
});
</script>

<template>
  <div class="Dashboard"><h1>AI sentiment dashboard</h1>
    <div class="searchBox">
    <input
        v-model="movieTitle"
        placeholder="Inserisci titolo di un film"
        @keyup.enter="handleAnalysis"
    />
    <button @click="handleAnalysis()" :disabled="isLoading">
      {{isLoading ? 'Analisi in corso...' : 'Analizza'}}
    </button>
    </div>


    <div v-if="isLoading" class="loader"></div>
    <div v-if="stats" class="statsGrid">
      <div class="card total">
        <h3>Recensioni totali </h3>
        <span class="number">{{stats.TOTALE}}</span>
      </div>

      <div class="card positive">
        <h3>Positive </h3>
        <span class="number">{{stats.POSITIVO || 0}}</span>
      </div>

      <div class="card negative">
        <h3>Negative </h3>
        <span class="number">{{stats.NEGATIVO || 0}}</span>
      </div>

      <div class="card neutrali">
        <h3>Neutrali </h3>
        <span class="number">{{stats.NEUTRALE || 0}}</span>
      </div>

      <div class="card score">
        <h3>Punteggio gradimento</h3>
        <div class="percentage" :style="{color: scoreColor}">
          {{positivePercentage}}%
        </div>
        <div class="progressBar-bg">
          <div class="progressBar-fill" :style="{width: positivePercentage + '%' , backgroundColor: scoreColor}"></div>
        </div>
      </div>
    </div>

    <div v-if="reviewList && reviewList.length > 0" class="reviews-section">
      <h2>Dettaglio Analisi</h2>
      <div class="reviews-list">
        <div v-for="(review, index) in reviewList" :key="index" class="review-item">

          <div class="review-header">
            <span class="sentiment-badge" :class="review.sentiment.toLowerCase()">
              {{ review.sentiment }}
            </span>
          </div>

          <p class="review-text">"{{ review.text }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 colonne */
  gap: 20px;
  margin-top: 30px;
}

button:disabled {
  background-color: #b0bec5;
  cursor: wait;
}

button {
  padding: 12px 24px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

input {
  padding: 12px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.searchBox {
  margin: 2rem 0;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.Dashboard{
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card h3 { margin: 0 0 10px 0; font-size: 1rem; color: #666; }
.number { font-size: 2.5rem; font-weight: bold; color: #333; }

/* Colori specifici per le card */
.positive .number { color: #4caf50; }
.negative .number { color: #f44336; }
.neutrali .number { color: #9e9e9e; }

.score {
  grid-column: span 2;
  padding: 30px;
}

.percentage {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 15px;
}

.progressBar-bg {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progressBar-fill {
  height: 100%;
  transition: width 1s ease-in-out;
}

.loader { color: #2196f3; margin-top: 20px; font-weight: bold; }

.reviews-section { margin-top: 40px; text-align: left; }
.reviews-list { display: flex; flex-direction: column; gap: 15px; }

.review-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid #ccc; /* Default */
}

.review-text { margin: 5px 0 0 0; font-style: italic; color: #555; }

.sentiment-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}

/* Classi dinamiche per i colori */
/* Nota: usa !important o selettori specifici per sovrascrivere il bordo */
.review-item:has(.positivo) { border-left-color: #4caf50; }
.review-item:has(.negativo) { border-left-color: #f44336; }
.review-item:has(.neutrale) { border-left-color: #9e9e9e; }

.positivo { background-color: #4caf50; }
.negativo { background-color: #f44336; }
.neutrale { background-color: #9e9e9e; }
</style>