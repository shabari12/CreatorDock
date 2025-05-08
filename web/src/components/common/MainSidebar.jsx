import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../../lib/Utils";
import MainLogo from "../../assets/MainLogo.PNG";
import MyImg from "../../assets/Myimg.jpg";
import CreateSpace from "./CreateSpace";
import HomeDash from "../ui/HomeDash";
export function MainSidebar() {
  const [activeComponent, setActiveComponent] = useState("AdminDash");
  const renderComponent = () => {
    switch (activeComponent) {
      case "AdminDash":
        return <HomeDash />;
      case "Profile":
        return <div>Profile</div>;
      case "CreateSpace":
        return <CreateSpace />;
      default:
        return <HomeDash />;
    }
  };
  const links = [
    {
      label: "Dashboard",
      onClick: () => setActiveComponent("AdminDash"),
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      onClick: () => setActiveComponent("Profile"),
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Create-Space",
      onClick: () => setActiveComponent("CreateSpace"),
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className="flex items-center gap-2 p-2 text-left text-neutral-700 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <button
              onClick={() => console.log("Avatar clicked")}
              className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
            >
              <img
                src={MyImg}
                className="h-7 w-7 shrink-0 rounded-full"
                width={50}
                height={50}
                alt="Avatar"
              />
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div>{renderComponent()}</div>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center  py-1 text-sm font-normal text-black"
    >
      <div />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        <img src={MainLogo} className="w-30" />
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <img src={MainLogo} width={50} height={50} alt="Avatar" />
    </a>
  );
};
