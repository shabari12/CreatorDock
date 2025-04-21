import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "../components/common/resizable-navbar";
import { MacbookScroll } from "../components/ui/macbook-scroll";
import { HeroSectionOne } from "../components/ui/Hero";

const Landing = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const navItems = [
    { name: "Home", link: "#" },
    { name: "About", link: "#about" },
    { name: "Services", link: "#services" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <div>
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            onItemClick={() => setMobileNavOpen(false)}
          />
          <NavbarButton href="#get-started">Get Started</NavbarButton>
        </NavBody>
        <MobileNav visible={isMobileNavOpen}>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileNavOpen}
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setMobileNavOpen(false)}
                className="text-black dark:text-white"
              >
                {item.name}
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <HeroSectionOne/>
      <MacbookScroll />
    </div>
  );
};

export default Landing;
