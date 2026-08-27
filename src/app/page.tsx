/* eslint-disable */
import { tripsService } from "@/services/trips";
"use client";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrips } from "@/hooks/useTrips";
import { ModalType, Trip } from "@/types";
import { withToast } from "@/utils/toast";
import TripCard from "@/components/TripCard";
import dynamic from "next/dynamic";
const TripFormModal = dynamic(() => import("@/components/modals/TripFormModal"));

export default function Home() {
  const router = useRouter();
  const { trips, isLoading, fetchTrips } = useTrips();
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const closeModal = () => {
    setActiveModal("none");
    setEditingTrip(null);
  };

  const handleTripSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const dates = start_date && end_date ? `${start_date} au ${end_date}` : null;
    const name = formData.get("name") as string;
    const notes = formData.get("notes") as string || null;
    
    try {
      if (editingTrip) {
        await tripsService.update(editingTrip.id, { name, dates, notes });
      } else {
        await withToast(
          tripsService.create({ name, dates, notes }),
          {
            loading: 'Création du voyage...',
            success: 'Voyage créé avec succès !',
            error: 'Erreur lors de la création du voyage'
          }
        );
      }
      closeModal();
      fetchTrips();
    } catch (error) {
      console.error(error);
    }
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
      
      <TripFormModal 
        isOpen={activeModal === "addTrip" || activeModal === "editTrip"} 
        onClose={closeModal} 
        initialData={editingTrip} 
        onSubmit={handleTripSubmit} 
      />

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
                {trips.map((trip, idx) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    idx={idx} 
                    onSelect={() => router.push(`/trip/${trip.id}`)} 
                    onEdit={() => { setEditingTrip(trip); setActiveModal("editTrip"); }} 
                    onDelete={() => handleDeleteTrip(trip.id)} 
                  />
                ))}
              </div>
            )}
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
}
