import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { properties, formatPrice } from "../../data/properties";
import { useFavourites } from "../../context/FavouritesContext";
import { generatePropertyDescription } from "../../utils/anthropic";
import toast from "react-hot-toast";

function MortgageCalculator({ price }) {
  const [deposit, setDeposit] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [term, setTerm] = useState(25);

  const loanAmount = price * (1 - deposit / 100);
  const monthlyRate = rate / 100 / 12;
  const payments = term * 12;
  const monthly = monthlyRate === 0 ? loanAmount / payments :
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
    (Math.pow(1 + monthlyRate, payments) - 1);
  const totalCost = monthly * payments;
  const totalInterest = totalCost - loanAmount;

  const fmt = (n) => "£" + Math.round(n).toLocaleString();

  return (
    <div style={{ backgroundColor: "#F5F0E8", borderRadius: "16px", padding: "24px", border: "1px solid rgba(201,169,110,0.2)" }}>
      <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.1rem", marginBottom: "20px" }}>
        🏦 Mortgage Calculator
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ color: "#6B5B4E", fontSize: "0.8rem", fontWeight: 500 }}>Deposit</label>
            <span style={{ color: "#2C3E2D", fontWeight: 700, fontSize: "0.875rem" }}>{deposit}% · {fmt(price * deposit / 100)}</span>
          </div>
          <input type="range" min="5" max="50" step="1" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#2C3E2D" }} />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ color: "#6B5B4E", fontSize: "0.8rem", fontWeight: 500 }}>Interest Rate</label>
            <span style={{ color: "#2C3E2D", fontWeight: 700, fontSize: "0.875rem" }}>{rate}%</span>
          </div>
          <input type="range" min="1" max="10" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#2C3E2D" }} />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ color: "#6B5B4E", fontSize: "0.8rem", fontWeight: 500 }}>Mortgage Term</label>
            <span style={{ color: "#2C3E2D", fontWeight: 700, fontSize: "0.875rem" }}>{term} years</span>
          </div>
          <input type="range" min="5" max="35" step="1" value={term} onChange={(e) => setTerm(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#2C3E2D" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "Monthly Payment", value: fmt(monthly), highlight: true },
          { label: "Loan Amount", value: fmt(loanAmount), highlight: false },
          { label: "Total Interest", value: fmt(totalInterest), highlight: false },
          { label: "Total Cost", value: fmt(totalCost), highlight: false },
        ].map((item) => (
          <div key={item.label} style={{
            backgroundColor: item.highlight ? "#2C3E2D" : "white",
            borderRadius: "10px", padding: "12px 14px",
            border: "1px solid rgba(201,169,110,0.15)",
          }}>
            <p style={{ color: item.highlight ? "rgba(255,255,255,0.6)" : "#8B7355", fontSize: "0.72rem", marginBottom: "4px" }}>{item.label}</p>
            <p className="font-serif" style={{ color: item.highlight ? "#C9A96E" : "#1A1A1A", fontSize: "1rem", fontWeight: 700 }}>{item.value}</p>
          </div>
        ))}
      </div>
      <p style={{ color: "#8B7355", fontSize: "0.7rem", marginTop: "12px", lineHeight: 1.5 }}>
        * For illustration purposes only. Contact a mortgage adviser for personalised advice.
      </p>
    </div>
  );
}

export default function Property() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [activeImg, setActiveImg] = useState(0);
  const [aiDesc, setAiDesc] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [enquirySent, setEnquirySent] = useState(false);

  const property = properties.find((p) => p.id === parseInt(id));

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!property) {
    return (
      <div style={{ textAlign: "center", padding: "80px 1.5rem" }}>
        <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🏠</p>
        <h2 className="font-serif" style={{ color: "#1A1A1A", marginBottom: "12px" }}>Property not found</h2>
        <Link to="/listings" style={{ color: "#2C3E2D", fontWeight: 600 }}>← Back to listings</Link>
      </div>
    );
  }

  const similar = properties
    .filter((p) => p.id !== property.id && p.area === property.area)
    .slice(0, 3);

  const handleGenerateDesc = async () => {
    setAiLoading(true);
    try {
      const desc = await generatePropertyDescription(property);
      setAiDesc(desc);
      toast.success("AI description generated!");
    } catch {
      toast.error("Failed to generate description.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleEnquiry = (e) => {
    e.preventDefault();
    setEnquirySent(true);
    toast.success("Enquiry sent! " + property.agent + " will contact you within 2 hours.");
  };

  const fav = isFavourite(property.id);

  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>

      {/* ── BREADCRUMB ── */}
      <div style={{ backgroundColor: "white", padding: "12px 1.5rem", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#8B7355" }}>
          <Link to="/" style={{ color: "#8B7355", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link to="/listings" style={{ color: "#8B7355", textDecoration: "none" }}>Listings</Link>
          <span>›</span>
          <span style={{ color: "#2C3E2D", fontWeight: 500 }}>{property.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Gallery */}
            <div style={{ borderRadius: "20px", overflow: "hidden", marginBottom: "24px" }}>
              <div style={{ position: "relative", height: "480px", backgroundColor: "#E8DDD0" }}>
                <img
                  src={property.images[activeImg]}
                  alt={property.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }}
                />
                <button
                  onClick={() => setActiveImg((prev) => (prev - 1 + property.images.length) % property.images.length)}
                  style={{
                    position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                    width: "40px", height: "40px", borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
                    fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >‹</button>
                <button
                  onClick={() => setActiveImg((prev) => (prev + 1) % property.images.length)}
                  style={{
                    position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                    width: "40px", height: "40px", borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
                    fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >›</button>
                <div style={{ position: "absolute", bottom: "16px", right: "16px", backgroundColor: "rgba(0,0,0,0.5)", color: "white", fontSize: "0.75rem", padding: "4px 12px", borderRadius: "100px" }}>
                  {activeImg + 1} / {property.images.length}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", padding: "8px", backgroundColor: "white" }}>
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: "72px", height: "52px", borderRadius: "8px", overflow: "hidden",
                      border: i === activeImg ? "2px solid #C9A96E" : "2px solid transparent",
                      cursor: "pointer", padding: 0, transition: "border 0.2s",
                    }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title + actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  {property.tags.map((tag) => (
                    <span key={tag} style={{ backgroundColor: "rgba(44,62,45,0.08)", color: "#2C3E2D", fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px", borderRadius: "100px" }}>{tag}</span>
                  ))}
                </div>
                <h1 className="font-serif" style={{ color: "#1A1A1A", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, marginBottom: "6px" }}>{property.title}</h1>
                <p style={{ color: "#8B7355", fontSize: "0.9rem" }}>📍 {property.address}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => { toggleFavourite(property.id); toast.success(fav ? "Removed from saved" : "Added to saved!"); }}
                  style={{
                    padding: "10px 16px", borderRadius: "10px",
                    border: "1px solid rgba(201,169,110,0.4)",
                    backgroundColor: fav ? "rgba(239,68,68,0.05)" : "white",
                    cursor: "pointer", fontSize: "0.875rem", fontWeight: 600,
                    color: fav ? "#EF4444" : "#2C3E2D", transition: "all 0.2s",
                  }}
                >
                  {fav ? "❤️ Saved" : "🤍 Save"}
                </button>
                <button
                  onClick={() => { navigator.share ? navigator.share({ title: property.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href).then(() => toast.success("Link copied!")); }}
                  style={{
                    padding: "10px 16px", borderRadius: "10px",
                    border: "1px solid rgba(201,169,110,0.4)",
                    backgroundColor: "white", cursor: "pointer",
                    fontSize: "0.875rem", fontWeight: 600, color: "#2C3E2D",
                  }}
                >
                  ↗ Share
                </button>
              </div>
            </div>

            {/* Key stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
              {[
                { icon: "💰", label: "Price", value: formatPrice(property) },
                { icon: "🛏", label: "Bedrooms", value: property.bedrooms },
                { icon: "🛁", label: "Bathrooms", value: property.bathrooms },
                { icon: "📐", label: "Size", value: property.sqft.toLocaleString() + " sqft" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  backgroundColor: "white", borderRadius: "12px", padding: "16px",
                  border: "1px solid rgba(201,169,110,0.15)", textAlign: "center",
                }}>
                  <p style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{stat.icon}</p>
                  <p style={{ color: "#8B7355", fontSize: "0.72rem", marginBottom: "2px" }}>{stat.label}</p>
                  <p className="font-serif" style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "0.95rem" }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "20px", border: "1px solid rgba(201,169,110,0.15)" }}>
              <h2 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.2rem", marginBottom: "16px" }}>About This Property</h2>
              <p style={{ color: "#6B5B4E", lineHeight: 1.8, fontSize: "0.95rem" }}>
                {aiDesc || property.description}
              </p>
              <button
                onClick={handleGenerateDesc}
                disabled={aiLoading}
                style={{
                  marginTop: "16px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(44,62,45,0.3)",
                  borderRadius: "8px", padding: "8px 16px",
                  color: "#2C3E2D", fontSize: "0.8rem", fontWeight: 600,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "6px",
                  opacity: aiLoading ? 0.7 : 1, transition: "all 0.2s",
                }}
              >
                {aiLoading ? (
                  <><span style={{ width: "12px", height: "12px", border: "2px solid rgba(44,62,45,0.3)", borderTopColor: "#2C3E2D", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Generating...</>
                ) : (
                  <>🤖 Generate AI Description</>
                )}
              </button>
            </div>

            {/* Features */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "20px", border: "1px solid rgba(201,169,110,0.15)" }}>
              <h2 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.2rem", marginBottom: "16px" }}>Key Features</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                {property.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "rgba(44,62,45,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2C3E2D", fontSize: "0.7rem", flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#6B5B4E", fontSize: "0.875rem" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mortgage calculator (sale only) */}
            {property.type === "sale" && property.price && (
              <div style={{ marginBottom: "20px" }}>
                <MortgageCalculator price={property.price} />
              </div>
            )}

            {/* Map */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(201,169,110,0.15)", marginBottom: "20px" }}>
              <div style={{ padding: "20px 24px 0" }}>
                <h2 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.2rem", marginBottom: "4px" }}>Location</h2>
                <p style={{ color: "#8B7355", fontSize: "0.85rem", marginBottom: "16px" }}>{property.address}</p>
              </div>
              <iframe
                title="Property location"
                src={"https://www.openstreetmap.org/export/embed.html?bbox=" +
                  (property.lng - 0.01) + "%2C" +
                  (property.lat - 0.01) + "%2C" +
                  (property.lng + 0.01) + "%2C" +
                  (property.lat + 0.01) +
                  "&layer=mapnik&marker=" +
                  property.lat + "%2C" + property.lng}
                width="100%"
                height="280"
                style={{ border: 0, display: "block" }}
                loading="lazy"
              />
            </div>

            {/* Similar properties */}
            {similar.length > 0 && (
              <div>
                <h2 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.2rem", marginBottom: "16px" }}>
                  Similar Properties in {property.area}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
                  {similar.map((p) => (
                    <Link
                      key={p.id}
                      to={"/listings/" + p.id}
                      style={{ textDecoration: "none", backgroundColor: "white", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(201,169,110,0.15)", display: "block", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                      <div style={{ padding: "14px" }}>
                        <p className="font-serif" style={{ color: "#1A1A1A", fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px" }}>{p.title}</p>
                        <p style={{ color: "#C9A96E", fontWeight: 700, fontSize: "0.95rem" }}>{formatPrice(p)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "100px" }}>

            {/* Price card */}
            <div style={{ backgroundColor: "#2C3E2D", borderRadius: "16px", padding: "24px", color: "white" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {property.type === "rent" ? "Monthly Rent" : "Asking Price"}
              </p>
              <p className="font-serif" style={{ color: "#C9A96E", fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>
                {formatPrice(property)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { label: "Type", value: property.propertyType },
                  { label: "Tenure", value: property.type === "rent" ? "Rental" : "Freehold" },
                  { label: "Area", value: property.area },
                  { label: "Agent", value: property.agent },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>{item.label}</span>
                    <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent card */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid rgba(201,169,110,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <img src={property.agentImage} alt={property.agent} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <p style={{ color: "#1A1A1A", fontWeight: 600, fontSize: "0.9rem" }}>{property.agent}</p>
                  <p style={{ color: "#8B7355", fontSize: "0.75rem" }}>Senior Property Consultant</p>
                </div>
              </div>
              <a href="tel:02079468000" style={{
                display: "block", textAlign: "center", backgroundColor: "#2C3E2D", color: "#C9A96E",
                textDecoration: "none", padding: "12px", borderRadius: "10px",
                fontWeight: 600, fontSize: "0.875rem", marginBottom: "8px", transition: "all 0.2s",
              }}>
                📞 020 7946 8000
              </a>
            </div>

            {/* Enquiry form */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid rgba(201,169,110,0.15)" }}>
              <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1rem", marginBottom: "16px" }}>Request a Viewing</h3>
              {enquirySent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</p>
                  <p style={{ color: "#2C3E2D", fontWeight: 600, marginBottom: "4px" }}>Enquiry Sent!</p>
                  <p style={{ color: "#8B7355", fontSize: "0.8rem" }}>{property.agent} will contact you within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { name: "name", placeholder: "Your full name", type: "text", required: true },
                    { name: "email", placeholder: "Email address", type: "email", required: true },
                    { name: "phone", placeholder: "Phone number", type: "tel", required: false },
                  ].map((field) => (
                    <input
                      key={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={enquiryForm[field.name]}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, [field.name]: e.target.value })}
                      style={{
                        border: "1px solid rgba(201,169,110,0.25)", borderRadius: "8px",
                        padding: "10px 12px", fontSize: "0.825rem", color: "#1A1A1A", outline: "none",
                      }}
                    />
                  ))}
                  <textarea
                    placeholder={"I'm interested in " + property.title + "..."}
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    style={{
                      border: "1px solid rgba(201,169,110,0.25)", borderRadius: "8px",
                      padding: "10px 12px", fontSize: "0.825rem", color: "#1A1A1A",
                      outline: "none", resize: "none",
                    }}
                  />
                  <button type="submit" style={{
                    backgroundColor: "#2C3E2D", color: "#C9A96E",
                    border: "none", borderRadius: "10px", padding: "12px",
                    fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s",
                  }}>
                    Send Enquiry →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}