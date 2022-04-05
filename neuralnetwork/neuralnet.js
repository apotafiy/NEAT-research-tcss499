class NeuralNet {

    constructor() {
        this.structure = getDefaultGenome();
        this.nodes = this.structure.NodeGenes;
        this.edges = this.structure.ConnectionGenes;
        this.numInputs = 1;
    };

    processInput(input) {
        let sortedNodes = this.topoSort();

        sortedNodes.forEach(nodeId => {
            if (nodeId <= this.numInputs) { // assign values to input neurons
                this.nodes[nodeId - 1] = input[nodeId - 1];
            } else { // hidden or output neurons
                let value = 0;
                this.edges.forEach(edge => {
                    if (edge.out.id === nodeId && edge.isEnabled) {
                        value += edge.in.value * edge.weight;
                    }
                });
                this.nodes[nodeId - 1] = value;
            }
        });
    };

    topoSort() {
        let inMap = {};
        let nodeQueue = [];
        let sortedNodes = [];
        
        for (let id = 1; id <= this.nodes.length; id++) { // map neurons to number of incoming edges
            inMap[id] = 0;
            this.edges.forEach(edge => {
                if (edge.out.id === id) {
                    inMap[id]++;
                }
            });
            if (inMap[id] === 0) {
                nodeQueue.push[id];
            }
        }

        while (nodeQueue.length !== 0) {
            let id = nodeQueue.splice(0, 1);
            sortedNodes.push[id];
            this.edges.forEach(edge => {
                if (edge.in.id === id) {
                    inMap[edge.in.id]--;
                    if (inMap[edge.in.id] === 0) {
                        nodeQueue.push[edge.in.id];
                    }
                }
            });
        }

        return sortedNodes;
    };
};