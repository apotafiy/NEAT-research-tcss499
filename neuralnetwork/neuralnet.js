class NeuralNet {

    constructor() {
        this.structure = getDefaultGenome();
        this.nodes = this.structure.NodeGenes;
        this.edges = this.structure.ConnectionGenes;
    };

    processInput(input) {
        let index = 0;
        this.nodes.forEach(node => {
            if (node.type === nodeTypes.input) {
                node.value = input[index]; // consider normalizing on the agent side?
                index++;
            } else {
                let value = 0;
                this.edges.forEach(edge => {
                    if (edge.out === node && edge.isEnabled) {
                        value += edge.in.value * edge.weight;
                    }
                });
                node.value = value;
            }
        });
    };
};