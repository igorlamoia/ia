type CityInfo = {
  [key: string]: number;
};

type Edge = {
  city1: string;
  city2: string;
  distance: number;
};

type AdjacencyList = {
  [key: string]: Array<{ city: string; distance: number }>;
};

type PathInfo = {
  [key: string]: string | null;
};

type VisitedInfo = {
  [key: string]: number;
};

class PriorityQueue {
  private cities: Array<[number, string]>;

  constructor() {
    this.cities = [];
  }

  push(city: string, cost: number): void {
    this.cities.push([cost, city]);
    this.cities.sort((a, b) => a[0] - b[0]);
  }

  pop(): string {
    return this.cities.shift()![1];
  }

  isEmpty(): boolean {
    return this.cities.length === 0;
  }
}

class Graph {
  private adjacencyList: AdjacencyList;

  constructor() {
    this.adjacencyList = {};
  }

  addEdge(city1: string, city2: string, distance: number): void {
    if (!this.adjacencyList[city1]) {
      this.adjacencyList[city1] = [];
    }
    this.adjacencyList[city1].push({ city: city2, distance });

    if (!this.adjacencyList[city2]) {
      this.adjacencyList[city2] = [];
    }
    this.adjacencyList[city2].push({ city: city1, distance });
  }

  aStar(start: string, goal: string, heuristic: CityInfo): void {
    const path: PathInfo = {};
    const visited: VisitedInfo = {};
    const pq = new PriorityQueue();
    pq.push(start, 0);
    visited[start] = 0;
    path[start] = null;

    while (!pq.isEmpty()) {
      const current = pq.pop();

      if (current === goal) {
        break;
      }

      this.adjacencyList[current].forEach((neighbor) => {
        const gCost = visited[current] + neighbor.distance;
        if (!visited[neighbor.city] || gCost < visited[neighbor.city]) {
          visited[neighbor.city] = gCost;
          const fCost = gCost + heuristic[neighbor.city];
          pq.push(neighbor.city, fCost);
          path[neighbor.city] = current;
        }
      });
    }

    this.printOutput(start, goal, path, visited);
  }

  private printOutput(
    start: string,
    goal: string,
    path: PathInfo,
    visited: VisitedInfo
  ): void {
    let current = goal;
    const finalPath: string[] = [];

    while (current !== start) {
      finalPath.unshift(current);
      current = path[current]!;
    }
    finalPath.unshift(start);

    console.log(`A* Algorithm from ${start} to ${goal}`);
    console.log("Path:", finalPath.join(" => "));
    console.log("Total Cost:", visited[goal]);
  }
}

// Heuristic values (straight-line distance to Bucharest)
const heuristic: CityInfo = {
  Arad: 366,
  Bucharest: 0,
  Craiova: 160,
  Dobreta: 242,
  Eforie: 161,
  Fagaras: 176,
  Giurgiu: 77,
  Hirsova: 151,
  Iasi: 226,
  Lugoj: 244,
  Mehadia: 241,
  Neamt: 234,
  Oradea: 380,
  Pitesti: 100,
  "Rimnicu Vilcea": 193,
  Sibiu: 253,
  Timisoara: 329,
  Urziceni: 80,
  Vaslui: 199,
  Zerind: 374,
};

// Edges
const edges: Edge[] = [
  { city1: "Arad", city2: "Zerind", distance: 75 },
  { city1: "Arad", city2: "Sibiu", distance: 140 },
  { city1: "Arad", city2: "Timisoara", distance: 118 },
  { city1: "Zerind", city2: "Oradea", distance: 71 },
  { city1: "Oradea", city2: "Sibiu", distance: 151 },
  { city1: "Timisoara", city2: "Lugoj", distance: 111 },
  { city1: "Sibiu", city2: "Fagaras", distance: 99 },
  { city1: "Sibiu", city2: "Rimnicu Vilcea", distance: 80 },
  { city1: "Lugoj", city2: "Mehadia", distance: 70 },
  { city1: "Fagaras", city2: "Bucharest", distance: 211 },
  { city1: "Rimnicu Vilcea", city2: "Pitesti", distance: 97 },
  { city1: "Rimnicu Vilcea", city2: "Craiova", distance: 146 },
  { city1: "Mehadia", city2: "Dobreta", distance: 75 },
  { city1: "Bucharest", city2: "Pitesti", distance: 101 },
  { city1: "Bucharest", city2: "Urziceni", distance: 85 },
  { city1: "Bucharest", city2: "Giurgiu", distance: 90 },
  { city1: "Pitesti", city2: "Craiova", distance: 138 },
  { city1: "Craiova", city2: "Dobreta", distance: 120 },
  { city1: "Urziceni", city2: "Hirsova", distance: 98 },
  { city1: "Urziceni", city2: "Vaslui", distance: 142 },
  { city1: "Hirsova", city2: "Eforie", distance: 86 },
  { city1: "Vaslui", city2: "Iasi", distance: 92 },
  { city1: "Iasi", city2: "Neamt", distance: 87 },
];

// Graph initialization
const graph = new Graph();
edges.forEach((edge) => graph.addEdge(edge.city1, edge.city2, edge.distance));

// Run A* Algorithm
graph.aStar("Arad", "Bucharest", heuristic);
