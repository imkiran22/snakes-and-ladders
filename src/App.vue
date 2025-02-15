<script setup lang="ts">
import SnakesLadder from "./components/SnakesLadder.vue";
import { ref } from "vue";
defineProps<{}>();

const step = ref(0);

const dicesList = [1, 2, 3, 4, 5, 6];

const gameStarted = ref(false);
const gameEnded = ref(false);

const handler = () => {
  const index = Math.floor(Math.random() * dicesList.length);
  const value = dicesList[index];

  if (gameStarted.value) {
    // Game over
    if (step.value + value >= 100) {
      step.value = 100;
      gameEnded.value = true;
      return;
    }
    step.value += value;
    return;
  }

  // Starts the game
  if (value === 1 && gameStarted.value === false) {
    gameStarted.value = true;
    step.value = 1;
    return;
  }
};
</script>

<template>
  <div id="root">
    <div id="board">
      <SnakesLadder
        :step="step"
        :game-started="gameStarted"
        :game-ended="gameEnded"
      />
    </div>
    <div id="game-progress">
      <div>Current Step: {{ step }}</div>
      <div>Game Started: {{ gameStarted }}</div>
      <div>Game Over: {{ gameEnded }}</div>
      <button @click="handler">Roll a dice</button>
    </div>
  </div>
</template>

<style scoped>
#root {
  display: flex;
  flex-direction: row-reverse;
}
#board {
  flex: 1;
}
#game-progress {
  display: flex;
  flex-direction: column;
  flex: 0.5;
  gap: 12px;
  align-self: center;
}
</style>
