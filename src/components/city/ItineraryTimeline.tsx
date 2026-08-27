import { CityData, Activity } from "@/types";
import ActivityCard from "./ActivityCard";

interface ItineraryTimelineProps {
  timeline: CityData["timeline"];
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
}

export default function ItineraryTimeline({ timeline, onAddActivity, onEditActivity }: ItineraryTimelineProps) {
  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><i className="fa-solid fa-list-check text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i> Itinerary</h3>
        <button onClick={onAddActivity} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm">
          <i className="fa-solid fa-plus mr-1"></i> Add Activity
        </button>
      </div>
      <div className="relative timeline-line space-y-12 pb-12">
        {timeline.map((day, idx) => (
          <div key={idx} className="relative pl-12 z-10">
            <div className="absolute left-[14px] top-1.5 w-5 h-5 rounded-full bg-indigo-500 ring-4 ring-white shadow-sm z-20"></div>
            <div className="flex items-center gap-4 mb-6">
              <h4 className="font-extrabold text-xl text-slate-800">{day.date}</h4>
            </div>
            <div className="space-y-4">
              {day.activities.map((act) => (
                <ActivityCard key={act.id} activity={act} onEditActivity={onEditActivity} />
              ))}
            </div>
          </div>
        ))}
        {timeline.length === 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 border-dashed text-center ml-12">
            <p className="text-slate-500 font-medium mb-3">No activities planned yet.</p>
            <button onClick={onAddActivity} className="text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">Add First Activity</button>
          </div>
        )}
      </div>
    </div>
  );
}
