import { CityData } from "@/types";

interface CityHeroProps {
  city: CityData;
  onBack?: () => void;
  onEditCity: () => void;
}

export default function CityHero({ city, onBack, onEditCity }: CityHeroProps) {
  const actCount = city.rawActivities.length;

  return (
    <div className="h-64 md:h-72 relative shrink-0 group">
      <img src={city.img} className="w-full h-full object-cover" alt={city.name} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

      {onBack && (
        <button 
          onClick={onBack} 
          className="md:hidden absolute top-4 left-4 z-10 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      )}

      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEditCity} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
          <i className="fa-solid fa-pen"></i> <span className="hidden md:inline">Edit City</span>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-10 md:right-10 flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-1 md:mb-2 tracking-tight drop-shadow-md">{city.name}</h2>
          <p className="text-indigo-200 font-medium text-sm md:text-lg drop-shadow-md">
            <i className="fa-regular fa-calendar mr-2"></i> {`${city.dateRange.start} - ${city.dateRange.end}`} • {city.nights} Nights
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/20 text-white flex gap-4 md:gap-8 shadow-2xl self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mb-1">City Budget</p>
            <p className="font-extrabold text-2xl">€{city.totalBudget}</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div>
            <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mb-1">Activities</p>
            <p className="font-extrabold text-2xl">{actCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
