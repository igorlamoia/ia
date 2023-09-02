type State = [number, number, number];
type Queue = {
  state: State;
  steps: State[];
};
const NUM_JARRAS = 3;
const targetState = [4, 4, 0];
const capacities = [8, 5, 3];
let visitedStates = new Set();
let queue: Queue[] = [] as Queue[];

function hashState(state: State) {
  return state.join(",");
}

function isTargetState(state: State): boolean {
  for (let i = 0; i < NUM_JARRAS; i++) {
    if (state[i] !== targetState[i]) return false;
  }
  return true;
}

function generateNewStates(currentState: State): State[] {
  let newStates = [] as State[];
  for (let i = 0; i < NUM_JARRAS; i++) {
    for (let j = 0; j < NUM_JARRAS; j++) {
      // garante não despejar em sí mesmo
      if (i !== j) {
        let newState = [...currentState];
        // O resultado da comparação entre esses dois valores é a quantidade máxima de água que pode ser despejada da jarra de índice i para a jarra de índice j sem exceder a capacidade da jarra de destino.
        let amount = Math.min(newState[i], capacities[j] - newState[j]);
        newState[i] -= amount;
        newState[j] += amount;
        newStates.push(newState as State);
        // 6 estados são gerados, pois 3*3 = 9 - [0,0,0; 1,1,1; 2,2,2] = 6
      }
    }
  }
  return newStates;
}

// Initial state
queue.push({ state: [8, 0, 0], steps: [] });

console.log("Initial Queue");
console.table(queue);

while (queue.length > 0) {
  console.count("Rodada:");
  let { state: currentState, steps: currentSteps } = queue.shift()!;
  visitedStates.add(hashState(currentState));

  if (isTargetState(currentState)) {
    console.log("Found solution: ", currentSteps);
    break;
  }

  let newStates = generateNewStates(currentState);

  console.log("Current");
  console.table({ state: currentState, stapes: currentSteps });
  console.log("Fila Inicial");
  console.table(
    queue.map((item) => ({
      ...item,
      steps: JSON.stringify(item.steps),
    }))
  );

  newStates.forEach((newState) => {
    if (!visitedStates.has(hashState(newState))) {
      queue.push({
        state: newState,
        steps: [...currentSteps, newState],
      });
    }
  });

  console.log("Visited");
  console.table(visitedStates);
  console.log("newStates");
  console.table(newStates);
  console.log("Fila Final");
  console.table(
    queue.map((item) => ({
      ...item,
      steps: JSON.stringify(item.steps),
    }))
  );

  console.log("\n\n");
}
