export const nodeImage = `
digraph {
	a -> b -> c
	a [ !/gcp/PubSub.svg ]
	c[!/gcp/Cloud-Run.svg]
}
`;

export const tableRecordVariable = `
digraph {
	
	!x = \`5\`
	
	a -> b -> c
	a [label=!x !/gcp/PubSub.svg ]
	c[!/gcp/Cloud-Run.svg]

	
	b [shape=record label="hello |{ b |{c|<here> d|e}| f}| g" color=red ];

}
`;

export const reserseArrow = `
digraph {
	
	graph [compound=true, concentrate=true, rankdir=LR, color="#8888ff", fontcolor=blue] 
	    
	node[color="#aaaaff", shape=box fontsize=14]     
	
	edge[color=blue, labelfloat=true, fontsize=12, fontcolor=brown weight=1]


	subgraph message {
		node[margin=0, shape=cds]
		
		Data
		Question
		SQL
	}


	User -> Question -> 
	YourSolution -> TranslateToSQL
	-> SQL -> DB
	
	User -> VisualizeAndInsight -> Data -> DB [dir=back]
	
	TranslateToSQL -> MetaData[dir=back]
	
	subgraph cluster_LLM {
		label="LLM"
		TranslateToSQL
		VisualizeAndInsight
	}
	
	subgraph cluster_data {
		label=DataWarehouse
		
		DB
		MetaData
	} 
	
	YourSolution[shape=box3d style=filled fillcolor=lightblue]
	
}
`
