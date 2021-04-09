
import './App.css';
import AddData from './component/AddData';
import ShowData from './component/ShowData';

function App() {
 
  return (
    <div className="App">
      {/* <button className="btn btn-danger m-4 p-3" onClick={()=>addData()}>Add data Through csv...!!</button> */}
      <AddData/>
     <ShowData/>
    </div>
  );
}

export default App;
