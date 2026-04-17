"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  const [lang, setLang] = useState<"en"|"fr">("en");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const t = {
    en: {
      nav: ["Features","Shariah","Performance","Pricing","DEX Lab"],
      badge: "Algorithmic trading · Shariah compliant · Available now",
      h1a: "The algorithm that",
      h1b: "trades for you",
      sub: "6Napse combines 6 layers of artificial intelligence to detect, score and execute trades with hedge fund precision — 24 hours a day, fully automated. Built for every trader, with native Shariah compliance.",
      trust: ["Free simulation forever","Shariah compliant mode","No credit card needed"],
      cta1: "Start for free", cta2: "See how it works",
      t1:"regime →", t2:"universe →", t3:"signal", t4:"confirm ×", t5:"sizing →", t6:"opened", t7:"later →", t8:"next signal",
      tv1:"RANGING", tv2:"accumulation", tv3:"BUY SOLUSDT", tv4:"1.20", tv5:"$2,266 USDT", tv6:"SL · TP · trailing:2.0 ATR", tv7:"TP reached · profit booked", tv8:"scanning markets",
      tk1:"ADX:18 | Squeeze:true", tk2:"Shariah filter: ON", tk3:"score:63.8/100", tk4:"CMF:0.12 | MTF:bullish", tk5:"risk:1% ATR:2.1%",
      sp: [
        {v:"Automated",l:"24/7 trading engine",s:"No manual intervention needed"},
        {v:"8 regimes",l:"Market intelligence",s:"Adaptive to any market condition"},
        {v:"18 strategies",l:"Signal generation",s:"Multi-timeframe · 5m to 4h"},
        {v:"Shariah",l:"Compliant mode",s:"Native ethical screening"},
      ],
      how_eyebrow:"How it works", how_h:"6 neurons.\n1 decision.", how_sub:"Every trade passes through 6 intelligence layers before execution. No shortcuts, no guessing — pure systematic logic running 24 hours a day.",
      neurons:[
        {n:"01",title:"Market regime",desc:"8 states detected in real time: trending, ranging, pre-breakout, breakout, volatile, bear, panic, squeeze."},
        {n:"02",title:"Asset universe",desc:"6 data-driven pools selected per regime. Shariah filter applied natively before any signal generation."},
        {n:"03",title:"Signal generation",desc:"18 strategies filtered by regime. Multi-timeframe: 5m detection, 15m validation, 1h decision, 4h macro veto."},
        {n:"04",title:"Opportunity score",desc:"7-dimensional conviction: signal strength, regime confidence, sentiment, volume, ATR, MTF bias, squeeze."},
        {n:"05",title:"Risk calibration",desc:"Fixed fractional 1% per trade with drawdown adaptive multipliers and factorial correlation limits."},
        {n:"06",title:"Smart execution",desc:"Automatic SL/TP, ATR trailing stop, real-time monitoring. Three engines running simultaneously."},
      ],
      prod_eyebrow:"Products", prod_h:"Three trading engines.", prod_sub:"Each engine optimized for a different time horizon and risk profile — running simultaneously with isolated capital.",
      products:[
        {tag:"Active · Binance SPOT",title:"CEX Swing",desc:"Automated swing trading using mean reversion, market structure and momentum strategies. Automatic SL/TP and trailing stop. Shariah-compliant asset filter available.",stats:[{v:"18",l:"strategies"},{v:"8",l:"regimes"},{v:"1%",l:"risk/trade"}]},
        {tag:"Active · Isolated capital",title:"Scalp Book",desc:"High-frequency scalping on 5m and 15m timeframes with dedicated isolated portfolio. Entry timing engine for optimal price. Positions of 5 to 30 minutes with automatic timeout.",stats:[{v:"5m",l:"timeframe"},{v:"5",l:"max positions"},{v:"30m",l:"timeout"}]},
        {tag:"Phase 1 · Base + Solana",title:"DEX Lab",desc:"On-chain gem detection on Base and Solana. Flow-driven scoring: absorption signal, buyer quality index, GoPlus security screening, age and velocity analysis.",stats:[{v:"2",l:"chains"},{v:"30m",l:"scan cycle"},{v:"H+3",l:"decision"}]},
      ],
      shariah_eyebrow:"Ethical compliance",
      shariah_h:"Trading that respects\nyour values",
      shariah_sub:"6Napse is the first algorithmic trading platform with native Shariah compliance. No workaround, no manual filtering — the engine screens every asset automatically before any position is opened.",
      shariah_feats:[
        {title:"Automatic asset screening",desc:"Alcohol, tobacco, weapons, conventional banking, pork and gambling are filtered at the universe level — before any signal is generated."},
        {title:"No riba (interest)",desc:"SPOT-only trading with no margin, no leverage and no overnight interest — fully aligned with Islamic finance principles."},
        {title:"Continuous compliance",desc:"The Shariah filter re-applies at every engine cycle. If an asset becomes non-compliant, it is removed from the universe automatically."},
        {title:"One toggle, full compliance",desc:"Activate Shariah mode in your profile. The entire engine adapts instantly — no configuration, no compromise."},
      ],
      shariah_cta:"Enable Shariah mode",
      shariah_market_title:"ISLAMIC FINANCE MARKET · 2026",
      shariah_markets:[
        {color:"#10b981",name:"Middle East & GCC",region:"Saudi Arabia · UAE · Qatar · Kuwait",val:"$1.9T"},
        {color:"#3b82f6",name:"Southeast Asia",region:"Malaysia · Indonesia · Brunei",val:"$0.8T"},
        {color:"#a78bfa",name:"Europe · diaspora",region:"UK · France · Germany · Belgium",val:"$0.5T"},
        {color:"#f59e0b",name:"North Africa",region:"Morocco · Egypt · Tunisia · Algeria",val:"$0.4T"},
      ],
      shariah_total_label:"Total addressable market",
      shariah_total:"$3.6 trillion",
      perf_eyebrow:"Performance",
      perf_h:"Real results.\nFull transparency.",
      perf_sub:"We believe in radical transparency. A public performance dashboard is coming — tracking real trader results across all strategies, regimes and market conditions.",
      perf_feats:[
        {title:"Live P&L tracking",desc:"Real-time portfolio value, realized and unrealized gains across all active strategies and regimes."},
        {title:"Strategy-level analytics",desc:"Win rate, expectancy and drawdown broken down by strategy, regime and time period."},
        {title:"Cross-trader benchmarking",desc:"Compare your performance against anonymized aggregate data from the entire 6Napse community."},
      ],
      waitlist_h:"Join the waitlist",
      waitlist_p:"Be among the first to access the public performance dashboard. One email when it launches, no spam.",
      waitlist_ph:"your@email.com",
      waitlist_cta:"Notify me",
      waitlist_sent:"You are on the list",
      price_eyebrow:"Pricing",
      price_h:"Start free.\nGo live when\nyou are ready.",
      price_sub:"No credit card required for simulation. Upgrade to live trading only when your readiness checklist is fully validated.",
      plans:[
        {tier:"FREE",price:"€0",per:"/month",line:"Simulation mode. No risk, no credit card. Full access to every feature and strategy.",feats:["Virtual capital $50,000 USDT","All 18 trading strategies","Full dashboard + journal","DEX Lab Phase 1 — Base + Solana","Telegram + Email alerts","Shariah compliant mode"],cta:"Get started — free",featured:false},
        {tier:"PRO",price:"€49",per:"/month",line:"Live trading with your real Binance capital. Unlocks when your checklist is complete.",feats:["Everything in Free","Live mode — Binance SPOT","Capital up to €50,000","Scalp book fully activated","Priority support — 24h response","1 year full performance history"],cta:"Start Pro",featured:true},
        {tier:"ELITE",price:"€149",per:"/month",line:"For serious traders, family offices and fund managers who need scale and control.",feats:["Everything in Pro","Up to 5 independent accounts","Unlimited trading capital","Multi-CEX: Binance + Coinbase + Kraken","DEX Lab Phase 2 — wallet intelligence","API access + webhooks"],cta:"Contact us",featured:false},
      ],
      faq_eyebrow:"FAQ", faq_h:"Common questions.", faq_sub:"Everything you need to know before getting started. Still have questions? We answer within 24 hours.",
      faqs:[
        {q:"Can I lose money in simulation mode?",a:"No. Simulation uses virtual capital only. You can test all strategies without any financial risk. The live toggle only unlocks when your readiness checklist is fully validated."},
        {q:"How is 6Napse different from 3Commas?",a:"6Napse adapts to 8 market regimes and selects strategies automatically. 3Commas gives you fixed tools to configure manually. 6Napse thinks for you — no manual intervention needed."},
        {q:"Is the Shariah mode truly compliant?",a:"Shariah mode filters assets at the universe level before any signal is generated. Screened categories include alcohol, tobacco, weapons, conventional banking, pork and gambling. SPOT-only trading eliminates riba entirely."},
        {q:"When can I switch to live trading?",a:"A built-in checklist validates your readiness: 100+ simulation trades, win rate above 60%, max drawdown below 10%, and your Binance API connected and verified."},
        {q:"What exchanges are supported?",a:"Binance SPOT is the primary exchange on Pro. Coinbase and Kraken are planned for Elite. DEX Lab covers Base and Solana on-chain, with Phase 2 bringing wallet intelligence."},
        {q:"Is my Binance API key safe?",a:"Your API key is stored encrypted. We only request Spot Trading and Read permissions — withdrawal access is never requested. Your funds can only be traded, never moved."},
      ],
      final_h:"Join 6Napse today.",
      final_em:"6Napse",
      final_sub:"Free forever in simulation · Shariah compliant · Go live when you are ready",
      final_cta:"Create my free account",
      final_cta2:"Read the docs",
      footer_links:["Features","Shariah","Pricing","Performance","DEX Lab","Privacy","Terms"],
    },
    fr: {
      nav:["Fonctionnalités","Shariah","Performance","Tarifs","DEX Lab"],
      badge:"Trading algorithmique · Conforme Shariah · Disponible maintenant",
      h1a:"L algorithme qui",
      h1b:"trade à ta place",
      sub:"6Napse combine 6 couches d intelligence artificielle pour détecter, scorer et exécuter des trades avec la précision d un hedge fund — 24h/24, entièrement automatisé. Conçu pour tous les traders, avec conformité Shariah native.",
      trust:["Simulation gratuite à vie","Mode conforme Shariah","Sans carte bancaire"],
      cta1:"Commencer gratuitement",cta2:"Voir comment ca marche",
      t1:"régime →",t2:"univers →",t3:"signal",t4:"confirmation ×",t5:"sizing →",t6:"ouvert",t7:"plus tard →",t8:"prochain signal",
      tv1:"RANGING",tv2:"accumulation",tv3:"BUY SOLUSDT",tv4:"1.20",tv5:"$2,266 USDT",tv6:"SL · TP · trailing:2.0 ATR",tv7:"TP atteint · profit réalisé",tv8:"analyse en cours",
      tk1:"ADX:18 | Squeeze:true",tk2:"Filtre Shariah: ON",tk3:"score:63.8/100",tk4:"CMF:0.12 | MTF:haussier",tk5:"risque:1% ATR:2.1%",
      sp:[
        {v:"Automatisé",l:"Moteur 24h/24",s:"Aucune intervention manuelle"},
        {v:"8 régimes",l:"Intelligence marché",s:"Adaptatif à toute condition"},
        {v:"18 stratégies",l:"Génération de signal",s:"Multi-timeframe · 5m à 4h"},
        {v:"Shariah",l:"Mode conforme",s:"Screening éthique natif"},
      ],
      how_eyebrow:"Comment ca marche",how_h:"6 neurones.\n1 décision.",how_sub:"Chaque trade passe par 6 couches d intelligence avant l exécution. Sans raccourci, sans approximation — logique systématique pure, 24h/24.",
      neurons:[
        {n:"01",title:"Régime de marché",desc:"8 états détectés en temps réel : trending, ranging, pre-breakout, breakout, volatile, bear, panic, squeeze."},
        {n:"02",title:"Univers d assets",desc:"6 pools data-driven sélectionnés par régime. Filtre Shariah appliqué nativement avant toute génération de signal."},
        {n:"03",title:"Génération de signal",desc:"18 stratégies filtrées par régime. Multi-timeframe : détection 5m, validation 15m, décision 1h, veto macro 4h."},
        {n:"04",title:"Score d opportunité",desc:"Conviction 7 dimensions : force signal, confiance régime, sentiment, volume, ATR, biais MTF, squeeze."},
        {n:"05",title:"Calibration du risque",desc:"Fixed fractional 1% par trade avec multiplicateurs adaptatifs au drawdown et limites de corrélation factorielle."},
        {n:"06",title:"Exécution intelligente",desc:"SL/TP automatiques, trailing stop ATR, monitoring temps réel. Trois moteurs actifs simultanément."},
      ],
      prod_eyebrow:"Produits",prod_h:"Trois moteurs de trading.",prod_sub:"Chaque moteur optimisé pour un horizon de temps et un profil de risque différent — actifs simultanément avec capital isolé.",
      products:[
        {tag:"Actif · Binance SPOT",title:"CEX Swing",desc:"Trading swing automatisé par mean reversion, market structure et momentum. SL/TP automatiques et trailing stop. Filtre Shariah disponible.",stats:[{v:"18",l:"stratégies"},{v:"8",l:"régimes"},{v:"1%",l:"risque/trade"}]},
        {tag:"Actif · Capital isolé",title:"Scalp Book",desc:"Scalping haute fréquence sur 5m et 15m avec portfolio dédié et capital isolé. Entry timing engine pour prix optimal. Positions de 5 à 30 minutes avec timeout automatique.",stats:[{v:"5m",l:"timeframe"},{v:"5",l:"max positions"},{v:"30m",l:"timeout"}]},
        {tag:"Phase 1 · Base + Solana",title:"DEX Lab",desc:"Détection de pépites on-chain sur Base et Solana. Scoring flow-driven : signal absorption, buyer quality index, screening sécurité GoPlus, analyse age et vélocité.",stats:[{v:"2",l:"chains"},{v:"30m",l:"scan"},{v:"H+3",l:"décision"}]},
      ],
      shariah_eyebrow:"Conformité éthique",
      shariah_h:"Un trading qui\nrespecte tes valeurs",
      shariah_sub:"6Napse est la première plateforme de trading algorithmique avec conformité Shariah native. Aucun contournement, aucun filtre manuel — le moteur analyse chaque asset automatiquement avant toute ouverture de position.",
      shariah_feats:[
        {title:"Screening automatique des assets",desc:"Alcool, tabac, armement, banques conventionnelles, porc et jeux sont filtrés au niveau des univers — avant toute génération de signal."},
        {title:"Sans riba (intérêt)",desc:"Trading SPOT uniquement, sans marge, sans levier et sans intérêts overnight — pleinement aligné avec les principes de la finance islamique."},
        {title:"Conformité continue",desc:"Le filtre Shariah est ré-appliqué à chaque cycle du moteur. Si un asset devient non-conforme, il est retiré de l univers automatiquement."},
        {title:"Un toggle, conformité totale",desc:"Active le mode Shariah dans ton profil. L ensemble du moteur s adapte instantanément — sans configuration, sans compromis."},
      ],
      shariah_cta:"Activer le mode Shariah",
      shariah_market_title:"MARCHÉ FINANCE ISLAMIQUE · 2026",
      shariah_markets:[
        {color:"#10b981",name:"Moyen-Orient & GCC",region:"Arabie Saoudite · EAU · Qatar · Koweït",val:"1,9T$"},
        {color:"#3b82f6",name:"Asie du Sud-Est",region:"Malaisie · Indonésie · Brunei",val:"0,8T$"},
        {color:"#a78bfa",name:"Europe · diaspora",region:"Royaume-Uni · France · Allemagne · Belgique",val:"0,5T$"},
        {color:"#f59e0b",name:"Afrique du Nord",region:"Maroc · Egypte · Tunisie · Algérie",val:"0,4T$"},
      ],
      shariah_total_label:"Marché adressable total",
      shariah_total:"3,6 trillions $",
      perf_eyebrow:"Performance",
      perf_h:"Vrais résultats.\nTransparence totale.",
      perf_sub:"Nous croyons en la transparence radicale. Un dashboard de performance public arrive — suivant les vrais résultats des traders sur toutes les stratégies et régimes.",
      perf_feats:[
        {title:"Suivi P&L en temps réel",desc:"Valeur du portfolio, gains réalisés et latents sur toutes les stratégies et régimes actifs."},
        {title:"Analytiques par stratégie",desc:"Win rate, espérance mathématique et drawdown max par stratégie, régime et période."},
        {title:"Benchmarking inter-traders",desc:"Compare tes performances avec les données agrégées anonymisées de toute la communauté 6Napse."},
      ],
      waitlist_h:"Rejoins la liste d attente",
      waitlist_p:"Sois parmi les premiers à accéder au dashboard de performance public. Un seul email au lancement, aucun spam.",
      waitlist_ph:"ton@email.com",
      waitlist_cta:"Me notifier",
      waitlist_sent:"Tu es sur la liste",
      price_eyebrow:"Tarifs",
      price_h:"Commence gratuitement.\nPasse en live\nquand tu es prêt.",
      price_sub:"Sans carte bancaire pour la simulation. Passe en live uniquement quand ta checklist de validation est complète.",
      plans:[
        {tier:"FREE",price:"€0",per:"/mois",line:"Mode simulation. Sans risque, sans carte bancaire. Accès complet à toutes les fonctionnalités et stratégies.",feats:["Capital virtuel 50 000 USDT","18 stratégies complètes","Dashboard + journal + analytiques","DEX Lab Phase 1 — Base + Solana","Alertes Telegram + Email","Mode conforme Shariah"],cta:"Commencer gratuitement",featured:false},
        {tier:"PRO",price:"€49",per:"/mois",line:"Trading live avec ton vrai capital Binance. Débloqué quand ta checklist est validée.",feats:["Tout le Free inclus","Mode live — Binance SPOT","Capital jusqu à 50 000€","Scalp book activé","Support prioritaire — réponse 24h","1 an d historique performance"],cta:"Commencer Pro",featured:true},
        {tier:"ELITE",price:"€149",per:"/mois",line:"Pour les traders sérieux, family offices et gérants de fonds qui ont besoin d échelle et de contrôle.",feats:["Tout le Pro inclus","Jusqu à 5 comptes indépendants","Capital illimité","Multi-CEX : Binance + Coinbase + Kraken","DEX Lab Phase 2 — wallet intelligence","Accès API + webhooks"],cta:"Nous contacter",featured:false},
      ],
      faq_eyebrow:"FAQ",faq_h:"Questions fréquentes.",faq_sub:"Tout ce que tu dois savoir avant de commencer. Des questions ? On répond dans les 24 heures.",
      faqs:[
        {q:"Puis-je perdre de l argent en simulation ?",a:"Non. La simulation utilise uniquement du capital virtuel. Tu peux tester toutes les stratégies sans aucun risque financier. Le toggle live ne se déverrouille que quand ta checklist est entièrement validée."},
        {q:"Quelle différence avec 3Commas ?",a:"6Napse s adapte à 8 régimes de marché et sélectionne les stratégies automatiquement. 3Commas te donne des outils fixes à configurer manuellement. 6Napse pense à ta place — aucune intervention nécessaire."},
        {q:"Le mode Shariah est-il vraiment conforme ?",a:"Le mode Shariah filtre les assets au niveau des univers avant toute génération de signal. Catégories exclues : alcool, tabac, armement, banques conventionnelles, porc et jeux. Trading SPOT uniquement — le riba est exclu par construction."},
        {q:"Quand puis-je passer en live ?",a:"Une checklist intégrée valide ta préparation : 100+ trades en simulation, win rate > 60%, drawdown max < 10%, et API Binance connectée et vérifiée. Le toggle se déverrouille automatiquement."},
        {q:"Quels exchanges sont supportés ?",a:"Binance SPOT est le principal sur Pro. Coinbase et Kraken sont prévus pour Elite. DEX Lab couvre Base et Solana on-chain, avec la Phase 2 apportant wallet intelligence et plus de chains."},
        {q:"Ma clé API Binance est-elle sécurisée ?",a:"Ta clé est stockée chiffrée. Nous ne demandons que les permissions Spot Trading et Lecture — l accès aux retraits n est jamais demandé. Tes fonds peuvent uniquement être tradés, jamais déplacés."},
      ],
      final_h:"Rejoins 6Napse aujourd hui.",
      final_em:"6Napse",
      final_sub:"Gratuit à vie en simulation · Conforme Shariah · Passe en live quand tu es prêt",
      final_cta:"Créer mon compte gratuit",
      final_cta2:"Lire la documentation",
      footer_links:["Fonctionnalités","Shariah","Tarifs","Performance","DEX Lab","Confidentialité","CGU"],
    }
  }[lang];

  const G = "#16a34a";
  const W = "#fff";
  const BG = "#f8fafc";
  const TEXT = "#0f172a";
  const MUTED = "#64748b";
  const MUTED2 = "#94a3b8";
  const BORDER = "#e2e8f0";
  const BORDER2 = "#cbd5e1";
  const GREEN_L = "#f0fdf4";
  const GREEN_B = "#bbf7d0";
  const MONO = "JetBrains Mono, monospace";
  const SANS = "Inter, sans-serif";
  const MAX = 1200;
  const PAD = "0 80px";

  const sec: React.CSSProperties = { borderBottom:`1px solid ${BORDER}`, padding:"96px 0" };
  const secAlt: React.CSSProperties = { ...sec, background:BG };
  const inner: React.CSSProperties = { maxWidth:MAX, margin:"0 auto", padding:PAD };
  const eyebrow: React.CSSProperties = { fontSize:11, fontFamily:MONO, color:G, letterSpacing:2, textTransform:"uppercase" as const, marginBottom:12 };
  const secH: React.CSSProperties = { fontSize:44, fontWeight:800, letterSpacing:-1.5, lineHeight:1.08, color:TEXT };
  const secSub: React.CSSProperties = { fontSize:16, color:MUTED, lineHeight:1.65 };
  const twoCol: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"end", marginBottom:56 };

  const Dot = ({size=6,color=G}:{size?:number,color?:string}) => (
    <div style={{width:size,height:size,background:color,borderRadius:"50%",flexShrink:0}} />
  );

  const Check = ({featured=false}:{featured?:boolean}) => (
    <div style={{width:16,height:16,borderRadius:"50%",background:featured?"rgba(22,163,74,.15)":GREEN_L,border:`1px solid ${featured?"rgba(22,163,74,.3)":GREEN_B}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
      <Dot size={5} />
    </div>
  );

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{background:W,color:TEXT,fontFamily:SANS,fontSize:16,lineHeight:1.6}}>

      {/* NAV */}
      <nav style={{background:"rgba(255,255,255,.95)",borderBottom:`1px solid ${BORDER}`,height:64,display:"flex",alignItems:"center",position:"sticky",top:0,zIndex:100}}>
        <div style={{...inner,display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:PAD}}>
          <div style={{fontFamily:MONO,fontSize:20,fontWeight:700,letterSpacing:-.5,color:TEXT}}>
            <span style={{color:G}}>6</span>Napse
          </div>
          <div style={{display:"flex",gap:32}}>
            {t.nav.map(n=><a key={n} style={{fontSize:14,color:MUTED,textDecoration:"none",cursor:"pointer"}}>{n}</a>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{display:"flex",border:`1px solid ${BORDER}`,borderRadius:8,overflow:"hidden"}}>
              {(["en","fr"] as const).map(l=>(
                <span key={l} onClick={()=>setLang(l)} style={{padding:"5px 12px",fontSize:12,fontFamily:MONO,cursor:"pointer",background:lang===l?TEXT:"transparent",color:lang===l?W:MUTED}}>
                  {l.toUpperCase()}
                </span>
              ))}
            </div>
            <button onClick={()=>router.push("/signup")} style={{background:TEXT,color:W,padding:"9px 20px",borderRadius:9,fontSize:13,fontWeight:600,border:"none",cursor:"pointer"}}>
              {t.cta1}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:W,borderBottom:`1px solid ${BORDER}`,padding:"100px 0 80px"}}>
        <div style={{...inner,padding:PAD}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,background:GREEN_L,border:`1px solid ${GREEN_B}`,borderRadius:100,padding:"5px 14px",marginBottom:28,fontSize:12,color:G,fontFamily:MONO}}>
                <div style={{width:6,height:6,background:G,borderRadius:"50%"}} />
                {t.badge}
              </div>
              <h1 style={{fontSize:56,fontWeight:800,lineHeight:1.05,letterSpacing:-2,marginBottom:24,color:TEXT}}>
                {t.h1a}<br/><em style={{fontStyle:"normal",color:G}}>{t.h1b}</em>
              </h1>
              <p style={{fontSize:17,color:MUTED,lineHeight:1.7,marginBottom:36}}>{t.sub}</p>
              <div style={{display:"flex",gap:12,marginBottom:40}}>
                <button onClick={()=>router.push("/signup")} style={{background:TEXT,color:W,padding:"14px 28px",borderRadius:10,fontSize:15,fontWeight:600,border:"none",cursor:"pointer"}}>{t.cta1}</button>
                <button style={{background:W,color:TEXT,padding:"14px 28px",borderRadius:10,fontSize:15,border:`1px solid ${BORDER2}`,cursor:"pointer"}}>{t.cta2}</button>
              </div>
              <div style={{display:"flex",gap:24}}>
                {t.trust.map(tr=>(
                  <div key={tr} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:MUTED}}>
                    <div style={{width:16,height:16,background:GREEN_L,border:`1px solid ${GREEN_B}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Dot size={5} />
                    </div>
                    {tr}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{border:`1px solid ${BORDER}`,borderRadius:14,overflow:"hidden",background:W}}>
                <div style={{background:BG,padding:"12px 16px",display:"flex",alignItems:"center",gap:7,borderBottom:`1px solid ${BORDER}`}}>
                  {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}} />)}
                  <span style={{fontSize:11,color:MUTED2,fontFamily:MONO,marginLeft:8}}>6napse · signal engine · live</span>
                </div>
                <div style={{padding:"20px 22px",fontFamily:MONO,fontSize:12,lineHeight:2.2}}>
                  {[
                    {p:"$",k:t.t1,v:t.tv1,s:t.tk1,vc:TEXT,sc:MUTED2},
                    {p:"$",k:t.t2,v:t.tv2,s:t.tk2,vc:TEXT,sc:MUTED2},
                    {p:"$",k:t.t3,v:t.tv3,s:t.tk3,vc:TEXT,sc:MUTED2},
                    {p:"$",k:t.t4,v:t.tv4,s:t.tk4,vc:TEXT,sc:MUTED2},
                    {p:"$",k:t.t5,v:t.tv5,s:t.tk5,vc:TEXT,sc:MUTED2},
                    {p:"$",k:t.t6,v:t.tv6,s:"",vc:G,sc:G},
                    {p:"$",k:t.t7,v:t.tv7,s:"",vc:G,sc:G,warn:true},
                    {p:"$",k:t.t8,v:t.tv8,s:"",vc:TEXT,sc:MUTED2,cursor:true},
                  ].map((l,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{color:G}}>{l.p}</span>
                      <span style={{color:l.warn?"#b45309":MUTED2}}>{l.k}</span>
                      <span style={{color:l.vc,fontWeight:600}}>{l.v}</span>
                      {l.s && <span style={{color:l.sc}}>{l.s}</span>}
                      {l.cursor && <span style={{display:"inline-block",width:7,height:14,background:TEXT,verticalAlign:"middle"}} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{background:BG,borderBottom:`1px solid ${BORDER}`,padding:"48px 0"}}>
        <div style={{...inner,padding:PAD}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,alignItems:"center"}}>
            {t.sp.map((s,i)=>(
              <div key={i} style={{textAlign:"center",padding:"0 24px",borderRight:i<3?`1px solid ${BORDER}`:"none"}}>
                <div style={{fontSize:13,fontWeight:600,color:MUTED,fontFamily:MONO,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{s.v}</div>
                <div style={{fontSize:22,fontWeight:800,color:TEXT,letterSpacing:-.5}}>{s.l}</div>
                <div style={{fontSize:12,color:MUTED2,marginTop:4}}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEURONS */}
      <section style={secAlt}>
        <div style={{...inner,padding:PAD}}>
          <div style={twoCol}>
            <div><div style={eyebrow}>{t.how_eyebrow}</div><h2 style={{...secH,marginBottom:0}}>{t.how_h.split("\\n").map((l,i)=><span key={i}>{l}{i===0&&<br/>}</span>)}</h2></div>
            <p style={secSub}>{t.how_sub}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"5fr 7fr",gap:64,alignItems:"start"}}>
            <div>
              {t.neurons.map(n=>(
                <div key={n.n} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"16px 0",borderBottom:`1px solid ${BORDER}`}}>
                  <span style={{fontFamily:MONO,fontSize:10,color:G,width:20,flexShrink:0,paddingTop:2}}>{n.n}</span>
                  <div><div style={{fontSize:14,fontWeight:700,color:TEXT,marginBottom:4}}>{n.title}</div><div style={{fontSize:12,color:MUTED,lineHeight:1.55}}>{n.desc}</div></div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {t.neurons.map(n=>(
                <div key={n.n} style={{background:W,border:`1px solid ${BORDER}`,borderRadius:12,padding:22}}>
                  <div style={{fontFamily:MONO,fontSize:10,color:G,marginBottom:8,letterSpacing:1}}>{n.n}</div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:TEXT}}>{n.title}</div>
                  <div style={{fontSize:12,color:MUTED,lineHeight:1.55}}>{n.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={sec}>
        <div style={{...inner,padding:PAD}}>
          <div style={twoCol}>
            <div><div style={eyebrow}>{t.prod_eyebrow}</div><h2 style={{...secH,marginBottom:0}}>{t.prod_h}</h2></div>
            <p style={secSub}>{t.prod_sub}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {t.products.map(p=>(
              <div key={p.title} style={{border:`1px solid ${BORDER}`,borderRadius:16,padding:32,background:BG}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:10,fontFamily:MONO,color:G,background:GREEN_L,border:`1px solid ${GREEN_B}`,padding:"3px 10px",borderRadius:100,marginBottom:18}}>
                  <Dot size={5} />{p.tag}
                </div>
                <div style={{fontSize:22,fontWeight:800,letterSpacing:-.5,marginBottom:10,color:TEXT}}>{p.title}</div>
                <div style={{fontSize:13,color:MUTED,lineHeight:1.65,marginBottom:24}}>{p.desc}</div>
                <div style={{height:1,background:BORDER,marginBottom:20}} />
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {p.stats.map(s=>(
                    <div key={s.l} style={{textAlign:"center",background:W,border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 6px"}}>
                      <div style={{fontSize:17,fontWeight:700,color:G,fontFamily:MONO}}>{s.v}</div>
                      <div style={{fontSize:10,color:MUTED2,marginTop:2}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHARIAH */}
      <section style={{background:TEXT,borderBottom:"none"}}>
        <div style={{maxWidth:MAX,margin:"0 auto",padding:`96px 80px`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <div>
            <div style={{...eyebrow,color:G}}>{t.shariah_eyebrow}</div>
            <h2 style={{fontSize:44,fontWeight:800,letterSpacing:-1.5,lineHeight:1.08,marginBottom:20,color:W}}>
              {t.shariah_h.split("\\n").map((l,i)=><span key={i}>{i===1?<em style={{fontStyle:"normal",color:G}}>{l}</em>:l}{i===0&&<br/>}</span>)}
            </h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,.5)",lineHeight:1.7,marginBottom:32}}>{t.shariah_sub}</p>
            <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:36}}>
              {t.shariah_feats.map(f=>(
                <div key={f.title} style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div style={{width:18,height:18,background:"rgba(22,163,74,.15)",border:"1px solid rgba(22,163,74,.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                    <Dot size={6} />
                  </div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>
                    <strong style={{color:W,fontWeight:600}}>{f.title}</strong> — {f.desc}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>router.push("/signup")} style={{display:"inline-flex",alignItems:"center",gap:8,background:G,color:W,padding:"13px 24px",borderRadius:10,fontSize:14,fontWeight:600,border:"none",cursor:"pointer"}}>
              {t.shariah_cta}
            </button>
          </div>
          <div>
            <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:32}}>
              <div style={{fontSize:11,fontFamily:MONO,color:"rgba(255,255,255,.35)",marginBottom:20,letterSpacing:1}}>{t.shariah_market_title}</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {t.shariah_markets.map(m=>(
                  <div key={m.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:m.color}} />
                      <div>
                        <div style={{fontSize:13,color:"rgba(255,255,255,.8)",fontWeight:500}}>{m.name}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,.3)",fontFamily:MONO}}>{m.region}</div>
                      </div>
                    </div>
                    <div style={{fontSize:14,color:G,fontFamily:MONO,fontWeight:700}}>{m.val}</div>
                  </div>
                ))}
              </div>
              <div style={{height:1,background:"rgba(255,255,255,.08)",margin:"16px 0"}} />
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,color:"rgba(255,255,255,.35)",fontFamily:MONO}}>{t.shariah_total_label}</div>
                <div style={{fontSize:16,color:W,fontFamily:MONO,fontWeight:700}}>{t.shariah_total}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section style={secAlt}>
        <div style={{...inner,padding:PAD}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
            <div>
              <div style={eyebrow}>{t.perf_eyebrow}</div>
              <h2 style={{...secH,marginBottom:16}}>{t.perf_h.split("\\n").map((l,i)=><span key={i}>{l}{i===0&&<br/>}</span>)}</h2>
              <p style={{...secSub,marginBottom:36}}>{t.perf_sub}</p>
              <div style={{display:"flex",flexDirection:"column",gap:20}}>
                {t.perf_feats.map(f=>(
                  <div key={f.title} style={{display:"flex",alignItems:"flex-start",gap:14}}>
                    <div style={{width:36,height:36,background:GREEN_L,border:`1px solid ${GREEN_B}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Dot size={8} />
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,marginBottom:4,color:TEXT}}>{f.title}</div>
                      <div style={{fontSize:13,color:MUTED,lineHeight:1.5}}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{background:W,border:`1px solid ${BORDER}`,borderRadius:16,padding:40}}>
                <h3 style={{fontSize:22,fontWeight:700,marginBottom:8,letterSpacing:-.5,color:TEXT}}>{t.waitlist_h}</h3>
                <p style={{fontSize:14,color:MUTED,marginBottom:24,lineHeight:1.6}}>{t.waitlist_p}</p>
                {sent ? (
                  <div style={{background:GREEN_L,border:`1px solid ${GREEN_B}`,borderRadius:9,padding:"14px 16px",fontSize:14,color:G,fontFamily:MONO,textAlign:"center"}}>
                    {t.waitlist_sent}
                  </div>
                ) : (
                  <form onSubmit={handleWaitlist} style={{display:"flex",gap:8}}>
                    <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder={t.waitlist_ph} required
                      style={{flex:1,padding:"12px 16px",border:`1px solid ${BORDER2}`,borderRadius:9,fontSize:14,outline:"none",background:W,fontFamily:SANS}} />
                    <button type="submit" style={{padding:"12px 20px",background:TEXT,color:W,border:"none",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                      {t.waitlist_cta}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={sec}>
        <div style={{...inner,padding:PAD}}>
          <div style={twoCol}>
            <div>
              <div style={eyebrow}>{t.price_eyebrow}</div>
              <h2 style={{...secH,marginBottom:0}}>{t.price_h.split("\\n").map((l,i)=><span key={i}>{l}{i<2&&<br/>}</span>)}</h2>
            </div>
            <p style={secSub}>{t.price_sub}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {t.plans.map(p=>(
              <div key={p.tier} style={{background:p.featured?TEXT:W,border:p.featured?"none":`1px solid ${BORDER}`,borderRadius:16,padding:32,position:"relative"}}>
                {p.featured && <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:G,color:W,fontSize:10,fontFamily:MONO,padding:"4px 16px",borderRadius:100,whiteSpace:"nowrap",fontWeight:600}}>Most popular</div>}
                <div style={{fontFamily:MONO,fontSize:10,color:p.featured?"rgba(255,255,255,.35)":MUTED,marginBottom:10,letterSpacing:1.5}}>{p.tier}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
                  <span style={{fontSize:42,fontWeight:800,letterSpacing:-2,color:p.featured?W:TEXT}}>{p.price}</span>
                  <span style={{fontSize:14,color:p.featured?"rgba(255,255,255,.35)":MUTED}}>{p.per}</span>
                </div>
                <div style={{fontSize:13,color:p.featured?"rgba(255,255,255,.45)":MUTED,paddingBottom:20,borderBottom:`1px solid ${p.featured?"rgba(255,255,255,.1)":BORDER}`,marginBottom:20,lineHeight:1.5}}>{p.line}</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
                  {p.feats.map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"flex-start",gap:9,fontSize:13,color:p.featured?"rgba(255,255,255,.65)":MUTED}}>
                      <Check featured={p.featured} />{f}
                    </div>
                  ))}
                </div>
                <button onClick={()=>router.push("/signup")} style={{width:"100%",padding:13,borderRadius:9,fontSize:14,fontWeight:600,cursor:"pointer",border:p.featured?"none":`1px solid ${BORDER2}`,background:p.featured?G:W,color:p.featured?W:TEXT,fontFamily:SANS}}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={secAlt}>
        <div style={{...inner,padding:PAD}}>
          <div style={twoCol}>
            <div><div style={eyebrow}>{t.faq_eyebrow}</div><h2 style={{...secH,marginBottom:0}}>{t.faq_h}</h2></div>
            <p style={secSub}>{t.faq_sub}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {t.faqs.map(f=>(
              <div key={f.q} style={{background:W,border:`1px solid ${BORDER}`,borderRadius:12,padding:28}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:10,color:TEXT}}>{f.q}</div>
                <div style={{fontSize:13,color:MUTED,lineHeight:1.65}}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{background:TEXT,padding:"120px 0",textAlign:"center",borderBottom:"none"}}>
        <h2 style={{fontSize:52,fontWeight:800,color:W,letterSpacing:-2,marginBottom:16,lineHeight:1.05}}>
          {t.final_h.replace(t.final_em,"").trim().split(" ").length > 0 ? (
            <>Join <em style={{fontStyle:"normal",color:G}}>{t.final_em}</em> today.</>
          ) : t.final_h}
        </h2>
        <p style={{fontSize:15,color:"rgba(255,255,255,.35)",marginBottom:40,fontFamily:MONO}}>{t.final_sub}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={()=>router.push("/signup")} style={{background:W,color:TEXT,padding:"15px 36px",borderRadius:11,fontSize:15,fontWeight:700,border:"none",cursor:"pointer"}}>{t.final_cta}</button>
          <button style={{background:"transparent",color:"rgba(255,255,255,.4)",padding:"15px 36px",borderRadius:11,fontSize:15,border:"1px solid rgba(255,255,255,.15)",cursor:"pointer"}}>{t.final_cta2}</button>
        </div>
      </section>

      <footer style={{background:W,borderTop:`1px solid ${BORDER}`,padding:"32px 80px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:MONO,fontSize:16,fontWeight:700,color:TEXT}}><span style={{color:G}}>6</span>Napse</div>
        <div style={{display:"flex",gap:28}}>
          {t.footer_links.map(l=><a key={l} style={{fontSize:13,color:MUTED,textDecoration:"none",cursor:"pointer"}}>{l}</a>)}
        </div>
        <div style={{fontSize:12,color:MUTED2,fontFamily:MONO}}>© 2026 6Napse · Not financial advice</div>
      </footer>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}
