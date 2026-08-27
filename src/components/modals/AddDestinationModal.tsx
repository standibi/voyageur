import React from "react";
import Modal from "./Modal";
import FormField from "../ui/FormField";
import DateRangePicker from "../ui/DateRangePicker";

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddDestinationModal({ isOpen, onClose, onSubmit }: AddDestinationModalProps) {
  return (
    <Modal title="Ajouter une nouvelle destination" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Nom de la ville" name="name" required type="text" />
        <DateRangePicker />
        <FormField label="Nuits" name="nights" required type="number" />
        <FormField label="URL de l'image de couverture" name="img_url" type="url" />
        <FormField label="Budget estimé (€)" name="allocated_budget" required type="number" />
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Enregistrer la destination</button>
        </div>
      </form>
    </Modal>
  );
}
