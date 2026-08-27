import { CityData } from "@/types";

interface AccommodationCardProps {
  hotel: CityData["hotel"];
  onChangeStay: () => void;
}

export default function AccommodationCard({ hotel, onChangeStay }: AccommodationCardProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-5">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><i className="fa-solid fa-bed text-indigo-500 bg-indigo-50 p-2 rounded-lg"></i> Accommodation</h3>
        <button onClick={onChangeStay} className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm flex items-center gap-1">
          <i className="fa-solid fa-arrows-rotate"></i> Change Stay
        </button>
      </div>
      {hotel.name !== 'No Hotel Selected' ? (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="relative w-32 h-32 shrink-0">
            <img src={hotel.img_url} className="w-full h-full object-cover rounded-xl" alt={hotel.name} />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="flex text-yellow-400 text-[10px] mb-1.5">{Array.from({ length: hotel.stars || 0 }).map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}</div>
                <h4 className="font-bold text-xl text-slate-800">{hotel.name}</h4>
              </div>
              <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm border border-slate-200 shadow-sm">€{hotel.price_total} total</span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-3"><i className="fa-solid fa-location-dot mr-1.5"></i> {hotel.address}</p>
            <div className="flex gap-6 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
              <div className="flex items-center gap-2"><i className="fa-solid fa-right-to-bracket text-indigo-400"></i><div><span className="font-semibold text-slate-800">In:</span> <span>{hotel.check_in}</span></div></div>
              <div className="w-px bg-slate-200"></div>
              <div className="flex items-center gap-2"><i className="fa-solid fa-right-from-bracket text-rose-400"></i><div><span className="font-semibold text-slate-800">Out:</span> <span>{hotel.check_out}</span></div></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 border-dashed text-center">
          <p className="text-slate-500 font-medium mb-3">No accommodation booked yet.</p>
          <button onClick={onChangeStay} className="text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">Add Hotel</button>
        </div>
      )}
    </div>
  );
}
