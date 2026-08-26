import { CityData } from "@/types";

interface SidebarProps {
  tripData: Record<string, CityData>;
  currentCityId: string | null;
  setCurrentCityId: (id: string) => void;
  onAddDestination: () => void;
}

export default function Sidebar({ tripData, currentCityId, setCurrentCityId, onAddDestination }: SidebarProps) {
  const cities = Object.values(tripData);
  const totalBudget = cities.reduce((acc, c) => acc + c.totalBudget, 0);
  const totalNights = cities.reduce((acc, c) => acc + c.nights, 0);

  return (
    <div className="w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative shrink-0">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-extrabold text-indigo-600 mb-1 flex items-center gap-2">
          <i className="fa-solid fa-map-location-dot"></i> Voyageur
        </h1>
        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trip</p>
            <p className="text-sm font-semibold">{totalNights} Nights</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Budget</p>
            <p className="text-sm font-bold text-emerald-600">€{totalBudget}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cities.map((c) => {
          const isActive = c.id === currentCityId;
          return (
            <button
              key={c.id}
              onClick={() => setCurrentCityId(c.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                isActive ? "border-2 border-indigo-600 bg-indigo-50 shadow-md transform scale-100" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <div>
                <h3 className={`text-lg mb-1 ${isActive ? "font-bold text-indigo-900" : "font-bold text-slate-800 group-hover:text-indigo-600"}`}>{c.name}</h3>
                <p className="text-xs font-medium text-slate-500"><i className="fa-regular fa-calendar mr-1 opacity-70"></i> {c.dates}</p>
              </div>
              <div className="text-right">
                <span className={`font-extrabold ${isActive ? "text-indigo-600" : "text-slate-600"}`}>€{c.totalBudget}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{c.nights} Nights</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button onClick={onAddDestination} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2">
          <i className="fa-solid fa-plus"></i> Add Destination
        </button>
      </div>
    </div>
  );
}
