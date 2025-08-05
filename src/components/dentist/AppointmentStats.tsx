'use client';

import { Calendar, CheckCircle, Clock, Stethoscope } from 'lucide-react';
import React from 'react';

interface AppointmentStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    todayAppointments: number;
  };
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600">Total</p>
            <p className="text-2xl font-bold text-blue-900">
              {stats.total || 0}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <div className="rounded-lg bg-yellow-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {stats.pending || 0}
            </p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </div>
      <div className="rounded-lg bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-900">
              {stats.approved || 0}
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="rounded-lg bg-purple-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600">Today</p>
            <p className="text-2xl font-bold text-purple-900">
              {stats.todayAppointments || 0}
            </p>
          </div>
          <Stethoscope className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default AppointmentStats;
