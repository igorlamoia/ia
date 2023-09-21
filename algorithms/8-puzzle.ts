type PuzzleType = number[][];
interface Queue {
  node: PuzzleType;
  steps: PuzzleType[];
  distance: number;
}

function goalTest(node: PuzzleType): boolean {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j + 1 < 3) {
        // columns verification
        if (node[j][i] > node[j + 1][i] && node[j + 1][i] != 0) {
          return false;
        }
        // rows verification
        if (node[i][j] > node[i][j + 1] && node[i][j + 1] != 0) {
          return false;
        }
      }
    }
  }
  return true;
}

function getInvCount(puzzle: PuzzleType) {
  let inv_count = 0;
  const linear = puzzle.flat();
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 9; j++) {
      if (linear[i] > 0 && linear[j] > 0 && linear[i] > linear[j]) {
        inv_count += 1;
      }
    }
  }
  return inv_count;
}

function isSolvable(puzzle: PuzzleType) {
  let invCount = getInvCount(puzzle);
  return invCount % 2 == 0;
}

const initialState: PuzzleType = [
  [1, 8, 2],
  [0, 4, 3],
  [7, 6, 5],
];
const targetState: PuzzleType = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

function solve() {
  if (!isSolvable(initialState)) {
    console.log("Not Solvable");
    return;
  }

  const frontier: Queue[] = [];
  frontier.push({
    node: initialState,
    steps: [],
    distance: 0,
  });

  function cloneNode(node: PuzzleType): PuzzleType {
    return node.map((row) => [...row]);
  }

  function generateNewStates(node: PuzzleType): PuzzleType[] {
    const newStates: PuzzleType[] = [];
    console.log("\n\nGenerating new states from:");
    console.table(node);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (node[i][j] === 0) {
          if (i + 1 < 3) {
            const newNode = cloneNode(node);
            newNode[i][j] = node[i + 1][j];
            newNode[i + 1][j] = 0;
            console.log("(i+1) < 3, move up");
            console.table(newNode);
            newStates.push(newNode);
          }
          if (i - 1 >= 0) {
            const newNode = cloneNode(node);
            newNode[i][j] = node[i - 1][j];
            newNode[i - 1][j] = 0;
            console.log("(i-1) >= 0, move down");
            console.table(newNode);
            newStates.push(newNode);
          }
          if (j + 1 < 3) {
            const newNode = cloneNode(node);
            newNode[i][j] = node[i][j + 1];
            newNode[i][j + 1] = 0;
            console.log("(j+1) < 3, move left");
            console.table(newNode);
            newStates.push(newNode);
          }
          if (j - 1 >= 0) {
            const newNode = cloneNode(node);
            newNode[i][j] = node[i][j - 1];
            newNode[i][j - 1] = 0;
            console.log("(j-1) >= 0, move right");
            console.table(newNode);
            newStates.push(newNode);
          }
        }
      }
    }
    return newStates;
  }

  function manhattanDistance(node: PuzzleType): number {
    let distance = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = node[i][j];

        if (value !== 0) {
          const targetPosition = findTargetPosition(value);
          distance +=
            Math.abs(i - targetPosition.row) + Math.abs(j - targetPosition.col);
        }
      }
    }

    return distance;
  }

  // Find the target position for a given value
  function findTargetPosition(value: number): { row: number; col: number } {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (targetState[i][j] === value) {
          return { row: i, col: j };
        }
      }
    }

    return { row: -1, col: -1 }; // Not found
  }

  function calculateTotalCost(state: Queue): number {
    const distanceToState = state.distance; // The cost to reach the current state
    const heuristicCost = manhattanDistance(state.node); // The heuristic cost (Manhattan distance)
    return distanceToState + heuristicCost;
  }

  const visitedStates = new Set();

  while (frontier.length > 0) {
    frontier.sort((a, b) => calculateTotalCost(a) - calculateTotalCost(b));
    const currentState = frontier.shift()!;
    visitedStates.add(JSON.stringify(currentState.node));

    const isGoal = goalTest(currentState.node);
    if (isGoal) {
      console.log("\n\nGoal achieved:");
      console.table(currentState.node);
      console.log("\n\nConfiguração inicial:");
      console.table(initialState);
      console.log("\n\nCaminho:");
      currentState.steps.forEach((state) => console.table(state));
      return;
    }

    const newStates = generateNewStates(currentState.node);

    function wasAlreadyVisited(node: PuzzleType): boolean {
      return visitedStates.has(JSON.stringify(node));
    }

    const notVisitedStates = newStates.filter(
      (node) => !wasAlreadyVisited(node)
    );

    notVisitedStates.forEach((node) => {
      frontier.push({
        node,
        steps: [...currentState.steps, node],
        distance: currentState.distance + 1,
      });
    });
  }
}
solve();
