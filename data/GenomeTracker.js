class GenomeTracker {
    constructor() {
        this.currentGeneration = -1;
        this.generations = [];
        this.addNewGeneration();
    }

    addNewGeneration() {
        this.currentGeneration++;
        this.generations[this.currentGeneration] = {
            maxNodes: 0,
            minNodes: Number.MAX_VALUE,
            nodes: [],
            maxConnections: 0,
            minConnections: Number.MAX_VALUE,
            connections: [],
            cycles: [], // count how many cycles each agent has
        };
    }

    addNodes(genome) {
        const numNodes = genome.nodeGenes.size;
        this.generations[this.currentGeneration].maxNodes = Math.max(
            numNodes,
            this.generations[this.currentGeneration].maxNodes
        );
        this.generations[this.currentGeneration].minNodes = Math.min(
            numNodes,
            this.generations[this.currentGeneration].minNodes
        );
        this.generations[this.currentGeneration].nodes.push(numNodes);
    }

    addConnections(genome) {
        const connections = genome.connectionsAsList();
        const numConnections = connections.length;
        this.generations[this.currentGeneration].maxConnections = Math.max(
            numConnections,
            this.generations[this.currentGeneration].maxConnections
        );
        this.generations[this.currentGeneration].minConnections = Math.min(
            numConnections,
            this.generations[this.currentGeneration].minConnections
        );
        this.generations[this.currentGeneration].connections.push(
            numConnections
        );
        const numCycles = connections.reduce((acc, curr) => {
            if (curr.isCyclic) {
                return 1 + acc;
            } else {
                return acc;
            }
        }, 0);
        this.generations[this.currentGeneration].cycles.push(numCycles);
    }

    processGenome(genome) {
        this.addConnections(genome);
        this.addNodes(genome);
    }

    getConnectionData() {
        const maxConnections = this.generations.map(
            (obj) => obj.maxConnections
        );
        const minConnections = this.generations.map(
            (obj) => obj.minConnections
        );
        const medianConnections = this.generations.map((obj) =>
            getMedian(obj.connections)
        );
        return {
            maxes: maxConnections,
            mins: minConnections,
            medians: medianConnections,
        };
    }
}
