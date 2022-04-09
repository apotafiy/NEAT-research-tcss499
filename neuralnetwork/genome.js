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
        let nodeGenes = [];
        let connectionGenes = [];

        for (let i = 0; i < numNeurons; i++) {
            if (i < numInputs) {
                nodeGenes[i] = { id: i, type: Genome.NODE_TYPES.input };
            } else if (i < numInputs + numHiddens) {
                nodeGenes[i] = { id: i, type: Genome.NODE_TYPES.hidden };
            } else {
                nodeGenes[i] = { id: i, type: Genome.NODE_TYPES.output };
            } 
        }

        for (let inputNeuron = 0; inputNeuron < numInputs; inputNeuron++) {
            if (numHiddens > 0) {
                for (let hiddenNeuron = numInputs; hiddenNeuron < numInputs + numHiddens; hiddenNeuron++) {
                    connectionGenes.push(
                        {
                            in: inputNeuron,
                            out: hiddenNeuron,
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
                            in: inputNeuron,
                            out: outputNeuron,
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
                        in: hiddenNeuron,
                        out: outputNeuron,
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

    static crossover = (genomeA, genomeB) => {

        let addedIds = [];
        let copiedNodes = [];

        genomeA.nodeGenes.forEach(node => {
            if (node !== undefined && !addedIds[node.id]) {
                copiedNodes[node.id] = { ...node };
                addedIds[node.id] = true;
            }
        });

        genomeB.nodeGenes.forEach(node => {
            if (node !== undefined && !addedIds[node.id]) {
                copiedNodes[node.id] = { ...node };
                addedIds[node.id] = true;
            }
        });

        let innovationMap = [];

        genomeA.connectionGenes.forEach(connection => {
            if (innovationMap[connection.innovation] === undefined) {
                innovationMap[connection.innovation] = [];
            }
            innovationMap[connection.innovation].push({ ...connection });
        });

        genomeB.connectionGenes.forEach(connection => {
            if (innovationMap[connection.innovation] === undefined) {
                innovationMap[connection.innovation] = [];
            }
            innovationMap[connection.innovation].push({ ...connection });
        });

        let copiedConnections = [];

        innovationMap.forEach(connectionList => {
            if (connectionList !== undefined) {
                let newConnection = { ...connectionList[0] };
                if (connectionList.length === 2) {
                    newConnection.isEnabled = newConnection.isEnabled && connectionList[1].isEnabled;
                }
                copiedConnections.push(newConnection);
            }
        });

        return new Genome({ nodeGenes: copiedNodes, connectionGenes: copiedConnections });
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