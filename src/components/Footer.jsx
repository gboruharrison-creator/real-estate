import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DeveloperCard from "./DeveloperCard";

export default function Footer() {
  const { t } = useTranslation();

  const propertiesLinks = [
    { label: t("footer.buy"), to: "/listings?type=sale" },
    { label: t("footer.rentLink"), to: "/listings?type=rent" },
    { label: t("footer.allListings"), to: "/listings" },
    { label: t("footer.savedProperties"), to: "/favourites" },
  ];

  const companyLinks = [
    { label: t("footer.aboutUs"), to: "/contact" },
    { label: t("footer.meetTeam"), to: "/contact" },
    { label: t("footer.contactLink"), to: "/contact" },
    { label: t("footer.bookValuation"), to: "/contact" },
  ];

  return (
    <footer style={{ backgroundColor: "#2C3E2D", color: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "48px" }}>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "36px", height: "36px", backgroundColor: "#C9A96E", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#2C3E2D", fontWeight: 700, fontSize: "1rem" }}>E</div>
              <span className="font-serif" style={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>Estatly</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", lineHeight: 1.7 }}>
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>{t("footer.properties")}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {propertiesLinks.map((l) => (
                <li key={l.label}><Link to={l.to} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "#C9A96E"} onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.6)"}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>{t("footer.company")}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {companyLinks.map((l) => (
                <li key={l.label}><Link to={l.to} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "#C9A96E"} onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.6)"}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>{t("footer.contactUs")}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { icon: "📍", text: "14 Berkeley Square, London W1J 6BX" },
                { icon: "📞", text: "020 7946 8000" },
                { icon: "✉️", text: "hello@estatly.co.uk" },
                { icon: "🕐", text: "Mon–Fri 9am–6pm, Sat 10am–4pm" },
              ].map((item) => (
                <li key={item.text} style={{ display: "flex", gap: "8px", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                  <span>{item.icon}</span><span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>{t("footer.copyright")}</p>
          <DeveloperCard />
        </div>
      </div>
    </footer>
  );
}
