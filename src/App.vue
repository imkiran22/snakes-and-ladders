<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import SnakesLadder from "./components/SnakesLadder.vue";
import { debounce } from "./utils/debounce";
const snakeBoardRef = ref<{
  handler: () => void;
  restart: () => void;
  gameStarted: boolean;
  gameEnded: boolean;
  rolled: number;
  currentPlayerIndex: number;
  players: Record<string, { step: number; started: boolean }>;
  disabled: boolean;
  rolling: boolean;
}>();

const rollDice = () => {
  if (snakeBoardRef.value) {
    snakeBoardRef.value?.handler();
  }
};

const restart = () => {
  if (snakeBoardRef.value) {
    alert("Game is restarted");
    // snakeBoardRef.value?.restart();
    window.location.reload();
  }
};

// Debounced version of rollDice with a 500ms delay
const debouncedRollDice = debounce(rollDice, 300);

// Debounced version of restart with a 500ms delay
const debouncedRestart = debounce(restart, 300);

const playerColors = ["#004EFF", "#fe5000", "#D62598"];
const noOfPlayers = 3;

// Function to handle keydown events
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !snakeBoardRef.value?.rolling) {
    debouncedRollDice();
  } else {
    console.log("Rolling in progress");
  }
};

const debouncedKeydown = debounce(handleKeydown, 1000);

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener("keydown", debouncedKeydown);
});

// Remove event listener before component is unmounted
onBeforeUnmount(() => {
  document.removeEventListener("keydown", debouncedKeydown);
});
</script>

<template>
  <div id="root">
    <div id="board">
      <SnakesLadder :no-of-players="noOfPlayers" ref="snakeBoardRef" />
      <div class="restart" v-if="snakeBoardRef?.gameEnded">
        <span class="win-text"
          >Player {{ snakeBoardRef?.currentPlayerIndex + 1 }} Won
          <span style="font-size: 38px">&#127881;</span></span
        >
        <button class="btn btn-secondary" @click="restart">RESTART</button>
      </div>
    </div>
    <div id="game-progress">
      <div class="game-status">
        <!-- <div>Game Started: {{ snakeBoardRef?.gameStarted }}</div>
        <div>Game Over: {{ snakeBoardRef?.gameEnded }}</div> -->
        <div class="last-roll position">
          Last Roll: {{ snakeBoardRef?.rolled }}
        </div>
      </div>
      <div class="players">
        <div
          v-for="(player, index) in Object.values(snakeBoardRef?.players ?? {})"
          class="player"
          :class="{ active: snakeBoardRef?.currentPlayerIndex === index }"
          :key="index"
        >
          <span class="player-text">Player {{ index + 1 }}</span>
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
          <span class="position">Position: {{ player.step }}</span>
        </div>
      </div>

      <div class="actions" :class="{ disabled: snakeBoardRef?.disabled }">
        <button
          class="btn btn-primary"
          :class="{ disabled: snakeBoardRef?.rolling }"
          @click="debouncedRollDice"
        >
          {{ snakeBoardRef?.rolling ? "Rolling ..." : "Roll a dice" }}
        </button>
        <button class="btn btn-secondary" @click="debouncedRestart">
          Restart Game
        </button>
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

.win-text {
  font-size: 32px;
  color: #5e5b55;
  letter-spacing: 10px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
}

.restart {
  position: absolute;
  background-color: #f5f5f5;
  opacity: 0.9;
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

#game-progress {
  display: flex;
  flex-direction: column;
  flex: 0.5;
  gap: 24px;
  align-self: center;
}

.btn {
  padding: 12px 24px;
  outline: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  color: #fff;
  background-color: #0827f5;
}
.btn-secondary {
  color: #000;
  background-color: #cdc4aa;
}

.players {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.player {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #36454f;
  padding: 4px;
  border-radius: 8px;
}

.player.active {
  background-color: #08ff08;
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
  align-self: center;
}

.position {
  background-color: #dfd7c8;
  padding: 4px;
  letter-spacing: 4px;
  font-size: 24px;
  font-weight: 600;
  align-self: center;
  margin-bottom: 8px;
  color: #5e5b55;
  border-radius: 4px;
}

.player-text {
  color: #5e5b55;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  align-self: center;
  background-color: #fe9a0a;
  padding: 4px;
  border-radius: 4px;
}

.last-roll {
  background-color: #00958a !important;
  color: whitesmoke !important;
  letter-spacing: 6px !important;
  padding: 6px 12px;
}
</style>
