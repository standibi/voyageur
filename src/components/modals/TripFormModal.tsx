import Modal from "@/components/modals/Modal";
import { Trip, CreateTripInputSchema } from "@/types";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

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
          <Input 
            name="name" 
            label="Nom du voyage"
            required 
            type="text" 
            placeholder="Ex: Vacances Été 2026" 
            defaultValue={initialData?.name || ""}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input 
              name="start_date" 
              label="Date de début"
              type="date" 
              defaultValue={parsedDates.start}
            />
          </div>
          <div>
            <Input 
              name="end_date" 
              label="Date de fin"
              type="date" 
              defaultValue={parsedDates.end}
            />
          </div>
        </div>
        <div>
          <Textarea 
            name="notes" 
            label="Notes"
            placeholder="Notes générales pour ce voyage..." 
            defaultValue={initialData?.notes || ""}
            className="h-24"
          />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button 
            type="button" 
            onClick={onClose} 
            variant="ghost"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            {isEditing ? "Enregistrer" : "Créer le voyage"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
