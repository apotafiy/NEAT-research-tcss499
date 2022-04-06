class Genome {

    constructor() {
        let defaultGenome = this.getDefault(10, 5, 2, true);
        this.nodeGenes = defaultGenome.NodeGenes;
        this.connectionGenes = defaultGenome.ConnectionGenes;
    };

    getDefault(numInputs, numHiddens, numOutputs, randomWeights = false) {

        let numNeurons = numInputs + numHiddens + numOutputs;
        let NodeGenes = [];
        let ConnectionGenes = [];

        for (let i = 0; i < numNeurons; i++) {
            if (i < numInputs) {
                NodeGenes.push({ id: i, type: NODE_TYPES.input });
            } else if (i < numInputs + numHiddens) {
                NodeGenes.push({ id: i, type: NODE_TYPES.hidden });
            } else {
                NodeGenes.push({ id: i, type: NODE_TYPES.output });
            } 
        }

        for (let inputNeuron = 0; inputNeuron < numInputs; inputNeuron++) {
            if (numHiddens > 0) {
                for (let hiddenNeuron = numInputs; hiddenNeuron < numInputs + numHiddens; hiddenNeuron++) {
                    ConnectionGenes.push(
                        {
                            in: NodeGenes[inputNeuron],
                            out: NodeGenes[hiddenNeuron],
                            weight: randomWeights ? randomInt(101) / 100 : 0.1,
                            isEnabled: true,
                            innovation: INNOV_NUM++,
                        }
                    );
                }
            } else { // no hidden neurons, connect straight to output neurons
                for (let outputNeuron = numInputs + numHiddens; outputNeuron < numNeurons; outputNeuron++) {
                    ConnectionGenes.push(
                        {
                            in: NodeGenes[inputNeuron],
                            out: NodeGenes[outputNeuron],
                            weight: randomWeights ? randomInt(101) / 100 : 0.1,
                            isEnabled: true,
                            innovation: INNOV_NUM++,
                        }
                    );
                }
            }
        }

        for (let hiddenNeuron = numInputs; hiddenNeuron < numInputs + numHiddens; hiddenNeuron++) {
            for (let outputNeuron = numInputs + numHiddens; outputNeuron < numNeurons; outputNeuron++) {
                ConnectionGenes.push(
                    {
                        in: NodeGenes[hiddenNeuron],
                        out: NodeGenes[outputNeuron],
                        weight: randomWeights ? randomInt(101) / 100 : 0.1,
                        isEnabled: true,
                        innovation: INNOV_NUM++,
                    }
                );
            }
        }
    
        return {
            NodeGenes,
            ConnectionGenes,
        };
    };
};