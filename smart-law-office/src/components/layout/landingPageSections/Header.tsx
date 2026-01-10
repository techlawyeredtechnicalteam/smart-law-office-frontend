"use client";
import React from "react";
import { Button } from "../../ui/button";
import { Menu, X } from "lucide-react";
import { animate, motion, Variants } from "framer-motion";

// Nav Navigation Bar
const navItems = [
  { name: "About", href: "#about" },
  { name: "Features", href: "#features" },
  { name: "Why choose us", href: "#why-choose-us" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact us", href: "#contact" }
];

const headerVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.1,
      when: "beforeChildren"
    }
  }
};

const navContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const navItemVariants: Variants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};

const mobileMenuVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.2,
      ease: "easeOut"
    }
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut"
    }
  }
};
// 5. Mobile Menu Link Item (Staggered Fade In)
const mobileLinkItemVariants: Variants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleScrollSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    setIsMenuOpen(false);

    // revmoe th e# to get the section 1d
    const sectionId = href.replace("#", "");
    const element = document.getElementById(sectionId);

    if (element) {
      const headerOffset = 96;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageXOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className="fixed top-0 w-full bg-violet-50 backdrop-blur-sm shadow-sm z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="shrink-0"
          >
            <a
              href="#"
              className="text-2xl font-heading font-bold text-black tracking-widest"
            >
              LOGO
            </a>
          </motion.div>

          {/* Desktop Nav */}
          <motion.nav
            variants={navContainerVariants}
            className="hidden lg:flex items-center space-x-8 text-black font-medium"
          >
            {navItems.map((nav) => (
              <motion.a
                key={nav.name}
                href={nav.href}
                onClick={(e) => handleScrollSection(e, nav.href)}
                className="hover:text-violet-400 transition duration-150"
                variants={navItemVariants}
              >
                {nav.name}
              </motion.a>
            ))}
          </motion.nav>

          {/* Mobile Menu Button */}
          <Button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden mb-4"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            // exist="hidden"
          >
            <motion.nav
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col space-y-3 text-black font-medium"
            >
              {navItems.map((nav) => (
                <motion.a
                  key={nav.name}
                  href={nav.href}
                  onClick={(e) => handleScrollSection(e, nav.href)}
                  className="hover:text-violet-400 transition duration-150"
                  variants={mobileLinkItemVariants}
                >
                  {nav.name}
                </motion.a>
              ))}
              <motion.div variants={mobileLinkItemVariants}>
                <Button variant="default" className="w-full bg-violet-600 mt-2">
                  Login
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;
