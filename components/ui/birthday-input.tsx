"use client";

import * as React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar as CalendarComponent } from "./calendar";
import { format, parse, isValid } from "date-fns";

interface BirthdayInputProps {
  value: Date | string | undefined;
  onChange: (date: Date | string) => void;
  placeholder?: string;
}

export function BirthdayInput({
  value,
  onChange,
  placeholder = "MM/DD/YYYY or select date",
}: BirthdayInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      const date = value instanceof Date ? value : new Date(value);
      if (isValid(date)) {
        setInputValue((prev) =>
          prev === "" ? format(date, "MM/dd/yyyy") : prev,
        );
      }
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 0) {
      if (input.length <= 2) {
        setInputValue(input);
      } else if (input.length <= 4) {
        const formatted = `${input.slice(0, 2)}/${input.slice(2)}`;
        setInputValue(formatted);
      } else {
        const formatted = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4, 8)}`;
        setInputValue(formatted);
        if (formatted.length === 10) {
          const parsed = parse(formatted, "MM/dd/yyyy", new Date());
          if (isValid(parsed)) {
            onChange(parsed);
          }
        }
      }
    } else {
      setInputValue("");
      onChange("");
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let pastedText = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (pastedText.length >= 8) {
      pastedText = pastedText.slice(0, 8);
      const formatted = `${pastedText.slice(0, 2)}/${pastedText.slice(2, 4)}/${pastedText.slice(4, 8)}`;
      setInputValue(formatted);
      parseAndUpdate(formatted);
    }
  };

  const parseAndUpdate = (dateStr: string) => {
    const parsed = parse(dateStr, "MM/dd/yyyy", new Date());

    if (isValid(parsed)) {
      onChange(parsed);
    }
  };

  // Handle blur to validate and update
  const handleBlur = () => {
    if (inputValue.length === 10) {
      // Full format MM/DD/YYYY
      parseAndUpdate(inputValue);
    }
  };

  // Handle date picker selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "MM/dd/yyyy");
      setInputValue(formatted);
      onChange(date);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleInputChange}
        onPaste={handlePaste}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={10}
        className="flex-1"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            type="button"
            className="h-10 w-10 bg-transparent"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="single"
            selected={
              inputValue.length === 10
                ? parse(inputValue, "MM/dd/yyyy", new Date())
                : undefined
            }
            onSelect={handleDateSelect}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
