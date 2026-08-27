import React from "react";
import Modal from "./Modal";
import FormField from "../ui/FormField";
import DateRangePicker from "../ui/DateRangePicker";
import { parseDateRange } from "@/utils/dateUtils";
import { City } from "@/types";

interface EditCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  city: City;
}

export default function EditCityModal({ isOpen, onClose, onSubmit, onDelete, city }: EditCityModalProps) {
  const dates = parseDateRange(city.dates);
  return (
    <Modal title="Modifier la destination" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Nom de la ville" name="name" required type="text" defaultValue={city.name} />
        <DateRangePicker defaultStart={dates.start} defaultEnd={dates.end} />
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
