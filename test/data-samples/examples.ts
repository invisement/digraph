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
