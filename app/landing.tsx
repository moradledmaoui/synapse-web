"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  const [lang, setLang] = useState<"en"|"fr">("en");
  const [email, setEmail] = useState("");
  const [billing, setBilling] = useState<"monthly"|"annual">("monthly");

  const t = {
    en: {
      nav: ["Features", "Performance", "Pricing", "DEX Lab"],
      cta: "Start free",
      badge: "Live simulation · 34 trades · WR 76.5%",
      h1a: "The algorithm that",
      h1b: "trades for you",
      sub: "6Napse combines 6 layers of artificial intelligence to detect, score and execute trades with hedge fund precision — 24 hours a day.",
      cta1: "Start for free",
      cta2: "See how it works",
      how: "How it works",
      neurons_title: "6 neurons. 1 decision.",
      neurons_sub: "Every trade passes through 6 intelligence layers before execution. No shortcuts.",
      prod_label: "Products",
      prod_title: "Three trading engines.",
      prod_sub: "Each optimized for a different time horizon and risk profile.",
      perf_label: "Performance",
      perf_title: "Real results. Full transparency.",
      perf_sub: "We are building a public performance dashboard. Be the first to know when it launches.",
      perf_cta: "Notify me",
      perf_ph: "your@email.com",
      price_label: "Pricing",
      price_title: "Start free. Go live when ready.",
      price_sub: "No credit card required. Upgrade at any time.",
      monthly: "Monthly",
      annual: "Annual",
      save: "Save 20% annually",
      faq_label: "FAQ",
      faq_title: "Common questions.",
      final_title: "Join 6Napse today.",
      final_sub: "Free forever in simulation. Go live when you are ready.",
      final_cta: "Create my free account",
      final_cta2: "Read the docs",
    },
    fr: {
      nav: ["Fonctionnalités", "Performance", "Tarifs", "DEX Lab"],
      cta: "Commencer",
      badge: "Simulation live · 34 trades · WR 76.5%",
      h1a: "L algorithme qui",
      h1b: "trade à ta place",
      sub: "6Napse combine 6 couches d intelligence artificielle pour détecter, scorer et exécuter des trades avec la précision d un hedge fund — 24h/24.",
      cta1: "Commencer gratuitement",
      cta2: "Voir comment ca marche",
      how: "Comment ca marche",
      neurons_title: "6 neurones. 1 décision.",
      neurons_sub: "Chaque trade passe par 6 couches d intelligence avant l exécution. Sans raccourci.",
      prod_label: "Produits",
      prod_title: "Trois moteurs de trading.",
      prod_sub: "Chacun optimisé pour un horizon de temps et un profil de risque différent.",
      perf_label: "Performance",
      perf_title: "Vrais résultats. Transparence totale.",
      perf_sub: "Nous construisons un dashboard de performance public. Sois le premier informé du lancement.",
      perf_cta: "Me notifier",
      perf_ph: "ton@email.com",
      price_label: "Tarifs",
      price_title: "Commence gratuitement. Passe en live quand tu es prêt.",
      price_sub: "Sans carte bancaire. Évolution possible à tout moment.",
      monthly: "Mensuel",
      annual: "Annuel",
      save: "Économise 20% annuellement",
      faq_label: "FAQ",
      faq_title: "Questions fréquentes.",
      final_title: "Rejoins 6Napse aujourd hui.",
      final_sub: "Gratuit à vie en simulation. Passe en live quand tu es prêt.",
      final_cta: "Créer mon compte gratuit",
      final_cta2: "Lire la documentation",
    }
  }[lang];

  const neurons = {
    en: [
      { n:"01", name:"Market regime", desc:"Detects the market state among 8 regimes: trending, ranging, pre-breakout, breakout, volatile, bear, panic." },
      { n:"02", name:"Asset universe", desc:"6 data-driven universes: accumulation, momentum, short squeeze, bas de cycle, pepites, defensif." },
      { n:"03", name:"Signal generation", desc:"18 strategies filtered by regime. Multi-timeframe: 5m detection, 15m validation, 1h decision, 4h veto." },
      { n:"04", name:"Opportunity score", desc:"7-dimensional scoring: signal strength, regime confidence, sentiment, volume, ATR, MTF bias, squeeze." },
      { n:"05", name:"Risk calibration", desc:"Fixed fractional 1% per trade. Drawdown adaptive multipliers. Factorial correlation limits per strategy." },
      { n:"06", name:"Smart execution", desc:"Auto SL/TP, trailing stop ATR, real-time monitoring. Swing, scalp book and DEX Lab — all automated." },
    ],
    fr: [
      { n:"01", name:"Régime de marché", desc:"Détecte l état du marché parmi 8 régimes : trending, ranging, pre-breakout, breakout, volatile, bear, panic." },
      { n:"02", name:"Univers d assets", desc:"6 univers data-driven : accumulation, momentum, short squeeze, bas de cycle, pépites, défensif." },
      { n:"03", name:"Génération de signal", desc:"18 stratégies filtrées par régime. Multi-timeframe : détection 5m, validation 15m, décision 1h, veto 4h." },
      { n:"04", name:"Score d opportunité", desc:"Scoring 7 dimensions : force signal, confiance régime, sentiment, volume, ATR, biais MTF, squeeze." },
      { n:"05", name:"Calibration du risque", desc:"Fixed fractional 1% par trade. Multiplicateurs adaptatifs au drawdown. Limites de corrélation factorielle." },
      { n:"06", name:"Exécution intelligente", desc:"SL/TP automatiques, trailing stop ATR, monitoring temps réel. Swing, scalp book et DEX Lab — tout automatisé." },
    ]
  }[lang];

  const faqs = {
    en: [
      { q:"Can I lose money in simulation mode?", a:"No. Simulation uses virtual capital only. You can test all strategies without any financial risk. Go live only when you feel ready." },
      { q:"How is 6Napse different from 3Commas?", a:"6Napse adapts to 8 market regimes and selects strategies automatically. 3Commas gives you fixed tools. 6Napse thinks for you." },
      { q:"Do I need trading knowledge to use it?", a:"No. 6Napse handles detection, scoring, sizing and execution automatically. The dashboard lets you explore the logic but it is not required." },
      { q:"When can I switch to live trading?", a:"A built-in checklist validates your readiness: 100+ trades, win rate above 60%, drawdown below 10%, Binance API connected." },
      { q:"What exchanges are supported?", a:"Binance SPOT is primary. Coinbase and Kraken are planned for Elite. DEX Lab covers Base and Solana on-chain." },
      { q:"Is my API key safe?", a:"Your Binance API key is stored encrypted. We only request Spot Trading and Read permissions — no withdrawal access ever." },
    ],
    fr: [
      { q:"Puis-je perdre de l argent en simulation ?", a:"Non. La simulation utilise uniquement du capital virtuel. Tu peux tester toutes les stratégies sans risque financier. Tu passes en live quand tu es prêt." },
      { q:"Quelle différence avec 3Commas ?", a:"6Napse s adapte à 8 régimes de marché et sélectionne les stratégies automatiquement. 3Commas te donne des outils fixes. 6Napse pense pour toi." },
      { q:"Faut-il des connaissances en trading ?", a:"Non. 6Napse gère la détection, le scoring, le sizing et l exécution automatiquement. Le dashboard te permet d explorer la logique mais ce n est pas obligatoire." },
      { q:"Quand puis-je passer en live ?", a:"Une checklist intégrée valide ta préparation : 100+ trades, win rate > 60%, drawdown < 10%, API Binance connectée." },
      { q:"Quels exchanges sont supportés ?", a:"Binance SPOT est le principal. Coinbase et Kraken sont prévus pour l Elite. DEX Lab couvre Base et Solana on-chain." },
      { q:"Ma clé API est-elle sécurisée ?", a:"Ta clé API Binance est stockée chiffrée. Nous ne demandons que les permissions Spot Trading et Lecture — jamais d accès aux retraits." },
    ]
  }[lang];

  const prices = {
    en: [
      { tier:"FREE", price:"€0", per:"/month", tagline:"Simulation mode. No risk, full features.", feats:["Virtual capital $50,000 USDT","All 18 strategies","Full dashboard access","DEX Lab Phase 1","Telegram alerts","Shadow trading analysis"], cta:"Get started — free", featured:false },
      { tier:"PRO", price: billing==="monthly" ? "€49" : "€39", per:"/month", tagline:"Live trading. Your real capital on Binance.", feats:["Everything in Free","Live mode — Binance SPOT","Capital up to €50,000","Scalp book activated","Email + Telegram priority","1 year performance history"], cta:"Start Pro", featured:true },
      { tier:"ELITE", price: billing==="monthly" ? "€149" : "€119", per:"/month", tagline:"For serious traders and fund managers.", feats:["Everything in Pro","Up to 5 accounts","Unlimited capital","Multi-CEX support","DEX Lab Phase 2","API access + webhooks"], cta:"Contact us", featured:false },
    ],
    fr: [
      { tier:"FREE", price:"€0", per:"/mois", tagline:"Mode simulation. Sans risque, toutes les fonctionnalités.", feats:["Capital virtuel 50 000 USDT","18 stratégies complètes","Dashboard complet","DEX Lab Phase 1","Alertes Telegram","Analyse shadow trading"], cta:"Commencer gratuitement", featured:false },
      { tier:"PRO", price: billing==="monthly" ? "€49" : "€39", per:"/mois", tagline:"Trading live. Ton vrai capital sur Binance.", feats:["Tout le Free inclus","Mode live — Binance SPOT","Capital jusqu à 50 000€","Scalp book activé","Email + Telegram prioritaires","1 an d historique performance"], cta:"Commencer Pro", featured:true },
      { tier:"ELITE", price: billing==="monthly" ? "€149" : "€119", per:"/mois", tagline:"Pour les traders sérieux et gérants de fonds.", feats:["Tout le Pro inclus","Jusqu à 5 comptes","Capital illimité","Multi-CEX support","DEX Lab Phase 2","Accès API + webhooks"], cta:"Nous contacter", featured:false },
    ]
  }[lang];

  return (
    <div style={{ background:"#f9fafb", color:"#111827", fontFamily:"Inter, sans-serif" }}>

      {/* Nav */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 48px", borderBottom:"1px solid #e5e7eb", background:"rgba(255,255,255,0.95)", backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:18, fontWeight:700, letterSpacing:-0.5 }}>
          <span style={{ color:"#16a34a" }}>6</span>Napse
        </div>
        <div style={{ display:"flex", gap:28 }}>
          {t.nav.map(n => <a key={n} style={{ color:"#6b7280", fontSize:14, textDecoration:"none", cursor:"pointer" }}>{n}</a>)}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
            {(["en","fr"] as const).map(l => (
              <span key={l} onClick={() => setLang(l)}
                style={{ padding:"5px 10px", fontSize:12, fontFamily:"JetBrains Mono, monospace", cursor:"pointer", background: lang===l ? "#111827" : "transparent", color: lang===l ? "#fff" : "#6b7280" }}>
                {l.toUpperCase()}
              </span>
            ))}
          </div>
          <button onClick={() => router.push("/signup")}
            style={{ background:"#111827", color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer" }}>
            {t.cta}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background:"#fff", minHeight:"92vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 48px", textAlign:"center", borderBottom:"1px solid #e5e7eb" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:100, padding:"5px 14px", marginBottom:28, fontSize:12, color:"#16a34a", fontFamily:"JetBrains Mono, monospace" }}>
          <div style={{ width:6, height:6, background:"#16a34a", borderRadius:"50%", animation:"pulse 2s infinite" }} />
          {t.badge}
        </div>
        <h1 style={{ fontSize:60, fontWeight:700, lineHeight:1.08, letterSpacing:-2.5, marginBottom:20, maxWidth:780 }}>
          {t.h1a}<br/><em style={{ fontStyle:"normal", color:"#16a34a" }}>{t.h1b}</em>
        </h1>
        <p style={{ fontSize:18, color:"#6b7280", lineHeight:1.7, maxWidth:520, margin:"0 auto 36px" }}>{t.sub}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:56 }}>
          <button onClick={() => router.push("/signup")}
            style={{ background:"#111827", color:"#fff", padding:"13px 28px", borderRadius:10, fontSize:14, fontWeight:500, border:"none", cursor:"pointer" }}>
            {t.cta1}
          </button>
          <button style={{ background:"transparent", color:"#111827", padding:"13px 28px", borderRadius:10, fontSize:14, border:"1px solid #d1d5db", cursor:"pointer" }}>
            {t.cta2}
          </button>
        </div>
        {/* Terminal */}
        <div style={{ width:"100%", maxWidth:620, border:"1px solid #e5e7eb", borderRadius:12, overflow:"hidden", background:"#fff", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ background:"#f9fafb", padding:"10px 16px", display:"flex", alignItems:"center", gap:6, borderBottom:"1px solid #e5e7eb" }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
            <span style={{ fontSize:11, color:"#9ca3af", fontFamily:"JetBrains Mono, monospace", marginLeft:8 }}>6napse · signal engine · live</span>
          </div>
          <div style={{ padding:"18px 20px", fontFamily:"JetBrains Mono, monospace", fontSize:12, lineHeight:2.1, textAlign:"left" }}>
            {[
              { p:"$", k:"regime →", v:"RANGING", s:"ADX:18 | Squeeze:true | Conf:0.60", vc:"#111827", sc:"#6b7280" },
              { p:"$", k:"universe →", v:"accumulation", s:"15 assets selected", vc:"#111827", sc:"#6b7280" },
              { p:"$", k:"signal", v:"BUY SOLUSDT", s:"score:63.8 | confirm×1.20 | MTF:bullish", vc:"#111827", sc:"#6b7280" },
              { p:"$", k:"sizing →", v:"$2,266 USDT", s:"risk:1% | ATR:2.1% | DD:0%", vc:"#111827", sc:"#6b7280" },
              { p:"$", k:"opened →", v:"SL $84.20 · TP $91.50", s:"trailing:2.0 ATR", vc:"#16a34a", sc:"#6b7280" },
              { p:"$", k:"4h later →", v:"TP reached · +$118.42 USDT", s:"+5.23%", vc:"#16a34a", sc:"#16a34a" },
              { p:"$", k:"portfolio", v:"$50,595 total", s:"+595 USDT · WR 76.5%", vc:"#111827", sc:"#6b7280" },
            ].map((l,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ color:"#16a34a" }}>{l.p}</span>
                <span style={{ color:"#9ca3af" }}>{l.k}</span>
                <span style={{ color:l.vc, fontWeight:500 }}>{l.v}</span>
                <span style={{ color:l.sc }}>{l.s}</span>
                {i===6 && <span style={{ display:"inline-block", width:7, height:13, background:"#111827", animation:"blink 1s infinite", verticalAlign:"middle" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neurons */}
      <section style={{ background:"#f9fafb", padding:"96px 48px", borderBottom:"1px solid #e5e7eb" }}>
        <div style={{ fontSize:11, fontFamily:"JetBrains Mono, monospace", color:"#16a34a", letterSpacing:2, textTransform:"uppercase", marginBottom:12, textAlign:"center" }}>{t.how}</div>
        <h2 style={{ fontSize:44, fontWeight:700, letterSpacing:-1.5, textAlign:"center", marginBottom:12 }}>{t.neurons_title}</h2>
        <p style={{ fontSize:16, color:"#6b7280", textAlign:"center", marginBottom:56 }}>{t.neurons_sub}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, maxWidth:860, margin:"0 auto" }}>
          {neurons.map(n => (
            <div key={n.n} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:24 }}>
              <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10, color:"#16a34a", marginBottom:10, letterSpacing:1 }}>{n.n}</div>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>{n.name}</div>
              <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.6 }}>{n.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ background:"#fff", padding:"96px 48px", borderBottom:"1px solid #e5e7eb" }}>
        <div style={{ fontSize:11, fontFamily:"JetBrains Mono, monospace", color:"#16a34a", letterSpacing:2, textTransform:"uppercase", marginBottom:12, textAlign:"center" }}>{t.prod_label}</div>
        <h2 style={{ fontSize:44, fontWeight:700, letterSpacing:-1.5, textAlign:"center", marginBottom:12 }}>{t.prod_title}</h2>
        <p style={{ fontSize:16, color:"#6b7280", textAlign:"center", marginBottom:56 }}>{t.prod_sub}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:860, margin:"0 auto" }}>
          {[
            { tag:"Active", title:"CEX Swing", desc: lang==="en" ? "Automated swing trading on Binance SPOT. Mean reversion, momentum, market structure. Positions from 4 to 24 hours." : "Trading swing automatisé sur Binance SPOT. Mean reversion, momentum, market structure. Positions de 4 à 24 heures.", stats:[{v:"18",l:"strategies"},{v:"8",l:"regimes"},{v:"1%",l:"risk/trade"}] },
            { tag:"Active", title:"Scalp Book", desc: lang==="en" ? "High-frequency scalping on 5m/15m timeframes. Isolated capital, separate portfolio. 5 to 30 minute positions." : "Scalping haute fréquence sur 5m/15m. Capital isolé, portfolio séparé. Positions de 5 à 30 minutes.", stats:[{v:"5m",l:"timeframe"},{v:"5",l:"max pos."},{v:"30m",l:"timeout"}] },
            { tag:"Phase 1", title:"DEX Lab", desc: lang==="en" ? "On-chain gem detection on Base and Solana. Flow-driven scoring: absorption signal, BQI, security filter, age." : "Détection de pépites on-chain sur Base et Solana. Scoring flow-driven : signal absorption, BQI, sécurité, age.", stats:[{v:"2",l:"chains"},{v:"30m",l:"scan"},{v:"H+3",l:"decision"}] },
          ].map(p => (
            <div key={p.title} style={{ border:"1px solid #e5e7eb", borderRadius:16, padding:28, background:"#f9fafb" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:10, fontFamily:"JetBrains Mono, monospace", color:"#16a34a", background:"#f0fdf4", border:"1px solid #bbf7d0", padding:"3px 10px", borderRadius:100, marginBottom:16 }}>
                <div style={{ width:5, height:5, background:"#16a34a", borderRadius:"50%" }} />{p.tag}
              </div>
              <div style={{ fontSize:18, fontWeight:600, marginBottom:8, letterSpacing:-0.3 }}>{p.title}</div>
              <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.6, marginBottom:20 }}>{p.desc}</div>
              <div style={{ display:"flex", gap:16 }}>
                {p.stats.map(s => (
                  <div key={s.l} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:"#16a34a", fontFamily:"JetBrains Mono, monospace" }}>{s.v}</div>
                    <div style={{ fontSize:10, color:"#9ca3af", fontFamily:"JetBrains Mono, monospace" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance waitlist */}
      <section style={{ background:"#f9fafb", padding:"96px 48px", borderBottom:"1px solid #e5e7eb", textAlign:"center" }}>
        <div style={{ fontSize:11, fontFamily:"JetBrains Mono, monospace", color:"#16a34a", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>{t.perf_label}</div>
        <h2 style={{ fontSize:44, fontWeight:700, letterSpacing:-1.5, marginBottom:12 }}>{t.perf_title}</h2>
        <p style={{ fontSize:16, color:"#6b7280", marginBottom:40 }}>{t.perf_sub}</p>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:48, maxWidth:560, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:8 }}>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t.perf_ph}
              style={{ flex:1, padding:"11px 16px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, outline:"none", fontFamily:"Inter, sans-serif" }} />
            <button style={{ padding:"11px 20px", background:"#111827", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap" }}>
              {t.perf_cta}
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background:"#fff", padding:"96px 48px", borderBottom:"1px solid #e5e7eb" }}>
        <div style={{ fontSize:11, fontFamily:"JetBrains Mono, monospace", color:"#16a34a", letterSpacing:2, textTransform:"uppercase", marginBottom:12, textAlign:"center" }}>{t.price_label}</div>
        <h2 style={{ fontSize:44, fontWeight:700, letterSpacing:-1.5, textAlign:"center", marginBottom:12 }}>{t.price_title}</h2>
        <p style={{ fontSize:16, color:"#6b7280", textAlign:"center", marginBottom:32 }}>{t.price_sub}</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:48 }}>
          <div style={{ display:"flex", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:100, padding:4 }}>
            {(["monthly","annual"] as const).map(b => (
              <div key={b} onClick={() => setBilling(b)}
                style={{ padding:"5px 16px", borderRadius:100, fontSize:12, cursor:"pointer", fontFamily:"JetBrains Mono, monospace", background: billing===b ? "#111827" : "transparent", color: billing===b ? "#fff" : "#6b7280" }}>
                {b==="monthly" ? t.monthly : t.annual}
              </div>
            ))}
          </div>
          {billing==="annual" && (
            <div style={{ background:"#f0fdf4", color:"#16a34a", fontSize:11, fontFamily:"JetBrains Mono, monospace", padding:"3px 10px", borderRadius:100, border:"1px solid #bbf7d0" }}>{t.save}</div>
          )}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:860, margin:"0 auto" }}>
          {prices.map(p => (
            <div key={p.tier} style={{ border: p.featured ? "none" : "1px solid #e5e7eb", borderRadius:16, padding:28, background: p.featured ? "#111827" : "#f9fafb", position:"relative" }}>
              {p.featured && (
                <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:"#16a34a", color:"#fff", fontSize:10, fontFamily:"JetBrains Mono, monospace", padding:"3px 14px", borderRadius:100, whiteSpace:"nowrap" }}>
                  Most popular
                </div>
              )}
              <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10, color: p.featured ? "rgba(255,255,255,0.4)" : "#9ca3af", marginBottom:8, letterSpacing:1 }}>{p.tier}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:4 }}>
                <span style={{ fontSize:38, fontWeight:700, letterSpacing:-1.5, color: p.featured ? "#fff" : "#111827" }}>{p.price}</span>
                <span style={{ fontSize:14, color: p.featured ? "rgba(255,255,255,0.4)" : "#9ca3af" }}>{p.per}</span>
              </div>
              <div style={{ fontSize:13, color: p.featured ? "rgba(255,255,255,0.5)" : "#6b7280", marginBottom:20, paddingBottom:20, borderBottom: p.featured ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb" }}>{p.tagline}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:24 }}>
                {p.feats.map(f => (
                  <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:12, color: p.featured ? "rgba(255,255,255,0.7)" : "#6b7280" }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", background: p.featured ? "rgba(22,163,74,0.2)" : "#f0fdf4", border: p.featured ? "1px solid rgba(22,163,74,0.4)" : "1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <div style={{ width:5, height:5, background:"#16a34a", borderRadius:"50%" }} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => router.push(p.tier==="FREE" ? "/signup" : "/signup")}
                style={{ width:"100%", padding:12, borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", border: p.featured ? "none" : "1px solid #d1d5db", background: p.featured ? "#16a34a" : "#fff", color: p.featured ? "#fff" : "#111827", fontFamily:"Inter, sans-serif" }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background:"#f9fafb", padding:"96px 48px", borderBottom:"1px solid #e5e7eb" }}>
        <div style={{ fontSize:11, fontFamily:"JetBrains Mono, monospace", color:"#16a34a", letterSpacing:2, textTransform:"uppercase", marginBottom:12, textAlign:"center" }}>{t.faq_label}</div>
        <h2 style={{ fontSize:44, fontWeight:700, letterSpacing:-1.5, textAlign:"center", marginBottom:48 }}>{t.faq_title}</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, maxWidth:860, margin:"0 auto" }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:24 }}>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>{f.q}</div>
              <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.6 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background:"#111827", padding:"96px 48px", textAlign:"center" }}>
        <h2 style={{ fontSize:44, fontWeight:700, color:"#fff", letterSpacing:-1.5, marginBottom:16 }}>{t.final_title}</h2>
        <p style={{ fontSize:16, color:"rgba(255,255,255,0.4)", marginBottom:36, fontFamily:"JetBrains Mono, monospace" }}>{t.final_sub}</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => router.push("/signup")}
            style={{ background:"#fff", color:"#111827", padding:"14px 32px", borderRadius:10, fontSize:15, fontWeight:600, border:"none", cursor:"pointer" }}>
            {t.final_cta}
          </button>
          <button style={{ background:"transparent", color:"rgba(255,255,255,0.5)", padding:"14px 32px", borderRadius:10, fontSize:15, border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer" }}>
            {t.final_cta2}
          </button>
        </div>
      </section>

      <footer style={{ background:"#fff", borderTop:"1px solid #e5e7eb", padding:"32px 48px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:16, fontWeight:700 }}>
          <span style={{ color:"#16a34a" }}>6</span>Napse
        </div>
        <div style={{ display:"flex", gap:24 }}>
          {["Features","Pricing","Performance","DEX Lab","Privacy","Terms"].map(l => (
            <a key={l} style={{ fontSize:13, color:"#6b7280", textDecoration:"none", cursor:"pointer" }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:12, color:"#9ca3af", fontFamily:"JetBrains Mono, monospace" }}>© 2026 6Napse · Not financial advice</div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
      `}</style>
    </div>
  );
}
