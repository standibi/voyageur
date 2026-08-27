import PullToRefresh from "react-simple-pull-to-refresh";
import { CityData, Activity } from "@/types";
import CityHero from "./CityHero";
import AccommodationCard from "./AccommodationCard";
import ItineraryTimeline from "./ItineraryTimeline";
import ExpenseBreakdown from "./ExpenseBreakdown";

interface CityViewProps {
  city: CityData;
  onBack?: () => void;
  onEditCity: () => void;
  onChangeStay: () => void;
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  onViewLedger: () => void;
  onRefresh: () => Promise<void>;
}

export default function CityView({ city, onBack, onEditCity, onChangeStay, onAddActivity, onEditActivity, onViewLedger, onRefresh }: CityViewProps) {
  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50/50 overflow-hidden relative">
      <CityHero city={city} onBack={onBack} onEditCity={onEditCity} />

      <div className="flex-1 overflow-y-auto" id="city-scroll">
        <PullToRefresh onRefresh={onRefresh} pullDownThreshold={60} maxPullDownDistance={100}>
          <div className="p-4 md:p-10 min-h-[50vh]">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-10">
              
              <div className="flex-1 min-w-0">
                <AccommodationCard hotel={city.hotel} onChangeStay={onChangeStay} />
                <ItineraryTimeline timeline={city.timeline} onAddActivity={onAddActivity} onEditActivity={onEditActivity} />
              </div>

              <div className="w-full lg:w-80 shrink-0 space-y-6 md:space-y-8">
                <div>
                  <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Location</h4>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-40 relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Map" />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                      <div className="bg-white text-slate-800 px-4 py-2 rounded-lg font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
                        <i className="fa-solid fa-expand"></i> Open Full Map
                      </div>
                    </div>
                  </div>
                </div>

                <ExpenseBreakdown breakdown={city.breakdown} totalBudget={city.totalBudget} onViewLedger={onViewLedger} />
              </div>
            </div>
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
}
