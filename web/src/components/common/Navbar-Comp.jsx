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
} from "./resizable-navbar";
const Navbarcomp = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const navItems = [
    { name: "Home", link: "#" },
    { name: "About", link: "#about" },
    { name: "Services", link: "#services" },
    { name: "Contact", link: "#contact" },
  ];

  const globeConfig = {
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffcc00",
    directionalTopLight: "#ff9900",
    pointLight: "#ff6600",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
  };

  const data = [
    {
      startLat: 37.7749,
      startLng: -122.4194,
      endLat: 40.7128,
      endLng: -74.006,
      color: "#ff0000",
      arcAlt: 0.2,
      order: 1,
    },
    {
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 51.5074,
      endLng: -0.1278,
      color: "#00ff00",
      arcAlt: 0.3,
      order: 2,
    },
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
          <NavbarButton href="/auth">Get Started</NavbarButton>
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
    </div>
  );
};

export default Navbarcomp;
