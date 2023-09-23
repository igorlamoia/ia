type PuzzleType = number[][];
interface Queue {
  node: PuzzleType;
  steps: PuzzleType[];
  distance: number;
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
/**
 * Set has to be a string because of the way javascript handles objects
 * @param node
 * @returns
 */
function hashState(node: PuzzleType): string {
  return JSON.stringify(node);
}

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
/**
 * Manhattan distance heuristic
 * ## Relaxed version of the problem
 * Admissible heuristics can be derived from the exact solution cost of a **relaxed** version of the problem
 * If the rules of the 8-puzzle are relaxed so that a tile can move anywhere
 * then the number of moves required to solve a given start state is at least
 */
function manhattanDistance(node: PuzzleType): number {
  let distance = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const value = node[i][j];

      if (value !== 0) {
        const { row, col } = findTargetPosition(value);
        distance += Math.abs(i - row) + Math.abs(j - col);
      }
    }
  }

  return distance;
}

/**
 * Find the position of a given value in the target state
 * @param value The value to be found
 * @returns The position of the value in the target state (row, col)
 */
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

/**
 * f(n) = estimated total cost of path through n to goal
 * @param state
 * @returns f(n) = g(n) + h(n) (The total cost of the current state)
 */
function calculateTotalCost(state: Queue): number {
  // g(n) = cost so far to reach n (The cost to reach the current state)
  const distanceToState = state.distance;
  // h(n) = estimated cost to goal from n (The heuristic cost (Manhattan distance))
  const heuristicCost = manhattanDistance(state.node);
  return distanceToState + heuristicCost;
}
// ---- From https://www.geeksforgeeks.org/check-instance-8-puzzle-solvable/ ----
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
// ---- From https://www.geeksforgeeks.org/check-instance-8-puzzle-solvable/ ----
function isSolvable(puzzle: PuzzleType) {
  let invCount = getInvCount(puzzle);
  return invCount % 2 == 0;
}

function solve() {
  if (!isSolvable(initialState)) {
    console.log("Not Solvable :(");
    console.log(
      "To be solvable, the puzzle must have an even number of inversions. (https://www.geeksforgeeks.org/check-instance-8-puzzle-solvable/)"
    );
    return;
  }

  const frontier: Queue[] = [];
  frontier.push({
    node: initialState,
    steps: [],
    distance: 0,
  });

  const explored = new Set();

  while (frontier.length > 0) {
    frontier.sort((a, b) => calculateTotalCost(a) - calculateTotalCost(b));
    const currentState = frontier.shift()!;
    explored.add(hashState(currentState.node));

    const isGoal = goalTest(currentState.node);
    if (isGoal) {
      console.log("\n\nGoal achieved:");
      console.table(currentState.node);
      console.log("\n\nInitial State:");
      console.table(initialState);
      console.log(
        "\n\nPath/Steps: (Total steps: " + currentState.distance + ")"
      );
      currentState.steps.forEach((state) => console.table(state));
      return;
    }

    const newStates = generateNewStates(currentState.node);

    function wasAlreadyVisited(node: PuzzleType): boolean {
      return explored.has(hashState(node));
    }

    const notexplored = newStates.filter((node) => !wasAlreadyVisited(node));

    notexplored.forEach((node) => {
      frontier.push({
        node,
        steps: [...currentState.steps, node],
        distance: currentState.distance + 1,
      });
    });
  }
}
solve();
