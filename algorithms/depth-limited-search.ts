function dls() {
  type Node = [number, number, number];
  type Queue = {
    node: Node;
    steps: Node[];
    depth: number;
  };
  const JARS_NUMBER = 3;
  const MAX_DEPTH = 10; // Set some maximum depth
  const INITIAL_STATE: Queue = { node: [8, 0, 0], steps: [], depth: 0 };
  const targetState = [4, 4, 0];
  const capacities = [8, 5, 3];
  let explored = new Set();
  const frontier = [] as Queue[];

  function hashState(node: Node) {
    return node.join(",");
  }

  function goalTest(node: Node): boolean {
    for (let i = 0; i < JARS_NUMBER; i++) {
      if (node[i] !== targetState[i]) return false;
    }
    return true;
  }

  function generateNewStates(currentNode: Node): Node[] {
    let newNodes = [] as Node[];
    for (let i = 0; i < JARS_NUMBER; i++) {
      for (let j = 0; j < JARS_NUMBER; j++) {
        // garante não despejar em sí mesmo
        if (i !== j) {
          let newNode = [...currentNode];
          // O resultado da comparação entre esses dois valores é a quantidade máxima de água que pode ser despejada da jarra de índice i para a jarra de índice j sem exceder a capacidade da jarra de destino.
          let amount = Math.min(newNode[i], capacities[j] - newNode[j]);
          newNode[i] -= amount;
          newNode[j] += amount;
          newNodes.push(newNode as Node);
          // 6 estados são gerados, pois 3*3 = 9 - [0,0,0; 1,1,1; 2,2,2] = 6
        }
      }
    }
    return newNodes;
  }

  // Initial node
  frontier.push(INITIAL_STATE);

  console.log("Initial Queue");
  console.table(frontier);

  while (frontier.length > 0) {
    console.count("Path  cost:");
    const {
      node: currentNode,
      steps: currentSteps,
      depth: currentDepth,
    } = frontier.pop()!;
    explored.add(hashState(currentNode));

    if (goalTest(currentNode)) {
      console.log("Found solution: ", currentSteps);
      break;
    }

    let newNodes = generateNewStates(currentNode);

    console.log("Current");
    console.table({ node: currentNode, steps: currentSteps });
    console.log("Initial Queue");
    console.table(
      frontier.map((item) => ({
        ...item,
        steps: JSON.stringify(item.steps),
      }))
    );

    // <-- Check the depth before generating new states
    if (currentDepth < MAX_DEPTH) {
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
    console.log("Visited");
    console.table(explored);
    console.log("newNodes");
    console.table(newNodes);
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
