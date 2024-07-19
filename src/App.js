import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import MainPage from "./pages/MainPage";

import Schedule from "./pages/Schedule";

import HeaderBar from "./pages/HeaderBar";
import SelectDestination from "./pages/SelectDestination";
import SelectAccommodation from "./pages/SelectAccommodation";
import FinalData from "./pages/FinalData";
import ContryIntroModal from "./modal/ContryIntroModal";

function App() {
  return (
    <Router>
      <HeaderBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/select-destination" element={<SelectDestination />} />
        <Route path="/select-accommodation" element={<SelectAccommodation />} />
        <Route path="/finaldata" element={<FinalData />} />
        <Route path="/ContryIntroModal" element={<ContryIntroModal />} />
      </Routes>
    </Router>
  );
}

export default App;
