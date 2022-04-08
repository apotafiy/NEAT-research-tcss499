class Genome {

    static INNOV_NUM = 0;

    static NODE_TYPES = {
        input: 0,
        hidden: 1,
        output: 2,
    };

    static INNOV_MAP = {};

    static resetInnovations = () => { // this function must be called whenever a new set of agents is created
        Genome.INNOV_MAP = {};
    };

    static assignInnovNum = (inId, outId) => {
        let innovNumber;
        if (Genome.INNOV_MAP[[inId, outId]] !== undefined) { // check if we have already created a number for this connection
            innovNumber = Genome.INNOV_MAP[[inId, outId]];
        } else {
            innovNumber = Genome.INNOV_NUM++;
            Genome.INNOV_MAP[[inId, outId]] = innovNumber;
        }
        return innovNumber;
    };

    static getDefault = (numInputs, numHiddens, numOutputs, randomWeights = false) => {

        let numNeurons = numInputs + numHiddens + numOutputs;
        let nodeGenes = {};
        let connectionGenes = [];

        for (let i = 0; i < numNeurons; i++) {
            if (i < numInputs) {
                nodeGenes.push({ id: i, type: Genome.NODE_TYPES.input });
            } else if (i < numInputs + numHiddens) {
                nodeGenes.push({ id: i, type: Genome.NODE_TYPES.hidden });
            } else {
                nodeGenes.push({ id: i, type: Genome.NODE_TYPES.output });
            } 
        }

        for (let inputNeuron = 0; inputNeuron < numInputs; inputNeuron++) {
            if (numHiddens > 0) {
                for (let hiddenNeuron = numInputs; hiddenNeuron < numInputs + numHiddens; hiddenNeuron++) {
                    connectionGenes.push(
                        {
                            in: nodeGenes[inputNeuron],
                            out: nodeGenes[hiddenNeuron],
                            weight: randomWeights ? randomInt(101) / 100 : 0.1,
                            isEnabled: true,
                            innovation: Genome.assignInnovNum(inputNeuron, hiddenNeuron),
                        }
                    );
                }
            } else { // no hidden neurons, connect straight to output neurons
                for (let outputNeuron = numInputs + numHiddens; outputNeuron < numNeurons; outputNeuron++) {
                    connectionGenes.push(
                        {
                            in: nodeGenes[inputNeuron],
                            out: nodeGenes[outputNeuron],
                            weight: randomWeights ? randomInt(101) / 100 : 0.1,
                            isEnabled: true,
                            innovation: Genome.assignInnovNum(inputNeuron, outputNeuron),
                        }
                    );
                }
            }
        }

        for (let hiddenNeuron = numInputs; hiddenNeuron < numInputs + numHiddens; hiddenNeuron++) {
            for (let outputNeuron = numInputs + numHiddens; outputNeuron < numNeurons; outputNeuron++) {
                connectionGenes.push(
                    {
                        in: nodeGenes[hiddenNeuron],
                        out: nodeGenes[outputNeuron],
                        weight: randomWeights ? randomInt(101) / 100 : 0.1,
                        isEnabled: true,
                        innovation: Genome.assignInnovNum(hiddenNeuron, outputNeuron),
                    }
                );
            }
        }
    
        return {
            nodeGenes: nodeGenes,
            connectionGenes: connectionGenes,
        };
    };

    static copyNode = (node) => {
        return { id: node.id, type: node.type, value: node.value };
    };

    static copyConnection = (connection) => {
        return { in: Genome.copyNode(connection.in), 
                 out: Genome.copyNode(connection.out), 
                 weight: connection.weight, 
                 isEnabled: connection.isEnabled, 
                 innovation: connection.innovation };
    };

    static crossover = (genomeA, genomeB) => {

        let copiedNodes = [];



        let innovationMap = {};

        genomeA.connectionGenes.forEach(connection => {
            if (innovationMap[connection.innovation] === undefined) {
                innovationMap[connection.innovation] = [];
            }
            innovationMap[connection.innovation].push(connection);
        });

        genomeB.connectionGenes.forEach(connection => {
            if (innovationMap[connection.innovation] === undefined) {
                innovationMap[connection.innovation] = [];
            }
            innovationMap[connection.innovation].push(connection);
        });

        console.log(innovationMap)

    };

    constructor(genome = undefined) {
        if (genome === undefined) {
            let defaultGenome = Genome.getDefault(2, 0, 2, false);
            this.nodeGenes = defaultGenome.nodeGenes;
            this.connectionGenes = defaultGenome.connectionGenes;
        } else {
            this.nodeGenes = genome.nodeGenes;
            this.connectionGenes = genome.connectionGenes;
        }  
    };

    mutate() {

    };

    length() {
        return this.connectionGenes.length;
    };
};