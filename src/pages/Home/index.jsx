import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { properties, formatPrice } from "../../data/properties";
import { useFavourites } from "../../context/FavouritesContext";

const testimonials = [
  { name: "Emma & Robert T.", area: "Bought in Chelsea", text: "Estatly found us our dream family home in Chelsea within 3 weeks. The team's knowledge of the area was exceptional and made the whole process stress-free.", rating: 5 },
  { name: "Marcus W.", area: "Renting in Shoreditch", text: "As a first-time renter in London, I was nervous. The Estatly team guided me through everything and found me a stunning apartment at exactly the right price.", rating: 5 },
  { name: "Sophia & James L.", area: "Sold in Notting Hill", text: "We achieved 12% over asking price on our Notting Hill property thanks to Estatly's marketing strategy and their exceptional network of buyers.", rating: 5 },
];

const neighbourhoods = [
  { name: "Mayfair", type: "Ultra Luxury", avgPrice: "£4.2m", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop" },
  { name: "Chelsea", type: "Prestigious", avgPrice: "£2.8m", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop" },
  { name: "Shoreditch", type: "Creative Hub", avgPrice: "£875k", image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop" },
  { name: "Richmond", type: "Family Living", avgPrice: "£1.85m", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop" },
];

function PropertyCard({ property }) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const navigate = useNavigate();
  const fav = isFavourite(property.id);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(201,169,110,0.15)",
        transition: "all 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onClick={() => navigate("/listings/" + property.id)}
    >
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <img
          src={property.images[0]}
          alt={property.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        />
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavourite(property.id); }}
          style={{
            position: "absolute", top: "12px", right: "12px",
            width: "36px", height: "36px", borderRadius: "50%",
            backgroundColor: "white", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {fav ? "❤️" : "🤍"}
        </button>
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          display: "flex", gap: "6px", flexWrap: "wrap",
        }}>
          {property.newListing && (
            <span style={{ backgroundColor: "#2C3E2D", color: "#C9A96E", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase" }}>New</span>
          )}
          <span style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#2C3E2D", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", textTransform: "capitalize" }}>
            {property.type === "rent" ? "To Rent" : "For Sale"}
          </span>
        </div>
        <div style={{
          position: "absolute", bottom: "12px", left: "12px",
          backgroundColor: "rgba(44,62,45,0.9)", backdropFilter: "blur(4px)",
          borderRadius: "8px", padding: "4px 12px",
        }}>
          <span className="font-serif" style={{ color: "#C9A96E", fontWeight: 700, fontSize: "1rem" }}>{formatPrice(property)}</span>
        </div>
      </div>
      <div style={{ padding: "18px" }}>
        <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1rem", fontWeight: 600, marginBottom: "6px" }}>{property.title}</h3>
        <p style={{ color: "#8B7355", fontSize: "0.8rem", marginBottom: "12px" }}>📍 {property.area}</p>
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { icon: "🛏", value: property.bedrooms + " beds" },
            { icon: "🛁", value: property.bathrooms + " baths" },
            { icon: "📐", value: property.sqft.toLocaleString() + " sqft" },
          ].map((stat) => (
            <span key={stat.value} style={{ color: "#6B5B4E", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
              {stat.icon} {stat.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("sale");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const featured = properties.filter((p) => p.featured);

  const stats = [
    { value: "500+", label: t("stats.properties") },
    { value: "£2bn+", label: t("stats.sold") },
    { value: "15", label: t("stats.experience") },
    { value: "98%", label: t("stats.satisfaction") },
  ];

  const steps = [
    { icon: "🔍", title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc") },
    { icon: "♡", title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc") },
    { icon: "📞", title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc") },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchType) params.set("type", searchType);
    if (searchQuery) params.set("q", searchQuery);
    navigate("/listings?" + params.toString());
  };

  return (
    <div style={{ backgroundColor: "#F5F0E8" }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "92vh",
        backgroundImage: "linear-gradient(rgba(26,26,26,0.5), rgba(26,26,26,0.6)), url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        marginTop: "-72px",
        paddingTop: "72px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <div style={{ maxWidth: "700px" }}>
            <p style={{ color: "#C9A96E", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
              {t("hero.badge")}
            </p>
            <h1 className="font-serif" style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "white",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "24px",
            }}>
              {t("hero.title1")}<br />
              <span style={{ color: "#C9A96E" }}>{t("hero.title2")}</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "40px", maxWidth: "540px" }}>
              {t("hero.subtitle")}
            </p>

            {/* Search bar */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "8px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", gap: "4px", padding: "4px", backgroundColor: "#F5F0E8", borderRadius: "10px" }}>
                {["sale", "rent"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSearchType(type)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: searchType === type ? "#2C3E2D" : "transparent",
                      color: searchType === type ? "#C9A96E" : "#8B7355",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {type === "sale" ? "Buy" : "Rent"}
                  </button>
                ))}
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("hero.searchPlaceholder")}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  border: "none",
                  outline: "none",
                  fontSize: "0.9rem",
                  color: "#1A1A1A",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  backgroundColor: "#2C3E2D",
                  color: "#C9A96E",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 28px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {t("hero.searchBtn")}
              </button>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
              {["Knightsbridge", "Chelsea", "Mayfair", "Notting Hill"].map((area) => (
                <button
                  key={area}
                  onClick={() => navigate("/listings?area=" + area)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(201,169,110,0.4)",
                    color: "rgba(255,255,255,0.8)",
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.2)"; e.currentTarget.style.color = "#C9A96E"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ backgroundColor: "#2C3E2D", padding: "32px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "24px" }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p className="font-serif" style={{ color: "#C9A96E", fontSize: "2rem", fontWeight: 700 }}>{stat.value}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "4px" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section style={{ padding: "80px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
                {t("featured.badge")}
              </p>
              <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1A1A1A" }}>
                {t("featured.title")}
              </h2>
            </div>
            <Link to="/listings" style={{
              color: "#2C3E2D",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "1px solid #2C3E2D",
              padding: "10px 20px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2C3E2D"; e.currentTarget.style.color = "#C9A96E"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#2C3E2D"; }}
            >
              {t("featured.viewAll")}
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ backgroundColor: "white", padding: "80px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>{t("howItWorks.badge")}</p>
            <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1A1A1A" }}>{t("howItWorks.title")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px" }}>
            {steps.map((step, i) => (
              <div key={step.title} style={{ textAlign: "center" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "20px",
                  backgroundColor: "#F5F0E8", border: "1px solid rgba(201,169,110,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", margin: "0 auto 20px",
                }}>
                  {step.icon}
                </div>
                <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "8px" }}>
                  0{i + 1}
                </p>
                <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.2rem", marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ color: "#8B7355", fontSize: "0.9rem", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEIGHBOURHOODS ── */}
      <section style={{ padding: "80px 1.5rem", backgroundColor: "#F5F0E8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>{t("neighbourhoods.badge")}</p>
            <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1A1A1A" }}>{t("neighbourhoods.title")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {neighbourhoods.map((n) => (
              <Link
                key={n.name}
                to={"/listings?area=" + n.name}
                style={{ textDecoration: "none", borderRadius: "16px", overflow: "hidden", display: "block", position: "relative", height: "280px" }}
              >
                <img src={n.image} alt={n.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.06)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(26,26,26,0.8) 0%, transparent 60%)",
                }} />
                <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
                  <p className="font-serif" style={{ color: "white", fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>{n.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginTop: "4px" }}>{n.type} · Avg {n.avgPrice}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ backgroundColor: "white", padding: "80px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>{t("testimonials.badge")}</p>
            <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1A1A1A" }}>{t("testimonials.title")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} style={{
                backgroundColor: "#F5F0E8",
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid rgba(201,169,110,0.2)",
                transition: "all 0.3s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ color: "#C9A96E", fontSize: "1.2rem", marginBottom: "16px" }}>{"★".repeat(testimonial.rating)}</div>
                <p className="font-serif" style={{ color: "#1A1A1A", fontSize: "1rem", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic" }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <p style={{ color: "#2C3E2D", fontWeight: 600, fontSize: "0.9rem" }}>{testimonial.name}</p>
                  <p style={{ color: "#8B7355", fontSize: "0.8rem", marginTop: "2px" }}>{testimonial.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, #2C3E2D 0%, #1a2b1c 100%)",
        padding: "80px 1.5rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>{t("cta.badge")}</p>
          <h2 className="font-serif" style={{ color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "16px" }}>
            {t("cta.title")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "40px" }}>
            {t("cta.subtitle")}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/listings" style={{
              backgroundColor: "#C9A96E",
              color: "#2C3E2D",
              textDecoration: "none",
              padding: "16px 36px",
              borderRadius: "100px",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "all 0.2s",
              display: "inline-block",
            }}>
              {t("cta.btn1")}
            </Link>
            <Link to="/contact" style={{
              border: "2px solid rgba(201,169,110,0.4)",
              color: "#C9A96E",
              textDecoration: "none",
              padding: "14px 36px",
              borderRadius: "100px",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "all 0.2s",
              display: "inline-block",
            }}>
              {t("cta.btn2")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
