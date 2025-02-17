<script setup lang="ts">
import { computed } from "vue";

defineProps<{
  gameStarted: boolean;
  gameEnded: boolean;
  rolled: number;
  players: Record<string, { step: number; started: boolean }>;
  currentPlayerIndex: number;
  playerColors: string[];
  rollDice: () => void;
  restart: () => void;
  disabled: boolean;
}>();

const playersList = computed(() => Object.values(players ?? {}));
</script>

<template>
  <div id="game-progress">
    <div class="game-status">
      <div>Game Started: {{ gameStarted }}</div>
      <div>Game Over: {{ gameEnded }}</div>
      <div>Last Roll: {{ rolled }}</div>
    </div>
    <div class="players">
      <div
        v-for="(player, index) in playersList"
        class="player"
        :class="{ active: currentPlayerIndex === index }"
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

    <div class="actions" :class="{ disabled: disabled }">
      <button class="btn-primary" @click="rollDice">Roll a dice</button>
      <button class="btn-secondary" @click="restart">Restart Game</button>
    </div>
  </div>
</template>

<style scoped>
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
  animation: bounceScale 0.2s ease-in;
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
    transform: scale(1.1);
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
