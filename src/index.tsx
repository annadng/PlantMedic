import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "./screens/Main";
import { Diagnosis } from "./screens/Diagnosis"; 
// import CareRecommendations from "./pages/CareRecommendations"; 
import { History } from "./screens/History"; 

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Diagnosis" element={<Diagnosis />} />
        {/* <Route path="/care-recommendations" element={< CareRecommendations />} /> */}
        <Route path="/History" element={<History />} />
      </Routes>
    </Router>
  </StrictMode>
);