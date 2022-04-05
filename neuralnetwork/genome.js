class Genome {

    constructor() {
        let defaultGenome = this.getDefault();
        this.nodeGenes = defaultGenome.NodeGenes;
        this.connectionGenes = defaultGenome.ConnectionGenes;
    };

    getDefault(randomize = false) {
        
        const NodeGenes = [
            { id: 0, type: NODE_TYPES.input },
            { id: 1, type: NODE_TYPES.hidden },
            { id: 2, type: NODE_TYPES.output },
            { id: 3, type: NODE_TYPES.output },
        ];
    
        const ConnectionGenes = [
            {
                in: NodeGenes[0],
                out: NodeGenes[1],
                weight: randomize ? randomInt(101) / 100 : 0.1,
                isEnabled: true,
                innovation: INNOV_NUM++,
            },
            {
                in: NodeGenes[1],
                out: NodeGenes[2],
                weight: randomize ? randomInt(101) / 100 : 0.1,
                isEnabled: true,
                innovation: INNOV_NUM++,
            },
            {
                in: NodeGenes[1],
                out: NodeGenes[3],
                weight: randomize ? randomInt(101) / 100 : 0.1,
                isEnabled: true,
                innovation: INNOV_NUM++,
            },
        ];
    
        return {
            NodeGenes,
            ConnectionGenes,
        };
    };
};