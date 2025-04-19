const distanceMap = {
  'C1-C2': 4, 'C2-C1': 4,
  'C1-C3': 5, 'C3-C1': 5,
  'C2-C3': 3, 'C3-C2': 3,
  'C1-L1': 3, 'C2-L1': 2.5, 'C3-L1': 2,
  'L1-C1': 3, 'L1-C2': 2.5, 'L1-C3': 2
};

const products = {
  A: ['C1', 3],
  B: ['C1', 2],
  C: ['C1', 8],
  D: ['C2', 12],
  E: ['C2', 25],
  F: ['C2', 15],
  G: ['C3', 0.5],
  H: ['C3', 1],
  I: ['C3', 2]
};

function deliveryCost(weight, distance) {
  if (weight <= 5) return 10 * distance;
  const extra = weight - 5;
  const blocks = Math.ceil(extra / 5);
  return distance * (10 + blocks * 8);
}

function getPermutations(arr) {
  if (arr.length === 0) return [[]];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = getPermutations(rest);
    perms.forEach(p => result.push([arr[i], ...p]));
  }
  return result;
}

function getAllRoutes(centers) {
  const routes = [];
  const perms = getPermutations(centers);
  for (const perm of perms) {
    const n = perm.length;
    const options = Math.pow(2, n);
    for (let mask = 0; mask < options; mask++) {
      const route = [];
      for (let i = 0; i < n; i++) {
        route.push(perm[i]);
        if ((mask >> i) & 1) route.push('L1');
      }
      route.push('L1');
      routes.push(route);
    }
  }
  return routes;
}

function calculateCost(order) {
  const centerWeight = { C1: 0, C2: 0, C3: 0 };
  for (const item in order) {
    const [center, weight] = products[item];
    centerWeight[center] += order[item] * weight;
  }

  const required = ['C1', 'C2', 'C3'].filter(c => centerWeight[c] > 0);
  const routes = getAllRoutes(required);
  let minCost = Infinity;

  for (const route of routes) {
    let cost = 0;
    let onboard = 0;
    const picked = new Set();

    for (let i = 0; i < route.length - 1; i++) {
      const u = route[i];
      const v = route[i + 1];

      if (u in centerWeight && !picked.has(u)) {
        onboard += centerWeight[u];
        picked.add(u);
      }

      if (u === 'L1') {
        onboard = 0;
      }

      const dist = distanceMap[`${u}-${v}`];
      if (dist !== undefined) {
        cost += deliveryCost(onboard, dist);
      }
    }

    minCost = Math.min(minCost, cost);
  }

  return Math.floor(minCost);
}
  
module.exports = { calculateCost };
  