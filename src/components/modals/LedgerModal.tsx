import React from "react";
import Modal from "./Modal";
import { CityData } from "@/types";

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
}

export default function LedgerModal({ isOpen, onClose, city }: LedgerModalProps) {
  return (
    <Modal title={`${city.name} - Grand Livre`} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="py-2 font-medium">Article</th>
              <th className="py-2 font-medium">Catégorie</th>
              <th className="py-2 font-medium text-right">Coût</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
              <td className="py-3 font-semibold text-slate-800">{city.hotel.name}</td>
              <td className="py-3 text-slate-500">
                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">Séjour</span>
              </td>
              <td className="py-3 text-right font-bold">€{city.breakdown.stay}</td>
            </tr>
            {city.rawActivities.map((act) => {
              const isFood = act.icon === "utensils";
              const catClass = isFood ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600";
              const catName = isFood ? "Nourriture" : "Activité";
              return (
                <tr key={act.id} className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-semibold text-slate-800">{act.name}</td>
                  <td className="py-3 text-slate-500">
                    <span className={`${catClass} px-2 py-1 rounded text-xs font-bold`}>{catName}</span>
                  </td>
                  <td className="py-3 text-right font-bold">€{act.price}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="text-lg">
              <td colSpan={2} className="py-4 font-bold text-slate-800">Budget Total Ville</td>
              <td className="py-4 text-right font-extrabold text-indigo-600">€{city.totalBudget}</td>
            </tr>
          </tfoot>
        </table>
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}
