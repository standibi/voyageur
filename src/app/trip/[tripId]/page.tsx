/* eslint-disable */

"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTripData } from "@/hooks/useTripData";
import { ModalType, Activity } from "@/types";
import { citiesService } from "@/services/cities";
import { hotelsService } from "@/services/hotels";
import { activitiesService } from "@/services/activities";
import { expensesService } from "@/services/expenses";
import { checklistService } from "@/services/checklist";
import Sidebar from "@/components/layout/Sidebar";
import CityView from "@/components/city/CityView";
import Modal from "@/components/modals/Modal";
import ChecklistModal from "@/components/modals/ChecklistModal";

import AddDestinationModal from "@/components/modals/AddDestinationModal";
import EditCityModal from "@/components/modals/EditCityModal";
import ChangeStayModal from "@/components/modals/ChangeStayModal";
import ActivityModal from "@/components/modals/ActivityModal";
import LedgerModal from "@/components/modals/LedgerModal";

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
    const start = fd.get("start_date") as string;
    const end = fd.get("end_date") as string;
    let dates = null;
    if (start && end) dates = `${start} au ${end}`;
    else if (start) dates = start;
    else if (end) dates = end;

    await citiesService.create({
      trip_id: tripId,
      name: fd.get("name"),
      dates: dates,
      nights: Number(fd.get("nights")),
      allocated_budget: Number(fd.get("allocated_budget")),
      img_url: fd.get("img_url") || null
    });
    closeModal();
    fetchData(true);
  };

  const handleEditCity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentCityId) return;
    const fd = new FormData(e.currentTarget);
    const start = fd.get("start_date") as string;
    const end = fd.get("end_date") as string;
    let dates = null;
    if (start && end) dates = `${start} au ${end}`;
    else if (start) dates = start;
    else if (end) dates = end;

    await citiesService.update(currentCityId, {
      name: fd.get("name"), dates: dates, nights: Number(fd.get("nights")), img_url: fd.get("img_url") || null
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
    const price = Number(fd.get("price_total") || 0);

    if (city.hotel.id) {
      await hotelsService.update(city.hotel.id, {
        name: fd.get("name"), stars: Number(fd.get("stars")), address: fd.get("address"),
        price_total: price, img_url: fd.get("img_url"), check_in: fd.get("check_in"), check_out: fd.get("check_out")
      });
      await expensesService.updateByHotelId(city.hotel.id, { amount: price });
    } else {
      const { data: newHotel } = await hotelsService.create({
        city_id: currentCityId, name: fd.get("name"), stars: Number(fd.get("stars")), address: fd.get("address"),
        price_total: price, img_url: fd.get("img_url"), check_in: fd.get("check_in"), check_out: fd.get("check_out")
      });
      if(newHotel) await expensesService.create({ city_id: currentCityId, amount: price, category: "stay", related_hotel_id: newHotel.id });
    }
    closeModal();
    fetchData(true);
  };

  const handleSaveActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentCityId) return;
    const fd = new FormData(e.currentTarget);
    const price = Number(fd.get("price") || 0);
    const isFood = fd.get("icon_name") === "fa-utensils";
    
    const activityData = {
      city_id: currentCityId,
      name: fd.get("name"), day_title: fd.get("day_title"), date: fd.get("day_title"), time: fd.get("time"),
      price: price, description: fd.get("description"), icon_name: fd.get("icon_name"),
      color_class: `text-${fd.get("color")}-500`, bg_class: `bg-${fd.get("color")}-50`,
    };

    if (editingActivity?.id) {
      await activitiesService.update(editingActivity.id, activityData);
      await expensesService.updateByActivityId(editingActivity.id, { amount: price, category: isFood ? "food" : "activity" });
    } else {
      const { data: newAct } = await activitiesService.create(activityData);
      if (newAct) await expensesService.create({ city_id: currentCityId, amount: price, category: isFood ? "food" : "activity", related_activity_id: newAct.id });
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
  
  const city = currentCityId ? tripData[currentCityId] : null;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50">
      <AddDestinationModal isOpen={activeModal === "addDestination"} onClose={closeModal} onSubmit={handleAddDestination} />
      
      <Modal title="Checklist du voyage" isOpen={activeModal === "checklist"} onClose={closeModal}>
        <ChecklistModal 
          checklist={checklist}
          onAdd={handleAddChecklistItem}
          onToggle={handleToggleChecklistItem}
          onDelete={handleDeleteChecklistItem}
        />
      </Modal>

      {city && (
        <>
          <EditCityModal isOpen={activeModal === "editCity"} onClose={closeModal} onSubmit={handleEditCity} onDelete={handleDeleteCity} city={city} />
          <ChangeStayModal isOpen={activeModal === "changeStay"} onClose={closeModal} onSubmit={handleChangeStay} city={city} />
          <ActivityModal isOpen={activeModal === "addActivity" || activeModal === "editActivity"} onClose={closeModal} onSubmit={handleSaveActivity} onDelete={handleDeleteActivity} activity={editingActivity} city={city} />
          <LedgerModal isOpen={activeModal === "ledger"} onClose={closeModal} city={city} />
        </>
      )}

      <Sidebar 
        tripData={tripData} 
        currentCityId={currentCityId} 
        setCurrentCityId={setCurrentCityId} 
        onBackToTrips={() => router.push("/")}
        onAddDestination={() => setActiveModal("addDestination")} 
        onOpenChecklist={() => setActiveModal("checklist")}
        onRefresh={() => fetchData(true)}
      />
      
      {city ? (
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
      ) : (
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
      )}
    </div>
  );
}
