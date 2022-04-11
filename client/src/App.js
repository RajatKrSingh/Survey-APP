import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes} from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Download from "./components/Download";

const App = () => {
  return (
    <div>
      <div style={{ margin: 20}}>
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/download" element={<Download />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;



