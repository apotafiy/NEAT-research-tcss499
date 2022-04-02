const getDefaultGenome = () => {
    // construct the default genome and return it

    const nodeTypes = {
        sensor: 0,
        hidden: 1,
        output: 2,
    };
    const NodeGenes = [
        { nodeId: 1, type: nodeTypes.sensor },
        { nodeId: 2, type: nodeTypes.hidden },
        { nodeId: 3, type: nodeTypes.output },
    ];
    const ConnectionGenes = [
        {
            in: NodeGenes[0],
            out: NodeGenes[1],
            weight: 0.1,
            isEnabled: true,
            innovation: 1,
        },
    ];
    return {
        NodeGenes,
        ConnectionGenes,
    };
};
