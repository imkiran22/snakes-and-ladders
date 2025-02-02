<script setup lang="ts">
defineProps<{}>();

const rows = Array.from({ length: 10 }, (_, rowIndex) =>
  Array.from({ length: 10 }, (_, colIndex) => rowIndex * 10 + (colIndex + 1))
);
</script>

<template>
  <div class="container">
    <div id="canvas"></div>
    <div id="snake-board">
      <div class="row" v-for="row in rows">
        <div class="column" v-for="col in row" :id="col.toString()">
          <div class="text">{{ col }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  justify-self: center;
  align-items: center;
}

#canvas {
  width: 600px;
  height: 600px;
  border: 1px solid purple;
  position: absolute;
}

#snake-board {
  width: 600px;
  height: 600px;
  border: 1px solid purple;
  display: flex;
  flex-direction: column-reverse;
}

#snake-board .row {
  display: flex;
  height: 100%;
}

#snake-board .column {
  border: 1px solid blue;
  flex: 1;
  text-align: center;
}

#snake-board .column .text {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: antiquewhite;
}

#snake-board .row:nth-child(even) {
  flex-direction: row-reverse;
}
</style>
