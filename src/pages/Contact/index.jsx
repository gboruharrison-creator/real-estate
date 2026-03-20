import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const agents = [
  {
    name: "Sarah Mitchell",
    role: "Senior Property Consultant",
    speciality: "Luxury Sales — Knightsbridge, Chelsea, Mayfair",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    email: "sarah@estatly.co.uk",
    phone: "020 7946 8001",
  },
  {
    name: "James Okafor",
    role: "Property Consultant",
    speciality: "Residential Sales — North & East London",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    email: "james@estatly.co.uk",
    phone: "020 7946 8002",
  },
  {
    name: "Priya Sharma",
    role: "Lettings Specialist",
    speciality: "Rentals & Property Management",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
    email: "priya@estatly.co.uk",
    phone: "020 7946 8003",
  },
];

const hours = [
  { day: "Monday – Friday", time: "9:00am – 6:00pm" },
  { day: "Saturday", time: "10:00am – 4:00pm" },
  { day: "Sunday", time: "By appointment only" },
];

export default function Contact() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("enquiry");
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "buying", message: "" });
  const [valForm, setValForm] = useState({ name: "", email: "", phone: "", address: "", propertyType: "", bedrooms: "" });
  const [submitted, setSubmitted] = useState(false);
  const [valSubmitted, setValSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We will reply within 2 hours.");
  };

  const handleValuation = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setValSubmitted(true);
    toast.success("Valuation request received! We'll be in touch within 24 hours.");
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid rgba(201,169,110,0.25)",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "0.875rem",
    color: "#1A1A1A",
    outline: "none",
    backgroundColor: "white",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const tabs = [
    { key: "enquiry", label: t("contact.tabEnquiry") },
    { key: "valuation", label: t("contact.tabValuation") },
  ];

  const interestOptions = [
    { value: "buying", label: t("contact.buying") },
    { value: "renting", label: t("contact.renting") },
    { value: "selling", label: t("contact.selling") },
    { value: "valuation", label: t("contact.valuation") },
  ];

  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #2C3E2D 0%, #1a2b1c 100%)",
        padding: "60px 1.5rem 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
            {t("contact.badge")}
          </p>
          <h1 className="font-serif" style={{ color: "white", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", marginBottom: "12px" }}>
            {t("contact.title")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", maxWidth: "500px", lineHeight: 1.7 }}>
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "32px", alignItems: "start" }}>

            {/* ── FORM AREA ── */}
            <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(201,169,110,0.15)" }}>

              {/* Tabs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSubmitted(false); setValSubmitted(false); }}
                    style={{
                      padding: "16px", border: "none",
                      backgroundColor: activeTab === tab.key ? "rgba(44,62,45,0.05)" : "transparent",
                      color: activeTab === tab.key ? "#2C3E2D" : "#8B7355",
                      fontWeight: activeTab === tab.key ? 700 : 400,
                      fontSize: "0.875rem", cursor: "pointer",
                      borderBottom: activeTab === tab.key ? "2px solid #2C3E2D" : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Enquiry Form */}
              {activeTab === "enquiry" && (
                <div style={{ padding: "28px" }}>
                  {submitted ? (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
                      <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.3rem", marginBottom: "8px" }}>
                        {t("contact.received")}, {form.name.split(" ")[0]}!
                      </h3>
                      <p style={{ color: "#8B7355", lineHeight: 1.7, marginBottom: "8px" }}>
                        {t("contact.receivedDesc")} <strong>{form.email}</strong> {t("contact.receivedDesc2")}
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", type: "buying", message: "" }); }}
                        style={{ marginTop: "16px", border: "1px solid rgba(44,62,45,0.3)", backgroundColor: "transparent", color: "#2C3E2D", padding: "10px 24px", borderRadius: "100px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        {t("contact.sendAnother")}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquiry} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                            {t("contact.name")} *
                          </label>
                          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Jane Smith" style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"} />
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                            {t("contact.phone")}
                          </label>
                          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07700 000000" style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                          {t("contact.email")} *
                        </label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="jane@example.com" style={inputStyle}
                          onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"} />
                      </div>
                      <div>
                        <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                          {t("contact.interestedIn")}
                        </label>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {interestOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setForm({ ...form, type: opt.value })}
                              style={{
                                padding: "7px 16px", borderRadius: "100px", cursor: "pointer",
                                border: form.type === opt.value ? "none" : "1px solid rgba(201,169,110,0.3)",
                                backgroundColor: form.type === opt.value ? "#2C3E2D" : "transparent",
                                color: form.type === opt.value ? "#C9A96E" : "#8B7355",
                                fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize",
                                transition: "all 0.2s",
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                          {t("contact.message")} *
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          required rows={4}
                          placeholder={t("contact.messagePlaceholder")}
                          style={{ ...inputStyle, resize: "none" }}
                          onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          backgroundColor: "#2C3E2D", color: "#C9A96E",
                          border: "none", borderRadius: "10px", padding: "14px",
                          fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.7 : 1, transition: "all 0.2s",
                        }}
                      >
                        {loading ? t("contact.sending") : t("contact.sendMessage")}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Valuation Form */}
              {activeTab === "valuation" && (
                <div style={{ padding: "28px" }}>
                  {valSubmitted ? (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏡</div>
                      <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.3rem", marginBottom: "8px" }}>
                        {t("contact.valReceived")}
                      </h3>
                      <p style={{ color: "#8B7355", lineHeight: 1.7, marginBottom: "8px" }}>
                        {t("contact.valReceivedDesc")}
                      </p>
                      <button
                        onClick={() => { setValSubmitted(false); setValForm({ name: "", email: "", phone: "", address: "", propertyType: "", bedrooms: "" }); }}
                        style={{ marginTop: "16px", border: "1px solid rgba(44,62,45,0.3)", backgroundColor: "transparent", color: "#2C3E2D", padding: "10px 24px", borderRadius: "100px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        {t("contact.submitAnother")}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleValuation} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <p style={{ color: "#8B7355", fontSize: "0.875rem", lineHeight: 1.6, padding: "12px 14px", backgroundColor: "rgba(201,169,110,0.08)", borderRadius: "10px", border: "1px solid rgba(201,169,110,0.2)" }}>
                        {t("contact.valuationBadge")}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{t("contact.name")} *</label>
                          <input value={valForm.name} onChange={(e) => setValForm({ ...valForm, name: e.target.value })} required placeholder="Jane Smith" style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"} />
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{t("contact.phone")} *</label>
                          <input value={valForm.phone} onChange={(e) => setValForm({ ...valForm, phone: e.target.value })} required placeholder="07700 000000" style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{t("contact.email")} *</label>
                        <input type="email" value={valForm.email} onChange={(e) => setValForm({ ...valForm, email: e.target.value })} required placeholder="jane@example.com" style={inputStyle}
                          onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"} />
                      </div>
                      <div>
                        <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{t("contact.address")} *</label>
                        <input value={valForm.address} onChange={(e) => setValForm({ ...valForm, address: e.target.value })} required placeholder={t("contact.addressPlaceholder")} style={inputStyle}
                          onFocus={(e) => e.target.style.borderColor = "#2C3E2D"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(201,169,110,0.25)"} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{t("contact.propertyType")}</label>
                          <select value={valForm.propertyType} onChange={(e) => setValForm({ ...valForm, propertyType: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                            <option value="">{t("contact.selectType")}</option>
                            {["House", "Apartment", "Flat", "Studio", "Penthouse", "Mews House", "Townhouse", "Bungalow"].map((type) => <option key={type}>{type}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", color: "#6B5B4E", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{t("contact.bedroomsLabel")}</label>
                          <select value={valForm.bedrooms} onChange={(e) => setValForm({ ...valForm, bedrooms: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                            <option value="">{t("contact.selectBeds")}</option>
                            {["Studio", "1", "2", "3", "4", "5", "6+"].map((b) => <option key={b}>{b}</option>)}
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          backgroundColor: "#C9A96E", color: "#2C3E2D",
                          border: "none", borderRadius: "10px", padding: "14px",
                          fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.7 : 1, transition: "all 0.2s",
                        }}
                      >
                        {loading ? t("contact.submitting") : t("contact.requestValuation")}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Contact info */}
              <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(201,169,110,0.15)" }}>
                <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1rem", marginBottom: "18px" }}>{t("contact.office")}</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { icon: "📍", label: "Address", value: "14 Berkeley Square\nLondon W1J 6BX" },
                    { icon: "📞", label: "Phone", value: "020 7946 8000", href: "tel:02079468000" },
                    { icon: "✉️", label: "Email", value: "hello@estatly.co.uk", href: "mailto:hello@estatly.co.uk" },
                  ].map((item) => (
                    <li key={item.label} style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "1.1rem", marginTop: "2px" }}>{item.icon}</span>
                      <div>
                        <p style={{ color: "#8B7355", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>{item.label}</p>
                        {item.href ? (
                          <a href={item.href} style={{ color: "#2C3E2D", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>{item.value}</a>
                        ) : (
                          <p style={{ color: "#1A1A1A", fontSize: "0.875rem", whiteSpace: "pre-line" }}>{item.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hours */}
              <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid rgba(201,169,110,0.15)" }}>
                <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1rem", marginBottom: "16px" }}>{t("contact.hoursTitle")}</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {hours.map((h) => (
                    <li key={h.day} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
                      <span style={{ color: "#6B5B4E", fontSize: "0.875rem" }}>{h.day}</span>
                      <span style={{ color: "#2C3E2D", fontWeight: 600, fontSize: "0.875rem" }}>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency */}
              <div style={{
                background: "linear-gradient(135deg, #2C3E2D, #1a2b1c)",
                borderRadius: "16px", padding: "20px", textAlign: "center",
              }}>
                <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📞</p>
                <h3 className="font-serif" style={{ color: "white", fontSize: "1rem", marginBottom: "6px" }}>{t("contact.urgent")}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginBottom: "12px" }}>{t("contact.urgentDesc")}</p>
                <a href="tel:02079468000" style={{ display: "block", backgroundColor: "#C9A96E", color: "#2C3E2D", textDecoration: "none", padding: "10px", borderRadius: "8px", fontWeight: 700, fontSize: "0.875rem" }}>
                  020 7946 8000
                </a>
              </div>
            </div>
          </div>

          {/* ── MEET THE TEAM ── */}
          <div style={{ marginTop: "48px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <p style={{ color: "#C9A96E", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>{t("contact.teamBadge")}</p>
              <h2 className="font-serif" style={{ color: "#1A1A1A", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>{t("contact.teamTitle")}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {agents.map((agent) => (
                <div key={agent.name} style={{
                  backgroundColor: "white", borderRadius: "16px", padding: "24px",
                  border: "1px solid rgba(201,169,110,0.15)", textAlign: "center",
                  transition: "all 0.3s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <img src={agent.image} alt={agent.name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px", display: "block", border: "3px solid rgba(201,169,110,0.3)" }} />
                  <h3 className="font-serif" style={{ color: "#1A1A1A", fontSize: "1.1rem", fontWeight: 600, marginBottom: "4px" }}>{agent.name}</h3>
                  <p style={{ color: "#2C3E2D", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>{agent.role}</p>
                  <p style={{ color: "#8B7355", fontSize: "0.78rem", marginBottom: "16px", lineHeight: 1.5 }}>{agent.speciality}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a href={"tel:" + agent.phone.replace(/\s/g, "")} style={{
                      flex: 1, display: "block", backgroundColor: "#2C3E2D", color: "#C9A96E",
                      textDecoration: "none", padding: "9px", borderRadius: "8px",
                      fontWeight: 600, fontSize: "0.78rem", transition: "all 0.2s",
                    }}>{t("contact.call")}</a>
                    <a href={"mailto:" + agent.email} style={{
                      flex: 1, display: "block", border: "1px solid rgba(44,62,45,0.25)", color: "#2C3E2D",
                      textDecoration: "none", padding: "9px", borderRadius: "8px",
                      fontWeight: 600, fontSize: "0.78rem", transition: "all 0.2s",
                    }}>{t("contact.emailBtn")}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── MAP ── */}
          <div style={{ marginTop: "48px", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(201,169,110,0.15)" }}>
            <iframe
              title="Estatly Office Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1530%2C51.5080%2C-0.1430%2C51.5130&layer=mapnik&marker=51.5105%2C-0.1480"
              width="100%"
              height="360"
              style={{ border: 0, display: "block" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
