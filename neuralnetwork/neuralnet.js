class NeuralNet {

    constructor(genome) {
        this.genome = genome;
        this.nodes = this.genome.nodeGenes;
        this.edges = this.genome.connectionGenes;
        this.sortedNodes = topoSort(this.nodes, this.edges);
        // if (this.sortedNodes === false) {
        //     console.log("this should not be printing...")
        //     console.log(this.nodes)
        //     console.log(this.edges)
        // }
    };

    processInput(input) {

        let wheels = [];
        let inputIndex = 0;

        if (this.sortedNodes === false) {
            console.log("we have a problem")
            console.log(this.nodes)
            console.log(this.edges)
        }

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
};