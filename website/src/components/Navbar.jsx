import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("catalog"), path: "/catalog" },
    { name: t("customPrints"), path: "/contact" },
    { name: t("faqTitle"), path: "/faq" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <img
            src="/logo.png"
            alt="Double LayeR Prints Logo"
            style={{ height: "32px", width: "auto" }}
          />
          <span style={styles.logoText}>
            <span style={{ color: "var(--color-primary)" }}>Double</span>
            <span style={{ color: "var(--color-accent)" }}>LayeR</span>{" "}
            Prints
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={styles.desktopMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                ...styles.link,
                color: isActive(link.path)
                  ? "var(--color-primary)"
                  : "var(--color-text)",
                borderBottom: isActive(link.path)
                  ? "2px solid var(--color-primary)"
                  : "2px solid transparent",
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* Toggles */}
          <div style={styles.toggles}>
            <button
              onClick={toggleLanguage}
              style={styles.iconBtn}
              title="Toggle Language"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              style={styles.iconBtn}
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={20} color="var(--color-text)" />
              ) : (
                <Moon size={20} color="var(--color-text)" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-actions" style={styles.mobileActions}>
          <button onClick={toggleLanguage} style={styles.iconBtnMobile}>
            {language.toUpperCase()}
          </button>
          <button onClick={toggleTheme} style={styles.iconBtnMobile}>
            {theme === "dark" ? (
              <Sun size={20} color="var(--color-text)" />
            ) : (
              <Moon size={20} color="var(--color-text)" />
            )}
          </button>
          <button
            style={styles.mobileToggle}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={24} color="var(--color-text)" />
            ) : (
              <Menu size={24} color="var(--color-text)" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                ...styles.mobileLink,
                color: isActive(link.path)
                  ? "var(--color-primary)"
                  : "var(--color-text)",
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: "1rem", // Push down from the top edge
    zIndex: 100,
    padding: "0 var(--spacing-md)",
    pointerEvents: "none", // Allow clicking the webpage behind the invisible nav container bounds
  },
  navContainer: {
    pointerEvents: "auto", // Re-enable pointer events for the island itself
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--color-nav-bg)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid var(--color-border)",
    borderRadius: "100px",
    padding: "0.75rem 1.5rem",
    maxWidth: "1000px",
    boxShadow: "var(--shadow-md)",
    position: "relative",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoText: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.25rem",
    fontWeight: "bold",
    letterSpacing: "-0.5px",
  },
  desktopMenu: {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
  },
  toggles: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginLeft: "1rem",
    paddingLeft: "1rem",
    borderLeft: "1px solid var(--color-border)",
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--color-text)",
    fontWeight: "bold",
    fontSize: "0.9rem",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
  link: {
    fontWeight: 500,
    fontSize: "0.95rem",
    paddingBottom: "0.25rem",
    transition: "all 0.2s ease",
  },
  mobileActions: {
    display: "none", // Shown via media query via CSS string below
  },
  iconBtnMobile: {
    display: "block",
    marginRight: "1rem",
    fontWeight: "bold",
    color: "var(--color-text)",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },
  mobileToggle: {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileMenu: {
    pointerEvents: "auto",
    position: "absolute",
    top: "calc(100% + 0.5rem)",
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(100% - 2 * var(--spacing-md))",
    maxWidth: "1000px",
    backgroundColor: "var(--color-nav-bg)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid var(--color-border)",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    padding: "1rem var(--spacing-md)",
    boxShadow: "var(--shadow-lg)",
  },
  mobileLink: {
    padding: "1rem 0",
    borderBottom: "1px solid var(--color-border)",
    fontWeight: 500,
  },
};

// Add minimal mobile query support directly to document head for ease
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @media (min-width: 768px) {
    nav .mobile-actions { display: none !important; }
  }
  @media (max-width: 767px) {
    nav .desktop-menu { display: none !important; }
    nav .mobile-actions { display: flex !important; align-items: center; }
  }
`;
document.head.appendChild(styleTag);
