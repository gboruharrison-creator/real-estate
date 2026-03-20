import { useState, useEffect } from "react";

const DEV = {
  name: "Harrison Gboru",
  title: "Full-Stack Developer & AI Integration Specialist",
  email: "gboruharrison@gmail.com",
  github: "https://github.com/gboruharrison-creator",
  linkedin: "https://www.linkedin.com/in/harrison-gboru-52a142264/",
  stack: [
    "React", "Vite", "Tailwind CSS", "JavaScript",
    "HTML5", "CSS3", "Supabase", "REST APIs", "AI Agents", "Automation", "i18n",
  ],
  services: [
    { icon: "🌐", label: "Web Applications", desc: "React · Vite · Tailwind" },
    { icon: "🤖", label: "AI Integration", desc: "AI Assistant · Chatbots · AI Agents · N8N ·APIs" },
    { icon: "⚡", label: "Business Automation", desc: "Save time · Cut costs" },
    { icon: "🗄️", label: "Backend & Database", desc: "Supabase · REST APIs" },
  ],
  built: [
    { icon: "🦷", name: "BrightSmile Dental", desc: "5-page site, AI chatbot, 5 languages, SEO", url: "https://dental-website-theta.vercel.app" },
    { icon: "🍝", name: "Gusto Restaurant", desc: "Live cart, AI recommender, 2 languages", url: "https://gusto-restaurant-ebon.vercel.app" },
    { icon: "📊", name: "Nexus Analytics", desc: "TypeScript SaaS dashboard, Recharts, Zustand, AI reports", url: "https://nexus-analytics-three.vercel.app" },
    { icon: "🏠", name: "Estatly Real Estate", desc: "20 listings, AI advisor, mortgage calc, 3 languages", url: "https://estatly-london.vercel.app" },
    { icon: "💼", name: "Portfolio Site", desc: "Personal portfolio, animated, AI contact bot", url: "" },
  ],
  available: true,
};

export default function DeveloperCard() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "work", message: "" });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      form.type === "work" ? "Work Enquiry — " + form.name :
      form.type === "collab" ? "Collaboration Proposal — " + form.name :
      "Employment Opportunity — " + form.name
    );
    const body = encodeURIComponent(
      "From: " + form.name + "\nEmail: " + form.email + "\n\n" + form.message
    );
    window.location.href = "mailto:" + DEV.email + "?subject=" + subject + "&body=" + body;
    setSent(true);
  };

  return (
    <>
      {/* Trigger — sits in footer */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 group"
      >
        <span className="text-xs text-gray-500 group-hover:text-accent transition-colors">
          Designed & built by
        </span>
        <span className="text-xs font-semibold text-accent hover:underline transition-colors">
          {DEV.name}
        </span>
        {DEV.available && (
          <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 text-xs px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
            Available
          </span>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative bg-dark text-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-dark border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-sm text-white">
                  {DEV.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm">{DEV.name}</p>
                  <p className="text-xs text-gray-400">{DEV.title}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-6">

              {/* Availability banner */}
              {DEV.available && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                  <p className="text-green-300 text-sm">
                    <strong>Open to opportunities</strong> — remote roles, freelance projects, and long-term partnerships welcome.
                  </p>
                </div>
              )}

              {/* Bio */}
              <p className="text-gray-300 text-sm leading-relaxed">
                I build modern web applications and help businesses unlock real value through AI and automation. From React frontends to Supabase backends, AI-powered chatbots to workflow automation — I deliver complete digital solutions that save clients time and money. Whether you need a stunning website, an AI assistant trained on your business, or a system that automates your operations, I build it end to end. Currently open to remote roles, freelance projects, and long-term partnerships while building my own AI-powered web studio.
              </p>

              {/* What I do */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">What I Do</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEV.services.map((s) => (
                    <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-start gap-3">
                      <span className="text-xl">{s.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{s.label}</p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {DEV.stack.map((tech) => (
                    <span key={tech} className="bg-white/10 text-gray-200 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Portfolio Projects (2025)</p>
                <div className="space-y-2">
                  {DEV.built.map((project) => (
                    <div key={project.name} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <span className="text-xl">{project.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{project.name}</p>
                        <p className="text-xs text-gray-400">{project.desc}</p>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: "#2ABFA3",
                            border: "1px solid rgba(42,191,163,0.3)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            transition: "all 0.2s",
                          }}
                        >
                          Live →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3">
                <a
                  href={DEV.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-3 text-sm font-medium transition-all"
                >
                  ⌥ GitHub
                </a>
                <a
                  href={DEV.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl py-3 text-sm font-medium text-blue-300 transition-all"
                >
                  in LinkedIn
                </a>
                <a
                  href={"mailto:" + DEV.email}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 border border-accent/30 rounded-xl py-3 text-sm font-medium text-accent transition-all"
                >
                  ✉ Email
                </a>
              </div>

              {/* Contact form */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Send a Message</p>

                {sent ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                    <p className="text-2xl mb-2">✅</p>
                    <p className="text-green-300 font-semibold mb-1">Message drafted!</p>
                    <p className="text-gray-400 text-xs">Your email app has opened with the message pre-filled. Just hit send.</p>
                    <button onClick={() => setSent(false)} className="mt-3 text-xs text-gray-400 hover:text-white underline">
                      Send another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "work", label: "💼 Hire Me", desc: "Freelance / Project" },
                        { key: "collab", label: "🤝 Collaborate", desc: "Joint project" },
                        { key: "employ", label: "🏢 Employment", desc: "Full-time / Remote" },
                      ].map((type) => (
                        <button
                          key={type.key}
                          type="button"
                          onClick={() => setForm({ ...form, type: type.key })}
                          className={
                            "rounded-xl border p-3 text-center transition-all " +
                            (form.type === type.key
                              ? "bg-accent/20 border-accent text-accent"
                              : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30")
                          }
                        >
                          <p className="text-xs font-semibold">{type.label}</p>
                          <p className="text-xs opacity-70 mt-0.5">{type.desc}</p>
                        </button>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Your Name *</label>
                        <input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          placeholder="Jane Smith"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Your Email *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                          placeholder="jane@company.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        rows={3}
                        placeholder={
                          form.type === "work"
                            ? "Tell me about your project, what you need built, budget, and timeline..."
                            : form.type === "collab"
                            ? "What are you working on and how could we build something together?"
                            : "Tell me about the role, your company, and what you're looking for..."
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-accent hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                    >
                      Open Email App →
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      This pre-fills your email app. Your message goes directly to{" "}
                      <span className="text-accent">gboruharrison@gmail.com</span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
