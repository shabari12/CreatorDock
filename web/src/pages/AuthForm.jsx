import React from "react";
import { Label } from "../components/ui/label";
import { SignupFormDemo } from "../components/common/FormDemo";

import Navbarcomp from "../components/common/Navbar-Comp";
import { SelectRole } from "../components/ui/SelectRole";
const AuthForm = () => {
  return (
    <div>
      <Navbarcomp />
      {/* <SignupFormDemo /> */}
      <SelectRole />
    </div>
  );
};

export default AuthForm;
