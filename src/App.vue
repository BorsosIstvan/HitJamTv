<script setup>
import Hls from 'hls.js';
import { ref, watch, onMounted } from 'vue';
import { useStreamStore } from './stores/streamStore';

const streamStore = useStreamStore();
const videoRef = ref(null);

// Ez a függvény vezérli a lejátszást tiszta Vanilla JS + CDN segítségével
const startStream = (url) => {
  if (!videoRef.value) return;

  // 1. Ha a böngésző gyárilag tudja (Safari / iOS)
  if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoRef.value.src = url;
    videoRef.value.play().catch(err => console.log("Autoplay gátolva:", err));
  } 
  // 2. Ha a Chrome/Firefox alá betöltött a CDN-es Hls segédlet (Hls)
  else if (Hls && Hls.isSupported()) {
    // Ha már van régi lejátszás a video elemen, takarítsuk le
    if (videoRef.value._hls) {
      videoRef.value._hls.destroy();
    }

    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(videoRef.value);
    
    // Elmentjük a példányt a videó elemre, hogy később elérjük
    videoRef.value._hls = hls;

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoRef.value.play().catch(err => console.log("Autoplay gátolva:", err));
    });
  }
};

// Figyeljük, ha a felhasználó csatornát vált
watch(
  () => streamStore.currentStation,
  (newStation) => {
    if (newStation) {
      startStream(newStation.payload);
    }
  }
);
</script>

<template>
  <div class="app-container">
    
    <!-- Fejléc / Logo -->
    <div class="logo-section">
      <h1>HitJam TV</h1>
      <p>Online Stream lejátszó az autódba és mobilodra</p>
    </div>

    <!-- Videó ablak (Csak akkor jelenik meg, ha kiválasztottunk valmit) -->
    <div v-show="streamStore.currentStation" class="video-container">
      <video 
        ref="videoRef" 
        controls 
        playsinline 
        class="tv-player"
      ></video>
      <div class="video-info">
        <h3>{{ streamStore.currentStation?.name }}</h3>
        <p>{{ streamStore.currentStation?.genre }}</p>
      </div>
    </div>

    <!-- Csatorna Választó Rács (A te egyedi dizájnod alapján) -->
    <div class="quiz-grid">
      <button 
        v-for="station in streamStore.stationsList"
        :key="station.id"
        class="quiz-btn" 
        :style="streamStore.currentStation?.id === station.id ? 'border-color: #ff4500; background: rgba(255, 69, 0, 0.2); box-shadow: 0 0 15px #ff4500;' : ''"
        @click="streamStore.play(station)"
      >
        <span style="font-size: 32px; display: block; margin-bottom: 8px;">{{ station.logo }}</span>
        <span style="font-size: 18px; font-weight: bold; display: block;">{{ station.name }}</span>
      </button>
    </div>

    <!-- Lábléc -->
    <div class="footer">
      <p>© 2026 HitJam TV. Minden jog fenntartva.</p>
    </div>

  </div>
</template>
