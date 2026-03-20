import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFavourites } from "../context/FavouritesContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { favourites } = useFavourites();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      backgroundColor: isHome && !scrolled ? "transparent" : scrolled ? "rgba(245,240,232,0.97)" : "#F5F0E8",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.08)" : "none",
      transition: "all 0.3s",
      borderBottom: scrolled ? "1px solid rgba(201,169,110,0.2)" : "none",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "0 1.5rem", height: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", backgroundColor: "#2C3E2D",
            borderRadius: "8px", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#C9A96E", fontWeight: 700, fontSize: "1rem",
          }}>E</div>
          <div>
            <span className="font-serif" style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "1.2rem", lineHeight: 1, display: "block" }}>Estatly</span>
            <span style={{ color: "#8B7355", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>London Property</span>
          </div>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {[
            { label: t("nav.buy"), to: "/listings?type=sale" },
            { label: t("nav.rent"), to: "/listings?type=rent" },
            { label: t("nav.all"), to: "/listings" },
            { label: t("nav.contact"), to: "/contact" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="desktop-nav-link"
              style={{
                color: "#1A1A1A", textDecoration: "none",
                fontSize: "0.875rem", fontWeight: 500,
                transition: "color 0.2s", display: "none",
              }}
              onMouseEnter={(e) => e.target.style.color = "#C9A96E"}
              onMouseLeave={(e) => e.target.style.color = "#1A1A1A"}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LanguageSwitcher />
          <Link to="/favourites" style={{
            position: "relative", textDecoration: "none", color: "#1A1A1A",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "0.875rem", fontWeight: 500,
            padding: "8px 12px", borderRadius: "8px",
            border: "1px solid rgba(201,169,110,0.4)",
            transition: "all 0.2s", backgroundColor: "rgba(201,169,110,0.08)",
          }}>
            ♡ {t("nav.saved")}
            {favourites.length > 0 && (
              <span style={{
                backgroundColor: "#2C3E2D", color: "white",
                fontSize: "10px", fontWeight: 700,
                padding: "1px 6px", borderRadius: "100px",
              }}>{favourites.length}</span>
            )}
          </Link>
          <Link
            to="/contact"
            className="desktop-nav-link"
            style={{
              backgroundColor: "#2C3E2D", color: "#C9A96E",
              textDecoration: "none", padding: "10px 18px",
              borderRadius: "8px", fontSize: "0.875rem", fontWeight: 600,
              transition: "all 0.2s", display: "none",
            }}
          >
            {t("nav.valuation")}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: "#1A1A1A", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: "#1A1A1A", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: "#1A1A1A", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(201,169,110,0.2)", padding: "20px 1.5rem" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: t("nav.buy"), to: "/listings?type=sale" },
              { label: t("nav.rent"), to: "/listings?type=rent" },
              { label: t("nav.all"), to: "/listings" },
              { label: t("nav.saved"), to: "/favourites" },
              { label: t("nav.contact"), to: "/contact" },
            ].map((link) => (
              <Link key={link.to} to={link.to} style={{ color: "#1A1A1A", textDecoration: "none", fontWeight: 500, fontSize: "1rem" }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-link { display: block !important; }
        }
      `}</style>
    </header>
  );
}