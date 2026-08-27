import React from "react";
import FormField from "./FormField";

interface DateRangePickerProps {
  startLabel?: string;
  endLabel?: string;
  startName?: string;
  endName?: string;
  defaultStart?: string;
  defaultEnd?: string;
  required?: boolean;
}

export default function DateRangePicker({
  startLabel = "Date d'arrivée",
  endLabel = "Date de départ",
  startName = "start_date",
  endName = "end_date",
  defaultStart,
  defaultEnd,
  required = true,
}: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label={startLabel} name={startName} type="date" required={required} defaultValue={defaultStart} />
      <FormField label={endLabel} name={endName} type="date" required={required} defaultValue={defaultEnd} />
    </div>
  );
}