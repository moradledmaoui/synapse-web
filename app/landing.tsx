"use client";
import "./landing.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  const [lang, setLang] = useState<"en"|"fr">("en");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const T = {
    en: {
      nav: ["Features","Shariah","Performance","Pricing","DEX Lab"],
      badge: "Algorithmic trading · Shariah compliant · Available now",
      h1a: "The algorithm that", h1b: "trades for you",
      sub: "6Napse combines 6 layers of artificial intelligence to detect, score and execute trades with hedge fund precision — 24 hours a day, fully automated. Built for every trader, with native Shariah compliance.",
      trust: ["Free simulation forever","Shariah compliant mode","No credit card needed"],
      cta1: "Start for free", cta2: "See how it works",
      sp: [{v:"Automated",l:"24/7 trading engine",s:"No manual intervention"},{v:"8 regimes",l:"Market intelligence",s:"Adaptive to any condition"},{v:"18 strategies",l:"Signal generation",s:"Multi-timeframe 5m–4h"},{v:"Shariah",l:"Compliant mode",s:"Native ethical screening"}],
      how_ey:"How it works", how_h:"6 neurons. 1 decision.", how_s:"Every trade passes through 6 intelligence layers before execution. No shortcuts, no guessing — pure systematic logic running 24 hours a day.",
      neurons:[
        {n:"01",t:"Market regime",d:"8 states detected in real time: trending, ranging, pre-breakout, breakout, volatile, bear, panic."},
        {n:"02",t:"Asset universe",d:"6 data-driven pools per regime. Shariah filter applied natively before any signal generation."},
        {n:"03",t:"Signal generation",d:"18 strategies filtered by regime. Multi-timeframe: 5m detection, 15m validation, 1h decision, 4h veto."},
        {n:"04",t:"Opportunity score",d:"7-dimensional conviction: signal, regime confidence, sentiment, volume, ATR, MTF bias, squeeze."},
        {n:"05",t:"Risk calibration",d:"Fixed fractional 1% per trade. Drawdown adaptive multipliers and correlation limits."},
        {n:"06",t:"Smart execution",d:"Auto SL/TP, ATR trailing stop, real-time monitoring. Three engines running simultaneously."},
      ],
      prod_ey:"Products", prod_h:"Three trading engines.", prod_s:"Each engine optimized for a different time horizon and risk profile — running simultaneously with isolated capital.",
      products:[
        {tag:"Active · Binance SPOT",t:"CEX Swing",d:"Automated swing trading using mean reversion, market structure and momentum strategies. Auto SL/TP and trailing stop.",s:[{v:"18",l:"strategies"},{v:"8",l:"regimes"},{v:"1%",l:"risk/trade"}]},
        {tag:"Active · Isolated capital",t:"Scalp Book",d:"High-frequency scalping on 5m/15m with dedicated isolated portfolio. Entry timing engine for optimal price. 5–30 min positions.",s:[{v:"5m",l:"timeframe"},{v:"5",l:"max pos."},{v:"30m",l:"timeout"}]},
        {tag:"Phase 1 · Base + Solana",t:"DEX Lab",d:"On-chain gem detection on Base and Solana. Flow-driven scoring: absorption signal, buyer quality index, GoPlus security screening.",s:[{v:"2",l:"chains"},{v:"30m",l:"scan"},{v:"H+3",l:"decision"}]},
      ],
      sh_ey:"Ethical compliance", sh_h1:"Trading that respects", sh_h2:"your values",
      sh_s:"6Napse is the first algorithmic trading platform with native Shariah compliance. The engine screens every asset automatically before any position is opened — no workaround, no manual filtering.",
      sh_feats:[
        {t:"Automatic asset screening",d:"Alcohol, tobacco, weapons, conventional banking, pork and gambling filtered at universe level — before any signal is generated."},
        {t:"No riba (interest)",d:"SPOT-only trading with no margin, no leverage and no overnight interest — fully aligned with Islamic finance principles."},
        {t:"Continuous compliance",d:"The Shariah filter re-applies at every engine cycle. Non-compliant assets are removed from the universe automatically."},
        {t:"One toggle, full compliance",d:"Activate Shariah mode in your profile. The entire engine adapts instantly — no configuration, no compromise."},
      ],
      sh_cta:"Enable Shariah mode",
      sh_markets:[
        {c:"#10b981",n:"Middle East & GCC",r:"Saudi Arabia · UAE · Qatar · Kuwait",v:"$1.9T"},
        {c:"#3b82f6",n:"Southeast Asia",r:"Malaysia · Indonesia · Brunei",v:"$0.8T"},
        {c:"#a78bfa",n:"Europe · diaspora",r:"UK · France · Germany · Belgium",v:"$0.5T"},
        {c:"#f59e0b",n:"North Africa",r:"Morocco · Egypt · Tunisia · Algeria",v:"$0.4T"},
      ],
      sh_tl:"Total addressable market", sh_tv:"$3.6 trillion",
      perf_ey:"Performance", perf_h:"Real results. Full transparency.",
      perf_s:"We believe in radical transparency. A public performance dashboard is coming — tracking real trader results across all strategies and regimes.",
      perf_feats:[
        {t:"Live P&L tracking",d:"Real-time portfolio value, realized and unrealized gains across all active strategies."},
        {t:"Strategy-level analytics",d:"Win rate, expectancy and drawdown broken down by strategy, regime and time period."},
        {t:"Community benchmarking",d:"Compare your performance against anonymized aggregate data from all 6Napse traders."},
      ],
      wl_h:"Join the waitlist", wl_s:"Be among the first to access the public performance dashboard. One email when it launches, no spam.",
      wl_ph:"your@email.com", wl_cta:"Notify me", wl_sent:"You are on the list ✓",
      price_ey:"Pricing", price_h:"Start free. Go live when ready.",
      price_s:"No credit card required. Upgrade to live trading only when your readiness checklist is fully validated.",
      plans:[
        {tier:"FREE",p:"€0",per:"/month",l:"Simulation mode. No risk, no credit card. Full access to every feature and strategy.",fs:["Virtual capital $50,000 USDT","All 18 trading strategies","Full dashboard + journal","DEX Lab Phase 1 — Base + Solana","Telegram + Email alerts","Shariah compliant mode"],cta:"Get started — free",f:false},
        {tier:"PRO",p:"€49",per:"/month",l:"Live trading with your real Binance capital. Unlocks when your checklist is complete.",fs:["Everything in Free","Live mode — Binance SPOT","Capital up to €50,000","Scalp book fully activated","Priority support — 24h response","1 year performance history"],cta:"Start Pro",f:true},
        {tier:"ELITE",p:"€149",per:"/month",l:"For serious traders, family offices and fund managers who need scale and control.",fs:["Everything in Pro","Up to 5 independent accounts","Unlimited capital","Multi-CEX support","DEX Lab Phase 2","API access + webhooks"],cta:"Contact us",f:false},
      ],
      faq_ey:"FAQ", faq_h:"Common questions.", faq_s:"Everything you need to know. Still have questions? We answer within 24 hours.",
      faqs:[
        {q:"Can I lose money in simulation?",a:"No. Simulation uses virtual capital only. The live toggle only unlocks when your checklist is fully validated — 100 trades, win rate above 60%, drawdown below 10%."},
        {q:"How is 6Napse different from 3Commas?",a:"6Napse adapts to 8 market regimes automatically and selects strategies without manual input. 3Commas gives you fixed tools. 6Napse thinks for you."},
        {q:"Is the Shariah mode truly compliant?",a:"Shariah mode filters assets before any signal is generated. Screened: alcohol, tobacco, weapons, banking, pork, gambling. SPOT-only eliminates riba entirely."},
        {q:"When can I switch to live trading?",a:"Built-in checklist: 100+ simulation trades, win rate above 60%, max drawdown below 10%, Binance API connected and verified. Toggle unlocks automatically."},
        {q:"What exchanges are supported?",a:"Binance SPOT on Pro. Coinbase and Kraken planned for Elite. DEX Lab covers Base and Solana on-chain, with Phase 2 bringing wallet intelligence."},
        {q:"Is my Binance API key safe?",a:"Stored encrypted. Spot Trading + Read permissions only. Withdrawal access never requested. Funds can only be traded, never moved."},
      ],
      fin_s:"Free forever in simulation · Shariah compliant · Go live when you are ready",
      fin_cta:"Create my free account", fin_cta2:"Read the docs",
      foot:["Features","Shariah","Pricing","Performance","DEX Lab","Privacy","Terms"],
    },
    fr: {
      nav:["Fonctionnalités","Shariah","Performance","Tarifs","DEX Lab"],
      badge:"Trading algorithmique · Conforme Shariah · Disponible maintenant",
      h1a:"L algorithme qui", h1b:"trade à ta place",
      sub:"6Napse combine 6 couches d intelligence artificielle pour détecter, scorer et exécuter des trades avec la précision d un hedge fund — 24h/24, entièrement automatisé. Conçu pour tous les traders, avec conformité Shariah native.",
      trust:["Simulation gratuite à vie","Mode conforme Shariah","Sans carte bancaire"],
      cta1:"Commencer gratuitement", cta2:"Voir comment ça marche",
      sp:[{v:"Automatisé",l:"Moteur 24h/24",s:"Aucune intervention"},{v:"8 régimes",l:"Intelligence marché",s:"Adaptatif à toute condition"},{v:"18 stratégies",l:"Génération de signal",s:"Multi-timeframe 5m–4h"},{v:"Shariah",l:"Mode conforme",s:"Screening éthique natif"}],
      how_ey:"Comment ça marche", how_h:"6 neurones. 1 décision.", how_s:"Chaque trade passe par 6 couches d intelligence avant l exécution. Sans raccourci, sans approximation — logique systématique pure.",
      neurons:[
        {n:"01",t:"Régime de marché",d:"8 états détectés en temps réel : trending, ranging, pre-breakout, breakout, volatile, bear, panic."},
        {n:"02",t:"Univers d assets",d:"6 pools data-driven par régime. Filtre Shariah appliqué nativement avant toute génération de signal."},
        {n:"03",t:"Génération de signal",d:"18 stratégies filtrées par régime. Multi-timeframe : détection 5m, validation 15m, décision 1h, veto 4h."},
        {n:"04",t:"Score d opportunité",d:"Conviction 7 dimensions : signal, confiance régime, sentiment, volume, ATR, biais MTF, squeeze."},
        {n:"05",t:"Calibration du risque",d:"Fixed fractional 1% par trade. Multiplicateurs adaptatifs au drawdown et limites de corrélation."},
        {n:"06",t:"Exécution intelligente",d:"SL/TP auto, trailing stop ATR, monitoring temps réel. Trois moteurs actifs simultanément."},
      ],
      prod_ey:"Produits", prod_h:"Trois moteurs de trading.", prod_s:"Chaque moteur optimisé pour un horizon de temps différent — actifs simultanément avec capital isolé.",
      products:[
        {tag:"Actif · Binance SPOT",t:"CEX Swing",d:"Trading swing automatisé par mean reversion, market structure et momentum. SL/TP automatiques et trailing stop.",s:[{v:"18",l:"stratégies"},{v:"8",l:"régimes"},{v:"1%",l:"risque/trade"}]},
        {tag:"Actif · Capital isolé",t:"Scalp Book",d:"Scalping haute fréquence sur 5m/15m avec portfolio dédié et capital isolé. Entry timing engine. Positions 5 à 30 min.",s:[{v:"5m",l:"timeframe"},{v:"5",l:"max pos."},{v:"30m",l:"timeout"}]},
        {tag:"Phase 1 · Base + Solana",t:"DEX Lab",d:"Détection de pépites on-chain sur Base et Solana. Scoring flow-driven : absorption, BQI, screening GoPlus, age et vélocité.",s:[{v:"2",l:"chains"},{v:"30m",l:"scan"},{v:"H+3",l:"décision"}]},
      ],
      sh_ey:"Conformité éthique", sh_h1:"Un trading qui respecte", sh_h2:"tes valeurs",
      sh_s:"6Napse est la première plateforme de trading algorithmique avec conformité Shariah native. Le moteur analyse chaque asset automatiquement avant toute ouverture de position.",
      sh_feats:[
        {t:"Screening automatique des assets",d:"Alcool, tabac, armement, banques conventionnelles, porc et jeux filtrés au niveau des univers — avant tout signal."},
        {t:"Sans riba (intérêt)",d:"Trading SPOT uniquement, sans marge, sans levier et sans intérêts overnight — pleinement aligné avec la finance islamique."},
        {t:"Conformité continue",d:"Le filtre Shariah est ré-appliqué à chaque cycle. Les assets non-conformes sont retirés automatiquement."},
        {t:"Un toggle, conformité totale",d:"Active le mode Shariah dans ton profil. L ensemble du moteur s adapte instantanément — sans configuration."},
      ],
      sh_cta:"Activer le mode Shariah",
      sh_markets:[
        {c:"#10b981",n:"Moyen-Orient & GCC",r:"Arabie Saoudite · EAU · Qatar · Koweït",v:"1,9T$"},
        {c:"#3b82f6",n:"Asie du Sud-Est",r:"Malaisie · Indonésie · Brunei",v:"0,8T$"},
        {c:"#a78bfa",n:"Europe · diaspora",r:"Royaume-Uni · France · Allemagne · Belgique",v:"0,5T$"},
        {c:"#f59e0b",n:"Afrique du Nord",r:"Maroc · Egypte · Tunisie · Algérie",v:"0,4T$"},
      ],
      sh_tl:"Marché adressable total", sh_tv:"3,6 trillions $",
      perf_ey:"Performance", perf_h:"Vrais résultats. Transparence totale.",
      perf_s:"Nous croyons en la transparence radicale. Un dashboard de performance public arrive — suivant les vrais résultats des traders sur toutes les stratégies.",
      perf_feats:[
        {t:"Suivi P&L en temps réel",d:"Valeur du portfolio, gains réalisés et latents sur toutes les stratégies et régimes actifs."},
        {t:"Analytiques par stratégie",d:"Win rate, espérance et drawdown max par stratégie, régime et période de temps."},
        {t:"Benchmarking communauté",d:"Compare tes performances avec les données agrégées anonymisées de toute la communauté 6Napse."},
      ],
      wl_h:"Rejoins la liste d attente", wl_s:"Sois parmi les premiers à accéder au dashboard de performance public. Un seul email au lancement.",
      wl_ph:"ton@email.com", wl_cta:"Me notifier", wl_sent:"Tu es sur la liste ✓",
      price_ey:"Tarifs", price_h:"Commence gratuitement. Passe en live quand tu es prêt.",
      price_s:"Sans carte bancaire pour la simulation. Passe en live uniquement quand ta checklist de validation est complète.",
      plans:[
        {tier:"FREE",p:"€0",per:"/mois",l:"Mode simulation. Sans risque, sans carte bancaire. Accès complet à toutes les fonctionnalités.",fs:["Capital virtuel 50 000 USDT","18 stratégies complètes","Dashboard + journal complet","DEX Lab Phase 1 — Base + Solana","Alertes Telegram + Email","Mode conforme Shariah"],cta:"Commencer gratuitement",f:false},
        {tier:"PRO",p:"€49",per:"/mois",l:"Trading live avec ton vrai capital Binance. Débloqué quand ta checklist est validée.",fs:["Tout le Free inclus","Mode live — Binance SPOT","Capital jusqu à 50 000€","Scalp book activé","Support prioritaire — 24h","1 an d historique performance"],cta:"Commencer Pro",f:true},
        {tier:"ELITE",p:"€149",per:"/mois",l:"Pour les traders sérieux, family offices et gérants de fonds qui ont besoin d échelle.",fs:["Tout le Pro inclus","Jusqu à 5 comptes","Capital illimité","Multi-CEX support","DEX Lab Phase 2","Accès API + webhooks"],cta:"Nous contacter",f:false},
      ],
      faq_ey:"FAQ", faq_h:"Questions fréquentes.", faq_s:"Tout ce qu il faut savoir. Des questions ? On répond en 24 heures.",
      faqs:[
        {q:"Puis-je perdre de l argent en simulation ?",a:"Non. La simulation utilise uniquement du capital virtuel. Le toggle live ne se déverrouille que quand ta checklist est entièrement validée."},
        {q:"Quelle différence avec 3Commas ?",a:"6Napse s adapte à 8 régimes de marché automatiquement et sélectionne les stratégies sans intervention. 3Commas te donne des outils fixes. 6Napse pense à ta place."},
        {q:"Le mode Shariah est-il vraiment conforme ?",a:"Le mode Shariah filtre les assets avant toute génération de signal. Exclus : alcool, tabac, armement, banques, porc, jeux. Trading SPOT uniquement — le riba est exclu."},
        {q:"Quand puis-je passer en live ?",a:"Checklist intégrée : 100+ trades en simulation, win rate > 60%, drawdown < 10%, API Binance connectée et vérifiée. Toggle débloqué automatiquement."},
        {q:"Quels exchanges sont supportés ?",a:"Binance SPOT sur Pro. Coinbase et Kraken prévus pour Elite. DEX Lab couvre Base et Solana on-chain, avec la Phase 2 apportant wallet intelligence."},
        {q:"Ma clé API Binance est-elle sécurisée ?",a:"Stockée chiffrée. Permissions Spot Trading + Lecture uniquement. Accès aux retraits jamais demandé. Tes fonds peuvent uniquement être tradés, jamais déplacés."},
      ],
      fin_s:"Gratuit à vie en simulation · Conforme Shariah · Passe en live quand tu es prêt",
      fin_cta:"Créer mon compte gratuit", fin_cta2:"Lire la documentation",
      foot:["Fonctionnalités","Shariah","Tarifs","Performance","DEX Lab","Confidentialité","CGU"],
    }
  };

  const t = T[lang];

  return (
    <div className="ln">

      {/* NAV */}
      <nav>
        <div className="wrap">
          <div className="nav-inner">
            <div className="logo"><span className="logo-6">6</span>Napse</div>
            <ul className="nav-links">
              {t.nav.map(n => <li key={n}><a href="#features">{n}</a></li>)}
            </ul>
            <div className="nav-right">
              <div className="lang-tog">
                {(["en","fr"] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} className={lang===l?"on":""}>{l.toUpperCase()}</button>
                ))}
              </div>
              <button className="btn-nav btn-nav-desktop" onClick={() => router.push("/signup")}>{t.cta1}</button>
              <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                <span/><span/><span/>
              </button>
            </div>
          </div>
        </div>
        <div className={`mob-menu${menuOpen?" open":""}`}>
          {t.nav.map(n => <a key={n} href="#features" onClick={() => setMenuOpen(false)}>{n}</a>)}
          <button className="btn-p" style={{marginTop:8}} onClick={() => router.push("/signup")}>{t.cta1}</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="badge"><div className="bdot"/>{t.badge}</div>
              <h1>{t.h1a}<br/><em>{t.h1b}</em></h1>
              <p className="hero-sub">{t.sub}</p>
              <div className="hero-ctas">
                <button className="btn-p" onClick={() => router.push("/signup")}>{t.cta1}</button>
                <button className="btn-o">{t.cta2}</button>
              </div>
              <div className="trust-list">
                {t.trust.map(tr => (
                  <div key={tr} className="trust-item">
                    <div className="tcheck"><div className="tdot"/></div>{tr}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="term">
                <div className="term-bar">
                  <div className="tds">
                    <div className="td" style={{background:"#ff5f57"}}/>
                    <div className="td" style={{background:"#febc2e"}}/>
                    <div className="td" style={{background:"#28c840"}}/>
                  </div>
                  <span className="ttitle">6napse · signal engine · live</span>
                </div>
                <div className="term-body">
                  {[
                    {k:"regime →",v:"RANGING",s:"ADX:18 | Squeeze:true",vc:"tv",warn:false,cursor:false},
                    {k:"universe →",v:"accumulation",s:"Shariah filter: ON",vc:"tv",warn:false,cursor:false},
                    {k:"signal",v:"BUY SOLUSDT",s:"score:63.8/100",vc:"tv",warn:false,cursor:false},
                    {k:"sizing →",v:"$2,266 USDT",s:"risk:1% ATR:2.1%",vc:"tv",warn:false,cursor:false},
                    {k:"opened →",v:"SL · TP · trailing:2.0 ATR",s:"",vc:"ts",warn:false,cursor:false},
                    {k:"later →",v:"TP reached · profit booked",s:"",vc:"ts",warn:true,cursor:false},
                    {k:"portfolio →",v:"scanning next signal",s:"",vc:"tv",warn:false,cursor:true},
                  ].map((l,i) => (
                    <div key={i} className="tl">
                      <span className="tp">$</span>
                      <span className={l.warn?"tw":"tk"}>{l.k}</span>
                      <span className={l.vc}>{l.v}</span>
                      {l.s && <span className="tk">{l.s}</span>}
                      {l.cursor && <span className="tc"/>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="wrap">
          <div className="stats-grid">
            {t.sp.map((s,i) => (
              <div key={i} className="stat-item">
                <div className="stat-v">{s.v}</div>
                <div className="stat-l">{s.l}</div>
                <div className="stat-s">{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEURONS */}
      <section className="sec sec-alt" id="features">
        <div className="wrap">
          <div className="sec-hdr">
            <div><p className="eyebrow">{t.how_ey}</p><h2 className="sec-h">{t.how_h}</h2></div>
            <p className="sec-sub">{t.how_s}</p>
          </div>
          <div className="neu-layout">
            <div className="n-list">
              {t.neurons.map(n => (
                <div key={n.n} className="n-row">
                  <span className="n-num">{n.n}</span>
                  <div><div className="n-t">{n.t}</div><div className="n-d">{n.d}</div></div>
                </div>
              ))}
            </div>
            <div className="n-grid">
              {t.neurons.map(n => (
                <div key={n.n} className="nc">
                  <div className="nc-num">{n.n}</div>
                  <div className="nc-t">{n.t}</div>
                  <div className="nc-d">{n.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="sec" id="dex">
        <div className="wrap">
          <div className="sec-hdr">
            <div><p className="eyebrow">{t.prod_ey}</p><h2 className="sec-h">{t.prod_h}</h2></div>
            <p className="sec-sub">{t.prod_s}</p>
          </div>
          <div className="prod-grid">
            {t.products.map(p => (
              <div key={p.t} className="pc">
                <div className="pc-tag"><div className="bdot" style={{width:5,height:5}}/>{p.tag}</div>
                <div className="pc-t">{p.t}</div>
                <div className="pc-d">{p.d}</div>
                <div className="pc-div"/>
                <div className="pc-stats">
                  {p.s.map(s => (
                    <div key={s.l} className="ps">
                      <div className="ps-v">{s.v}</div>
                      <div className="ps-l">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHARIAH */}
      <section className="shariah" id="shariah">
        <div className="wrap">
          <div className="sh-grid">
            <div>
              <p className="sh-ey">{t.sh_ey}</p>
              <h2 className="sh-h">{t.sh_h1}<br/><em>{t.sh_h2}</em></h2>
              <p className="sh-sub">{t.sh_s}</p>
              <div className="sh-feats">
                {t.sh_feats.map(f => (
                  <div key={f.t} className="sh-feat">
                    <div className="sh-fi"><div className="sh-fd"/></div>
                    <div className="sh-ft"><strong>{f.t}</strong> — {f.d}</div>
                  </div>
                ))}
              </div>
              <button className="btn-green" onClick={() => router.push("/signup")}>{t.sh_cta}</button>
            </div>
            <div>
              <div className="sh-card">
                <div className="sh-ct">Islamic Finance Market · 2026</div>
                <div className="sh-ms">
                  {t.sh_markets.map(m => (
                    <div key={m.n} className="sh-m">
                      <div className="sh-ml">
                        <div className="sh-md" style={{background:m.c}}/>
                        <div><div className="sh-mn">{m.n}</div><div className="sh-mr">{m.r}</div></div>
                      </div>
                      <div className="sh-mv">{m.v}</div>
                    </div>
                  ))}
                </div>
                <div className="sh-div"/>
                <div className="sh-tot">
                  <div className="sh-tl">{t.sh_tl}</div>
                  <div className="sh-tv">{t.sh_tv}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section className="sec sec-alt" id="performance">
        <div className="wrap">
          <div className="perf-grid">
            <div>
              <p className="eyebrow">{t.perf_ey}</p>
              <h2 className="sec-h" style={{marginBottom:16}}>{t.perf_h}</h2>
              <p className="sec-sub">{t.perf_s}</p>
              <div className="pf-list">
                {t.perf_feats.map(f => (
                  <div key={f.t} className="pf-item">
                    <div className="pf-icon"><div className="pf-id"/></div>
                    <div><div className="pf-t">{f.t}</div><div className="pf-d">{f.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="wl-card">
                <h3>{t.wl_h}</h3>
                <p>{t.wl_s}</p>
                {sent ? (
                  <div className="sent-msg">{t.wl_sent}</div>
                ) : (
                  <div className="email-row">
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t.wl_ph}/>
                    <button onClick={() => {if(email.includes("@")) setSent(true)}}>{t.wl_cta}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="sec" id="pricing">
        <div className="wrap">
          <div className="sec-hdr">
            <div><p className="eyebrow">{t.price_ey}</p><h2 className="sec-h">{t.price_h}</h2></div>
            <p className="sec-sub">{t.price_s}</p>
          </div>
          <div className="price-grid">
            {t.plans.map(p => (
              <div key={p.tier} className={`prc${p.f?" feat":""}`}>
                {p.f && <div className="pop-b">Most popular</div>}
                <div className="plan-tier">{p.tier}</div>
                <div className="price-row">
                  <span className="price-n">{p.p}</span>
                  <span className="price-p">{p.per}</span>
                </div>
                <div className="plan-line">{p.l}</div>
                <div className="plan-fs">
                  {p.fs.map(f => (
                    <div key={f} className="plan-f">
                      <div className="fcheck"><div className="fdot"/></div>{f}
                    </div>
                  ))}
                </div>
                <button className="plan-btn" onClick={() => router.push("/signup")}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="sec-hdr">
            <div><p className="eyebrow">{t.faq_ey}</p><h2 className="sec-h">{t.faq_h}</h2></div>
            <p className="sec-sub">{t.faq_s}</p>
          </div>
          <div className="faq-grid">
            {t.faqs.map(f => (
              <div key={f.q} className="fq">
                <div className="fq-q">{f.q}</div>
                <div className="fq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-fin">
        <div className="wrap">
          <h2>Join <em>6Napse</em> today.</h2>
          <p>{t.fin_s}</p>
          <div className="cta-btns">
            <button className="cta-w" onClick={() => router.push("/signup")}>{t.fin_cta}</button>
            <button className="cta-g">{t.fin_cta2}</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-inner">
            <div className="foot-logo"><span>6</span>Napse</div>
            <div className="foot-links">
              {t.foot.map(l => <a key={l} href="#">{l}</a>)}
            </div>
            <div className="foot-copy">© 2026 6Napse · Not financial advice</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
