import { Activity } from "@/types";

interface ActivityCardProps {
  activity: Activity;
  onEditActivity: (activity: Activity) => void;
}

export default function ActivityCard({ activity, onEditActivity }: ActivityCardProps) {
  return (
    <div
      className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex gap-5 hover:shadow-lg transition-all duration-300 group cursor-default relative overflow-hidden pl-8"
    >
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button onClick={() => onEditActivity(activity)} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors shadow-sm border border-slate-100">
          <i className="fa-solid fa-pen text-xs"></i>
        </button>
      </div>
      <div className={`w-14 h-14 rounded-xl ${activity.bg} flex items-center justify-center shrink-0 ${activity.color} text-xl transition-transform`}><i className={`fa-solid ${activity.icon}`}></i></div>
      <div className="flex-1 pt-1 pr-16">
        <div className="flex justify-between items-start mb-1">
          <h5 className="font-bold text-slate-800 text-lg transition-colors">{activity.name}</h5>
          <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm">€{activity.price}</span>
        </div>
        <p className="text-sm font-medium text-slate-500 mb-2"><i className="fa-regular fa-clock mr-1 opacity-70"></i> {activity.time}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{activity.desc}</p>
      </div>
    </div>
  );
}
