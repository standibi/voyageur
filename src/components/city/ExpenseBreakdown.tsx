/* eslint-disable @typescript-eslint/no-explicit-any */
import { CityData } from "@/types";

interface ExpenseBreakdownProps {
  breakdown: CityData["breakdown"];
  totalBudget: number;
  onViewLedger: () => void;
}

export default function ExpenseBreakdown({ breakdown, totalBudget, onViewLedger }: ExpenseBreakdownProps) {
  return (
    <div>
      <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Expense Breakdown</h4>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium flex items-center gap-2"><i className="fa-solid fa-bed text-indigo-400 w-4"></i> Stay</span><span className="font-bold text-slate-800">€{breakdown.stay}</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min((breakdown.stay / totalBudget) * 100, 100)}%` }}></div></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium flex items-center gap-2"><i className="fa-solid fa-ticket text-rose-400 w-4"></i> Activities</span><span className="font-bold text-slate-800">€{breakdown.activities || (breakdown as any).activity || 0}</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(((breakdown.activities || (breakdown as any).activity || 0) / totalBudget) * 100, 100)}%` }}></div></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium flex items-center gap-2"><i className="fa-solid fa-utensils text-emerald-400 w-4"></i> Food</span><span className="font-bold text-slate-800">€{breakdown.food}</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min((breakdown.food / totalBudget) * 100, 100)}%` }}></div></div>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-slate-100">
          <button onClick={onViewLedger} className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2"><i className="fa-solid fa-file-invoice-dollar"></i> View Detailed Ledger</button>
        </div>
      </div>
    </div>
  );
}
