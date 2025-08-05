'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { countries } from '../lib/countries';

type Props = {
  value: { country: string; number: string };
  onChange: (val: { country: string; number: string }) => void;
  error?: boolean;
  placeholder?: string;
};

export function PhoneNumberInput({
  value,
  onChange,
  error = false,
  placeholder = 'Phone number',
}: Props) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry =
    countries.find(c => c.code === value.country) || countries[0];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
      {/* Country Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between px-3 py-2 sm:w-auto sm:min-w-[120px] ${
              error ? 'border-red-500' : ''
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-medium">{selectedCountry.dialCode}</span>
              <span className="hidden text-sm text-gray-500 sm:inline">
                {selectedCountry.name}
              </span>
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[calc(100vw-2rem)] max-w-[280px] p-0"
          side="bottom"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandGroup className="max-h-48 overflow-y-auto sm:max-h-60">
              {countries.map(country => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dialCode}`}
                  onSelect={() => {
                    onChange({ ...value, country: country.code });
                    setOpen(false);
                  }}
                >
                  <span className="mr-2 text-lg">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    {country.dialCode}
                  </span>
                  {value.country === country.code && (
                    <Check className="text-primary ml-2 h-4 w-4 flex-shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Phone Input */}
      <Input
        type="tel"
        placeholder={placeholder}
        value={value.number}
        onChange={e => {
          const numericValue = e.target.value.replace(/\D/g, '');
          // Limit to 10 digits maximum
          if (numericValue.length <= 10) {
            onChange({
              ...value,
              number: numericValue,
            });
          }
        }}
        className={`flex-1 ${error ? 'border-red-500' : ''}`}
        pattern="[0-9]*"
        maxLength={10}
        autoComplete="tel"
      />
    </div>
  );
}
