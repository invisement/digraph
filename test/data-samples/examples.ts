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


a [ label=(!/gcp/Cloud-Run.svg 
 Cloud Run) ]

b [label=<hello world | { <port1> x |{y1| y2 | y3}| z}> shape=record]



c [label=(

	|	| <font point-size="28" color="green"> Table Header </font> \`bgcolor="#bbbbff55"\`
tableX |	 | !/gcp/Cloud-Run.svg 
<port2> primaryKey | ID | string
person full name | name | string

)]


}`;

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
`;

export const gcpArch = `
strict digraph {
    graph [compound=true, concentrate=true, rankdir=LR, color="#8888ff", fontcolor=blue] // clusterrank=none     
	node[color="#ccccff", shape=box3d imagepos=tc fontsize=12 labelloc=c]     
	edge[color=blue, labelfloat=true, fontsize=12, fontcolor=brown tailport=e headport=w weight=1]


    // style for label nodes   
    {
        node[shape=none fillcolor=none margin=0 fontsize=10 fontcolor=blue labelloc=c]
        
    }
    
    // database style
    {
        node[shape=cylinder image="/gcp/BigQuery.svg"]
    }
    
    // event manager style
    {
    	node[style=filled fillcolor="#eeeeff" shape=oval]
    	
    	GCPScheduler
    }
    
            
    
   	ExternalData[shape=cylinder]

        ETL[label=(
        		| GCP ETL Tools
        	!/gcp/Data-Transfer.svg | BigQuery <br/> Data Transfer
        	 !/gcp/Dataflow.svg | GCP Dataflow
        	 !/gcp/Dataproc.svg | DataProc
        
        ) shape=rarrow margin=".3,.1" labelloc=c]
        

        DataWarehouse [label = (
        	
        		| DataWarehouse
       		!/gcp/BigQuery.svg | BigQuery
        	| TransactionData
        	| PromoCalendarData
        	| MarketSpecificData
        	| TransMap
        	| ClickStreamData
        	| -
        	!/gcp/Cloud-Storage.svg | Cloud Storage
        	| Unstructured Data
        )]
        

        
        
        VertexTools [label=(
        	
        	AutoML | !/gcp/AutoML.svg
       		Gemini | !/gcp/AI-Hub.svg
        	ModelGarden | !/gcp/AI-Hub.svg
        	XAI | !/gcp/Datalab.svg
        )]
        
       //Workbench [label = (!/gcp/Vertex-AI.svg \n WorkBench)]
        
        Modeling [label=( 
        	| 	| Modeling in Benchwork
        !/gcp/Datastream.svg | !/gcp/Datastore.svg | !/gcp/Container-Registry.svg  
        Vertex AI Pipelines | Feature Store | Model Registry
        
        )]
        
        CICD [label = (
        		|	| 	|	CI/CD
        	!/gcp/Vertex-AI.svg	| !/gcp/Vertex-AI.svg | !/gcp/Cloud-Build.svg | !/gcp/Artifact-Registry.svg
        	GitHub | Actions | Cloud Build | Artifact Registry
        ) shape=rarrow margin=".2,.2"]
        
                Runner [label = (
        		| Model Executor
        	VertexEndpoint | !/gcp/Cloud-Endpoints.svg
        	Cloud Run | !/gcp/Cloud-Run.svg
        	GKE | !/gcp/Google-Kubernetes-Engine.svg 
        	Cloud Functions | !/gcp/Cloud-Functions.svg 
        )]
        
        Gateway [label = (
        		| 	| API Management
        	APIGateway | APIgee | LoadBalancer
        	!/gcp/Cloud-API-Gateway.svg | !/gcp/Apigee-API-Platform.svg | !/gcp/Cloud-Load-Balancing.svg
        ) shape=rarrow margin=".2,.2"]
        

	Auth[label=(
		| Auth Providers
	WorkSpace | !/gcp/Workload-Identity-Pool.svg
	Okta | !/gcp/Identity-Platform.svg
	AuthO | !/gcp/Identity-Aware-Proxy.svg
	ActiveDirectory | !/gcp/Managed-Service-For-Microsoft-Active-Directory.svg

 	)]

IAM[label=(!/gcp/Identity-And-Access-Management.svg \n IAM)]
         
Security [label = (
 	| <port>Security
Cloud Armor | !/gcp/Cloud-Armor.svg
VPC | !/gcp/My-Cloud.svg
Loss Prevention | !/gcp/Data-Loss-Prevention-API.svg
Key Management | !/gcp/Key-Management-Service.svg
Command Center | !/gcp/Security-Command-Center.svg
Cloud Audit | !/gcp/Cloud-Audit-Logs.svg


)]

Monitoring [label = (
	!/gcp/Visual-Inspection.svg | | Model Monitoring
	PubSub | Cloud Functions | Looker
	
)]


Workbench [label = (
	!/gcp/Vertex-AI.svg  | Workbench | Python
	| | Data Exploration
	| | Model Selection
	| | FeatureEngineering 
	| | Training 
	| | Test 
)]

UI [label=(
	| Service Consumers
	!/gcp/Angular.svg | Angular
	!/gcp/Cloud-For-Marketing.svg | React
	!/gcp/Google-Cloud-Marketplace.svg | Applications
	!/gcp/Partner-Portal.svg | Vendors
)]
	 

subgraph cluster_DataDomain {
        label="ETL"

        
        
}
    
    subgraph cluster_VertexAI {
        label="5-VertexAI"
        
    }
    
    subgraph cluster_Prediction {
        label="6-Prediction/Inference"

    }
    
    

    subgraph cluster_Authentication {
        label="7-GCP IdPs for SSO Authentication"
        

    }

        
        
    


    
    
   
    ExternalData -> ETL -> DataWarehouse
    VertexTools -> Workbench -> Modeling -> CICD -> Runner
    DataWarehouse -> Modeling

    Auth -> IAM
    
    {Runner IAM Security} -> Gateway -> UI
    Runner -> Monitoring
    GCPScheduler -> ETL:n [style=dashed]


    

}`;
