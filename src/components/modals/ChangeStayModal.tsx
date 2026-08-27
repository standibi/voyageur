import React from "react";
import Modal from "./Modal";
import FormField from "../ui/FormField";
import { CityData, UpdateHotelInputSchema } from "@/types";
import toast from "react-hot-toast";

interface ChangeStayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  city: CityData;
}

export default function ChangeStayModal({ isOpen, onClose, onSubmit, city }: ChangeStayModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const result = UpdateHotelInputSchema.safeParse(data);
    
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    
    onSubmit(e);
  };

  return (
    <Modal title="Modifier l'hébergement" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nom de l'hôtel" name="name" required type="text" defaultValue={city.hotel.name !== "No Hotel Selected" ? city.hotel.name : ""} placeholder="Ex: Hôtel Le Clos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Étoiles" name="stars" required type="number" min="1" max="5" defaultValue={city.hotel.stars || 3} />
          <FormField label="Prix Total (€)" name="price_total" required type="number" defaultValue={city.hotel.price_total} />
        </div>
        <FormField label="Adresse" name="address" required type="text" defaultValue={city.hotel.address} placeholder="Ex: 31 Route de Pommard, 21200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Check-in" name="check_in" required type="datetime-local" defaultValue={city.hotel.check_in} />
          <FormField label="Check-out" name="check_out" required type="datetime-local" defaultValue={city.hotel.check_out} />
        </div>
        <FormField label="URL de l'image de l'hôtel" name="img_url" required type="url" defaultValue={city.hotel.img_url} />
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Annuler</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Enregistrer</button>
        </div>
      </form>
    </Modal>
  );
}
