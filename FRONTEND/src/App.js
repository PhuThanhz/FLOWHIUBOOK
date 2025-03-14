import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import LoginPage from "./pages/LoginPage";
import DualViewLayout from "./pages/DualViewLayout";
import RegisterPage from "./pages/RegisterPage";
import SummaryPage from "./pages/SummaryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-summary" element={<SummaryPage />} />
        <Route path="/summary" element={<DualViewLayout />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Add other routes */}
      </Routes>
    </Router>
  );
}

export default App;
