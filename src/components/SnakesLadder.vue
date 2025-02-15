<script setup lang="ts">
import { onMounted } from "vue";

const {
  step = 0,
  gameEnded,
  gameStarted,
} = defineProps<{
  step: number;
  gameStarted: boolean;
  gameEnded: boolean;
}>();

// Creating the 10x10 board
const rows = Array.from({ length: 10 }, (_, rowIndex) =>
  Array.from({ length: 10 }, (_, colIndex) => rowIndex * 10 + (colIndex + 1))
);

// Define ladders (start and end positions on board)
const ladders = [
  { start: 1, end: 38 },
  { start: 4, end: 14 },
  { start: 8, end: 30 },
  { start: 21, end: 42 },
  { start: 28, end: 76 },
  { start: 50, end: 67 },
  { start: 71, end: 92 },
  { start: 80, end: 99 },
];

// Define ladders (start and end positions on board)
const snakes = [
  { start: 32, end: 10 },
  { start: 36, end: 6 },
  { start: 48, end: 26 },
  { start: 62, end: 18 },
  { start: 88, end: 24 },
  { start: 95, end: 56 },
  { start: 97, end: 78 },
];

// Function to draw ladders using Canvas
const drawLadders = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#008AD8";
  ctx.lineWidth = 3;

  ladders.forEach(({ start, end }) => {
    const startCell = document.getElementById(start.toString());
    const endCell = document.getElementById(end.toString());

    if (!startCell || !endCell) {
      console.warn(`Missing cell(s) for ladder: ${start} → ${end}`);
      return; // Skip if cells are missing
    }

    // Get exact positions of cells
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const boardRect = canvas.getBoundingClientRect();

    // Convert positions relative to the canvas
    const startX = startRect.left - boardRect.left + startRect.width / 2;
    const startY = startRect.top - boardRect.top + startRect.height / 2;
    const endX = endRect.left - boardRect.left + endRect.width / 2;
    const endY = endRect.top - boardRect.top + endRect.height / 2;

    const offset = 20; // Space between ladder rails

    // Draw ladder rails
    ctx.beginPath();
    ctx.moveTo(startX - offset, startY);
    ctx.lineTo(endX - offset, endY);
    ctx.moveTo(startX + offset, startY);
    ctx.lineTo(endX + offset, endY);
    ctx.stroke();

    // Draw ladder steps
    const distance = Math.hypot(endX - startX, endY - startY);
    const stepCount = Math.max(5, Math.round(distance / 40));

    for (let i = 0; i <= stepCount; i++) {
      const stepX1 = startX - offset + (endX - startX) * (i / stepCount);
      const stepY1 = startY + (endY - startY) * (i / stepCount);
      const stepX2 = startX + offset + (endX - startX) * (i / stepCount);
      const stepY2 = startY + (endY - startY) * (i / stepCount);

      ctx.beginPath();
      ctx.moveTo(stepX1, stepY1);
      ctx.lineTo(stepX2, stepY2);
      ctx.stroke();
    }
  });
};

const drawSnakes = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.strokeStyle = "#95C21B";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";

  snakes.forEach(({ start, end }) => {
    const startCell = document.getElementById(start.toString());
    const endCell = document.getElementById(end.toString());

    if (!startCell || !endCell) {
      console.warn(`Missing cell(s) for snake: ${start} → ${end}`);
      return;
    }

    // Get positions of cells
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const boardRect = canvas.getBoundingClientRect();

    const startX = startRect.left - boardRect.left + startRect.width / 2;
    const startY = startRect.top - boardRect.top + startRect.height / 2;
    const endX = endRect.left - boardRect.left + endRect.width / 2;
    const endY = endRect.top - boardRect.top + endRect.height / 2;

    // **🐍 Smooth Snaking Motion**
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    const segments = 6; // More segments = smoother curves
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const midX = startX + (endX - startX) * t;
      const midY = startY + (endY - startY) * t;

      const waveOffset = (i % 2 === 0 ? 1 : -1) * 50; // Larger offset for a more natural wave

      ctx.bezierCurveTo(
        midX + waveOffset,
        midY - waveOffset,
        midX - waveOffset,
        midY + waveOffset,
        midX,
        midY
      );
    }

    ctx.lineTo(endX, endY);
    ctx.stroke();

    // **🐍 Snake Head**
    ctx.beginPath();
    ctx.arc(startX, startY, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#03B303";
    ctx.fill();
    ctx.stroke();

    // **👀 Eyes**
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(startX - 4, startY - 5, 2.5, 0, Math.PI * 2);
    ctx.arc(startX + 4, startY - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // **🖤 Pupils**
    ctx.fillStyle = "#b30018";
    ctx.beginPath();
    ctx.arc(startX - 4, startY - 5, 1, 0, Math.PI * 2);
    ctx.arc(startX + 4, startY - 5, 1, 0, Math.PI * 2);
    ctx.fill();
  });
};

// Ensure elements are rendered before drawing ladders
onMounted(() => {
  setTimeout(() => {
    drawLadders();
    drawSnakes();
  }, 300); // Small delay to ensure all elements are positioned
});

const getActive = (col: number) => {
  return step === col;
};
</script>

<template>
  <div class="container" :class="{ disabled: !gameStarted || gameEnded }">
    <div class="wrapper">
      <canvas id="canvas" width="800" height="800"></canvas>
      <div id="snake-board">
        <div class="row" v-for="(row, rowIndex) in rows" :key="rowIndex">
          <div
            class="column"
            :class="{ active: getActive(col) }"
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
  opacity: 0.5;
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
  border: 1px solid #6e0d10;
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
  background-color: #b30018;
  color: #dbe2e9;
}

#snake-board .row > .column:nth-child(even) {
  background-color: #dbe2e9;
  color: #b30018;
}

#snake-board .row > .column.active {
  background-color: #e6a519;
}
</style>
