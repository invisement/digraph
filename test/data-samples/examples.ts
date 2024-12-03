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
    graph [compound=true, concentrate=true, rankdir=LR, color="#8888ff", fontcolor=blue] //concentrate=true,clusterrank=none     
	node[color="#ccccff", shape=box3d style=filled fillcolor=white fixedsize=true width=1.3 height=1.1 imagepos=tc labelloc=b fontsize=14]     
	edge[color=blue, labelfloat=true, fontsize=12, fontcolor=brown tailport=e headport=w weight=1]


    // style for label nodes   
    {
        node[shape=none fillcolor=none margin=0 fontsize=10 fontcolor=blue labelloc=c]
        FeatureEngineering 
        OIDC
        ModelTraining
    }
    
    // database style
    {
        node[shape=cylinder image="/gcp/BigQuery.svg"]
        ModelRegistry [image="/gcp/Container-Registry.svg"]
        FeatureStore [image="/gcp/Datastore.svg"]
    }
    
    
    // subgraphs
    subgraph cluster_AWSDataSources {
        label="1-Data Sources"
        node[shape=cylinder image="/gcp/BigQuery.svg" ]
        
        
        TransactionData
        PromoCalendarData
        MarketSpecificData
        TransMap
        ClickStreamData
    }
    

    subgraph cluster_Migration {
        label="2,3-Data Ingestion and Migration"

        transfer[label="BigQuery Data Transfer Service" image="/gcp/Data-Transfer.svg"]
        dataflow[label="GCP Dataflow" image="/gcp/Dataflow.svg"]
    }

    subgraph cluster_DataDomain {
        label="4-AI/ML Data Domain"
        node[shape=cylinder]

        
        bigquery[label="BigQuery DataWarehouse" image="/gcp/BigQuery.svg"]
        storage[label="Cloud Storage DataLake" image="/gcp/Cloud-Storage.svg"]
    }
    
    subgraph cluster_VertexAI {
        label="5-VertexAI"


        Pipeline -> FeatureEngineering -> FeatureStore -> ModelTraining -> ModelRegistry
        {ModelGarden XAI AutoML Gemini} -> Workbench:w 
        Workbench -> ModelTraining
        Workbench -> "Vertex AI Model Monitoring"
        

        Pipeline[label="Vertex AI Pipelines" image="/gcp/Datastream.svg"]
        
        
        AutoML [image="/gcp/AutoML.svg"]
        Gemini [image="/gcp/AI-Hub.svg"]
        ModelGarden [image="/gcp/AI-Hub.svg"]
        XAI [image="/gcp/Datalab.svg"]
        Workbench [image="/gcp/Vertex-AI.svg"]
        "Vertex AI Model Monitoring" [image="/gcp/Visual-Inspection.svg"]
        
    }
    
    subgraph cluster_Prediction {
        label="6-Prediction/Inference"

        {VertexEndpoint CloudRun} -> {APIGateway PubSub}
        APIGateway -> LoadBalancer
        
        CloudRun [image="/gcp/Cloud-Run.svg"]
        VertexEndpoint [image="/gcp/Cloud-Endpoints.svg"]
        PubSub[image="/gcp/PubSub.svg"]
        APIGateway [image="/gcp/Cloud-API-Gateway.svg"]
        LoadBalancer [image="/gcp/Cloud-Load-Balancing.svg"]
    }
    
    subgraph cluster_Authentication {
        label="7-GCP IdPs for SSO Authentication"
        
        {GoogleWorkspace AzureActiveDirectory AuthO Okta} -> OIDC -> IAM
        IAM[label="IAM Authorization"]
        
        Okta [image="/gcp/Identity-Platform.svg"]
        IAM [image="/gcp/Identity-And-Access-Management.svg"]
        AuthO [image="/gcp/Identity-Aware-Proxy.svg"]
        AzureActiveDirectory [image="/gcp/Managed-Service-For-Microsoft-Active-Directory.svg"]
        GoogleWorkspace [image="/gcp/Workload-Identity-Pool.svg"]
    }

    
    subgraph cluster_FrontEnd {
        label="8-FrontEnd App"
        Angular [image="/gcp/My-Cloud.svg"]
        
    }
    
    subgraph cluster_Security {
        edge[style=invis]
        label="Security"
        VPC -> SecurityCommandCenter -> DataLossPrevention -> CloudArmor -> KeyManagementService -> CloudAudit
        
        CloudArmor [image="/gcp/Cloud-Armor.svg"]
        VPC [image="/gcp/My-Cloud.svg"]
        DataLossPrevention [image="/gcp/Data-Loss-Prevention-API.svg"]
        CloudAudit [image="/gcp/My-Cloud.svg"]
        KeyManagementService [image="/gcp/Key-Management-Service.svg"]
        CloudAudit [image="/gcp/Cloud-Audit-Logs.svg"]
        SecurityCommandCenter [image="/gcp/Security-Command-Center.svg"]
    }
    


    
    
    edge[minlen=2]
    TransactionData -> transfer [ltail=cluster_AWSDataSources lhead=cluster_Migration]
    transfer -> bigquery [ltail=cluster_Migration lhead=cluster_DataDomain]
    bigquery -> Pipeline [ltail=cluster_DataDomain lhead=cluster_VertexAI]
    ModelRegistry -> VertexEndpoint [ltail=cluster_VertexAI lhead=cluster_Prediction]
    LoadBalancer -> Angular [ltail=cluster_Prediction lhead=cluster_FrontEnd]

    VPC:w -> Pipeline:n [lhead=cluster_VertexAI ltail=cluster_Security weight=0.1]
    CloudAudit -> LoadBalancer:s [lhead=cluster_Prediction ltail=cluster_Security weight=0.1]
    IAM -> LoadBalancer:n [ltail=cluster_Authentication lhead=cluster_Prediction weight=0.1]
    

    

}
`;
