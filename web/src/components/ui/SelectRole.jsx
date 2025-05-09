import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/Utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { SignupFormDemo } from "../common/FormDemo";

export function SelectRole() {
    const [role, setRole] = useState("editor");
    const [ifRoleSelected, setIfRoleSelected] = useState(false);

    if (ifRoleSelected) {
      return <SignupFormDemo role={role} />;
    }

  const handleSubmit =  (e) => {
    e.preventDefault();
    const selectedRole = e.target.role.value;
      setRole(selectedRole);
      setIfRoleSelected(true);
    console.log("Selected Role:", selectedRole);
    
  };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-10 mt-20 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Choose Your Role
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Are you an Editor or an Admin? Select your role to proceed.
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2">
          <LabelInputContainer>
            <Label htmlFor="role">Select Role</Label>
            <select
              id="role"
              className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-black dark:text-white"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </LabelInputContainer>
        </div>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Proceed &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
