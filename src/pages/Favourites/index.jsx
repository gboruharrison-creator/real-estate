import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { properties, formatPrice } from "../../data/properties";
import { useFavourites } from "../../context/FavouritesContext";
import toast from "react-hot-toast";

export default function Favourites() {
  const { t } = useTranslation();
  const { favourites, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

  const saved = properties.filter((p) => favourites.includes(p.id));

  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #2C3E2D 0%, #1a2b1c 100%)",
        padding: "60px 1.5rem 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
            {t("favourites.badge")}
          </p>
          <h1 className="font-serif" style={{ color: "white", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", marginBottom: "8px" }}>
            {t("favourites.title")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem" }}>
            {saved.length === 0
              ? t("favourites.none")
              : saved.length + " " + (saved.length === 1 ? t("favourites.count1") : t("favourites.countMany"))}
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {saved.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                backgroundColor: "rgba(201,169,110,0.1)",
                border: "1px solid rgba(201,169,110,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem", margin: "0 auto 24px",
              }}>🤍</div>
              <h2 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.5rem", marginBottom: "12px" }}>
                {t("favourites.noTitle")}
              </h2>
              <p style={{ color: "#8B7355", fontSize: "0.95rem", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.7 }}>
                {t("favourites.noDesc")}
              </p>
              <Link
                to="/listings"
                style={{
                  backgroundColor: "#2C3E2D", color: "#C9A96E",
                  textDecoration: "none", padding: "14px 32px",
                  borderRadius: "100px", fontWeight: 700, fontSize: "0.95rem",
                  display: "inline-block", transition: "all 0.2s",
                }}
              >
                {t("favourites.browse")}
              </Link>
            </div>
          ) : (
            <>
              {/* Actions bar */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "24px", flexWrap: "wrap", gap: "12px",
              }}>
                <p style={{ color: "#8B7355", fontSize: "0.875rem" }}>
                  {saved.length + " " + (saved.length === 1 ? t("favourites.count1") : t("favourites.countMany"))}
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      const text = saved.map((p) => p.title + " — " + formatPrice(p)).join("\n");
                      navigator.clipboard.writeText(text);
                      toast.success(t("favourites.copied"));
                    }}
                    style={{
                      border: "1px solid rgba(44,62,45,0.3)", backgroundColor: "white",
                      color: "#2C3E2D", padding: "8px 16px", borderRadius: "8px",
                      fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {t("favourites.shareList")}
                  </button>
                  <button
                    onClick={() => {
                      saved.forEach((p) => toggleFavourite(p.id));
                      toast.success(t("favourites.removedAll"));
                    }}
                    style={{
                      border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)",
                      color: "#EF4444", padding: "8px 16px", borderRadius: "8px",
                      fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {t("favourites.clearAll")}
                  </button>
                </div>
              </div>

              {/* Properties grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {saved.map((property) => (
                  <div
                    key={property.id}
                    style={{
                      backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                      border: "1px solid rgba(201,169,110,0.15)",
                      transition: "all 0.3s", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.1)";
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavourite(property.id);
                          toast.success(t("favourites.removed"));
                        }}
                        style={{
                          position: "absolute", top: "12px", right: "12px",
                          width: "36px", height: "36px", borderRadius: "50%",
                          backgroundColor: "white", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          transition: "transform 0.2s",
                        }}
                        title="Remove from saved"
                      >
                        ❤️
                      </button>
                      <div style={{
                        position: "absolute", bottom: "12px", left: "12px",
                        backgroundColor: "rgba(44,62,45,0.9)",
                        borderRadius: "8px", padding: "4px 12px",
                      }}>
                        <span className="font-serif" style={{ color: "#C9A96E", fontWeight: 700, fontSize: "1rem" }}>
                          {formatPrice(property)}
                        </span>
                      </div>
                      <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                        <span style={{
                          backgroundColor: "rgba(255,255,255,0.9)", color: "#2C3E2D",
                          fontSize: "9px", fontWeight: 700, padding: "2px 8px",
                          borderRadius: "100px",
                        }}>
                          {property.type === "rent" ? "To Rent" : "For Sale"}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: "18px" }}>
                      <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1rem", fontWeight: 600, marginBottom: "4px" }}>
                        {property.title}
                      </h3>
                      <p style={{ color: "#8B7355", fontSize: "0.8rem", marginBottom: "12px" }}>
                        📍 {property.area}
                      </p>
                      <div style={{ display: "flex", gap: "16px", marginBottom: "14px" }}>
                        {[
                          { icon: "🛏", value: property.bedrooms + " beds" },
                          { icon: "🛁", value: property.bathrooms + " baths" },
                          { icon: "📐", value: property.sqft.toLocaleString() + " sqft" },
                        ].map((s) => (
                          <span key={s.value} style={{ color: "#6B5B4E", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
                            {s.icon} {s.value}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate("/listings/" + property.id); }}
                          style={{
                            flex: 1, backgroundColor: "#2C3E2D", color: "#C9A96E",
                            border: "none", borderRadius: "8px", padding: "10px",
                            fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {t("favourites.viewProperty")}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavourite(property.id); toast.success(t("favourites.removed")); }}
                          style={{
                            padding: "10px 14px", borderRadius: "8px",
                            border: "1px solid rgba(239,68,68,0.2)",
                            backgroundColor: "rgba(239,68,68,0.05)",
                            color: "#EF4444", cursor: "pointer", fontSize: "0.875rem",
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{
                textAlign: "center", marginTop: "48px", padding: "40px",
                backgroundColor: "white", borderRadius: "20px",
                border: "1px solid rgba(201,169,110,0.15)",
              }}>
                <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.2rem", marginBottom: "8px" }}>
                  {t("favourites.nextStep")}
                </h3>
                <p style={{ color: "#8B7355", fontSize: "0.875rem", marginBottom: "24px" }}>
                  {t("favourites.nextDesc")}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link
                    to="/contact"
                    style={{
                      backgroundColor: "#2C3E2D", color: "#C9A96E",
                      textDecoration: "none", padding: "12px 28px",
                      borderRadius: "100px", fontWeight: 700, fontSize: "0.875rem",
                    }}
                  >
                    {t("favourites.bookViewing")}
                  </Link>
                  <Link
                    to="/listings"
                    style={{
                      border: "1px solid rgba(44,62,45,0.3)", color: "#2C3E2D",
                      textDecoration: "none", padding: "12px 28px",
                      borderRadius: "100px", fontWeight: 600, fontSize: "0.875rem",
                    }}
                  >
                    {t("favourites.browseMore")}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}