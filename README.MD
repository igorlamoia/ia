# This is a repository for my IA studies

## Algorithms to solve Puzzle problems

<!-- put a link to scroll to 8-Puzzle Problem -->

<p align="center">
 <a href="#the-water-jar-puzzle"> The Water Jar puzzle </a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#8-puzzle-puzzle"> 8-Puzzle Puzzle </a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#runing">Run</a>
</p>

# The Water Jar puzzle

I have the following codes inside algorithms:

- BREADTH-FIRST SEARCH (Busca em largura) - [aima-pseudocode](https://github.com/aimacode/aima-pseudocode/blob/master/md/Breadth-First-Search.md)
  `npm run bfs`
  Olhando sempre para primeira posição inserida na fila (FIFO), garantindo a busca em largura
- DEPTH-LIMITED-SEARCH (Busca em profundidade LIMITADA) - [aima-pseudocode](https://github.com/aimacode/aima-pseudocode/blob/master/md/Depth-Limited-Search.md)
  `npm run dls`
  Always looking at the last position inserted in the frontier (LIFO), guaranteeing the search in depth

![problem](https://github.com/igorlamoia/ia/blob/main/algorithms/assets/jars.png?raw=true)

My solution explanaition:

![problem](https://github.com/igorlamoia/ia/blob/main/algorithms/assets/for-solution.png?raw=true)

Simulation of breadth:

![problem](https://github.com/igorlamoia/ia/blob/main/algorithms/assets/simulacao-breadth.png?raw=true)

Simulation of depth:

![problem](https://github.com/igorlamoia/ia/blob/main/algorithms/assets/simulacao-depth.png?raw=true)

Just switching from FIFO to LIFO I can get a depth search, adding the depth parameter (deapth) I get a limited depth avoiding infinite loops

In the code: simply changing `frontier.shift()` to `frontier.pop()` would change the behavior of your search algorithm from Breadth-First Search (BFS) to a Depth-First Search (DFS) approach. But it won't make it a Depth-Limited Search (DLS) specifically.

Here's a quick breakdown of the difference:

1. **BFS (Breadth-First Search)**: Explores all sibling nodes before moving on to the child nodes. It uses a frontier, and the oldest element in the frontier is dequeued first (`frontier.shift()`).

2. **DFS (Depth-First Search)**: Explores as far down one path as possible before backtracking. It uses a stack, and the newest element in the stack is popped first (`frontier.pop()`).

3. **DLS (Depth-Limited Search)**: This is DFS with a limit on the depth to which the algorithm will explore. It is beneficial when you want to avoid the risk of getting stuck in infinite loops or taking too long in highly connected graphs.

To implement Depth-Limited Search, you would not only change `frontier.shift()` to `frontier.pop()` but also introduce a "depth" variable to keep track of how deep you've gone into your search tree. If a node reaches a maximum allowable depth, it should not generate new child states.

This should give you a Depth-Limited Search based on your existing Breadth-First Search code. Here's a sample change you could make:

```typescript
type Queue = {
  node: Node;
  steps: Node[];
  depth: number; // <-- Add a depth variable here
};

// ... other code ...

// Initial node
frontier.push({ node: [8, 0, 0], steps: [], depth: 0 }); // <-- Initialize depth to 0

const MAX_DEPTH = 10; // Set some maximum depth

while (frontier.length > 0) {
  let {
    node: currentNode,
    steps: currentSteps,
    depth: currentDepth,
  } = frontier.pop()!; // <-- Changed to pop

  // ... other code ...

  if (currentDepth < MAX_DEPTH) {
    // <-- Check the depth before generating new states
    newNodes.forEach((newNode) => {
      if (!explored.has(hashState(newNode))) {
        frontier.push({
          node: newNode,
          steps: [...currentSteps, newNode],
          depth: currentDepth + 1, // <-- Increment the depth
        });
      }
    });
  }

  // ... other code ...
}
```

<p align="center">
 <a href="#the-water-jar-puzzle"> The Water Jar puzzle </a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#8-puzzle-puzzle"> 8-Puzzle Puzzle</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#runing">Run</a>
</p>

# 8-Puzzle Puzzle

[problem](https://www.geeksforgeeks.org/check-instance-8-puzzle-solvable/)

![problem](https://media.geeksforgeeks.org/wp-content/cdn-uploads/8puzzle.png)

[Slides](http://aima.eecs.berkeley.edu/slides-pdf/chapter04a.pdf)

![problem](https://github.com/igorlamoia/ia/blob/main/algorithms/assets/for-puzzle-solution.png?raw=true)

Using A\* to solve, sorting the frontier for each iteration

```typescript
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

// ....
while (frontier.length > 0) {
  frontier.sort((a, b) => calculateTotalCost(a) - calculateTotalCost(b));
  const currentState = frontier.shift()!;
  // ... rest
}
```

Result:
![problem](https://github.com/igorlamoia/ia/blob/main/algorithms/assets/resultado_8-puzzle.png?raw=true)

<p align="center">
 <a href="#the-water-jar-puzzle"> The Water Jar puzzle </a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#8-puzzle-puzzle"> 8-Puzzle Puzzle </a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#runing">Run</a>
</p>

# Runing

`cd algorithms`

`npm run bfs` or `npm run dls`

`npm run 8` to run 8-puzzle
