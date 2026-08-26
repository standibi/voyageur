import { CityData, Activity } from "@/types";

interface CityViewProps {
  city: CityData;
  onEditCity: () => void;
  onChangeStay: () => void;
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  onViewLedger: () => void;
}

export default function CityView({ city, onEditCity, onChangeStay, onAddActivity, onEditActivity, onViewLedger }: CityViewProps) {
  const actCount = city.rawActivities.length;

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50/50 overflow-hidden relative">
      <div className="h-72 relative shrink-0 group">
        <img src={city.img} className="w-full h-full object-cover" alt={city.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEditCity} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
            <i className="fa-solid fa-pen"></i> Edit City
          </button>
        </div>

        <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">{city.name}</h2>
            <p className="text-indigo-200 font-medium text-lg drop-shadow-md">
              <i className="fa-regular fa-calendar mr-2"></i> {city.dates} • {city.nights} Nights
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 text-white flex gap-8 shadow-2xl">
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

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-5xl mx-auto flex gap-10">
          
          <div className="flex-1">
            <div className="mb-12">
              <div className="flex justify-between items-end mb-5">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><i className="fa-solid fa-bed text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i> Accommodation</h3>
                <button onClick={onChangeStay} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm flex items-center gap-1">
                  <i className="fa-solid fa-arrows-rotate"></i> Change Stay
                </button>
              </div>
              {city.hotel.name !== 'No Hotel Selected' ? (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="relative w-32 h-32 shrink-0">
                    <img src={city.hotel.img_url} className="w-full h-full object-cover rounded-xl" alt={city.hotel.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="flex text-yellow-400 text-[10px] mb-1.5">{Array.from({ length: city.hotel.stars || 0 }).map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}</div>
                        <h4 className="font-bold text-xl text-slate-800">{city.hotel.name}</h4>
                      </div>
                      <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm border border-slate-200 shadow-sm">€{city.hotel.price_total} total</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-3"><i className="fa-solid fa-location-dot mr-1.5"></i> {city.hotel.address}</p>
                    <div className="flex gap-6 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><i className="fa-solid fa-right-to-bracket text-indigo-400"></i><div><span className="font-semibold text-slate-800">In:</span> <span>{city.hotel.check_in}</span></div></div>
                      <div className="w-px bg-slate-200"></div>
                      <div className="flex items-center gap-2"><i className="fa-solid fa-right-from-bracket text-rose-400"></i><div><span className="font-semibold text-slate-800">Out:</span> <span>{city.hotel.check_out}</span></div></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 border-dashed text-center">
                  <p className="text-slate-500 font-medium mb-3">No accommodation booked yet.</p>
                  <button onClick={onChangeStay} className="text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">Add Hotel</button>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><i className="fa-solid fa-list-check text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i> Itinerary</h3>
                <button onClick={onAddActivity} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm">
                  <i className="fa-solid fa-plus mr-1"></i> Add Activity
                </button>
              </div>
              <div className="relative timeline-line space-y-12 pb-12">
                {city.timeline.map((day, idx) => (
                  <div key={idx} className="relative pl-12 z-10">
                    <div className="absolute left-[14px] top-1.5 w-5 h-5 rounded-full bg-indigo-500 ring-4 ring-white shadow-sm z-20"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <h4 className="font-extrabold text-xl text-slate-800">{day.date}</h4>
                    </div>
                    <div className="space-y-4">
                      {day.activities.map((act) => (
                        <div
                          key={act.id}
                          className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex gap-5 hover:shadow-lg transition-all duration-300 group cursor-default relative overflow-hidden pl-8"
                        >
                          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={() => onEditActivity(act)} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors shadow-sm border border-slate-100">
                              <i className="fa-solid fa-pen text-xs"></i>
                            </button>
                          </div>
                          <div className={`w-14 h-14 rounded-xl ${act.bg} flex items-center justify-center shrink-0 ${act.color} text-xl transition-transform`}><i className={`fa-solid ${act.icon}`}></i></div>
                          <div className="flex-1 pt-1 pr-16">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-bold text-slate-800 text-lg transition-colors">{act.name}</h5>
                              <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm">€{act.price}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-2"><i className="fa-regular fa-clock mr-1 opacity-70"></i> {act.time}</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{act.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {city.timeline.length === 0 && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 border-dashed text-center ml-12">
                    <p className="text-slate-500 font-medium mb-3">No activities planned yet.</p>
                    <button onClick={onAddActivity} className="text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">Add First Activity</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-80 shrink-0 space-y-8">
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

            <div>
              <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Expense Breakdown</h4>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium flex items-center gap-2"><i className="fa-solid fa-bed text-indigo-400 w-4"></i> Stay</span><span className="font-bold text-slate-800">€{city.breakdown.stay}</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min((city.breakdown.stay / city.totalBudget) * 100, 100)}%` }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium flex items-center gap-2"><i className="fa-solid fa-ticket text-rose-400 w-4"></i> Activities</span><span className="font-bold text-slate-800">€{city.breakdown.act || city.breakdown.activity || 0}</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(((city.breakdown.act || city.breakdown.activity || 0) / city.totalBudget) * 100, 100)}%` }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-medium flex items-center gap-2"><i className="fa-solid fa-utensils text-emerald-400 w-4"></i> Food</span><span className="font-bold text-slate-800">€{city.breakdown.food}</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min((city.breakdown.food / city.totalBudget) * 100, 100)}%` }}></div></div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <button onClick={onViewLedger} className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2"><i className="fa-solid fa-file-invoice-dollar"></i> View Detailed Ledger</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
