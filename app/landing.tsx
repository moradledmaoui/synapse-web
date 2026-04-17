"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  const [lang, setLang] = useState<"en"|"fr">("en");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const en = {
    nav: ["Features","Shariah","Performance","Pricing","DEX Lab"],
    badge: "Algorithmic trading · Shariah compliant · Available now",
    h1a: "The algorithm that",
    h1b: "trades for you",
    sub: "6Napse combines 6 layers of artificial intelligence to detect, score and execute trades with hedge fund precision — 24 hours a day, fully automated.",
    trust: ["Free simulation forever","Shariah compliant mode","No credit card needed"],
    cta1: "Start for free", cta2: "See how it works",
    sp: [{v:"Automated",l:"24/7 trading engine"},{v:"8 regimes",l:"Market intelligence"},{v:"18 strategies",l:"Signal generation"},{v:"Shariah",l:"Compliant mode"}],
    neurons_eyebrow: "How it works",
    neurons_title: "6 neurons. 1 decision.",
    neurons_sub: "Every trade passes through 6 intelligence layers before execution. No shortcuts, no guessing.",
    neurons: [
      {n:"01",t:"Market regime",d:"8 states detected in real time: trending, ranging, pre-breakout, breakout, volatile, bear, panic."},
      {n:"02",t:"Asset universe",d:"6 data-driven pools selected per regime. Shariah filter applied natively before signal generation."},
      {n:"03",t:"Signal generation",d:"18 strategies filtered by regime. Multi-timeframe: 5m detection, 15m validation, 1h decision, 4h veto."},
      {n:"04",t:"Opportunity score",d:"7-dimensional conviction: signal, regime confidence, sentiment, volume, ATR, MTF bias, squeeze."},
      {n:"05",t:"Risk calibration",d:"Fixed fractional 1% per trade with drawdown adaptive multipliers and correlation limits."},
      {n:"06",t:"Smart execution",d:"Automatic SL/TP, ATR trailing stop, real-time monitoring. Three engines running simultaneously."},
    ],
    prod_eyebrow: "Products",
    prod_title: "Three trading engines.",
    prod_sub: "Each engine optimized for a different time horizon and risk profile — running simultaneously with isolated capital.",
    products: [
      {tag:"Active · Binance SPOT",t:"CEX Swing",d:"Automated swing trading using mean reversion, market structure and momentum strategies. Automatic SL/TP and trailing stop with real-time monitoring.",s:[{v:"18",l:"strategies"},{v:"8",l:"regimes"},{v:"1%",l:"risk/trade"}]},
      {tag:"Active · Isolated capital",t:"Scalp Book",d:"High-frequency scalping on 5m and 15m timeframes with dedicated isolated portfolio. Entry timing engine for optimal price. 5 to 30 minute positions.",s:[{v:"5m",l:"timeframe"},{v:"5",l:"max pos."},{v:"30m",l:"timeout"}]},
      {tag:"Phase 1 · Base + Solana",t:"DEX Lab",d:"On-chain gem detection on Base and Solana. Flow-driven scoring: absorption signal, buyer quality index, GoPlus security screening, age and velocity analysis.",s:[{v:"2",l:"chains"},{v:"30m",l:"scan"},{v:"H+3",l:"decision"}]},
    ],
    sh_eyebrow: "Ethical compliance",
    sh_title: "Trading that respects your values",
    sh_sub: "6Napse is the first algorithmic trading platform with native Shariah compliance. The engine screens every asset automatically before any position is opened.",
    sh_feats: [
      {t:"Automatic asset screening",d:"Alcohol, tobacco, weapons, conventional banking, pork and gambling filtered at universe level — before any signal is generated."},
      {t:"No riba (interest)",d:"SPOT-only trading with no margin, no leverage and no overnight interest — fully aligned with Islamic finance principles."},
      {t:"Continuous compliance",d:"The Shariah filter re-applies at every engine cycle. Non-compliant assets are removed from the universe automatically."},
      {t:"One toggle, full compliance",d:"Activate Shariah mode in your profile. The entire engine adapts instantly — no configuration, no compromise."},
    ],
    sh_cta: "Enable Shariah mode",
    sh_markets: [
      {color:"#10b981",n:"Middle East & GCC",r:"Saudi Arabia · UAE · Qatar · Kuwait",v:"$1.9T"},
      {color:"#3b82f6",n:"Southeast Asia",r:"Malaysia · Indonesia · Brunei",v:"$0.8T"},
      {color:"#a78bfa",n:"Europe · diaspora",r:"UK · France · Germany · Belgium",v:"$0.5T"},
      {color:"#f59e0b",n:"North Africa",r:"Morocco · Egypt · Tunisia · Algeria",v:"$0.4T"},
    ],
    sh_total: "$3.6 trillion",
    sh_total_label: "Total addressable market",
    perf_eyebrow: "Performance",
    perf_title: "Real results. Full transparency.",
    perf_sub: "We believe in radical transparency. A public performance dashboard is coming — tracking real trader results across all strategies and market conditions.",
    perf_feats: [
      {t:"Live P&L tracking",d:"Real-time portfolio value, realized and unrealized gains across all active strategies."},
      {t:"Strategy-level analytics",d:"Win rate, expectancy and drawdown broken down by strategy, regime and time period."},
      {t:"Cross-trader benchmarking",d:"Compare your performance against anonymized aggregate data from the 6Napse community."},
    ],
    wl_title: "Join the waitlist",
    wl_sub: "Be among the first to access the public performance dashboard. One email when it launches.",
    wl_ph: "your@email.com",
    wl_cta: "Notify me",
    wl_sent: "You are on the list ✓",
    price_eyebrow: "Pricing",
    price_title: "Start free. Go live when ready.",
    price_sub: "No credit card required. Upgrade to live trading only when your readiness checklist is fully validated.",
    plans: [
      {tier:"FREE",price:"€0",per:"/month",line:"Simulation mode. No risk, no credit card. Full access to every feature.",feats:["Virtual capital $50,000 USDT","All 18 trading strategies","Full dashboard + journal","DEX Lab Phase 1 — Base + Solana","Telegram + Email alerts","Shariah compliant mode"],cta:"Get started — free",f:false},
      {tier:"PRO",price:"€49",per:"/month",line:"Live trading with your real Binance capital. Unlocks when your checklist is complete.",feats:["Everything in Free","Live mode — Binance SPOT","Capital up to €50,000","Scalp book fully activated","Priority support — 24h","1 year performance history"],cta:"Start Pro",f:true},
      {tier:"ELITE",price:"€149",per:"/month",line:"For serious traders, family offices and fund managers who need scale and control.",feats:["Everything in Pro","Up to 5 independent accounts","Unlimited capital","Multi-CEX support","DEX Lab Phase 2","API access + webhooks"],cta:"Contact us",f:false},
    ],
    faq_eyebrow: "FAQ",
    faq_title: "Common questions.",
    faq_sub: "Everything you need to know. Still have questions? We answer within 24 hours.",
    faqs: [
      {q:"Can I lose money in simulation?",a:"No. Simulation uses virtual capital only. The live toggle only unlocks when your checklist is fully validated."},
      {q:"How is 6Napse different from 3Commas?",a:"6Napse adapts to 8 market regimes automatically. 3Commas gives you fixed tools. 6Napse thinks for you — no manual intervention needed."},
      {q:"Is the Shariah mode truly compliant?",a:"Shariah mode filters assets before any signal is generated. Screened: alcohol, tobacco, weapons, banking, pork, gambling. SPOT-only eliminates riba."},
      {q:"When can I switch to live trading?",a:"Built-in checklist: 100+ simulation trades, win rate above 60%, drawdown below 10%, Binance API connected and verified."},
      {q:"What exchanges are supported?",a:"Binance SPOT on Pro. Coinbase and Kraken planned for Elite. DEX Lab covers Base and Solana on-chain."},
      {q:"Is my Binance API key safe?",a:"Stored encrypted. Spot Trading + Read permissions only — withdrawal access never requested. Funds can only be traded, never moved."},
    ],
    final_sub: "Free forever in simulation · Shariah compliant · Go live when you are ready",
    final_cta: "Create my free account",
    final_cta2: "Read the docs",
  };

  const fr: typeof en = {
    nav: ["Fonctionnalités","Shariah","Performance","Tarifs","DEX Lab"],
    badge: "Trading algorithmique · Conforme Shariah · Disponible maintenant",
    h1a: "L algorithme qui",
    h1b: "trade à ta place",
    sub: "6Napse combine 6 couches d intelligence artificielle pour détecter, scorer et exécuter des trades avec la précision d un hedge fund — 24h/24, entièrement automatisé.",
    trust: ["Simulation gratuite à vie","Mode conforme Shariah","Sans carte bancaire"],
    cta1: "Commencer gratuitement", cta2: "Voir comment ca marche",
    sp: [{v:"Automatisé",l:"Moteur 24h/24"},{v:"8 régimes",l:"Intelligence marché"},{v:"18 stratégies",l:"Génération de signal"},{v:"Shariah",l:"Mode conforme"}],
    neurons_eyebrow: "Comment ca marche",
    neurons_title: "6 neurones. 1 décision.",
    neurons_sub: "Chaque trade passe par 6 couches d intelligence avant l exécution. Sans raccourci, sans approximation.",
    neurons: [
      {n:"01",t:"Régime de marché",d:"8 états détectés en temps réel : trending, ranging, pre-breakout, breakout, volatile, bear, panic."},
      {n:"02",t:"Univers d assets",d:"6 pools data-driven sélectionnés par régime. Filtre Shariah appliqué nativement avant toute génération de signal."},
      {n:"03",t:"Génération de signal",d:"18 stratégies filtrées par régime. Multi-timeframe : détection 5m, validation 15m, décision 1h, veto 4h."},
      {n:"04",t:"Score d opportunité",d:"Conviction 7 dimensions : force signal, confiance régime, sentiment, volume, ATR, biais MTF, squeeze."},
      {n:"05",t:"Calibration du risque",d:"Fixed fractional 1% par trade avec multiplicateurs adaptatifs au drawdown et limites de corrélation."},
      {n:"06",t:"Exécution intelligente",d:"SL/TP automatiques, trailing stop ATR, monitoring temps réel. Trois moteurs actifs simultanément."},
    ],
    prod_eyebrow: "Produits",
    prod_title: "Trois moteurs de trading.",
    prod_sub: "Chaque moteur optimisé pour un horizon de temps et un profil de risque différent — actifs simultanément avec capital isolé.",
    products: [
      {tag:"Actif · Binance SPOT",t:"CEX Swing",d:"Trading swing automatisé par mean reversion, market structure et momentum. SL/TP automatiques et trailing stop avec monitoring temps réel.",s:[{v:"18",l:"stratégies"},{v:"8",l:"régimes"},{v:"1%",l:"risque/trade"}]},
      {tag:"Actif · Capital isolé",t:"Scalp Book",d:"Scalping haute fréquence sur 5m et 15m avec portfolio dédié et capital isolé. Entry timing engine pour prix optimal. Positions de 5 à 30 minutes.",s:[{v:"5m",l:"timeframe"},{v:"5",l:"max pos."},{v:"30m",l:"timeout"}]},
      {tag:"Phase 1 · Base + Solana",t:"DEX Lab",d:"Détection de pépites on-chain sur Base et Solana. Scoring flow-driven : signal absorption, BQI, screening GoPlus, analyse age et vélocité.",s:[{v:"2",l:"chains"},{v:"30m",l:"scan"},{v:"H+3",l:"décision"}]},
    ],
    sh_eyebrow: "Conformité éthique",
    sh_title: "Un trading qui respecte tes valeurs",
    sh_sub: "6Napse est la première plateforme de trading algorithmique avec conformité Shariah native. Le moteur analyse chaque asset automatiquement avant toute ouverture de position.",
    sh_feats: [
      {t:"Screening automatique des assets",d:"Alcool, tabac, armement, banques conventionnelles, porc et jeux filtrés au niveau des univers — avant toute génération de signal."},
      {t:"Sans riba (intérêt)",d:"Trading SPOT uniquement, sans marge, sans levier et sans intérêts overnight — pleinement aligné avec la finance islamique."},
      {t:"Conformité continue",d:"Le filtre Shariah est ré-appliqué à chaque cycle du moteur. Les assets non-conformes sont retirés automatiquement."},
      {t:"Un toggle, conformité totale",d:"Active le mode Shariah dans ton profil. L ensemble du moteur s adapte instantanément — sans configuration."},
    ],
    sh_cta: "Activer le mode Shariah",
    sh_markets: [
      {color:"#10b981",n:"Moyen-Orient & GCC",r:"Arabie Saoudite · EAU · Qatar · Koweït",v:"1,9T$"},
      {color:"#3b82f6",n:"Asie du Sud-Est",r:"Malaisie · Indonésie · Brunei",v:"0,8T$"},
      {color:"#a78bfa",n:"Europe · diaspora",r:"Royaume-Uni · France · Allemagne · Belgique",v:"0,5T$"},
      {color:"#f59e0b",n:"Afrique du Nord",r:"Maroc · Egypte · Tunisie · Algérie",v:"0,4T$"},
    ],
    sh_total: "3,6 trillions $",
    sh_total_label: "Marché adressable total",
    perf_eyebrow: "Performance",
    perf_title: "Vrais résultats. Transparence totale.",
    perf_sub: "Nous croyons en la transparence radicale. Un dashboard de performance public arrive — suivant les vrais résultats des traders sur toutes les stratégies.",
    perf_feats: [
      {t:"Suivi P&L en temps réel",d:"Valeur du portfolio, gains réalisés et latents sur toutes les stratégies et régimes actifs."},
      {t:"Analytiques par stratégie",d:"Win rate, espérance et drawdown max par stratégie, régime et période de temps."},
      {t:"Benchmarking inter-traders",d:"Compare tes performances avec les données agrégées anonymisées de la communauté 6Napse."},
    ],
    wl_title: "Rejoins la liste d attente",
    wl_sub: "Sois parmi les premiers à accéder au dashboard de performance public. Un seul email au lancement.",
    wl_ph: "ton@email.com",
    wl_cta: "Me notifier",
    wl_sent: "Tu es sur la liste ✓",
    price_eyebrow: "Tarifs",
    price_title: "Commence gratuitement. Passe en live quand tu es prêt.",
    price_sub: "Sans carte bancaire pour la simulation. Passe en live uniquement quand ta checklist est validée.",
    plans: [
      {tier:"FREE",price:"€0",per:"/mois",line:"Mode simulation. Sans risque, sans carte bancaire. Accès complet à toutes les fonctionnalités.",feats:["Capital virtuel 50 000 USDT","18 stratégies complètes","Dashboard + journal + analytiques","DEX Lab Phase 1 — Base + Solana","Alertes Telegram + Email","Mode conforme Shariah"],cta:"Commencer gratuitement",f:false},
      {tier:"PRO",price:"€49",per:"/mois",line:"Trading live avec ton vrai capital Binance. Débloqué quand ta checklist est validée.",feats:["Tout le Free inclus","Mode live — Binance SPOT","Capital jusqu à 50 000€","Scalp book activé","Support prioritaire — 24h","1 an d historique performance"],cta:"Commencer Pro",f:true},
      {tier:"ELITE",price:"€149",per:"/mois",line:"Pour les traders sérieux, family offices et gérants de fonds qui ont besoin d échelle.",feats:["Tout le Pro inclus","Jusqu à 5 comptes indépendants","Capital illimité","Multi-CEX support","DEX Lab Phase 2","Accès API + webhooks"],cta:"Nous contacter",f:false},
    ],
    faq_eyebrow: "FAQ",
    faq_title: "Questions fréquentes.",
    faq_sub: "Tout ce qu il faut savoir avant de commencer. Des questions ? On répond en 24 heures.",
    faqs: [
      {q:"Puis-je perdre de l argent en simulation ?",a:"Non. La simulation utilise uniquement du capital virtuel. Le toggle live ne se déverrouille que quand ta checklist est entièrement validée."},
      {q:"Quelle différence avec 3Commas ?",a:"6Napse s adapte à 8 régimes de marché automatiquement. 3Commas te donne des outils fixes. 6Napse pense à ta place — aucune intervention nécessaire."},
      {q:"Le mode Shariah est-il vraiment conforme ?",a:"Le mode Shariah filtre les assets avant toute génération de signal. Exclus : alcool, tabac, armement, banques, porc, jeux. Trading SPOT uniquement — le riba est exclu."},
      {q:"Quand puis-je passer en live ?",a:"Checklist intégrée : 100+ trades en simulation, win rate > 60%, drawdown < 10%, API Binance connectée et vérifiée."},
      {q:"Quels exchanges sont supportés ?",a:"Binance SPOT sur Pro. Coinbase et Kraken prévus pour Elite. DEX Lab couvre Base et Solana on-chain."},
      {q:"Ma clé API Binance est-elle sécurisée ?",a:"Stockée chiffrée. Permissions Spot Trading + Lecture uniquement — l accès aux retraits n est jamais demandé."},
    ],
    final_sub: "Gratuit à vie en simulation · Conforme Shariah · Passe en live quand tu es prêt",
    final_cta: "Créer mon compte gratuit",
    final_cta2: "Lire la documentation",
  };

  const t = lang === "en" ? en : fr;

  const SectionHeader = ({eyebrow, title, sub}: {eyebrow:string, title:string, sub:string}) => (
    <div className="grid grid-cols-2 gap-20 items-end mb-14">
      <div>
        <p className="text-xs font-mono text-green-600 tracking-widest uppercase mb-3">{eyebrow}</p>
        <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-gray-900">{title}</h2>
      </div>
      <p className="text-base text-gray-500 leading-relaxed pb-1">{sub}</p>
    </div>
  );

  const Check = ({dark=false}:{dark?:boolean}) => (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${dark ? "bg-green-900 border border-green-700" : "bg-green-50 border border-green-200"}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
    </div>
  );

  return (
    <div className="bg-white text-gray-900 font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="font-mono text-xl font-bold tracking-tight">
            <span className="text-green-600">6</span>Napse
          </div>
          <div className="flex items-center gap-8">
            {t.nav.map(n => (
              <a key={n} className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">{n}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              {(["en","fr"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-xs font-mono transition-colors ${lang===l ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => router.push("/signup")}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              {t.cta1}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-white border-b border-gray-200 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-mono text-green-700">{t.badge}</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
                {t.h1a}<br/>
                <em className="not-italic text-green-600">{t.h1b}</em>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">{t.sub}</p>
              <div className="flex gap-3 mb-10">
                <button onClick={() => router.push("/signup")}
                  className="bg-gray-900 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                  {t.cta1}
                </button>
                <button className="border border-gray-300 text-gray-700 px-7 py-3.5 rounded-xl text-sm hover:border-gray-400 transition-colors">
                  {t.cta2}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {t.trust.map(tr => (
                  <div key={tr} className="flex items-center gap-2 text-sm text-gray-500">
                    <Check />
                    {tr}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400 font-mono ml-2">6napse · signal engine · live</span>
                </div>
                <div className="p-5 font-mono text-xs leading-loose">
                  {[
                    {k:"regime →", v:"RANGING", s:"ADX:18 | Squeeze:true", vc:"text-gray-900", sc:"text-gray-400"},
                    {k:"universe →", v:"accumulation", s:"Shariah filter: ON", vc:"text-gray-900", sc:"text-gray-400"},
                    {k:"signal", v:"BUY SOLUSDT", s:"score:63.8/100", vc:"font-bold text-gray-900", sc:"text-gray-400"},
                    {k:"confirm ×", v:"1.20", s:"CMF:0.12 | MTF:bullish", vc:"text-gray-900", sc:"text-gray-400"},
                    {k:"sizing →", v:"$2,266 USDT", s:"risk:1% ATR:2.1%", vc:"text-gray-900", sc:"text-gray-400"},
                    {k:"opened →", v:"SL · TP · trailing:2.0 ATR", s:"", vc:"text-green-600", sc:""},
                    {k:"later →", v:"TP reached · profit booked", s:"", vc:"text-green-600", sc:"", warn:true},
                    {k:"portfolio →", v:"scanning next signal", s:"", vc:"text-gray-900", sc:"", cursor:true},
                  ].map((l,i) => (
                    <div key={i} className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-green-600">$</span>
                      <span className={`${l.warn ? "text-amber-600" : "text-gray-400"}`}>{l.k}</span>
                      <span className={l.vc}>{l.v}</span>
                      {l.s && <span className={l.sc}>{l.s}</span>}
                      {l.cursor && <span className="inline-block w-1.5 h-3.5 bg-gray-900 animate-pulse ml-0.5" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-gray-50 border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
            {t.sp.map((s,i) => (
              <div key={i} className="text-center px-8">
                <div className="text-sm font-mono font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.v}</div>
                <div className="text-xl font-bold text-gray-900">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEURONS */}
      <section className="bg-gray-50 border-b border-gray-200 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <SectionHeader eyebrow={t.neurons_eyebrow} title={t.neurons_title} sub={t.neurons_sub} />
          <div className="grid grid-cols-2 gap-16 items-start">
            <div className="divide-y divide-gray-100">
              {t.neurons.map(n => (
                <div key={n.n} className="flex gap-4 py-4">
                  <span className="font-mono text-xs text-green-600 w-6 flex-shrink-0 pt-0.5">{n.n}</span>
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-1">{n.t}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{n.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {t.neurons.map(n => (
                <div key={n.n} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="font-mono text-xs text-green-600 mb-2 tracking-wide">{n.n}</div>
                  <div className="text-sm font-bold text-gray-900 mb-2">{n.t}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{n.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-white border-b border-gray-200 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <SectionHeader eyebrow={t.prod_eyebrow} title={t.prod_title} sub={t.prod_sub} />
          <div className="grid grid-cols-3 gap-5">
            {t.products.map(p => (
              <div key={p.t} className="border border-gray-200 rounded-2xl p-8 bg-gray-50">
                <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-green-700">{p.tag}</span>
                </div>
                <div className="text-xl font-extrabold tracking-tight text-gray-900 mb-3">{p.t}</div>
                <div className="text-sm text-gray-500 leading-relaxed mb-6">{p.d}</div>
                <div className="h-px bg-gray-200 mb-5" />
                <div className="grid grid-cols-3 gap-2">
                  {p.s.map(s => (
                    <div key={s.l} className="text-center bg-white border border-gray-200 rounded-lg py-3 px-2">
                      <div className="text-base font-bold text-green-600 font-mono">{s.v}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHARIAH */}
      <section className="bg-gray-900 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs font-mono text-green-500 tracking-widest uppercase mb-3">{t.sh_eyebrow}</p>
              <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white mb-5">
                {t.sh_title.split(" ").slice(0,-2).join(" ")}{" "}
                <em className="not-italic text-green-500">{t.sh_title.split(" ").slice(-2).join(" ")}</em>
              </h2>
              <p className="text-base text-gray-400 leading-relaxed mb-8">{t.sh_sub}</p>
              <div className="flex flex-col gap-4 mb-8">
                {t.sh_feats.map(f => (
                  <div key={f.t} className="flex gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-900 border border-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <div className="text-sm text-gray-300 leading-relaxed">
                      <strong className="text-white font-semibold">{f.t}</strong> — {f.d}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push("/signup")}
                className="bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                {t.sh_cta}
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-xs font-mono text-gray-500 mb-5 tracking-wider uppercase">Islamic Finance Market · 2026</div>
              <div className="flex flex-col gap-3">
                {t.sh_markets.map(m => (
                  <div key={m.n} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:m.color}} />
                      <div>
                        <div className="text-sm text-white/80 font-medium">{m.n}</div>
                        <div className="text-xs text-white/30 font-mono">{m.r}</div>
                      </div>
                    </div>
                    <div className="text-sm text-green-400 font-mono font-bold">{m.v}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
                <div className="text-xs text-gray-500 font-mono">{t.sh_total_label}</div>
                <div className="text-base text-white font-mono font-bold">{t.sh_total}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section className="bg-gray-50 border-b border-gray-200 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs font-mono text-green-600 tracking-widest uppercase mb-3">{t.perf_eyebrow}</p>
              <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-gray-900 mb-5">{t.perf_title}</h2>
              <p className="text-base text-gray-500 leading-relaxed mb-8">{t.perf_sub}</p>
              <div className="flex flex-col gap-5">
                {t.perf_feats.map(f => (
                  <div key={f.t} className="flex gap-4">
                    <div className="w-9 h-9 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 mb-1">{f.t}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-10">
              <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">{t.wl_title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{t.wl_sub}</p>
              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm font-mono text-green-700 text-center">
                  {t.wl_sent}
                </div>
              ) : (
                <form onSubmit={e => {e.preventDefault(); setSent(true);}} className="flex gap-2">
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t.wl_ph} required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-gray-500 font-sans" />
                  <button type="submit"
                    className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap">
                    {t.wl_cta}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-white border-b border-gray-200 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-20 items-end mb-14">
            <div>
              <p className="text-xs font-mono text-green-600 tracking-widest uppercase mb-3">{t.price_eyebrow}</p>
              <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-gray-900">{t.price_title}</h2>
            </div>
            <p className="text-base text-gray-500 leading-relaxed pb-1">{t.price_sub}</p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {t.plans.map(p => (
              <div key={p.tier} className={`rounded-2xl p-8 relative ${p.f ? "bg-gray-900" : "bg-gray-50 border border-gray-200"}`}>
                {p.f && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-mono px-4 py-1 rounded-full whitespace-nowrap font-semibold">
                    Most popular
                  </div>
                )}
                <div className={`font-mono text-xs tracking-widest mb-2 ${p.f ? "text-white/30" : "text-gray-400"}`}>{p.tier}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-extrabold tracking-tight ${p.f ? "text-white" : "text-gray-900"}`}>{p.price}</span>
                  <span className={`text-sm ${p.f ? "text-white/30" : "text-gray-400"}`}>{p.per}</span>
                </div>
                <div className={`text-xs leading-relaxed pb-5 mb-5 border-b ${p.f ? "text-white/40 border-white/10" : "text-gray-500 border-gray-200"}`}>{p.line}</div>
                <div className="flex flex-col gap-2.5 mb-7">
                  {p.feats.map(f => (
                    <div key={f} className={`flex items-start gap-2.5 text-xs ${p.f ? "text-white/60" : "text-gray-500"}`}>
                      <Check dark={p.f} />{f}
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push("/signup")}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${p.f ? "bg-green-600 text-white hover:bg-green-700" : "bg-white border border-gray-300 text-gray-900 hover:border-gray-400"}`}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-b border-gray-200 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <SectionHeader eyebrow={t.faq_eyebrow} title={t.faq_title} sub={t.faq_sub} />
          <div className="grid grid-cols-2 gap-4">
            {t.faqs.map(f => (
              <div key={f.q} className="bg-white border border-gray-200 rounded-xl p-7">
                <div className="text-sm font-bold text-gray-900 mb-3">{f.q}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gray-900 py-28 text-center">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold tracking-tight text-white mb-4">
            Join <em className="not-italic text-green-500">6Napse</em> today.
          </h2>
          <p className="text-sm font-mono text-gray-500 mb-10">{t.final_sub}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/signup")}
              className="bg-white text-gray-900 px-9 py-4 rounded-xl text-base font-bold hover:bg-gray-100 transition-colors">
              {t.final_cta}
            </button>
            <button className="border border-white/20 text-white/50 px-9 py-4 rounded-xl text-base hover:border-white/40 transition-colors">
              {t.final_cta2}
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="font-mono text-base font-bold text-gray-900">
            <span className="text-green-600">6</span>Napse
          </div>
          <div className="flex gap-7">
            {["Features","Shariah","Pricing","Performance","DEX Lab","Privacy","Terms"].map(l => (
              <a key={l} className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-xs text-gray-400 font-mono">© 2026 6Napse · Not financial advice</div>
        </div>
      </footer>

    </div>
  );
}
