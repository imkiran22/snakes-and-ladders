<script setup lang="ts">
import useGameProgress from "../composables/useGameProgress";

const { noOfPlayers } = defineProps<{
  noOfPlayers: number;
}>();

const {
  handler,
  restart,
  getActiveClass,
  activeSnake,
  rows,
  gameStarted,
  gameEnded,
  rolled,
  currentPlayerIndex,
  players,
  disabled,
} = useGameProgress(noOfPlayers);

defineExpose({
  handler,
  restart,
  gameStarted,
  gameEnded,
  rolled,
  currentPlayerIndex,
  players,
  disabled,
});
</script>

<template>
  <div class="container">
    <div class="wrapper">
      <canvas id="canvas" width="800" height="800"></canvas>
      <div id="snake-board">
        <div class="row" v-for="(row, rowIndex) in rows" :key="rowIndex">
          <div
            class="column"
            :class="[
              getActiveClass(col),
              { 'snake-highlight': activeSnake === col },
            ]"
            v-for="col in row"
            :key="col"
            :id="col.toString()"
          >
            <div class="text">{{ col }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.wrapper {
  position: relative;
}

#canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

#snake-board {
  width: 800px;
  height: 800px;
  display: flex;
  flex-direction: column-reverse;
}

#snake-board .row {
  display: flex;
  height: inherit;
}

#snake-board .column {
  flex: 1;
  text-align: center;
}

#snake-board .column .text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
  height: 100%;
}

/* Reverse direction for even rows to match Snakes & Ladders layout */
#snake-board .row:nth-child(even) {
  flex-direction: row-reverse;
}

/* Alternating Row Colors */
#snake-board .row > .column:nth-child(odd) {
  background-color: #a1000e;
  color: #f0e2b6;
}

#snake-board .row > .column:nth-child(even) {
  background-color: #cdc4aa;
  color: #a1000e;
}

#snake-board .row > .column.active-1 {
  background-color: #aadb1e;
}

#snake-board .row > .column.active-2 {
  background-color: #fe5000;
}

#snake-board .row > .column.active-3 {
  background-color: #ffc600;
}

#snake-board .row > .column.active-more {
  background-color: #9b945f;
}

@keyframes pulse {
  0% {
    background-color: #ed1d24;
    box-shadow: 0 0 10px rgba(237, 29, 36, 0.7);
  }
  50% {
    background-color: #ff474d;
    box-shadow: 0 0 20px rgba(237, 29, 36, 1);
  }
  100% {
    background-color: #ed1d24;
    box-shadow: 0 0 10px rgba(237, 29, 36, 0.7);
  }
}

#snake-board .row > .column.snake-highlight {
  animation: pulse 0.4s infinite ease-in-out;
}
</style>
