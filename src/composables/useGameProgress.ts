import { computed, onMounted, ref } from "vue";

export default function useGameProgress(noOfPlayers: number) {
  const rolled = ref(0);
  const currentPlayerIndex = ref(0);
  const dicesList = [1, 2, 3, 4, 5, 6];
  const gameStarted = ref(false);
  const gameEnded = ref(false);
  const rolling = ref(false);

  const players = ref<Record<string, { step: number; started: boolean }>>(
    Object.fromEntries(
      Array.from({ length: noOfPlayers }, (_, index) => [
        index,
        { step: 0, started: false },
      ])
    )
  );

  const playerSteps = computed(() =>
    Object.values(players.value).map((d) => d.step)
  );

  const isMoving = ref(false); // Prevents multiple triggers

  const activeSnake = ref<number | null>(null); // Stores the snake being animated

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
    ctx.strokeStyle = "#3C5291";
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

    ctx.strokeStyle = "#F20F5A";
    ctx.lineWidth = 3;
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
      ctx.fillStyle = "#A60A3D";
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

  const getActiveClass = (col: number) => {
    const classes: Array<string> = [];
    let count = 0;
    playerSteps.value.forEach((pl, index) => {
      if (pl === col) {
        classes.push(`active-${index + 1}`);
        count += 1;
      }
    });

    // More than one player at same position
    if (count > 1) {
      classes.push("active-more");
    }
    return classes.join(" ");
  };

  const rotatePlayer = () => {
    let temp = currentPlayerIndex.value + 1;
    if (temp >= noOfPlayers) {
      currentPlayerIndex.value = 0;
    } else {
      currentPlayerIndex.value = temp;
    }
  };

  const animateMovement = (
    currentStep: number,
    endStep: number,
    isSnake: boolean
  ) => {
    return new Promise((resolve) => {
      if (isMoving.value) return; // Prevent multiple animations

      isMoving.value = true; // Lock movement
      activeSnake.value = isSnake ? currentStep : null; // Highlight only if snake

      const moveStep = (step: number) => {
        if ((isSnake && step > endStep) || (!isSnake && step < endStep)) {
          setTimeout(() => {
            players.value[currentPlayerIndex.value].step = isSnake
              ? step - 1
              : step + 1;
            moveStep(isSnake ? step - 1 : step + 1);
          }, 100); // Adjust speed
        } else {
          isMoving.value = false; // Unlock movement
          activeSnake.value = null; // Remove snake highlight
          resolve(true);
        }
      };

      moveStep(currentStep);
    });
  };

  const changeCallback = async (newStep: number) => {
    if (isMoving.value) return; // Ignore updates if already moving

    const snake = snakes.find((s) => s.start === newStep);
    const ladder = ladders.find((l) => l.start === newStep);

    if (snake) {
      console.log(
        `🐍 Oh no! You landed on a snake at ${snake.start}. Moving to ${snake.end}`
      );
      activeSnake.value = snake.start; // Highlight only this snake
      await animateMovement(snake.start, snake.end, true);
    } else if (ladder) {
      console.log(`🪜 Climbing ladder from ${ladder.start} to ${ladder.end}`);
      await animateMovement(ladder.start, ladder.end, false);
    }
  };

  let rollInterval: number;
  const currentNumber = ref(1);

  const handler = async () => {
    if (rolling.value) return;

    rolling.value = true;

    rollInterval = setInterval(() => {
      const index = Math.floor(Math.random() * dicesList.length);
      currentNumber.value = dicesList[index];
    }, 100);

    // Stop rolling after 2 seconds
    setTimeout(async () => {
      clearInterval(rollInterval);
      setTimeout(() => {
        rolling.value = false;
      }, 300);

      const value = currentNumber.value;
      rolled.value = currentNumber.value;
      // alert("Current rolled is " + value);

      let tempIndex = currentPlayerIndex.value;
      const { step, started } = players.value[tempIndex];

      if (started) {
        if (step + value > 100) {
          isMoving.value = true;
          setTimeout(() => {
            if (![6, 1].includes(value)) {
              rotatePlayer();
            }
            isMoving.value = false;
          }, 500);
          return;
        }

        if (step + value === 100) {
          players.value[tempIndex].step = 100;
          gameEnded.value = true;
          return;
        }

        players.value[tempIndex].step = step + value;
        await changeCallback(step + value);

        // If it is a ladder or snake wait
        isMoving.value = true;
        setTimeout(() => {
          if (![6, 1].includes(value)) {
            rotatePlayer();
          }
          isMoving.value = false;
        }, 500);
      } else {
        if (value === 1) {
          players.value[tempIndex].started = true;
          players.value[tempIndex].step = 0;
        } else {
          isMoving.value = true;
          setTimeout(() => {
            rotatePlayer();
            isMoving.value = false;
          }, 500);
        }
      }
    }, 2000);
  };

  function restart() {
    gameStarted.value = false;
    gameEnded.value = false;
    players.value = Object.fromEntries(
      Array.from({ length: noOfPlayers }, (_, index) => [
        index,
        { step: 0, started: false },
      ])
    );
    rolled.value = 0;
  }

  const disabled = computed(() => {
    return isMoving.value === true;
  });

  return {
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
    currentNumber,
    rolling,
  };
}
