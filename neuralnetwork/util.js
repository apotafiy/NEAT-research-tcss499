const normalizeHue = (hue) => Math.min(1, hue / 360);

const normalizeAngle = (a) => a < 0 ? -1 - a / 360 : 1 - a / 360;

const normalizeDistance = (distance) => 1 - Math.min(1, distance / Math.sqrt(2 * params.CANVAS_SIZE ** 2));

const normalizeX = (x) => x < 0 ? -1 - Math.max(-1, x / params.CANVAS_SIZE) : 1 - Math.min(1, x / params.CANVAS_SIZE);

const normalizeY = (y) => y < 0 ? -1 - Math.max(-1, y / params.CANVAS_SIZE) : 1 - Math.min(1, y / params.CANVAS_SIZE);

const topoSort = (nodes, edges) => {
    let inMap = new Map();
    let nodeQueue = [];
    let sortedNodes = [];
    
    nodes.forEach(node => { // map neurons to number of incoming edges
        inMap.set(node.id, 0);
        node.inIds.forEach(inId => {
            edges.get([inId, node.id]).forEach(edge => {
                if (!edge.isCyclic) {
                    inMap.set(node.id, inMap.get(node.id) + 1);
                }
            });
        });

        if (inMap.get(node.id) === 0) {
            nodeQueue.push(node.id);
        }
    });

    while (nodeQueue.length !== 0) {
        let id = nodeQueue.splice(0, 1)[0];
        sortedNodes.push(id);
        nodes.get(id).outIds.forEach(outId => {
            edges.get([id, outId]).forEach(edge => {
                if (!edge.isCyclic) {
                    inMap.set(outId, inMap.get(outId) - 1);
                }
            });

            if (inMap.get(outId) === 0 && !(sortedNodes.includes(outId))) {
                nodeQueue.push(outId);
            }
        });
    }

    if (sortedNodes.length !== nodes.size) { // cycle detected (this should never happen!)
        console.log("something went wrong");
    }

    return sortedNodes;
};

const detectCycle = (nodes, edges, newEdge) => {

    const dfs = (nodes, edges, visited, currNodeId, originID) => {
        let hasCycle = false;
        visited.add(currNodeId);
        nodes.get(currNodeId).outIds.forEach(outId => {
            let edge = edges.get([currNodeId, outId])[edges.get([currNodeId, outId]).length - 1]; // we take the last edge because it is the most recent
            if (!edge.isCyclic) {
                if (!(visited.has(outId))) {
                    hasCycle = hasCycle || dfs(nodes, edges, visited, outId, originID);
                } else if (outId === originID) {
                    hasCycle = true;
                }
            }
        });

        return hasCycle;
    };

    return dfs(nodes, edges, new Set(), newEdge.in, newEdge.in);
};
