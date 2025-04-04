import Scheduler from "./Components/Scheduler";
import { Events } from "./events";

function App() {

  return (
      <div style={{ height: "95vh" }}>
        <Scheduler events={Events}/>
      </div>
  );
}

export default App;
