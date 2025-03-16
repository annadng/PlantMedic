import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import the new UserProvider from the context we created
import { UserProvider } from "./contexts/UserContext";
import { Main } from "./screens/Main";
import { Diagnosis } from "./screens/Diagnosis"; 
// import CareRecommendations from "./pages/CareRecommendations"; 
import { History } from "./screens/History"; 
import { Scan } from "./screens/Scan"; 

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    {/* Wrap the entire app with UserProvider to share user state */}
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Diagnosis" element={<Diagnosis />} />
          {/* <Route path="/care-recommendations" element={< CareRecommendations />} /> */}
          <Route path="/History" element={<History />} />
          <Route path="/Scan" element={<Scan />} />
        </Routes>
      </Router>
    </UserProvider>
  </StrictMode>
);
