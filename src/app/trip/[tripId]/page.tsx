"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTripData } from "@/hooks/useTripData";
import { ModalType, Activity } from "@/types";
import { parseDateRange } from "@/utils/dateUtils";
import { citiesService } from "@/services/cities";
import { hotelsService } from "@/services/hotels";
import { activitiesService } from "@/services/activities";
import { expensesService } from "@/services/expenses";
import { checklistService } from "@/services/checklist";
import Sidebar from "@/components/layout/Sidebar";
import CityView from "@/components/city/CityView";
import Modal from "@/components/modals/Modal";
import ChecklistModal from "@/components/modals/ChecklistModal";


export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;
  
  const { trip, tripData, currentCityId, setCurrentCityId, checklist, isLoading, fetchData } = useTripData(tripId);
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
    const start = fd.get('start_date') as string;
    const end = fd.get('end_date') as string;
    let dates = null;
    if (start && end) dates = `${start} au ${end}`;
    else if (start) dates = start;
    else if (end) dates = end;

    await citiesService.create({
      trip_id: tripId,
      name: fd.get('name'),
      dates: dates,
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
    const start = fd.get('start_date') as string;
    const end = fd.get('end_date') as string;
    let dates = null;
    if (start && end) dates = `${start} au ${end}`;
    else if (start) dates = start;
    else if (end) dates = end;

    await citiesService.update(currentCityId, {
      name: fd.get('name'), dates: dates, nights: Number(fd.get('nights')), img_url: fd.get('img_url') || null
    });
    closeModal();
    fetchData(true);
  };

  const handleDeleteCity = async () => {
    if(!currentCityId) return;

    await citiesService.delete(currentCityId);
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
      await hotelsService.update(city.hotel.id, {
        name: fd.get('name'), stars: Number(fd.get('stars')), address: fd.get('address'),
        price_total: price, img_url: fd.get('img_url'), check_in: fd.get('check_in'), check_out: fd.get('check_out')
      });
      await expensesService.updateByHotelId(city.hotel.id, { amount: price });
    } else {
      const { data: newHotel } = await hotelsService.create({
        city_id: currentCityId, name: fd.get('name'), stars: Number(fd.get('stars')), address: fd.get('address'),
        price_total: price, img_url: fd.get('img_url'), check_in: fd.get('check_in'), check_out: fd.get('check_out')
      });
      if(newHotel) await expensesService.create({ city_id: currentCityId, amount: price, category: 'stay', related_hotel_id: newHotel.id });
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
      await activitiesService.update(editingActivity.id, activityData);
      await expensesService.updateByActivityId(editingActivity.id, { amount: price, category: isFood ? 'food' : 'activity' });
    } else {
      const { data: newAct } = await activitiesService.create(activityData);
      if (newAct) await expensesService.create({ city_id: currentCityId, amount: price, category: isFood ? 'food' : 'activity', related_activity_id: newAct.id });
    }
    closeModal();
    fetchData(true);
  };

  const handleDeleteActivity = async () => {
    if (!editingActivity?.id) return;
    await activitiesService.delete(editingActivity.id);
    await expensesService.deleteByActivityId(editingActivity.id);
    closeModal();
    fetchData(true);
  };

  const handleToggleChecklistItem = async (id: string, is_completed: boolean) => {
    await checklistService.update(id, { is_completed });
    fetchData(true);
  };

  const handleAddChecklistItem = async (title: string) => {
    await checklistService.create({ trip_id: tripId, title });
    fetchData(true);
  };

  const handleDeleteChecklistItem = async (id: string) => {
    await checklistService.delete(id);
    fetchData(true);
  };

  if (isLoading) return <div className="flex-1 w-full h-[100dvh] flex flex-col items-center justify-center font-bold text-slate-500 gap-4"><i className="fa-solid fa-plane-departure text-3xl animate-pulse text-indigo-400"></i><span>Chargement des données du voyage...</span></div>;
  
  if (!currentCityId || !tripData[currentCityId]) {
    return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50">
        <Modal title="Ajouter une nouvelle destination" isOpen={activeModal === "addDestination"} onClose={closeModal}>
          <form onSubmit={handleAddDestination} className="space-y-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la ville</label><input name="name" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date d'arrivée</label><input name="start_date" type="date" required className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date de départ</label><input name="end_date" type="date" required className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            </div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nuits</label><input name="nights" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">URL de l'image de couverture</label><input name="img_url" type="url" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Budget estimé (€)</label><input name="allocated_budget" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Enregistrer la destination</button></div>
          </form>
        </Modal>

        <Modal title="Checklist du voyage" isOpen={activeModal === "checklist"} onClose={closeModal}>
          <ChecklistModal 
            checklist={checklist}
            onAdd={handleAddChecklistItem}
            onToggle={handleToggleChecklistItem}
            onDelete={handleDeleteChecklistItem}
          />
        </Modal>

        <Sidebar 
          tripData={tripData} 
          currentCityId={null} 
          setCurrentCityId={setCurrentCityId} 
          onBackToTrips={() => router.push('/')}
          onAddDestination={() => setActiveModal("addDestination")} 
          onOpenChecklist={() => setActiveModal("checklist")}
          onRefresh={() => fetchData(true)}
        />
        
        <div className="hidden md:flex flex-1 h-full flex-col items-center justify-center bg-slate-50 relative p-10">
           <div className="max-w-md w-full text-center">
             <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm border border-indigo-100">
               <i className="fa-solid fa-map-location-dot"></i>
             </div>
             <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
               {Object.keys(tripData).length > 0 ? "Où allez-vous ensuite ?" : "Planifiez votre prochaine aventure"}
             </h2>
             <p className="text-slate-500 text-lg mb-8">
               {Object.keys(tripData).length > 0 
                 ? "Sélectionnez une destination dans le menu pour voir et modifier les détails." 
                 : "Votre itinéraire est actuellement vide. Commencez par ajouter une destination à votre roadtrip !"}
             </p>
             {Object.keys(tripData).length === 0 && (
               <button onClick={() => setActiveModal("addDestination")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-600/30 transition-transform transform hover:scale-105 flex items-center gap-3 mx-auto text-lg">
                  <i className="fa-solid fa-plane-departure"></i> C'est parti !
               </button>
             )}
           </div>
        </div>
      </div>
    );
  }

  const city = tripData[currentCityId];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50">
      {/* CITY MODAL */}
      <Modal title="Modifier la destination" isOpen={activeModal === "editCity"} onClose={closeModal}>
        <form onSubmit={handleEditCity} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la ville</label><input name="name" required type="text" defaultValue={city.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date d'arrivée</label><input name="start_date" type="date" required defaultValue={parseDateRange(city.dates).start} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date de départ</label><input name="end_date" type="date" required defaultValue={parseDateRange(city.dates).end} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nuits</label><input name="nights" required type="number" defaultValue={city.nights} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">URL de l'image de couverture</label><input name="img_url" type="url" defaultValue={city.img} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <button type="button" onClick={handleDeleteCity} className="px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"><i className="fa-solid fa-trash"></i> Supprimer</button>
            <div className="flex gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Mettre à jour</button></div>
          </div>
        </form>
      </Modal>

      {/* STAY MODAL */}
      <Modal title="Modifier l'hébergement" isOpen={activeModal === "changeStay"} onClose={closeModal}>
        <form onSubmit={handleChangeStay} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nom de l'hôtel</label><input name="name" required type="text" defaultValue={city.hotel.name !== 'No Hotel Selected' ? city.hotel.name : ''} placeholder="Ex: Hôtel Le Clos" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Étoiles</label><input name="stars" required type="number" min="1" max="5" defaultValue={city.hotel.stars || 3} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Prix Total (€)</label><input name="price_total" required type="number" defaultValue={city.hotel.price_total} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Adresse</label><input name="address" required type="text" defaultValue={city.hotel.address} placeholder="Ex: 31 Route de Pommard, 21200" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Check-in</label><input name="check_in" required type="datetime-local" defaultValue={city.hotel.check_in} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Check-out</label><input name="check_out" required type="datetime-local" defaultValue={city.hotel.check_out} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">URL de l'image de l'hôtel</label><input name="img_url" required type="url" defaultValue={city.hotel.img_url} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Enregistrer</button></div>
        </form>
      </Modal>

      {/* ACTIVITY MODAL */}
      <Modal title={editingActivity ? "Modifier l'activité" : "Ajouter une activité"} isOpen={activeModal === "addActivity" || activeModal === "editActivity"} onClose={closeModal}>
        <form onSubmit={handleSaveActivity} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nom de l'activité</label><input name="name" required type="text" defaultValue={editingActivity?.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date</label><input name="day_title" required type="date" defaultValue={editingActivity?.date || parseDateRange(city.dates).start} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Heure</label><input name="time" required type="time" defaultValue={editingActivity?.time} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Prix (€)</label><input name="price" required type="number" defaultValue={editingActivity?.price} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Description</label><textarea name="description" required rows={3} defaultValue={editingActivity?.description} className="w-full px-4 py-2 border border-slate-300 rounded-lg"></textarea></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Icône (FontAwesome)</label><input name="icon_name" required type="text" defaultValue={editingActivity?.icon_name || 'fa-star'} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Thème de couleur</label>
              <select name="color" defaultValue={editingActivity ? editingActivity.color_class.split('-')[1] : "indigo"} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="indigo">Indigo</option><option value="rose">Rose</option><option value="emerald">Émeraude</option><option value="cyan">Cyan</option><option value="amber">Ambre</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div>{editingActivity && <button type="button" onClick={handleDeleteActivity} className="px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"><i className="fa-solid fa-trash"></i> Supprimer</button>}</div>
            <div className="flex gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Enregistrer</button></div>
          </div>
        </form>
      </Modal>

      {/* LEDGER MODAL */}
      <Modal title={`${city.name} - Grand Livre`} isOpen={activeModal === "ledger"} onClose={closeModal}>
        <div className="space-y-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="py-2 font-medium">Article</th><th className="py-2 font-medium">Catégorie</th><th className="py-2 font-medium text-right">Coût</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                <td className="py-3 font-semibold text-slate-800">{city.hotel.name}</td>
                <td className="py-3 text-slate-500"><span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">Séjour</span></td>
                <td className="py-3 text-right font-bold">€{city.breakdown.stay}</td>
              </tr>
              {city.rawActivities.map((act) => {
                  const isFood = act.icon_name === "fa-utensils";
                  const catClass = isFood ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600";
                  const catName = isFood ? "Nourriture" : "Activité";
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
                <td colSpan={2} className="py-4 font-bold text-slate-800">Budget Total Ville</td>
                <td className="py-4 text-right font-extrabold text-indigo-600">€{city.totalBudget}</td>
              </tr>
            </tfoot>
          </table>
          <div className="pt-4 border-t border-slate-100 flex justify-end"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Fermer</button></div>
        </div>
      </Modal>

      {/* CHECKLIST MODAL */}
      <Modal title="Checklist du voyage" isOpen={activeModal === "checklist"} onClose={closeModal}>
        <ChecklistModal 
          checklist={checklist}
          onAdd={handleAddChecklistItem}
          onToggle={handleToggleChecklistItem}
          onDelete={handleDeleteChecklistItem}
        />
      </Modal>

      <Sidebar 
        tripData={tripData} 
        currentCityId={currentCityId} 
        setCurrentCityId={setCurrentCityId} 
        onBackToTrips={() => router.push('/')}
        onAddDestination={() => setActiveModal("addDestination")} 
        onOpenChecklist={() => setActiveModal("checklist")}
        onRefresh={() => fetchData(true)}
      />
      <CityView 
        city={city} 
        onBack={() => setCurrentCityId(null)}
        onEditCity={() => setActiveModal("editCity")} 
        onChangeStay={() => setActiveModal("changeStay")} 
        onAddActivity={() => { setEditingActivity(null); setActiveModal("addActivity"); }} 
        onEditActivity={(act) => { setEditingActivity(act); setActiveModal("editActivity"); }} 
        onViewLedger={() => setActiveModal("ledger")} 
        onRefresh={() => fetchData(true)}
      />
    </div>
  );
}
