import React from "react";
import Modal from "./Modal";
import FormField from "../ui/FormField";
import { Activity, CityData, SaveActivityInputSchema } from "@/types";
import toast from "react-hot-toast";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  activity: Activity | null;
  city: CityData;
}

export default function ActivityModal({ isOpen, onClose, onSubmit, onDelete, activity, city }: ActivityModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const result = SaveActivityInputSchema.safeParse(data);
    
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    
    onSubmit(e);
  };

  return (
    <Modal title={activity ? "Modifier l'activité" : "Ajouter une activité"} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nom de l'activité" name="name" required type="text" defaultValue={activity?.name} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date" name="day_title" required type="date" defaultValue={activity?.date || city.dateRange.start} />
          <FormField label="Heure" name="time" required type="time" defaultValue={activity?.time} />
        </div>
        <FormField label="Prix (€)" name="price" required type="number" defaultValue={activity?.price} />
        <FormField label="Description" name="description" as="textarea" required rows={3} defaultValue={activity?.description} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Icône (FontAwesome)" name="icon_name" required type="text" defaultValue={activity?.icon || "fa-star"} />
          <FormField label="Thème de couleur" name="color" as="select" defaultValue={activity ? activity.color : "indigo"} className="bg-white">
            <option value="indigo">Indigo</option>
            <option value="rose">Rose</option>
            <option value="emerald">Émeraude</option>
            <option value="cyan">Cyan</option>
            <option value="amber">Ambre</option>
          </FormField>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div>
            {activity && onDelete && (
              <button type="button" onClick={onDelete} className="px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100">
                <i className="fa-solid fa-trash"></i> Supprimer
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Enregistrer</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
