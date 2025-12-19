
import {router} from "./router/router";
import {RouterProvider} from "react-router-dom";

const App = () => {
  return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
           <RouterProvider router={router}/>
        </div>
  );
}

export default App;
