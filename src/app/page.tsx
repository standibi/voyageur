"use client";
import { useState } from "react";

const INITIAL_DATA = {
  paris: {
    id: "paris",
    name: "Paris",
    dates: "May 18 - 20",
    nights: 2,
    totalBudget: 650,
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
    breakdown: { stay: 400, act: 100, food: 150 },
    hotel: {
      name: "Hotel Le Meurice",
      stars: 5,
      address: "228 Rue de Rivoli, 75001 Paris",
      price: "€400",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      checkIn: "May 18, 15:00",
      checkOut: "May 20, 11:00",
    },
    timeline: [
      {
        dayTitle: "Day 1: Arrival & Icons",
        date: "May 18",
        activities: [
          { time: "10:00 AM", name: "Eiffel Tower Summit", desc: "Skip-the-line guided tour to the top. Amazing views.", price: "€28", icon: "fa-monument", color: "text-indigo-500", bg: "bg-indigo-50" },
          { time: "1:00 PM", name: "Lunch at Le Jules Verne", desc: "Fine dining experience inside the Eiffel Tower.", price: "€135", icon: "fa-utensils", color: "text-rose-500", bg: "bg-rose-50" },
          { time: "4:00 PM", name: "Seine River Cruise", desc: "Relaxing boat tour as the sun begins to set.", price: "€15", icon: "fa-ship", color: "text-cyan-500", bg: "bg-cyan-50" },
        ],
      },
      {
        dayTitle: "Day 2: Art & Culture",
        date: "May 19",
        activities: [
          { time: "09:00 AM", name: "Louvre Museum", desc: "Mona Lisa and classical art. Pre-booked tickets.", price: "€17", icon: "fa-palette", color: "text-purple-500", bg: "bg-purple-50" },
          { time: "3:00 PM", name: "Explore Montmartre", desc: "Walk around the artist district and Sacré-Cœur.", price: "Free", icon: "fa-church", color: "text-amber-500", bg: "bg-amber-50" },
        ],
      },
    ],
  },
  lyon: {
    id: "lyon",
    name: "Lyon",
    dates: "May 20 - 22",
    nights: 2,
    totalBudget: 420,
    img: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=2000&q=80",
    breakdown: { stay: 250, act: 20, food: 150 },
    hotel: {
      name: "Villa Florentine",
      stars: 4,
      address: "25 Montée Saint-Barthélémy, 69005 Lyon",
      price: "€250",
      img: "https://images.unsplash.com/photo-1551882547-ff40c0d1398c?auto=format&fit=crop&w=800&q=80",
      checkIn: "May 20, 14:00",
      checkOut: "May 22, 12:00",
    },
    timeline: [
      {
        dayTitle: "Day 3: Gastronomy",
        date: "May 20",
        activities: [
          { time: "2:00 PM", name: "Vieux Lyon Walk", desc: "Explore the hidden traboules (passageways).", price: "Free", icon: "fa-city", color: "text-indigo-500", bg: "bg-indigo-50" },
          { time: "8:00 PM", name: "Dinner at a Bouchon", desc: "Traditional Lyonnaise heavy dinner.", price: "€60", icon: "fa-utensils", color: "text-rose-500", bg: "bg-rose-50" },
        ],
      },
      {
        dayTitle: "Day 4: Views & Parks",
        date: "May 21",
        activities: [
          { time: "10:00 AM", name: "Basilica of Notre-Dame", desc: "Take the funicular up for panoramic city views.", price: "Free", icon: "fa-church", color: "text-amber-500", bg: "bg-amber-50" },
          { time: "2:00 PM", name: "Parc de la Tête d'Or", desc: "Relax in the largest urban park in France.", price: "Free", icon: "fa-tree", color: "text-emerald-500", bg: "bg-emerald-50" },
        ],
      },
    ],
  },
  nice: {
    id: "nice",
    name: "Nice",
    dates: "May 22 - 25",
    nights: 3,
    totalBudget: 710,
    img: "https://images.unsplash.com/photo-1533604100652-32a26563a628?auto=format&fit=crop&w=2000&q=80",
    breakdown: { stay: 450, act: 60, food: 200 },
    hotel: {
      name: "Le Negresco",
      stars: 5,
      address: "37 Promenade des Anglais, 06000 Nice",
      price: "€450",
      img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80",
      checkIn: "May 22, 15:00",
      checkOut: "May 25, 11:00",
    },
    timeline: [
      {
        dayTitle: "Day 5: The Riviera",
        date: "May 22",
        activities: [
          { time: "3:00 PM", name: "Promenade des Anglais", desc: "Walk along the famous pebble beaches.", price: "Free", icon: "fa-person-walking", color: "text-indigo-500", bg: "bg-indigo-50" },
          { time: "7:00 PM", name: "Old Town Dinner", desc: "Seafood dinner in the vibrant old town.", price: "€80", icon: "fa-utensils", color: "text-rose-500", bg: "bg-rose-50" },
        ],
      },
      {
        dayTitle: "Day 6: Beach & Views",
        date: "May 23",
        activities: [
          { time: "10:00 AM", name: "Colline du Château", desc: "Climb the hill for the best view of the Bay of Angels.", price: "Free", icon: "fa-mountain", color: "text-emerald-500", bg: "bg-emerald-50" },
          { time: "1:00 PM", name: "Beach Club", desc: "Rent a lounger and relax by the Mediterranean.", price: "€40", icon: "fa-umbrella-beach", color: "text-cyan-500", bg: "bg-cyan-50" },
        ],
      },
    ],
  },
};

type ModalType = "none" | "editCity" | "changeStay" | "addActivity" | "editActivity" | "addDestination" | "ledger";

export default function Home() {
  const [tripData, setTripData] = useState(INITIAL_DATA);
  const [currentCityId, setCurrentCityId] = useState<keyof typeof INITIAL_DATA>("paris");
  const [activeModal, setActiveModal] = useState<ModalType>("none");

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<{ dayIdx: number; actIdx: number } | null>(null);

  const city = tripData[currentCityId];
  if (!city) return null; // safety check if city is deleted (though we don't handle full deletion state yet)

  const actCount = city.timeline.reduce((acc, day) => acc + day.activities.length, 0);

  const closeModal = () => setActiveModal("none");

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, dayIdx: number, actIdx: number) => {
    setDraggedItem({ dayIdx, actIdx });
    e.dataTransfer.effectAllowed = "move";
    // Wait a tick to set visual opacity so the drag ghost looks normal
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = "0.4";
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "1";
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDayIdx: number, targetActIdx: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // Prevent dropping on itself
    if (draggedItem.dayIdx === targetDayIdx && draggedItem.actIdx === targetActIdx) {
      return;
    }

    setTripData((prev) => {
      const newData = { ...prev };
      const currentCity = { ...newData[currentCityId] };
      const newTimeline = JSON.parse(JSON.stringify(currentCity.timeline)); // Deep copy to avoid mutation issues

      // Remove activity from source
      const [movedActivity] = newTimeline[draggedItem.dayIdx].activities.splice(draggedItem.actIdx, 1);
      
      // Insert activity at destination
      newTimeline[targetDayIdx].activities.splice(targetActIdx, 0, movedActivity);

      currentCity.timeline = newTimeline;
      newData[currentCityId] = currentCity;
      return newData;
    });
    
    setDraggedItem(null);
  };

  const Modal = ({ title, children, isOpen, showDelete }: { title: string, children: React.ReactNode, isOpen: boolean, showDelete?: string }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-xl text-slate-800">{title}</h3>
            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {children}
          </div>
          <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              {showDelete && (
                <button className="px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-trash"></i> {showDelete}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">Save Details</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Add Destination Modal */}
      <Modal title="Add New Destination" isOpen={activeModal === "addDestination"}>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">City Name</label>
            <input type="text" placeholder="e.g. Bordeaux" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Dates</label>
              <input type="text" placeholder="May 25 - 27" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nights</label>
              <input type="number" placeholder="2" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label>
            <input type="url" placeholder="https://..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Budget (€)</label>
            <input type="number" placeholder="500" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </form>
      </Modal>

      {/* Edit City Modal */}
      <Modal title={`Edit ${city.name}`} isOpen={activeModal === "editCity"} showDelete="Delete City">
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">City Name</label>
            <input type="text" defaultValue={city.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Dates</label>
              <input type="text" defaultValue={city.dates} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nights</label>
              <input type="number" defaultValue={city.nights} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label>
            <input type="url" defaultValue={city.img} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </form>
      </Modal>

      {/* Change Stay Modal */}
      <Modal title={`Update Stay in ${city.name}`} isOpen={activeModal === "changeStay"} showDelete="Remove Stay">
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Hotel Name</label>
            <input type="text" defaultValue={city.hotel.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Star Rating (1-5)</label>
              <input type="number" min="1" max="5" defaultValue={city.hotel.stars} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Total Price</label>
              <input type="text" defaultValue={city.hotel.price} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
            <input type="text" defaultValue={city.hotel.address} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Check-in</label>
              <input type="text" defaultValue={city.hotel.checkIn} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Check-out</label>
              <input type="text" defaultValue={city.hotel.checkOut} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Hotel Image URL</label>
            <input type="url" defaultValue={city.hotel.img} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </form>
      </Modal>

      {/* Add / Edit Activity Modal */}
      <Modal title={activeModal === "editActivity" ? "Edit Activity" : "Add New Activity"} isOpen={activeModal === "addActivity" || activeModal === "editActivity"} showDelete={activeModal === "editActivity" ? "Delete Activity" : undefined}>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Activity Name</label>
            <input type="text" placeholder="e.g. Wine Tasting" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Day</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                {city.timeline.map((day, idx) => (
                  <option key={idx} value={day.date}>{day.dayTitle}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Time</label>
              <input type="text" placeholder="2:00 PM" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
            <input type="text" placeholder="€45" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea rows={3} placeholder="Tasting at a local vineyard..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Icon (FontAwesome Class)</label>
              <input type="text" placeholder="fa-wine-glass" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Color Theme</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="indigo">Indigo</option>
                <option value="rose">Rose</option>
                <option value="emerald">Emerald</option>
                <option value="cyan">Cyan</option>
                <option value="amber">Amber</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Ledger Modal */}
      <Modal title={`${city.name} - Detailed Ledger`} isOpen={activeModal === "ledger"}>
        <div className="space-y-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 font-medium">Category</th>
                <th className="py-2 font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                <td className="py-3 font-semibold text-slate-800">{city.hotel.name}</td>
                <td className="py-3 text-slate-500"><span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">Stay</span></td>
                <td className="py-3 text-right font-bold">€{city.breakdown.stay}</td>
              </tr>
              {city.timeline.map((day) =>
                day.activities.map((act, i) => {
                  const isFood = act.icon === "fa-utensils";
                  const catClass = isFood ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600";
                  const catName = isFood ? "Food" : "Activity";
                  return (
                    <tr key={`${day.date}-${i}`} className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">{act.name}</td>
                      <td className="py-3 text-slate-500">
                        <span className={`${catClass} px-2 py-1 rounded text-xs font-bold`}>{catName}</span>
                      </td>
                      <td className="py-3 text-right font-bold">{act.price}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
            <tfoot>
              <tr className="text-lg">
                <td colSpan={2} className="py-4 font-bold text-slate-800">Total City Budget</td>
                <td className="py-4 text-right font-extrabold text-indigo-600">€{city.totalBudget}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal>

      {/* Sidebar: Itinerary / Cities List */}
      <div className="w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-extrabold text-indigo-600 mb-1 flex items-center gap-2">
            <i className="fa-solid fa-map-location-dot"></i> Voyageur
          </h1>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Trip
              </p>
              <p className="text-sm font-semibold">10 Days</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Est. Budget
              </p>
              <p className="text-sm font-bold text-emerald-600">€2,250</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Object.values(tripData).map((c) => {
            const isActive = c.id === currentCityId;
            return (
              <button
                key={c.id}
                onClick={() => setCurrentCityId(c.id as keyof typeof INITIAL_DATA)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                  isActive
                    ? "border-2 border-indigo-600 bg-indigo-50 shadow-md transform scale-100"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <h3
                    className={`text-lg mb-1 ${
                      isActive
                        ? "font-bold text-indigo-900"
                        : "font-bold text-slate-800 group-hover:text-indigo-600"
                    }`}
                  >
                    {c.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    <i className="fa-regular fa-calendar mr-1 opacity-70"></i>{" "}
                    {c.dates}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-extrabold ${
                      isActive ? "text-indigo-600" : "text-slate-600"
                    }`}
                  >
                    €{c.totalBudget}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    {c.nights} Nights
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button onClick={() => setActiveModal("addDestination")} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2">
            <i className="fa-solid fa-plus"></i> Add Destination
          </button>
        </div>
      </div>

      {/* Main Content: City Details & Activity Timeline */}
      <div className="flex-1 h-full flex flex-col bg-slate-50/50 overflow-hidden relative">
        {/* City Header */}
        <div className="h-72 relative shrink-0 group">
          <img
            src={city.img}
            className="w-full h-full object-cover"
            alt={city.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setActiveModal("editCity")} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
              <i className="fa-solid fa-pen"></i> Edit City
            </button>
          </div>

          <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end">
            <div>
              <h2 className="text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                {city.name}
              </h2>
              <p className="text-indigo-200 font-medium text-lg drop-shadow-md">
                <i className="fa-regular fa-calendar mr-2"></i>
                {city.dates} • {city.nights} Nights
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 text-white flex gap-8 shadow-2xl">
              <div>
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mb-1">
                  City Budget
                </p>
                <p className="font-extrabold text-2xl">€{city.totalBudget}</p>
              </div>
              <div className="w-px bg-white/20"></div>
              <div>
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mb-1">
                  Activities
                </p>
                <p className="font-extrabold text-2xl">{actCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline & Details */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto flex gap-10">
            {/* Main Column */}
            <div className="flex-1">
              {/* Accommodation Section */}
              <div className="mb-12">
                <div className="flex justify-between items-end mb-5">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <i className="fa-solid fa-bed text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i>{" "}
                    Accommodation
                  </h3>
                  <button onClick={() => setActiveModal("changeStay")} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm flex items-center gap-1">
                    <i className="fa-solid fa-arrows-rotate"></i> Change Stay
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="relative w-32 h-32 shrink-0">
                    <img
                      src={city.hotel.img}
                      className="w-full h-full object-cover rounded-xl"
                      alt={city.hotel.name}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="flex text-yellow-400 text-[10px] mb-1.5">
                          {Array.from({ length: city.hotel.stars }).map(
                            (_, i) => (
                              <i key={i} className="fa-solid fa-star"></i>
                            )
                          )}
                        </div>
                        <h4 className="font-bold text-xl text-slate-800">
                          {city.hotel.name}
                        </h4>
                      </div>
                      <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm border border-slate-200 shadow-sm">
                        {city.hotel.price} total
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-3">
                      <i className="fa-solid fa-location-dot mr-1.5"></i>{" "}
                      {city.hotel.address}
                    </p>

                    <div className="flex gap-6 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-right-to-bracket text-indigo-400"></i>
                        <div>
                          <span className="font-semibold text-slate-800">
                            In:
                          </span>{" "}
                          <span>{city.hotel.checkIn}</span>
                        </div>
                      </div>
                      <div className="w-px bg-slate-200"></div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-right-from-bracket text-rose-400"></i>
                        <div>
                          <span className="font-semibold text-slate-800">
                            Out:
                          </span>{" "}
                          <span>{city.hotel.checkOut}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary Section */}
              <div>
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <i className="fa-solid fa-list-check text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i>{" "}
                    Itinerary
                  </h3>
                  <button onClick={() => setActiveModal("addActivity")} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm">
                    <i className="fa-solid fa-plus mr-1"></i> Add Activity
                  </button>
                </div>

                <div className="relative timeline-line space-y-12 pb-12">
                  {city.timeline.map((day, idx) => (
                    <div key={idx} className="relative pl-12 z-10">
                      <div className="absolute left-[14px] top-1.5 w-5 h-5 rounded-full bg-indigo-500 ring-4 ring-white shadow-sm z-20"></div>
                      <div className="flex items-center gap-4 mb-6">
                        <h4 className="font-extrabold text-xl text-slate-800">
                          {day.dayTitle}
                        </h4>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                          {day.date}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {day.activities.map((act, i) => (
                          <div
                            key={i}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx, i)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, idx, i)}
                            className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex gap-5 hover:shadow-lg transition-all duration-300 group cursor-default relative overflow-hidden pl-8"
                          >
                            {/* Drag handle */}
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 cursor-grab transition-opacity px-1 py-4">
                              <i className="fa-solid fa-grip-vertical"></i>
                            </div>

                            {/* Actions on hover */}
                            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <button onClick={() => setActiveModal("editActivity")} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors shadow-sm border border-slate-100">
                                <i className="fa-solid fa-pen text-xs"></i>
                              </button>
                              <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm border border-slate-100">
                                <i className="fa-solid fa-trash text-xs"></i>
                              </button>
                            </div>

                            <div
                              className={`w-14 h-14 rounded-xl ${act.bg} flex items-center justify-center shrink-0 ${act.color} text-xl transition-transform`}
                            >
                              <i className={`fa-solid ${act.icon}`}></i>
                            </div>
                            <div className="flex-1 pt-1 pr-16">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-bold text-slate-800 text-lg transition-colors">
                                  {act.name}
                                </h5>
                                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                                  {act.price}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-slate-500 mb-2">
                                <i className="fa-regular fa-clock mr-1 opacity-70"></i>{" "}
                                {act.time}
                              </p>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {act.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar (Budget Breakdown & Map widget) */}
            <div className="w-80 shrink-0 space-y-8">
              {/* Map Widget (Mini) */}
              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
                  Location
                </h4>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-40 relative group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Map"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                    <div className="bg-white text-slate-800 px-4 py-2 rounded-lg font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
                      <i className="fa-solid fa-expand"></i> Open Full Map
                    </div>
                  </div>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
                  Expense Breakdown
                </h4>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium flex items-center gap-2">
                          <i className="fa-solid fa-bed text-indigo-400 w-4"></i>{" "}
                          Stay
                        </span>
                        <span className="font-bold text-slate-800">
                          €{city.breakdown.stay}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{
                            width: `${
                              (city.breakdown.stay / city.totalBudget) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium flex items-center gap-2">
                          <i className="fa-solid fa-ticket text-rose-400 w-4"></i>{" "}
                          Activities
                        </span>
                        <span className="font-bold text-slate-800">
                          €{city.breakdown.act}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{
                            width: `${
                              (city.breakdown.act / city.totalBudget) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium flex items-center gap-2">
                          <i className="fa-solid fa-utensils text-emerald-400 w-4"></i>{" "}
                          Food
                        </span>
                        <span className="font-bold text-slate-800">
                          €{city.breakdown.food}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{
                            width: `${
                              (city.breakdown.food / city.totalBudget) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <button onClick={() => setActiveModal("ledger")} className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2">
                      <i className="fa-solid fa-file-invoice-dollar"></i> View Detailed Ledger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
