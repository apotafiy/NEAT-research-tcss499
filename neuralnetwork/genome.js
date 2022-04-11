class Genome {

    static DEFAULT_INPUTS = 10;

    static DEFAULT_HIDDENS = 0;

    static DEFAULT_OUTPUTS = 2;

    static INNOV_NUM = 0;

    static NODE_ID = Genome.DEFAULT_INPUTS + Genome.DEFAULT_HIDDENS + Genome.DEFAULT_OUTPUTS;

    static NODE_TYPES = {
        input: 0,
        hidden: 1,
        output: 2,
    };

    static INNOV_MAP = [];

    static NODE_ID_MAP = [];

    static resetInnovations = () => { // this function must be called whenever a new set of agents is created
        Genome.INNOV_MAP = [];
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

    static assignNodeId = (innovNum) => {
        let id;
        if (Genome.NODE_ID_MAP[innovNum] !== undefined) {
            id = Genome.NODE_ID_MAP[innovNum];
        } else {
            id = Genome.NODE_ID++;
            Genome.NODE_ID_MAP[innovNum] = id;
        }
        return id;
    };

    static getDefault = (randomWeights = false) => {

        let numInputs = Genome.DEFAULT_INPUTS;
        let numHiddens = Genome.DEFAULT_HIDDENS;
        let numOutputs = Genome.DEFAULT_OUTPUTS;
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
                            weight: randomWeights ? Math.random() : 0.1,
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
                            weight: randomWeights ? Math.random() : 0.1,
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
                        weight: randomWeights ? Math.random() : 0.1,
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
        let innovationMap = [];

        genomeA.connectionGenes.forEach(connection => {
            if (innovationMap[connection.innovation] === undefined) {
                innovationMap[connection.innovation] = [];
            }
            innovationMap[connection.innovation][0] = { ...connection }; // genome A connections stored at index 0
        });

        genomeB.connectionGenes.forEach(connection => {
            if (innovationMap[connection.innovation] === undefined) {
                innovationMap[connection.innovation] = [];
            }
            innovationMap[connection.innovation][1] = { ...connection }; // genome B connections stored at index 1
        });

        let copiedNodes = [];
        let copiedConnections = [];

        innovationMap.forEach(connectionList => {
            if (connectionList !== undefined) {
                let newConnection = undefined;
                let selectedGenome = undefined;
                if (connectionList[0] !== undefined && connectionList[1] !== undefined) { // randomly choose between matching connection genes
                    let randChoice = randomInt(2);
                    selectedGenome = randChoice === 0 ? genomeA : genomeB;
                    newConnection = connectionList[randChoice];
                    newConnection.isEnabled = connectionList[0].isEnabled && connectionList[1].isEnabled;
                } else { // disjoint/excess gene case -> result depends of fitness of genomeA and genomeB
                    if (connectionList[0] !== undefined && genomeA.rawFitness >= genomeB.rawFitness) {
                        selectedGenome = genomeA;
                        newConnection = connectionList[0];
                    } 
                    if (connectionList[1] !== undefined && genomeB.rawFitness >= genomeA.rawFitness) {
                        selectedGenome = genomeB;
                        newConnection = connectionList[1];
                    }
                }
                if (newConnection !== undefined) {
                    copiedConnections.push(newConnection);
                    copiedNodes[newConnection.in] = { ...selectedGenome.nodeGenes[newConnection.in] };
                    copiedNodes[newConnection.out] = { ...selectedGenome.nodeGenes[newConnection.out] };
                }
            }
        });

        return new Genome({ nodeGenes: copiedNodes, connectionGenes: copiedConnections });
    };

    constructor(genome = undefined) {
        if (genome === undefined) {
            let defaultGenome = Genome.getDefault();
            this.nodeGenes = defaultGenome.nodeGenes;
            this.connectionGenes = defaultGenome.connectionGenes;
        } else {
            this.nodeGenes = genome.nodeGenes;
            this.connectionGenes = genome.connectionGenes;
        }  
    };

    mutate() {
        this.connectionGenes.forEach(connection => { // weight mutations
            if (randomInt(100) < 5) { // 5% chance of a weight mutation for every connection
                connection.weight = randomInt(2) === 1 ? Math.min(1, connection.weight + Math.random() * 0.1) : Math.max(0, connection.weight - Math.random() * 0.1);
            }
        });

        if (randomInt(100) < 5) { // new node mutation (5% chance)
            let connection = this.connectionGenes[randomInt(this.connectionGenes.length)];
            if (connection.isEnabled) {
                let nodeId = Genome.assignNodeId(connection.innovation);
                if (this.nodeGenes[nodeId] === undefined) { // check if we already have this node in our genome
                    connection.isEnabled = false; // disable the old connection
                    this.nodeGenes[nodeId] = { id: nodeId, type: Genome.NODE_TYPES.hidden }; // add the new node, then split the connection
                    this.connectionGenes.push(
                        {
                            in: connection.in,
                            out: nodeId,
                            weight: 1,
                            isEnabled: true,
                            innovation: Genome.assignInnovNum(connection.in, nodeId)
                        }
                        );
                    this.connectionGenes.push(
                        {
                            in: nodeId,
                            out: connection.out,
                            weight: connection.weight,
                            isEnabled: true,
                            innovation: Genome.assignInnovNum(nodeId, connection.out)
                        }
                    );
                }
            }
        }
    };

    numNodes() {
        let count = 0;
        this.nodeGenes.forEach(node => {
            if (node !== undefined) {
                count++;
            }
        });
        return count;
    };

    numConnections() {
        return this.connectionGenes.length;
    };
};