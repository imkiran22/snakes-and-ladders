<script setup lang="ts">
import { onMounted } from "vue";

defineProps<{}>();

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

// Function to draw ladders using Canvas
const drawLadders = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;

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

// Ensure elements are rendered before drawing ladders
onMounted(() => {
  setTimeout(drawLadders, 300); // Small delay to ensure all elements are positioned
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
  border: 1px solid darkcyan;
  display: flex;
  flex-direction: column-reverse;
}

#snake-board .row {
  display: flex;
  height: inherit;
}

#snake-board .column {
  border: 1px solid darkcyan;
  flex: 1;
  text-align: center;
}

#snake-board .column .text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
  color: #3e4b3c;
  height: 100%;
}

/* Reverse direction for even rows to match Snakes & Ladders layout */
#snake-board .row:nth-child(even) {
  flex-direction: row-reverse;
}

/* Alternating Row Colors */
#snake-board .row:nth-child(odd) .column {
  background-color: #e0f7da;
}

#snake-board .row:nth-child(even) .column {
  background-color: #c8e6c9;
}
</style>
