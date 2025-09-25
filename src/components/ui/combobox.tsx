"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Định nghĩa kiểu danh sách
type ListType = {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
};

interface ComboboxProps<T extends ListType> {
  data: T[]; // Dữ liệu để hiển thị danh sách
  label?: string; // Nhãn mặc định
  placeholder?: string; // Placeholder tuỳ chỉnh
  selectedItem: string;
  handleSelect: (selected: T) => void; // Hàm callback khi chọn một item
  showSearch?: boolean;
}

export function Combobox<T extends ListType>({
  data,
  label = "Tùy chọn",
  placeholder = "Search...",
  selectedItem,
  handleSelect,
  showSearch = true
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedItem ? selectedItem : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {
            showSearch && (
              <CommandInput placeholder={placeholder} className="h-9" />
            )
          }
          <CommandList>
            <CommandEmpty>Không tìm thấy</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name || item.value}
                  onSelect={() => {
                    setOpen(false);
                    handleSelect(item);
                  }}
                >
                  {item.name || item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedItem === item.name || selectedItem === item.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
