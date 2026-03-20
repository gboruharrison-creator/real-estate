import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export default function LanguageSwitcher({ dark = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const borderColor = dark ? "rgba(201,169,110,0.4)" : "rgba(44,62,45,0.25)";
  const textColor = dark ? "rgba(255,255,255,0.8)" : "#2C3E2D";
  const bgColor = dark ? "rgba(255,255,255,0.05)" : "white";
  const dropdownBg = dark ? "#2C3E2D" : "white";
  const dropdownBorder = dark ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.2)";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "6px 12px", borderRadius: "100px",
          border: "1px solid " + borderColor,
          backgroundColor: bgColor,
          color: textColor, cursor: "pointer",
          fontSize: "0.8rem", fontWeight: 500,
          transition: "all 0.2s",
        }}
      >
        <span style={{ fontSize: "14px" }}>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <span style={{
          fontSize: "9px", opacity: 0.6,
          display: "inline-block", transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, marginTop: "6px",
          backgroundColor: dropdownBg,
          border: "1px solid " + dropdownBorder,
          borderRadius: "12px", overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          zIndex: 100, minWidth: "130px",
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                width: "100%", padding: "10px 14px",
                border: "none",
                backgroundColor: lang.code === i18n.language
                  ? (dark ? "rgba(201,169,110,0.15)" : "rgba(44,62,45,0.06)")
                  : "transparent",
                color: lang.code === i18n.language
                  ? (dark ? "#C9A96E" : "#2C3E2D")
                  : (dark ? "rgba(255,255,255,0.7)" : "#6B5B4E"),
                fontWeight: lang.code === i18n.language ? 700 : 400,
                cursor: "pointer", fontSize: "0.8rem", textAlign: "left",
                transition: "background 0.15s",
              }}
            >
              <span style={{ fontSize: "14px" }}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}