export const tutorial = `
digraph {

graph[rankdir=LR color=green]
node[shape=box color=blue fontsize=18]
edge[dir=back color=red]



a -> b:port1 -> c:port2;

subgraph cluster_x {
	label="hello you"
	
	a
	b
}


a [ label=(!/gcp/Cloud-Run.svg \n Cloud Run) ]

b [label="hello world | { <port1> x |{y1 | y2 | y3}| z}" shape=record]


c [label=(

tableX |	 | !/gcp/Cloud-Run.svg
<port2> primaryKey | ID | string
person full name | name | string

)]


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
