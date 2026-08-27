import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding database...");

  // 1. Create a Trip
  const { data: trip, error: tripErr } = await supabase
    .from("trips")
    .insert({ name: "France Roadtrip 2024" })
    .select()
    .single();
  if (tripErr) throw tripErr;

  // Paris Data
  const { data: paris } = await supabase
    .from("cities")
    .insert({
      trip_id: trip.id,
      name: "Paris",
      dates: "May 18 - 20",
      nights: 2,
      allocated_budget: 650,
      img_url:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
    })
    .select()
    .single();

  const { data: p_hotel } = await supabase
    .from("hotels")
    .insert({
      city_id: paris!.id,
      name: "Hotel Le Meurice",
      stars: 5,
      address: "228 Rue de Rivoli, 75001 Paris",
      price_total: 400,
      img_url:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      check_in: "May 18, 15:00",
      check_out: "May 20, 11:00",
    })
    .select()
    .single();

  await supabase
    .from("expenses")
    .insert({
      city_id: paris!.id,
      amount: 400,
      category: "stay",
      related_hotel_id: p_hotel!.id,
    });

  const act1 = await supabase
    .from("activities")
    .insert({
      city_id: paris!.id,
      day_title: "Day 1: Arrival & Icons",
      date: "May 18",
      time: "10:00 AM",
      name: "Eiffel Tower Summit",
      description: "Skip-the-line guided tour to the top.",
      price: 28,
      icon_name: "fa-monument",
      color_class: "text-indigo-500",
      bg_class: "bg-indigo-50",
      sort_order: 1,
    })
    .select()
    .single();
  await supabase
    .from("expenses")
    .insert({
      city_id: paris!.id,
      amount: 28,
      category: "activity",
      related_activity_id: act1.data!.id,
    });

  const act2 = await supabase
    .from("activities")
    .insert({
      city_id: paris!.id,
      day_title: "Day 1: Arrival & Icons",
      date: "May 18",
      time: "1:00 PM",
      name: "Lunch at Le Jules Verne",
      description: "Fine dining experience inside the Eiffel Tower.",
      price: 135,
      icon_name: "fa-utensils",
      color_class: "text-rose-500",
      bg_class: "bg-rose-50",
      sort_order: 2,
    })
    .select()
    .single();
  await supabase
    .from("expenses")
    .insert({
      city_id: paris!.id,
      amount: 135,
      category: "food",
      related_activity_id: act2.data!.id,
    });

  // Lyon Data
  const { data: lyon } = await supabase
    .from("cities")
    .insert({
      trip_id: trip.id,
      name: "Lyon",
      dates: "May 20 - 22",
      nights: 2,
      allocated_budget: 420,
      img_url:
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=2000&q=80",
    })
    .select()
    .single();

  const { data: l_hotel } = await supabase
    .from("hotels")
    .insert({
      city_id: lyon!.id,
      name: "Villa Florentine",
      stars: 4,
      address: "25 Montée Saint-Barthélémy, 69005 Lyon",
      price_total: 250,
      img_url:
        "https://images.unsplash.com/photo-1551882547-ff40c0d1398c?auto=format&fit=crop&w=800&q=80",
      check_in: "May 20, 14:00",
      check_out: "May 22, 12:00",
    })
    .select()
    .single();
  await supabase
    .from("expenses")
    .insert({
      city_id: lyon!.id,
      amount: 250,
      category: "stay",
      related_hotel_id: l_hotel!.id,
    });

  const act3 = await supabase
    .from("activities")
    .insert({
      city_id: lyon!.id,
      day_title: "Day 3: Gastronomy",
      date: "May 20",
      time: "8:00 PM",
      name: "Dinner at a Bouchon",
      description: "Traditional Lyonnaise heavy dinner.",
      price: 60,
      icon_name: "fa-utensils",
      color_class: "text-rose-500",
      bg_class: "bg-rose-50",
      sort_order: 1,
    })
    .select()
    .single();
  await supabase
    .from("expenses")
    .insert({
      city_id: lyon!.id,
      amount: 60,
      category: "food",
      related_activity_id: act3.data!.id,
    });

  console.log("Seeded successfully!");
}

seed().catch(console.error);
