'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import React from 'react';
import { AppointmentStatus } from '../../hooks/useDentistAppointments';

interface AppointmentFiltersProps {
  searchInputValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: AppointmentStatus | 'ALL';
  onStatusFilterChange: (value: AppointmentStatus | 'ALL') => void;
  dateFromFilter: string;
  onDateFromChange: (value: string) => void;
  dateToFilter: string;
  onDateToChange: (value: string) => void;
  viewType: 'all' | 'today' | 'upcoming';
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  searchInputValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFromFilter,
  onDateFromChange,
  dateToFilter,
  onDateToChange,
  viewType,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchInputValue}
            onChange={onSearchChange}
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="REJECTED">Declined</SelectItem>
            <SelectItem value="NO_SHOW">No Show</SelectItem>
            <SelectItem value="CANCELLED_BY_DENTIST">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {viewType === 'all' && (
          <>
            <input
              type="date"
              placeholder="From Date"
              value={dateFromFilter}
              onChange={e => onDateFromChange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateToFilter}
              onChange={e => onDateToChange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentFilters;
