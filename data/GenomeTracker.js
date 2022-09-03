/**
 * A class for tracking genome structural data for each generation
 */
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

    getCycleData() {
        const maxCycles = this.generations.map((obj) =>
            obj.cycles.reduce((acc, curr) => Math.max(acc, curr), 0)
        );
        const minCycles = this.generations.map((obj) =>
            obj.cycles.reduce(
                (acc, curr) => Math.min(acc, curr),
                Number.MAX_VALUE
            )
        );
        const medianCycles = this.generations.map((obj) =>
            getMedian(obj.cycles)
        );
        return {
            maxes: maxCycles,
            mins: minCycles,
            medians: medianCycles,
        };
    }

    getNodeData() {
        const maxNodes = this.generations.map((obj) => obj.maxNodes);
        const minNodes = this.generations.map((obj) => obj.minNodes);
        const medianNodes = this.generations.map((obj) => getMedian(obj.nodes));
        return {
            maxes: maxNodes,
            mins: minNodes,
            medians: medianNodes,
        };
    }
}
