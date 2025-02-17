<script setup lang="ts">
import { ref } from "vue";
import SnakesLadder from "./components/SnakesLadder.vue";
const snakeBoardRef = ref<{
  handler: () => void;
  restart: () => void;
  gameStarted: boolean;
  gameEnded: boolean;
  rolled: number;
  currentPlayerIndex: number;
  players: Record<string, { step: number; started: boolean }>;
  disabled: boolean;
}>();

const rollDice = () => {
  if (snakeBoardRef.value) {
    snakeBoardRef.value?.handler();
  }
};

const restart = () => {
  if (snakeBoardRef.value) {
    snakeBoardRef.value?.restart();
  }
};

const playerColors = ["#aadb1e", "#fe5000", "#ffc600"];
</script>

<template>
  <div id="root">
    <div id="board">
      <SnakesLadder :no-of-players="2" ref="snakeBoardRef" />
      <div class="restart" v-if="!!snakeBoardRef?.gameEnded">
        <span class="win-text"
          >Player {{ snakeBoardRef?.currentPlayerIndex + 1 }} Won</span
        >
        <button @click="restart">Restart Game</button>
      </div>
    </div>
    <div id="game-progress">
      <div class="game-status">
        <div>Game Started: {{ snakeBoardRef?.gameStarted }}</div>
        <div>Game Over: {{ snakeBoardRef?.gameEnded }}</div>
        <div>Last Roll: {{ snakeBoardRef?.rolled }}</div>
      </div>
      <div class="players">
        <div
          v-for="(player, index) in Object.values(snakeBoardRef?.players ?? {})"
          class="player"
          :class="{ active: snakeBoardRef?.currentPlayerIndex === index }"
          :key="index"
        >
          <span>Player {{ index + 1 }}</span>
          <svg width="300" height="130" xmlns="http://www.w3.org/2000/svg">
            <rect
              width="40"
              height="40"
              x="10"
              y="10"
              rx="20"
              ry="20"
              :fill="playerColors[index]"
            />
          </svg>
          <span>Position: {{ player.step }}</span>
        </div>
      </div>

      <div class="actions" :class="{ disabled: snakeBoardRef?.disabled }">
        <button class="btn-primary" @click="rollDice">Roll a dice</button>
        <button class="btn-secondary" @click="restart">Restart Game</button>
      </div>
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
  position: relative;
}

.restart {
  position: absolute;
  background-color: #dadada;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.win-text {
  font-size: 32px;
}

.restart button {
  padding: 4px;
  margin: 4px;
  color: #363636;
  background-color: #00b2a9;
  outline: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 28px;
}

#game-progress {
  display: flex;
  flex-direction: column;
  flex: 0.5;
  gap: 12px;
  align-self: center;
}
.btn-primary {
  color: #fff;
  background-color: blue;
  padding: 8px;
  outline: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-secondary {
  color: #363636;
  background-color: skyblue;
  padding: 8px;
  outline: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.players {
  display: flex;
  gap: 12px;
}

.player {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #00a3e1;
  padding: 4px;
  border-radius: 8px;
}

.player.active {
  background-color: #009a17;
  animation: bounceScale 0.4s ease-in;
}

.actions {
  display: flex;
  gap: 12px;
  align-self: center;
}

.actions.disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

@keyframes bounceScale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.game-status {
  display: flex;
  justify-content: space-between;
}
</style>
