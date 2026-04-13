"use client";
import { useState } from "react";

interface Props {
  strategyName: string;
  strategyId: string;
  onAccept: () => void;
  onBacktest: () => void;
  onClose: () => void;
}

export default function ConsentModal({ strategyName, onAccept, onBacktest, onClose }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState(false);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setScrolled(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{ width: "min(90vw, 560px)", maxHeight: "85vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
          <div>
            <div className="text-sm font-bold text-gray-900">Activation d'une stratégie automatisée</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{strategyName}</div>
          </div>
        </div>

        {/* Texte scrollable */}
        <div onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="text-[11px] font-bold text-orange-800 mb-2 uppercase tracking-wide">Lisez attentivement avant de continuer</div>
            <div className="space-y-3 text-[12px] text-orange-900 leading-relaxed">
              <p>Cette stratégie exécutera automatiquement des ordres sur votre compte en fonction de règles prédéfinies, sans intervention manuelle à chaque trade.</p>
              <p>Les marchés financiers comportent un <strong>risque élevé de perte en capital</strong>. Vous pouvez perdre tout ou partie des fonds alloués à cette stratégie.</p>
              <p>Les performances passées ou simulées <strong>ne garantissent pas les résultats futurs</strong>. Les conditions de marché peuvent changer radicalement et de façon imprévisible.</p>
              <p>Vous restez <strong>seul décisionnaire</strong> de l'activation, du suivi et de la désactivation de cette stratégie. SYNAPSE est un outil d'aide à la décision, non un conseiller financier réglementé.</p>
              <p>Vous pouvez désactiver la stratégie à tout moment, mais <strong>certaines positions peuvent rester ouvertes</strong> jusqu'à leur clôture automatique par les règles de stop loss ou take profit.</p>
              <p>En activant cette stratégie, vous confirmez avoir compris son fonctionnement, ses paramètres, et les risques associés. Vous assumez l'entière responsabilité des résultats.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-[11px] font-bold text-blue-800 mb-1">Recommandation</div>
            <p className="text-[11px] text-blue-700 leading-relaxed mb-3">
              Avant d'activer cette stratégie, nous vous recommandons de consulter ses performances historiques simulées pour comprendre son comportement dans différents contextes de marché.
            </p>
            <button onClick={onBacktest}
              className="text-[11px] font-bold text-blue-700 border border-blue-300 bg-white px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Voir les performances simulées (optionnel)
            </button>
          </div>

          {!scrolled && (
            <div className="text-center text-[10px] text-gray-400">↓ Continuez à lire pour activer</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <label className={`flex items-start gap-3 mb-4 cursor-pointer ${!scrolled ? "opacity-40 pointer-events-none" : ""}`}>
            <div
              onClick={() => scrolled && setChecked(!checked)}
              className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${checked ? "bg-[#111] border-[#111]" : "bg-white border-gray-300"}`}
            >
              {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-[11px] text-gray-700 leading-relaxed">
              J'ai lu et compris les risques associés. J'active <strong>{strategyName}</strong> sous ma propre responsabilité.
            </span>
          </label>

          {!scrolled && (
            <div className="text-[10px] text-orange-500 mb-3">⚠️ Lisez entièrement le texte ci-dessus pour débloquer l'activation</div>
          )}

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 text-[11px] text-gray-500 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              Annuler
            </button>
            <button
              onClick={onAccept}
              disabled={!checked || !scrolled}
              className="flex-1 text-[11px] font-bold bg-[#111] text-white py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Activer la stratégie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
