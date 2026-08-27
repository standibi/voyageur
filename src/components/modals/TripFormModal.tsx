import Modal from "@/components/modals/Modal";
import { Trip, CreateTripInputSchema } from "@/types";
import toast from "react-hot-toast";

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Trip | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
}

export default function TripFormModal({ isOpen, onClose, initialData, onSubmit }: TripFormModalProps) {
  const isEditing = !!initialData;
  const parsedDates = initialData?.dateRange || { start: "", end: "" };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const result = CreateTripInputSchema.safeParse(data);
    
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    
    onSubmit(e);
  };

  return (
    <Modal 
      title={isEditing ? "Modifier le voyage" : "Ajouter un nouveau voyage"} 
      isOpen={isOpen} 
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nom du voyage</label>
          <input 
            name="name" 
            required 
            type="text" 
            placeholder="Ex: Vacances Été 2026" 
            defaultValue={initialData?.name || ""}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Date de début</label>
            <input 
              name="start_date" 
              type="date" 
              defaultValue={parsedDates.start}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Date de fin</label>
            <input 
              name="end_date" 
              type="date" 
              defaultValue={parsedDates.end}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
          <textarea 
            name="notes" 
            placeholder="Notes générales pour ce voyage..." 
            defaultValue={initialData?.notes || ""}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24" 
          />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditing ? "Enregistrer" : "Créer le voyage"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
