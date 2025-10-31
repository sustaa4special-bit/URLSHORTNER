"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ date, setDate, placeholder = "Pick a date", disabled = false }: DatePickerProps) {
  const handleSelect: SelectSingleEventHandler = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
            !date && "text-gray-400"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700 text-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          disabled={disabled}
          className="bg-gray-900 text-white"
          classNames={{
            day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 focus:bg-indigo-700",
            day_today: "bg-indigo-500/20 text-indigo-400",
            day_range_middle: "aria-selected:bg-indigo-500 aria-selected:text-white",
            day_range_end: "aria-selected:bg-indigo-600 aria-selected:text-white",
            day_range_start: "aria-selected:bg-indigo-600 aria-selected:text-white",
            day_hidden: "invisible",
            day_disabled: "text-gray-500 opacity-50",
            nav_button_previous: "text-white hover:bg-gray-700",
            nav_button_next: "text-white hover:bg-gray-700",
            caption_label: "text-white",
            head_cell: "text-gray-400",
            day: "text-white hover:bg-gray-700",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}