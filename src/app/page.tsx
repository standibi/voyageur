"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type ModalType = "none" | "editCity" | "changeStay" | "addActivity" | "editActivity" | "addDestination" | "ledger";

export default function Home() {
  const supabase = createClient();
  const [tripData, setTripData] = useState<any>({});
  const [currentCityId, setCurrentCityId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<any>(null);

  const [draggedItem, setDraggedItem] = useState<{ dayIdx: number; actIdx: number } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (preserveCityId = false) => {
    setIsLoading(true);
    const { data: cities } = await supabase.from('cities').select('*').order('created_at', { ascending: true });
    
    if (!cities || cities.length === 0) {
      setTripData({});
      setCurrentCityId(null);
      setIsLoading(false);
      return;
    }

    const cityIds = cities.map(c => c.id);
    const { data: hotels } = await supabase.from('hotels').select('*').in('city_id', cityIds);
    const { data: activities } = await supabase.from('activities').select('*').in('city_id', cityIds).order('sort_order', { ascending: true });
    const { data: expenses } = await supabase.from('expenses').select('*').in('city_id', cityIds);

    const formattedData: any = {};

    cities.forEach(city => {
      const cityHotels = hotels?.filter(h => h.city_id === city.id) || [];
      const hotel = cityHotels.length > 0 ? cityHotels[0] : { name: 'No Hotel Selected', price_total: 0, stars: 0, address: '', check_in: '', check_out: '', img_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' };
      
      const cityActivities = activities?.filter(a => a.city_id === city.id) || [];
      const cityExpenses = expenses?.filter(e => e.city_id === city.id) || [];

      const timelineMap = new Map();
      cityActivities.forEach(act => {
        const key = `${act.date}|${act.day_title}`;
        if (!timelineMap.has(key)) timelineMap.set(key, { dayTitle: act.day_title, date: act.date, activities: [] });
        timelineMap.get(key).activities.push({ ...act, icon: act.icon_name, color: act.color_class, bg: act.bg_class, desc: act.description });
      });

      const timeline = Array.from(timelineMap.values());
      const breakdown = { stay: 0, act: 0, food: 0, transport: 0, misc: 0 };
      
      cityExpenses.forEach(exp => {
        if (breakdown[exp.category as keyof typeof breakdown] !== undefined) {
          breakdown[exp.category as keyof typeof breakdown] += Number(exp.amount);
        }
      });

      formattedData[city.id] = {
        id: city.id,
        trip_id: city.trip_id,
        name: city.name,
        dates: city.dates,
        nights: city.nights,
        totalBudget: Number(city.allocated_budget),
        img: city.img_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80',
        breakdown,
        hotel,
        timeline,
        rawActivities: cityActivities,
        rawExpenses: cityExpenses
      };
    });

    setTripData(formattedData);
    if (!preserveCityId || !currentCityId || !formattedData[currentCityId]) {
      setCurrentCityId(cities[0].id);
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setActiveModal("none");
    setEditingActivity(null);
  }

  // === MUTATION HANDLERS ===
  
  const handleAddDestination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    // Fallback to first trip if no trip_id context (assuming single trip app for now)
    const { data: trip } = await supabase.from('trips').select('id').limit(1).single();
    
    await supabase.from('cities').insert({
      trip_id: trip?.id,
      name: fd.get('name'),
      dates: fd.get('dates'),
      nights: Number(fd.get('nights')),
      allocated_budget: Number(fd.get('allocated_budget')),
      img_url: fd.get('img_url') || null
    });
    closeModal();
    fetchData(true);
  };

  const handleEditCity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentCityId) return;
    const fd = new FormData(e.currentTarget);
    
    await supabase.from('cities').update({
      name: fd.get('name'),
      dates: fd.get('dates'),
      nights: Number(fd.get('nights')),
      img_url: fd.get('img_url') || null
    }).eq('id', currentCityId);
    
    closeModal();
    fetchData(true);
  };

  const handleDeleteCity = async () => {
    if(!currentCityId) return;
    await supabase.from('cities').delete().eq('id', currentCityId);
    closeModal();
    fetchData(false); // don't preserve city id since we deleted it
  };

  const handleChangeStay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentCityId) return;
    const fd = new FormData(e.currentTarget);
    const city = tripData[currentCityId];
    
    let hotelId = city.hotel.id;
    const price = Number(fd.get('price_total') || 0);

    if (hotelId) {
      await supabase.from('hotels').update({
        name: fd.get('name'), stars: Number(fd.get('stars')), address: fd.get('address'),
        price_total: price, img_url: fd.get('img_url'), check_in: fd.get('check_in'), check_out: fd.get('check_out')
      }).eq('id', hotelId);
      await supabase.from('expenses').update({ amount: price }).eq('related_hotel_id', hotelId);
    } else {
      const { data: newHotel } = await supabase.from('hotels').insert({
        city_id: currentCityId, name: fd.get('name'), stars: Number(fd.get('stars')), address: fd.get('address'),
        price_total: price, img_url: fd.get('img_url'), check_in: fd.get('check_in'), check_out: fd.get('check_out')
      }).select().single();
      
      if(newHotel) {
        await supabase.from('expenses').insert({ city_id: currentCityId, amount: price, category: 'stay', related_hotel_id: newHotel.id });
      }
    }
    closeModal();
    fetchData(true);
  };

  const handleSaveActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentCityId) return;
    const fd = new FormData(e.currentTarget);
    const price = Number(fd.get('price') || 0);
    const isFood = fd.get('icon_name') === 'fa-utensils';
    
    const activityData = {
      city_id: currentCityId,
      name: fd.get('name'),
      day_title: fd.get('day_title'), // Using date as day title for simplicity here
      date: fd.get('day_title'),
      time: fd.get('time'),
      price: price,
      description: fd.get('description'),
      icon_name: fd.get('icon_name'),
      color_class: `text-${fd.get('color')}-500`,
      bg_class: `bg-${fd.get('color')}-50`,
    };

    if (editingActivity?.id) {
      await supabase.from('activities').update(activityData).eq('id', editingActivity.id);
      await supabase.from('expenses').update({ amount: price, category: isFood ? 'food' : 'activity' }).eq('related_activity_id', editingActivity.id);
    } else {
      const { data: newAct } = await supabase.from('activities').insert(activityData).select().single();
      if (newAct) {
        await supabase.from('expenses').insert({ city_id: currentCityId, amount: price, category: isFood ? 'food' : 'activity', related_activity_id: newAct.id });
      }
    }
    
    closeModal();
    fetchData(true);
  };

  const handleDeleteActivity = async () => {
    if(!editingActivity?.id) return;
    await supabase.from('activities').delete().eq('id', editingActivity.id);
    closeModal();
    fetchData(true);
  };


  if (isLoading && Object.keys(tripData).length === 0) return <div className="flex h-screen items-center justify-center font-bold text-slate-500">Loading Trip Data...</div>;
  if (!currentCityId || !tripData[currentCityId]) return (
    <div className="flex h-screen flex-col items-center justify-center font-bold text-slate-500 gap-4">
      <p>No cities found.</p>
      <button onClick={() => setActiveModal("addDestination")} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Add Destination</button>
      {activeModal === "addDestination" && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center">
           <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">Add First Destination</h3>
              <form onSubmit={handleAddDestination} className="space-y-4 text-left">
                <input name="name" type="text" placeholder="City Name" required className="w-full px-4 py-2 border rounded-lg" />
                <input name="dates" type="text" placeholder="Dates" required className="w-full px-4 py-2 border rounded-lg" />
                <input name="nights" type="number" placeholder="Nights" required className="w-full px-4 py-2 border rounded-lg" />
                <input name="allocated_budget" type="number" placeholder="Budget" required className="w-full px-4 py-2 border rounded-lg" />
                <div className="flex justify-end gap-2"><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Save</button></div>
              </form>
           </div>
        </div>
      )}
    </div>
  );

  const city = tripData[currentCityId];
  const actCount = city.rawActivities.length;

  const Modal = ({ title, children, isOpen, showDelete, onDelete }: { title: string, children: React.ReactNode, isOpen: boolean, showDelete?: string, onDelete?: () => void }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-xl text-slate-800">{title}</h3>
            <button type="button" onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal title="Add New Destination" isOpen={activeModal === "addDestination"}>
        <form onSubmit={handleAddDestination} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">City Name</label><input name="name" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Dates</label><input name="dates" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nights</label><input name="nights" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label><input name="img_url" type="url" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Budget (€)</label><input name="allocated_budget" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Cancel</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Save Destination</button></div>
        </form>
      </Modal>

      <Modal title={`Edit ${city.name}`} isOpen={activeModal === "editCity"}>
        <form onSubmit={handleEditCity} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">City Name</label><input name="name" required type="text" defaultValue={city.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Dates</label><input name="dates" required type="text" defaultValue={city.dates} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nights</label><input name="nights" required type="number" defaultValue={city.nights} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label><input name="img_url" type="url" defaultValue={city.img} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <button type="button" onClick={handleDeleteCity} className="px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"><i className="fa-solid fa-trash"></i> Delete City</button>
            <div className="flex gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Cancel</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Save Changes</button></div>
          </div>
        </form>
      </Modal>

      <Modal title={`Update Stay in ${city.name}`} isOpen={activeModal === "changeStay"}>
        <form onSubmit={handleChangeStay} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Hotel Name</label><input name="name" required type="text" defaultValue={city.hotel.name !== 'No Hotel Selected' ? city.hotel.name : ''} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Star Rating (1-5)</label><input name="stars" required type="number" min="1" max="5" defaultValue={city.hotel.stars || 4} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Total Price</label><input name="price_total" required type="number" defaultValue={city.hotel.price_total || 0} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Address</label><input name="address" required type="text" defaultValue={city.hotel.address} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Check-in</label><input name="check_in" required type="text" defaultValue={city.hotel.check_in} placeholder="e.g. May 18, 15:00" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Check-out</label><input name="check_out" required type="text" defaultValue={city.hotel.check_out} placeholder="e.g. May 20, 11:00" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Hotel Image URL</label><input name="img_url" required type="url" defaultValue={city.hotel.img_url} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Cancel</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Save Stay</button></div>
        </form>
      </Modal>

      <Modal title={editingActivity ? "Edit Activity" : "Add New Activity"} isOpen={activeModal === "addActivity" || activeModal === "editActivity"}>
        <form onSubmit={handleSaveActivity} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Activity Name</label><input name="name" required type="text" defaultValue={editingActivity?.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date</label><input name="day_title" required type="text" defaultValue={editingActivity?.date || city.dates.split(' - ')[0]} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Time</label><input name="time" required type="text" defaultValue={editingActivity?.time} placeholder="e.g. 2:00 PM" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Price (€)</label><input name="price" required type="number" defaultValue={editingActivity?.price} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Description</label><textarea name="description" required rows={3} defaultValue={editingActivity?.description} className="w-full px-4 py-2 border border-slate-300 rounded-lg"></textarea></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Icon (FontAwesome)</label><input name="icon_name" required type="text" defaultValue={editingActivity?.icon_name || 'fa-star'} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Color Theme</label>
              <select name="color" defaultValue={editingActivity ? editingActivity.color_class.split('-')[1] : "indigo"} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="indigo">Indigo</option><option value="rose">Rose</option><option value="emerald">Emerald</option><option value="cyan">Cyan</option><option value="amber">Amber</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div>{editingActivity && <button type="button" onClick={handleDeleteActivity} className="px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"><i className="fa-solid fa-trash"></i> Delete Activity</button>}</div>
            <div className="flex gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Cancel</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Save Activity</button></div>
          </div>
        </form>
      </Modal>

      <Modal title={`${city.name} - Detailed Ledger`} isOpen={activeModal === "ledger"}>
        <div className="space-y-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="py-2 font-medium">Item</th><th className="py-2 font-medium">Category</th><th className="py-2 font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                <td className="py-3 font-semibold text-slate-800">{city.hotel.name}</td>
                <td className="py-3 text-slate-500"><span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">Stay</span></td>
                <td className="py-3 text-right font-bold">€{city.breakdown.stay}</td>
              </tr>
              {city.rawActivities.map((act: any) => {
                  const isFood = act.icon_name === "fa-utensils";
                  const catClass = isFood ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600";
                  const catName = isFood ? "Food" : "Activity";
                  return (
                    <tr key={act.id} className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">{act.name}</td>
                      <td className="py-3 text-slate-500"><span className={`${catClass} px-2 py-1 rounded text-xs font-bold`}>{catName}</span></td>
                      <td className="py-3 text-right font-bold">€{act.price}</td>
                    </tr>
                  )
              })}
            </tbody>
            <tfoot>
              <tr className="text-lg">
                <td colSpan={2} className="py-4 font-bold text-slate-800">Total City Budget</td>
                <td className="py-4 text-right font-extrabold text-indigo-600">€{city.totalBudget}</td>
              </tr>
            </tfoot>
          </table>
          <div className="pt-4 border-t border-slate-100 flex justify-end"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Close</button></div>
        </div>
      </Modal>

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-extrabold text-indigo-600 mb-1 flex items-center gap-2">
            <i className="fa-solid fa-map-location-dot"></i> Voyageur
          </h1>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trip</p>
              <p className="text-sm font-semibold">10 Days</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Budget</p>
              <p className="text-sm font-bold text-emerald-600">€2,250</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Object.values(tripData).map((c: any) => {
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
          <button onClick={() => setActiveModal("addDestination")} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2">
            <i className="fa-solid fa-plus"></i> Add Destination
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col bg-slate-50/50 overflow-hidden relative">
        <div className="h-72 relative shrink-0 group">
          <img src={city.img} className="w-full h-full object-cover" alt={city.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setActiveModal("editCity")} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
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
            {/* Main Column */}
            <div className="flex-1">
              <div className="mb-12">
                <div className="flex justify-between items-end mb-5">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><i className="fa-solid fa-bed text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i> Accommodation</h3>
                  <button onClick={() => setActiveModal("changeStay")} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm flex items-center gap-1">
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
                    <button onClick={() => setActiveModal("changeStay")} className="text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">Add Hotel</button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><i className="fa-solid fa-list-check text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i> Itinerary</h3>
                  <button onClick={() => { setEditingActivity(null); setActiveModal("addActivity"); }} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm">
                    <i className="fa-solid fa-plus mr-1"></i> Add Activity
                  </button>
                </div>
                <div className="relative timeline-line space-y-12 pb-12">
                  {city.timeline.map((day: any, idx: number) => (
                    <div key={idx} className="relative pl-12 z-10">
                      <div className="absolute left-[14px] top-1.5 w-5 h-5 rounded-full bg-indigo-500 ring-4 ring-white shadow-sm z-20"></div>
                      <div className="flex items-center gap-4 mb-6">
                        <h4 className="font-extrabold text-xl text-slate-800">{day.date}</h4>
                      </div>
                      <div className="space-y-4">
                        {day.activities.map((act: any, i: number) => (
                          <div
                            key={act.id}
                            className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex gap-5 hover:shadow-lg transition-all duration-300 group cursor-default relative overflow-hidden pl-8"
                          >
                            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <button onClick={() => { setEditingActivity(act); setActiveModal("editActivity"); }} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors shadow-sm border border-slate-100">
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
                      <button onClick={() => { setEditingActivity(null); setActiveModal("addActivity"); }} className="text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">Add First Activity</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
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
                    <button onClick={() => setActiveModal("ledger")} className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2"><i className="fa-solid fa-file-invoice-dollar"></i> View Detailed Ledger</button>
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
