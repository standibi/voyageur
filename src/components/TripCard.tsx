import { Trip } from "@/types";
import { formatDateRangeDisplay } from "@/utils/dateUtils";

interface TripCardProps {
  trip: Trip;
  idx: number;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TripCard({ trip, idx, onSelect, onEdit, onDelete }: TripCardProps) {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-rose-500",
    "from-purple-500 to-fuchsia-600",
    "from-cyan-400 to-blue-500"
  ];
  const gradient = gradients[idx % gradients.length];
  
  return (
    <div 
      onClick={onSelect} 
      className="bg-white rounded-3xl shadow-sm border border-slate-200/75 hover:shadow-2xl hover:shadow-indigo-100 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden relative transform hover:-translate-y-1"
    >
      <div className={`h-3 w-full bg-gradient-to-r ${gradient}`}></div>
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white bg-gradient-to-br ${gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
            <i className="fa-solid fa-plane"></i>
          </div>
          <div className="flex gap-1 bg-slate-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }} 
              className="text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-sm"
            >
              <i className="fa-solid fa-pen text-sm"></i>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }} 
              className="text-slate-400 hover:text-rose-500 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-sm"
            >
              <i className="fa-solid fa-trash text-sm"></i>
            </button>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors mb-3 line-clamp-2">{trip.name}</h3>
        
        {trip.dates ? (
          <div className="inline-flex items-center gap-2 bg-slate-100/80 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-semibold w-fit">
            <i className="fa-regular fa-calendar text-indigo-500"></i> {formatDateRangeDisplay(trip.dates)}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg text-sm font-medium w-fit border border-slate-100">
            <i className="fa-regular fa-calendar-xmark"></i> Dates à définir
          </div>
        )}
        
        <div className="mt-auto pt-8 flex justify-end">
          <span className="text-sm font-bold text-indigo-600 flex items-center gap-2 group-hover:gap-3 transition-all bg-indigo-50 px-4 py-2 rounded-xl group-hover:bg-indigo-100">
            Ouvrir le voyage <i className="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  );
}
