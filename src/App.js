import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainRoutes from "./routes/MainRoutes";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
// import InactivityHandler from "./components/auth/InactivityHandler";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      {/* <InactivityHandler/> */}
      <MainRoutes />
    </BrowserRouter>
  );
}

export default App;
