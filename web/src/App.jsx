import React from "react";

import Landing from "./pages/Landing";
import AuthForm from "./pages/AuthForm";
import { Routes,Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
    </div>
  );
};

export default App;
