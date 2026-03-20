import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { properties, areas, formatPrice } from "../../data/properties";
import { useFavourites } from "../../context/FavouritesContext";
import { nlpPropertySearch, getPropertyAdvice } from "../../utils/anthropic";
import toast from "react-hot-toast";

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
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onClick={() => navigate("/listings/" + property.id)}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img
          src={property.images[0]}
          alt={property.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        />
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavourite(property.id); }}
          style={{
            position: "absolute", top: "10px", right: "10px",
            width: "32px", height: "32px", borderRadius: "50%",
            backgroundColor: "white", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {fav ? "❤️" : "🤍"}
        </button>
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "4px" }}>
          {property.newListing && (
            <span style={{ backgroundColor: "#2C3E2D", color: "#C9A96E", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", textTransform: "uppercase" }}>New</span>
          )}
          <span style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#2C3E2D", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px" }}>
            {property.type === "rent" ? "To Rent" : "For Sale"}
          </span>
        </div>
        <div style={{
          position: "absolute", bottom: "10px", left: "10px",
          backgroundColor: "rgba(44,62,45,0.9)",
          borderRadius: "6px", padding: "3px 10px",
        }}>
          <span className="font-serif" style={{ color: "#C9A96E", fontWeight: 700, fontSize: "0.95rem" }}>{formatPrice(property)}</span>
        </div>
      </div>
      <div style={{ padding: "16px" }}>
        <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "0.95rem", fontWeight: 600, marginBottom: "4px" }}>{property.title}</h3>
        <p style={{ color: "#8B7355", fontSize: "0.78rem", marginBottom: "10px" }}>📍 {property.area}</p>
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { icon: "🛏", value: property.bedrooms + " bd" },
            { icon: "🛁", value: property.bathrooms + " ba" },
            { icon: "📐", value: property.sqft.toLocaleString() + " sqft" },
          ].map((s) => (
            <span key={s.value} style={{ color: "#6B5B4E", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "3px" }}>
              {s.icon} {s.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAdvisor() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: t("ai.greeting"),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const apiMessages = updated
        .filter((m, i) => !(i === 0 && m.role === "assistant"))
        .map((m) => ({ role: m.role, content: m.content }));
      const reply = await getPropertyAdvice(apiMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("ai.error") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: "90px", right: "24px",
          width: "360px", height: "460px",
          backgroundColor: "white",
          borderRadius: "20px",
          border: "1px solid rgba(201,169,110,0.3)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column",
          zIndex: 100, overflow: "hidden",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #2C3E2D, #1a2b1c)",
            padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🏡</div>
              <div>
                <p style={{ color: "white", fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>{t("ai.title")}</p>
                <p style={{ color: "#C9A96E", fontSize: "0.72rem", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4ade80", display: "inline-block" }} />
                  {t("ai.online")}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "1.3rem", lineHeight: 1 }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#FAFAF8" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 13px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  backgroundColor: msg.role === "user" ? "#2C3E2D" : "white",
                  color: msg.role === "user" ? "white" : "#1A1A1A",
                  fontSize: "0.83rem",
                  lineHeight: 1.5,
                  border: msg.role === "assistant" ? "1px solid rgba(201,169,110,0.15)" : "none",
                  boxShadow: msg.role === "assistant" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", backgroundColor: "white", border: "1px solid rgba(201,169,110,0.15)", display: "flex", gap: "4px" }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#C9A96E", display: "inline-block", animation: "bounce 1s infinite", animationDelay: i * 0.15 + "s" }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(201,169,110,0.1)", display: "flex", gap: "8px", backgroundColor: "white" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("ai.placeholder")}
              style={{
                flex: 1, border: "1px solid rgba(201,169,110,0.25)", borderRadius: "10px",
                padding: "9px 13px", fontSize: "0.83rem", outline: "none", color: "#1A1A1A",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                backgroundColor: input.trim() && !loading ? "#2C3E2D" : "#E8DDD0",
                color: input.trim() && !loading ? "#C9A96E" : "#8B7355",
                border: "none", borderRadius: "10px", padding: "9px 14px",
                fontWeight: 700, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                fontSize: "1rem", transition: "all 0.2s",
              }}
            >→</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "56px", height: "56px", borderRadius: "50%",
          background: "linear-gradient(135deg, #2C3E2D, #1a2b1c)",
          border: "2px solid rgba(201,169,110,0.4)",
          cursor: "pointer", fontSize: "1.4rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(44,62,45,0.4)",
          transition: "all 0.2s", zIndex: 99,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(44,62,45,0.5)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(44,62,45,0.4)"; }}
      >
        {open ? "×" : "🏡"}
      </button>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </>
  );
}

export default function Listings() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [nlpQuery, setNlpQuery] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const type = searchParams.get("type") || "all";
  const area = searchParams.get("area") || "All Areas";
  const minBeds = parseInt(searchParams.get("minBeds") || "0");
  const sortBy = searchParams.get("sort") || "default";
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "99999999");
  const q = searchParams.get("q") || "";

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === "all" || value === "All Areas" || value === "0") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleNlpSearch = async () => {
    if (!nlpQuery.trim()) return;
    setNlpLoading(true);
    try {
      const filters = await nlpPropertySearch(nlpQuery);
      const next = new URLSearchParams();
      if (filters.type) next.set("type", filters.type);
      if (filters.area) next.set("area", filters.area);
      if (filters.minBedrooms) next.set("minBeds", String(filters.minBedrooms));
      if (filters.maxPrice) next.set("maxPrice", String(filters.maxPrice));
      if (filters.minPrice) next.set("minPrice", String(filters.minPrice));
      setSearchParams(next);
      toast.success("AI search applied!");
    } catch {
      toast.error("AI search failed. Try manual filters.");
    } finally {
      setNlpLoading(false);
    }
  };

  const filtered = properties.filter((p) => {
    if (type !== "all" && p.type !== type) return false;
    if (area !== "All Areas" && p.area !== area) return false;
    if (p.bedrooms < minBeds) return false;
    const price = p.type === "rent" ? (p.pricePerMonth || 0) : (p.price || 0);
    if (price < minPrice || price > maxPrice) return false;
    if (q) {
      const query = q.toLowerCase();
      if (!p.title.toLowerCase().includes(query) &&
        !p.area.toLowerCase().includes(query) &&
        !p.propertyType.toLowerCase().includes(query)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return (a.price || a.pricePerMonth || 0) - (b.price || b.pricePerMonth || 0);
    if (sortBy === "price-desc") return (b.price || b.pricePerMonth || 0) - (a.price || a.pricePerMonth || 0);
    if (sortBy === "newest") return b.newListing - a.newListing;
    return 0;
  });

  const cardBg = "white";
  const borderColor = "rgba(201,169,110,0.2)";

  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #2C3E2D 0%, #1a2b1c 100%)",
        padding: "60px 1.5rem 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
            {filtered.length} {t("listings.badge")}
          </p>
          <h1 className="font-serif" style={{ color: "white", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", marginBottom: "24px" }}>
            {type === "sale" ? t("listings.forSale") : type === "rent" ? t("listings.toRent") : t("listings.allProps")}
            {area !== "All Areas" && " " + t("listings.inArea") + " " + area}
          </h1>

          {/* NLP Search */}
          <div style={{ display: "flex", gap: "8px", maxWidth: "600px", flexWrap: "wrap" }}>
            <input
              value={nlpQuery}
              onChange={(e) => setNlpQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNlpSearch()}
              placeholder={t("listings.nlpPlaceholder")}
              style={{
                flex: 1, minWidth: "200px",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(201,169,110,0.3)",
                borderRadius: "10px", padding: "10px 16px",
                color: "white", fontSize: "0.875rem", outline: "none",
              }}
            />
            <button
              onClick={handleNlpSearch}
              disabled={nlpLoading || !nlpQuery.trim()}
              style={{
                backgroundColor: "#C9A96E", color: "#2C3E2D",
                border: "none", borderRadius: "10px", padding: "10px 20px",
                fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.2s",
                opacity: nlpLoading ? 0.7 : 1,
              }}
            >
              {nlpLoading ? t("listings.nlpSearching") : "🤖 " + t("listings.nlpBtn")}
            </button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: "8px" }}>
            {t("listings.nlpPowered")}
          </p>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <div style={{
        position: "sticky", top: "72px", zIndex: 40,
        backgroundColor: "rgba(245,240,232,0.97)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid " + borderColor,
        padding: "12px 1.5rem",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => setFilter("type", e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid " + borderColor, backgroundColor: cardBg, fontSize: "0.8rem", color: "#1A1A1A", cursor: "pointer", outline: "none" }}
            >
              <option value="all">{t("listings.buyOrRent")}</option>
              <option value="sale">{t("listings.forSaleFilter")}</option>
              <option value="rent">{t("listings.toRentFilter")}</option>
            </select>

            {/* Area */}
            <select
              value={area}
              onChange={(e) => setFilter("area", e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid " + borderColor, backgroundColor: cardBg, fontSize: "0.8rem", color: "#1A1A1A", cursor: "pointer", outline: "none" }}
            >
              {areas.map((a) => <option key={a}>{a}</option>)}
            </select>

            {/* Bedrooms */}
            <select
              value={minBeds}
              onChange={(e) => setFilter("minBeds", e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid " + borderColor, backgroundColor: cardBg, fontSize: "0.8rem", color: "#1A1A1A", cursor: "pointer", outline: "none" }}
            >
              <option value="0">{t("listings.anyBeds")}</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setFilter("sort", e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid " + borderColor, backgroundColor: cardBg, fontSize: "0.8rem", color: "#1A1A1A", cursor: "pointer", outline: "none" }}
            >
              <option value="default">{t("listings.defaultSort")}</option>
              <option value="price-asc">{t("listings.priceLow")}</option>
              <option value="price-desc">{t("listings.priceHigh")}</option>
              <option value="newest">{t("listings.newest")}</option>
            </select>

            {/* Clear */}
            {(type !== "all" || area !== "All Areas" || minBeds > 0 || sortBy !== "default") && (
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)", color: "#EF4444", fontSize: "0.8rem", cursor: "pointer" }}
              >
                {t("listings.clearFilters")}
              </button>
            )}
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", gap: "4px", backgroundColor: cardBg, borderRadius: "8px", padding: "4px", border: "1px solid " + borderColor }}>
            {[{ mode: "grid", icon: "⊞" }, { mode: "list", icon: "☰" }].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "6px 12px", borderRadius: "6px", border: "none",
                  backgroundColor: viewMode === mode ? "#2C3E2D" : "transparent",
                  color: viewMode === mode ? "#C9A96E" : "#8B7355",
                  cursor: "pointer", fontSize: "1rem", transition: "all 0.2s",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <section style={{ padding: "32px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🏠</p>
              <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.5rem", marginBottom: "8px" }}>{t("listings.noResults")}</h3>
              <p style={{ color: "#8B7355", marginBottom: "24px" }}>{t("listings.noResultsSub")}</p>
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                style={{ border: "1px solid #2C3E2D", color: "#2C3E2D", background: "transparent", padding: "10px 24px", borderRadius: "100px", cursor: "pointer", fontWeight: 600 }}
              >
                {t("listings.clearAll")}
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: cardBg, borderRadius: "16px", border: "1px solid " + borderColor,
                    display: "grid", gridTemplateColumns: "260px 1fr", overflow: "hidden",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                  onClick={() => window.location.href = "/listings/" + p.id}
                >
                  <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.1rem", fontWeight: 600, marginBottom: "4px" }}>{p.title}</h3>
                      <p style={{ color: "#8B7355", fontSize: "0.8rem", marginBottom: "8px" }}>📍 {p.address}</p>
                      <p style={{ color: "#6B5B4E", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.description.slice(0, 120)}...</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                      <div style={{ display: "flex", gap: "16px" }}>
                        {[{ icon: "🛏", v: p.bedrooms + " beds" }, { icon: "🛁", v: p.bathrooms + " baths" }, { icon: "📐", v: p.sqft.toLocaleString() + " sqft" }].map((s) => (
                          <span key={s.v} style={{ color: "#6B5B4E", fontSize: "0.8rem" }}>{s.icon} {s.v}</span>
                        ))}
                      </div>
                      <span className="font-serif" style={{ color: "#2C3E2D", fontWeight: 700, fontSize: "1.1rem" }}>{formatPrice(p)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AIAdvisor />
    </div>
  );
}