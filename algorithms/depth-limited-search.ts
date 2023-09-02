function dls() {
  type State = [number, number, number];
  type Queue = {
    state: State;
    steps: State[];
    depth: number;
  };
  const JARS_NUMBER = 3;
  const MAX_DEPTH = 10; // Set some maximum depth
  const INITIAL_STATE: Queue = { state: [8, 0, 0], steps: [], depth: 0 };
  const targetState = [4, 4, 0];
  const capacities = [8, 5, 3];
  let explored = new Set();
  const frontier = [] as Queue[];

  function hashState(state: State) {
    return state.join(",");
  }

  function goalTest(state: State): boolean {
    for (let i = 0; i < JARS_NUMBER; i++) {
      if (state[i] !== targetState[i]) return false;
    }
    return true;
  }

  function generateNewStates(currentState: State): State[] {
    let newStates = [] as State[];
    for (let i = 0; i < JARS_NUMBER; i++) {
      for (let j = 0; j < JARS_NUMBER; j++) {
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
  frontier.push(INITIAL_STATE);

  console.log("Initial Queue");
  console.table(frontier);

  while (frontier.length > 0) {
    console.count("Round:");
    const {
      state: currentState,
      steps: currentSteps,
      depth: currentDepth,
    } = frontier.pop()!;
    explored.add(hashState(currentState));

    if (goalTest(currentState)) {
      console.log("Found solution: ", currentSteps);
      break;
    }

    let newStates = generateNewStates(currentState);

    console.log("Current");
    console.table({ state: currentState, stapes: currentSteps });
    console.log("Initial Queue");
    console.table(
      frontier.map((item) => ({
        ...item,
        steps: JSON.stringify(item.steps),
      }))
    );

    // <-- Check the depth before generating new states
    if (currentDepth < MAX_DEPTH) {
      newStates.forEach((newState) => {
        if (!explored.has(hashState(newState))) {
          frontier.push({
            state: newState,
            steps: [...currentSteps, newState],
            depth: currentDepth + 1, // <-- Increment the depth
          });
        }
      });
    }
    console.log("Visited");
    console.table(explored);
    console.log("newStates");
    console.table(newStates);
    console.log("Final Queue");
    console.table(
      frontier.map((item) => ({
        ...item,
        steps: JSON.stringify(item.steps),
      }))
    );

    console.log("\n\n");
  }
}
dls();
