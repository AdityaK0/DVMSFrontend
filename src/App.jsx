import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";   // ✅ import Toaster
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />  {/* ✅ Toast provider */}
    </BrowserRouter>
  );
}

export default App;
