import { tripsService } from "@/services/trips";
import { parseDateRange } from "@/utils/dateUtils";
"use client";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrips } from "@/hooks/useTrips";
import { ModalType, Trip } from "@/types";
import Modal from "@/components/modals/Modal";
import { formatDateRangeDisplay } from "@/utils/dateUtils";


export default function Home() {
  const router = useRouter();
  const { trips, isLoading, fetchTrips } = useTrips();
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const closeModal = () => {
    setActiveModal("none");
    setEditingTrip(null);
  };

  const handleAddTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const dates = start_date && end_date ? `${start_date} au ${end_date}` : null;
    
    await tripsService.create({ 
      name: formData.get("name"),
      dates,
      notes: formData.get("notes") as string || null
    });
    closeModal();
    fetchTrips();
  };

  const handleEditTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTrip) return;
    const formData = new FormData(e.currentTarget);
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const dates = start_date && end_date ? `${start_date} au ${end_date}` : null;

    await tripsService.update(editingTrip.id, { 
      name: formData.get("name"),
      dates,
      notes: formData.get("notes") as string || null
    });
    closeModal();
    fetchTrips();
  };

  const handleDeleteTrip = async (id: string) => {
    await tripsService.delete(id);
    fetchTrips();
  };

  if (isLoading) return <div className="flex-1 w-full h-[100dvh] flex flex-col items-center justify-center font-bold text-slate-500 gap-4"><i className="fa-solid fa-plane-departure text-3xl animate-pulse text-indigo-400"></i><span>Chargement des voyages...</span></div>;

  return (
    <div className="flex-1 bg-slate-50 h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-100/50 to-transparent -z-10"></div>
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>
      
      <Modal title="Ajouter un nouveau voyage" isOpen={activeModal === "addTrip"} onClose={closeModal}>
        <form onSubmit={handleAddTrip} className="space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nom du voyage</label><input name="name" required type="text" placeholder="Ex: Vacances Été 2026" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date de début</label><input name="start_date" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date de fin</label><input name="end_date" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label><textarea name="notes" placeholder="Notes générales pour ce voyage..." className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24" /></div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Créer le voyage</button></div>
        </form>
      </Modal>

      <Modal title="Modifier le voyage" isOpen={activeModal === "editTrip"} onClose={closeModal}>
        {editingTrip && (
          <form onSubmit={handleEditTrip} className="space-y-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nom du voyage</label><input name="name" required type="text" defaultValue={editingTrip.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date de début</label><input name="start_date" type="date" defaultValue={parseDateRange(editingTrip.dates).start} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date de fin</label><input name="end_date" type="date" defaultValue={parseDateRange(editingTrip.dates).end} className="w-full px-4 py-2 border border-slate-300 rounded-lg" /></div>
            </div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label><textarea name="notes" defaultValue={editingTrip.notes || ''} className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24" /></div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button><button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Enregistrer</button></div>
          </form>
        )}
      </Modal>

      <div className="flex-1 overflow-y-auto" id="main-scroll-container">
        <PullToRefresh onRefresh={fetchTrips} pullDownThreshold={60} maxPullDownDistance={100}>
          <div className="p-4 sm:p-6 md:p-12 lg:p-20 max-w-6xl w-full mx-auto relative z-10 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 md:mb-12">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Mes Voyages</h1>
                <p className="text-slate-500 text-base md:text-lg max-w-md">Sélectionnez un voyage pour voir ou modifier votre itinéraire.</p>
              </div>
              <button onClick={() => setActiveModal("addTrip")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 md:px-8 rounded-xl shadow-lg shadow-indigo-600/25 transition-transform transform hover:-translate-y-1 w-full sm:w-auto flex justify-center items-center gap-2 text-lg">
                <i className="fa-solid fa-plus"></i> Nouveau Voyage
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="text-center py-24 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"><i className="fa-solid fa-plane-departure"></i></div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Aucun voyage pour le moment</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto text-lg">Commencez par créer votre premier voyage pour y ajouter vos destinations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {trips.map((trip, idx) => {
                  const gradients = [
                    "from-blue-500 to-indigo-600",
                    "from-emerald-400 to-teal-500",
                    "from-orange-400 to-rose-500",
                    "from-purple-500 to-fuchsia-600",
                    "from-cyan-400 to-blue-500"
                  ];
                  const gradient = gradients[idx % gradients.length];
                  
                  return (
                    <div key={trip.id} onClick={() => router.push(`/trip/${trip.id}`)} className="bg-white rounded-3xl shadow-sm border border-slate-200/75 hover:shadow-2xl hover:shadow-indigo-100 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden relative transform hover:-translate-y-1">
                      <div className={`h-3 w-full bg-gradient-to-r ${gradient}`}></div>
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white bg-gradient-to-br ${gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <i className="fa-solid fa-plane"></i>
                          </div>
                          <div className="flex gap-1 bg-slate-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setEditingTrip(trip); setActiveModal("editTrip"); }} className="text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-sm"><i className="fa-solid fa-pen text-sm"></i></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }} className="text-slate-400 hover:text-rose-500 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-sm"><i className="fa-solid fa-trash text-sm"></i></button>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors mb-3 line-clamp-2">{trip.name}</h3>
                        
                        {trip.dates ? (
                          <div className="inline-flex items-center gap-2 bg-slate-100/80 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-semibold w-fit">
                            <i className="fa-regular fa-calendar text-indigo-500"></i> {formatDateRangeDisplay(trip.dates)}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg text-sm font-medium w-fit border border-slate-100">
                            <i className="fa-regular fa-calendar-xmark"></i> Dates à définir
                          </div>
                        )}
                        
                        <div className="mt-auto pt-8 flex justify-end">
                          <span className="text-sm font-bold text-indigo-600 flex items-center gap-2 group-hover:gap-3 transition-all bg-indigo-50 px-4 py-2 rounded-xl group-hover:bg-indigo-100">
                            Ouvrir le voyage <i className="fa-solid fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
}
