import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/Utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { SignInForm } from "../ui/SignInForm";
import { useNavigate } from "react-router-dom";

export function SignupFormDemo(props) {
  const navigate = useNavigate();
  const { role } = props;
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (role === "editor") {
      navigate("/editor/dashboard");
    }
    if (role === "admin") {
      navigate("/admin/dashboard");
    }
  };
  if (isSigningIn) {
    return <SignInForm role={role} />;
  }

  const handleSwitchSignin = (e) => {
    e.preventDefault();
    console.log("Switch to SignIn");
    setIsSigningIn(true);
  };
  return (
    <div className=" shadow-input mx-auto w-full max-w-md rounded-none bg-white p-10  mt-20 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to CreatorDock
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        If you don't have an {role} account, you can sign up for free.
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">Username</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="creator@gmail.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Already having an {role} account?{" "}
          <span onClick={handleSwitchSignin} className="text-blue-500">
            SignIn
          </span>
          .
        </p>

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
