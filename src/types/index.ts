export type ModalType = "none" | "editCity" | "changeStay" | "addActivity" | "editActivity" | "addDestination" | "ledger" | "checklist" | "addTrip" | "editTrip";

export interface Trip {
  id: string;
  name: string;
  dates?: string;
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
  icon_name: string;
  color_class: string;
  bg_class: string;
  icon?: string;
  color?: string;
  bg?: string;
  desc?: string;
}

export interface TimelineDay {
  dayTitle: string;
  date: string;
  activities: Activity[];
}

export interface ExpenseBreakdown {
  stay: number;
  act: number;
  activity?: number;
  food: number;
  transport: number;
  misc: number;
}

export interface CityData {
  id: string;
  trip_id: string;
  name: string;
  dates: string;
  nights: number;
  totalBudget: number;
  img: string;
  breakdown: ExpenseBreakdown;
  hotel: Hotel;
  timeline: TimelineDay[];
  rawActivities: Activity[];
  rawExpenses: any[];
}

export interface ChecklistItem {
  id: string;
  trip_id: string;
  title: string;
  is_completed: boolean;
}
