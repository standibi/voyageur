import { z } from "zod";

export type ModalType = "none" | "editCity" | "changeStay" | "addActivity" | "editActivity" | "addDestination" | "ledger" | "checklist" | "addTrip" | "editTrip";

export type ActivityIcon = "camera" | "utensils" | "ticket" | "map" | "star" | "sun" | "car" | "plane" | "bed" | "coffee" | "glass-cheers" | "shopping-bag" | "landmark" | "swimmer" | "tree" | "bicycle" | "train" | "ship" | "bus";
export type ActivityColor = "blue" | "red" | "green" | "yellow" | "purple" | "indigo" | "pink" | "orange" | "teal" | "cyan" | "rose" | "emerald" | "amber" | "fuchsia" | "sky" | "lime";

export interface DateRange {
  start: string;
  end: string;
}

export interface Expense {
  id: string;
  city_id: string;
  amount: number;
  category: "stay" | "activities" | "food" | "transport" | "misc";
  description: string;
  date: string;
  related_hotel_id?: string;
  related_activity_id?: string;
}

export interface Trip {
  id: string;
  name: string;
  dateRange?: DateRange;
  notes?: string;
  created_at: string;
}

export interface Hotel {
  id?: string;
  name: string;
  stars: number;
  address: string;
  price_total: number;
  img_url: string;
  check_in: string;
  check_out: string;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  day_title: string;
  time: string;
  price: number;
  description: string;
  icon: ActivityIcon;
  color: ActivityColor;
  bg: string;
}

export interface TimelineDay {
  dayTitle: string;
  date: string;
  activities: Activity[];
}

export interface ExpenseBreakdown {
  stay: number;
  activities: number;
  food: number;
  transport: number;
  misc: number;
}

export interface CityData {
  id: string;
  trip_id: string;
  name: string;
  dateRange: DateRange;
  nights: number;
  totalBudget: number;
  img: string;
  breakdown: ExpenseBreakdown;
  hotel: Hotel;
  timeline: TimelineDay[];
  rawActivities: Activity[];
  rawExpenses: Expense[];
}

export interface ChecklistItem {
  id: string;
  trip_id: string;
  title: string;
  is_completed: boolean;
}

// ----------------- ZOD SCHEMAS -----------------

export const CreateTripInputSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
}).transform(data => ({
  name: data.name,
  dateRange: data.start_date && data.end_date ? { start: data.start_date, end: data.end_date } : undefined,
  notes: data.notes
}));
export type CreateTripInput = z.infer<typeof CreateTripInputSchema>;

export const CreateCityInputSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  start_date: z.string().min(1, "Date d'arrivée requise"),
  end_date: z.string().min(1, "Date de départ requise"),
  nights: z.coerce.number().min(1, "Au moins 1 nuit requise"),
  allocated_budget: z.coerce.number().min(0, "Le budget doit être positif"),
  img_url: z.string().optional(),
}).transform(data => ({
  name: data.name,
  dateRange: { start: data.start_date, end: data.end_date },
  nights: data.nights,
  allocated_budget: data.allocated_budget,
  img_url: data.img_url
}));
export type CreateCityInput = z.infer<typeof CreateCityInputSchema>;

export const UpdateHotelInputSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  stars: z.coerce.number().min(0).max(5),
  address: z.string().min(1, "Adresse requise"),
  price_total: z.coerce.number().min(0),
  check_in: z.string().min(1, "Date d'arrivée requise"),
  check_out: z.string().min(1, "Date de départ requise"),
  img_url: z.string().optional(),
}).transform(data => ({
  name: data.name,
  stars: data.stars,
  address: data.address,
  price_total: data.price_total,
  check_in: data.check_in,
  check_out: data.check_out,
  img_url: data.img_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
}));
export type UpdateHotelInput = z.infer<typeof UpdateHotelInputSchema>;

export const SaveActivityInputSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  day_title: z.string().min(1, "Date requise"),
  time: z.string().min(1, "Heure requise"),
  price: z.coerce.number().min(0, "Prix invalide"),
  description: z.string().optional(),
  icon_name: z.string().optional().default("fa-star"),
  color: z.string().optional().default("indigo"),
}).transform(data => {
  const iconRaw = data.icon_name.replace('fa-', '') as ActivityIcon;
  const colorRaw = data.color as ActivityColor;
  return {
    name: data.name,
    date: data.day_title,
    day_title: data.day_title,
    time: data.time,
    price: data.price,
    description: data.description || "",
    icon: iconRaw,
    color: colorRaw,
    bg: colorRaw,
  };
});
export type SaveActivityInput = z.infer<typeof SaveActivityInputSchema>;

export const UpdateCityInputSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  start_date: z.string().min(1, "Date d'arrivée requise"),
  end_date: z.string().min(1, "Date de départ requise"),
  nights: z.coerce.number().min(1, "Au moins 1 nuit requise"),
  img_url: z.string().optional(),
}).transform(data => ({
  name: data.name,
  dateRange: { start: data.start_date, end: data.end_date },
  nights: data.nights,
  img_url: data.img_url
}));
export type UpdateCityInput = z.infer<typeof UpdateCityInputSchema>;
