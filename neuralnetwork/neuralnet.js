class NeuralNet {

    constructor() {
        this.genome = new Genome();
        this.nodes = this.genome.nodeGenes;
        this.edges = this.genome.connectionGenes;
        this.sortedNodes = this.topoSort();
    };

    processInput(input) {

        let wheels = [];
        let inputIndex = 0;

        this.sortedNodes.forEach(nodeId => {
            if (this.nodes[nodeId].type === NODE_TYPES.input) { // assign values to input neurons
                this.nodes[nodeId].value = input[inputIndex];
                inputIndex++;
            } else { // hidden or output neurons
                let value = 0;
                this.edges.forEach(edge => {
                    if (edge.out.id === nodeId && edge.isEnabled) {
                        value += edge.in.value * edge.weight;
                    }
                });
                this.nodes[nodeId].value = this.sigmoid(value);
                if (this.nodes[nodeId].type === NODE_TYPES.output) {
                    wheels.push(this.nodes[nodeId].value);
                }
            }
        });

        return wheels;
    };

    sigmoid(x) {
        return 1 / (1 + Math.E ** -x);
    };

    topoSort() {
        let inMap = {};
        let nodeQueue = [];
        let sortedNodes = [];
        
        for (let id = 0; id < this.nodes.length; id++) { // map neurons to number of incoming edges
            inMap[id] = 0;
            this.edges.forEach(edge => {
                if (edge.out.id === id) {
                    inMap[id]++;
                }
            });
            if (inMap[id] === 0) {
                nodeQueue.push(id);
            }
        }

        while (nodeQueue.length !== 0) {
            let id = nodeQueue.splice(0, 1)[0];
            sortedNodes.push(id);
            this.edges.forEach(edge => {
                if (edge.in.id === id) {
                    inMap[edge.out.id]--;
                    if (inMap[edge.out.id] === 0) {
                        nodeQueue.push(edge.out.id);
                    }
                }
            });
        }

        return sortedNodes;
    };
};