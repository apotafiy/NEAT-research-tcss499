const normalizeHue = (hue) => Math.min(1, hue / 360);

const normalizeDistance = (distance) => Math.min(1, distance / params.CANVAS_SIZE);

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

            if (inMap.get(outId) === 0 && id !== outId) {
                nodeQueue.push(outId);
            }
        });
    }

    if (sortedNodes.length !== nodes.size) { // cycle detected
        return false;
    }

    return sortedNodes;
};

// const detectCycle = (nodes, edges, newEdge) => {

//     console.log(newEdge)

//     const dfs = (nodes, edges, visited, currNodeId) => {
//         visited.add(currNodeId);
//         console.log(visited)
//         nodes.get(currNodeId).outIds.forEach(outId => {
//             let edge = edges.get([currNodeId, outId])[0]; // we take the first index because all other duplicate edges produce the same result
//             if (!edge.isCyclic && !(visited.has(outId))) {
//                 return false || dfs(nodes, edges, visited, outId);
//             } else {
//                 return true;
//             }
//         });
//     };

//     return dfs(nodes, edges, new Set(), newEdge.in);
// };
