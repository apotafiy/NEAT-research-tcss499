class NeuralNet {

    constructor(genome) {
        this.genome = genome;
        this.nodes = this.genome.nodeGenes;
        this.edges = this.genome.connectionGenes;
        this.sortedNodes = this.topoSort();
    };

    processInput(input) {

        let wheels = [];
        let inputIndex = 0;

        this.sortedNodes.forEach(nodeId => {
            let currNode = this.nodes.get(nodeId);
            if (currNode.type === Genome.NODE_TYPES.input) { // assign values to input neurons
                currNode.value = input[inputIndex];
                inputIndex++;
            } else { // hidden or output neurons
                let value = 0;
                currNode.inIds.forEach(inId => {
                    this.edges.get([inId, nodeId]).forEach(connection => {
                        if (connection.isEnabled) {
                            value += this.nodes.get(inId).value * connection.weight;
                        }
                    });
                });
                currNode.value = this.sigmoid(value);
                if (currNode.type === Genome.NODE_TYPES.output) {
                    wheels.push(currNode.value);
                }
            }
        });

        return wheels;
    };

    sigmoid(x) {
        return 1 / (1 + Math.E ** -x);
    };

    topoSort() {
        let inMap = new Map();
        let nodeQueue = [];
        let sortedNodes = [];
        
        this.nodes.forEach(node => { // map neurons to number of incoming edges
            inMap.set(node.id, 0);
            node.inIds.forEach(inId => {
                inMap.set(node.id, inMap.get(node.id) + this.edges.get([inId, node.id]).length);
            });

            if (inMap.get(node.id) === 0) {
                nodeQueue.push(node.id);
            }
        });

        while (nodeQueue.length !== 0) {
            let id = nodeQueue.splice(0, 1)[0];
            sortedNodes.push(id);
            this.nodes.get(id).outIds.forEach(outId => {
                inMap.set(outId, inMap.get(outId) - 1);
                if (inMap.get(outId) === 0) {
                    nodeQueue.push(outId);
                }
            });
        }

        return sortedNodes;
    };
};