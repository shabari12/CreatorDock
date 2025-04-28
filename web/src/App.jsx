import React from "react";

import Landing from "./pages/Landing";
import AuthForm from "./pages/AuthForm";
import { Routes, Route } from "react-router-dom";
import EditorDashboard from "./pages/EditorDashboard";
import EditorProtectedWrapper from "./pages/Wraps/EditorProtectedWrapper";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedWrappers from "./pages/Wraps/AdminProtectedWrappers";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthForm />} />

        <Route
          path="editor/dashboard"
          element={
            /* <EditorProtectedWrapper> */
            <EditorDashboard />
            /* </EditorProtectedWrapper> */
          }
        ></Route>
        <Route
          path="admin/dashboard"
          element={
            /* <AdminProtectedWrappers> */
            <AdminDashboard />
            /* </AdminProtectedWrappers> */
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
