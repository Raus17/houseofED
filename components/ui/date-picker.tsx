import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export function DatePicker({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => {
            setDate(selected || undefined);
            onChange(selected ? selected.toISOString().split("T")[0] : "");
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
