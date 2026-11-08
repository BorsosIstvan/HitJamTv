import { defineStore } from 'pinia';
import stationsData from '../stations.json'; // Beimportáljuk a JSON-t

export const useStreamStore = defineStore('stream', {
  state: () => ({
    currentStation: null,
    isPlaying: false,
    stationsList: stationsData // Közvetlenül átadjuk a listát
  }),
  actions: {
    play(station) {
      this.currentStation = station;
      this.isPlaying = true;
    }
  }
});
