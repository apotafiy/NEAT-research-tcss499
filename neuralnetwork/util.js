const getDefaultGenome = () => {
    // construct the default genome and return it

    const SENSOR = 'SENSOR';
    const HIDDEN = 'HIDDEN';
    const OUTPUT = 'OUTPUT';
    const NodeGenes = [
            { nodeId: 1, type: SENSOR },
            { nodeId: 2, type: HIDDEN },
            { nodeId: 3, type: OUTPUT },
        ];
    const ConnectionGenes = [
            { in: NodeGenes[0], out: NodeGenes[1], weight: 0.1, enabled: true, innovation: 1 },
        ];
    return {
        NodeGenes,
        ConnectionGenes,
    };
};

