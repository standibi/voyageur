"use client";
import { useState } from "react";
import { useTripData } from "@/hooks/useTripData";
import { ModalType, Activity } from "@/types";
import Sidebar from "@/components/layout/Sidebar";
import CityView from "@/components/city/CityView";
import Modal from "@/components/modals/Modal";

export default function Home() {
  const { supabase, tripData, currentCityId, setCurrentCityId, isLoading, fetchData } = useTripData();
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const closeModal = () => {
    setActiveModal("none");
    setEditingActivity(null);
  };

  // --- MUTATION HANDLERS ---
  const handleAddDestination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
      name: fd.get('name'), dates: fd.get('dates'), nights: Number(fd.get('nights')), img_url: fd.get('img_url') || null
    }).eq('id', currentCityId);
    closeModal();
    fetchData(true);
  };

  const handleDeleteCity = async () => {
    if(!currentCityId) return;
    await supabase.from('cities').delete().eq('id', currentCityId);
    closeModal();
    fetchData(false);
  };

  const handleChangeStay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentCityId) return;
    const fd = new FormData(e.currentTarget);
    const city = tripData[currentCityId];
    const price = Number(fd.get('price_total') || 0);

    if (city.hotel.id) {
      await supabase.from('hotels').update({
        name: fd.get('name'), stars: Number(fd.get('stars')), address: fd.get('address'),
        price_total: price, img_url: fd.get('img_url'), check_in: fd.get('check_in'), check_out: fd.get('check_out')
      }).eq('id', city.hotel.id);
      await supabase.from('expenses').update({ amount: price }).eq('related_hotel_id', city.hotel.id);
    } else {
      const { data: newHotel } = await supabase.from('hotels').insert({
        city_id: currentCityId, name: fd.get('name'), stars: Number(fd.get('stars')), address: fd.get('address'),
        price_total: price, img_url: fd.get('img_url'), check_in: fd.get('check_in'), check_out: fd.get('check_out')
      }).select().single();
      if(newHotel) await supabase.from('expenses').insert({ city_id: currentCityId, amount: price, category: 'stay', related_hotel_id: newHotel.id });
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
      name: fd.get('name'), day_title: fd.get('day_title'), date: fd.get('day_title'), time: fd.get('time'),
      price: price, description: fd.get('description'), icon_name: fd.get('icon_name'),
      color_class: `text-${fd.get('color')}-500`, bg_class: `bg-${fd.get('color')}-50`,
    };

    if (editingActivity?.id) {
      await supabase.from('activities').update(activityData).eq('id', editingActivity.id);
      await supabase.from('expenses').update({ amount: price, category: isFood ? 'food' : 'activity' }).eq('related_activity_id', editingActivity.id);
    } else {
      const { data: newAct } = await supabase.from('activities').insert(activityData).select().single();
      if (newAct) await supabase.from('expenses').insert({ city_id: currentCityId, amount: price, category: isFood ? 'food' : 'activity', related_activity_id: newAct.id });
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
      
      <Modal title="Add New Destination" isOpen={activeModal === "addDestination"} onClose={closeModal}>
        <form onSubmit={handleAddDestination} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">City Name</label><input name="name" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Dates</label><input name="dates" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nights</label><input name="nights" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label><input name="img_url" type="url" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Budget (€)</label><input name="allocated_budget" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Save Destination</button>
          </div>
        </form>
      </Modal>
    </div>
  );

  const city = tripData[currentCityId];

  return (
    <>
      {/* ADD DESTINATION MODAL */}
      <Modal title="Add New Destination" isOpen={activeModal === "addDestination"} onClose={closeModal}>
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

      {/* EDIT CITY MODAL */}
      <Modal title={`Edit ${city.name}`} isOpen={activeModal === "editCity"} onClose={closeModal}>
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

      {/* CHANGE STAY MODAL */}
      <Modal title={`Update Stay in ${city.name}`} isOpen={activeModal === "changeStay"} onClose={closeModal}>
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

      {/* ACTIVITY MODAL */}
      <Modal title={editingActivity ? "Edit Activity" : "Add New Activity"} isOpen={activeModal === "addActivity" || activeModal === "editActivity"} onClose={closeModal}>
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

      {/* LEDGER MODAL */}
      <Modal title={`${city.name} - Detailed Ledger`} isOpen={activeModal === "ledger"} onClose={closeModal}>
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
              {city.rawActivities.map((act) => {
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

      <Sidebar 
        tripData={tripData} 
        currentCityId={currentCityId} 
        setCurrentCityId={setCurrentCityId} 
        onAddDestination={() => setActiveModal("addDestination")} 
      />
      <CityView 
        city={city} 
        onEditCity={() => setActiveModal("editCity")} 
        onChangeStay={() => setActiveModal("changeStay")} 
        onAddActivity={() => { setEditingActivity(null); setActiveModal("addActivity"); }} 
        onEditActivity={(act) => { setEditingActivity(act); setActiveModal("editActivity"); }} 
        onViewLedger={() => setActiveModal("ledger")} 
      />
    </>
  );
}
