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

export const recordAndTable = `
	digraph structs {
		node [shape=record];

		a [label="<por0> left | middle | <port1> right"];
		b [label="<port2> one | two"];
		c [label="hello \n world | { b |{c | <port3> d|e}| f}| g | h"];
		
		a:port1 -> b:port2 -> c:port3;
	}
`;
