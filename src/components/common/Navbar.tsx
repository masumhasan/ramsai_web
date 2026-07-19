import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Collapse } from "../animation/collapse";

const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/terms-and-conditions", label: "TERMS & CONDITION" },
    { to: "/privacy-policy", label: "PRIVACY POLICY" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <header ref={navRef} className="h-24 w-full py-4 px-4 sticky top-0 z-60 bg-background/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between bg-card/90 border border-border/80 rounded-xl px-6 py-3 shadow-xl transition-all duration-300">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Gocal AI Logo" className="h-9 w-auto" />
                </Link>

                {/* Nav Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `text-xs font-semibold tracking-wider transition-colors hover:text-foreground ${
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Dashboard Button (Desktop) & Hamburger */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <Link to="/dashboard">
                            <Button size="lg" className="cursor-pointer">
                                Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
                        aria-label="Toggle Menu"
                    >
                        <svg width="20" height="20" viewBox="0 0 23 23" className="w-5 h-5">
                            <motion.path
                                fill="transparent"
                                strokeWidth="2.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                                variants={{
                                    closed: { d: "M 2 2.5 L 20 2.5" },
                                    open: { d: "M 3 16.5 L 17 2.5" }
                                }}
                                animate={isOpen ? "open" : "closed"}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.path
                                fill="transparent"
                                strokeWidth="2.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                                d="M 2 9.423 L 20 9.423"
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 }
                                }}
                                animate={isOpen ? "open" : "closed"}
                                transition={{ duration: 0.15 }}
                            />
                            <motion.path
                                fill="transparent"
                                strokeWidth="2.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                                variants={{
                                    closed: { d: "M 2 16.346 L 20 16.346" },
                                    open: { d: "M 3 2.5 L 17 16.346" }
                                }}
                                animate={isOpen ? "open" : "closed"}
                                transition={{ duration: 0.2 }}
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <Collapse isOpen={isOpen} className="md:hidden mt-2 p-4 bg-card border border-border rounded-xl flex flex-col gap-4 shadow-xl">
                <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `text-xs font-semibold tracking-wider py-2 px-3 rounded-lg transition-colors hover:bg-muted hover:text-foreground ${
                                    isActive ? "text-foreground bg-muted/50" : "text-muted-foreground"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="pt-2 border-t border-border">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full cursor-pointer">
                            Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </Collapse>
        </header>
    );
};

export default Navbar;