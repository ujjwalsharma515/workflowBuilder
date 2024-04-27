import  { useState, useRef, useCallback, useEffect } from 'react';
import {usehomeNodeStore, usehomeEdgeStore} from  "../../store"
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  
} from 'reactflow';
// import 'reactflow/dist/style.css';
import NodeSidebar from "../sidebar/NodeSidebar";
import './home.css';
//initial node
/*
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node'},
    position: { x: 250, y: 5 },
  },
];
*/

let id = 0;
const getId = () => `dndnode_${id++}`;

const Home = () => {
  const { homenodeData, updatehomeNodeData } = usehomeNodeStore();
  const { homeedgeData, updatehomeEdgeData } = usehomeEdgeStore();

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(homenodeData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(homeedgeData);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [editvalue , setEditvalue] = useState(nodes.data);
  const [id, setId] = useState();

  const onNodeClick = (e,val)=>{
    setEditvalue(val.data.label);
    setId(val.id)
  };
  const handleChange=(e)=>{
    e.preventDefault();
    setEditvalue(e.target.value)
  }
  const handleEdit =()=>{
    const res = nodes.map((item)=>{
      if(item.id === id){
        item.data = {
          ...item.data,
          label:editvalue
        }
      }
      return item
    })
    setNodes(res);
    setEditvalue('');
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance,setNodes],
  );

useEffect(()=>{
  updatehomeNodeData(nodes);
  updatehomeEdgeData(edges);
},[nodes,edges,usehomeEdgeStore,usehomeNodeStore]);

  return (
    <div className="dndflow"  style={{ width: '100vw', height: '100vh' }}>
    <div className='updatenode_controls'>
      
      <input id='label' type="text" placeholder='enter updated value' value={editvalue} onChange={handleChange} /><br />
      <button className='btn' onClick={handleEdit}>updated</button>
    </div>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={homenodeData}
            edges={homeedgeData}
            onNodeClick={(e,val)=> onNodeClick(e,val)}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <NodeSidebar index = {"home"}/>
      </ReactFlowProvider>
    </div>
  );
};

export default Home;
