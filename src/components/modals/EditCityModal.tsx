import React from "react";
import Modal from "./Modal";
import FormField from "../ui/FormField";
import DateRangePicker from "../ui/DateRangePicker";
import { CityData, UpdateCityInputSchema } from "@/types";
import toast from "react-hot-toast";

interface EditCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  city: CityData;
}

export default function EditCityModal({ isOpen, onClose, onSubmit, onDelete, city }: EditCityModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const result = UpdateCityInputSchema.safeParse(data);
    
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    
    onSubmit(e);
  };

  return (
    <Modal title="Modifier la destination" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nom de la ville" name="name" required type="text" defaultValue={city.name} />
        <DateRangePicker defaultStart={city.dateRange.start} defaultEnd={city.dateRange.end} />
        <FormField label="Nuits" name="nights" required type="number" defaultValue={city.nights} />
        <FormField label="URL de l'image de couverture" name="img_url" type="url" defaultValue={city.img} />
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <button type="button" onClick={onDelete} className="px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100">
            <i className="fa-solid fa-trash"></i> Supprimer
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Mettre à jour</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
