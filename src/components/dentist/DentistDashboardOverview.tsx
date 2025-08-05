'use client';

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useDentistAppointmentStats } from '../../hooks/useDentistAppointments';
import DentistAppointmentManager from './DentistAppointmentManager';

interface DentistDashboardOverviewProps {
  dentistId: string;
}

const DentistDashboardOverview: React.FC<DentistDashboardOverviewProps> = ({
  dentistId,
}) => {
  const { data: stats, isLoading: statsLoading } =
    useDentistAppointmentStats(dentistId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Appointments
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {statsLoading ? '...' : stats?.todayAppointments || 0}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/manage-dentists/${dentistId}/dashboard/today-appointments`}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View details →
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Requests
                </p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {statsLoading ? '...' : stats?.pendingRequests || 0}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/manage-dentists/${dentistId}/dashboard/all-appointments?status=PENDING`}
                className="text-sm font-medium text-yellow-600 hover:text-yellow-500"
              >
                Review now →
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  This Week Completed
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {statsLoading ? '...' : stats?.thisWeekCompleted || 0}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Great progress!</span>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming (7 days)
                </p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {statsLoading ? '...' : stats?.upcomingAppointments || 0}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/manage-dentists/${dentistId}/dashboard/all-appointments`}
                className="text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                View schedule →
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Appointments Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Today's Schedule
            </h2>
            <Link
              href={`/manage-dentists/${dentistId}/dashboard/today-appointments`}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4" />
              View Full Schedule
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Today's appointments component */}
          <div className="rounded-lg bg-white shadow-sm">
            <DentistAppointmentManager
              dentistId={dentistId}
              viewType="today"
              showHeader={false}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href={`/manage-dentists/${dentistId}/dashboard/all-appointments`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Manage All Appointments</span>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
              </Link>

              <Link
                href={`/manage-dentists/${dentistId}/dashboard/today-appointments`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Today's Appointments</span>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
              </Link>

              <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-medium">Patient Records</span>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Appointment completed
                  </p>
                  <p className="text-sm text-gray-500">
                    John Doe - Root Canal Treatment
                  </p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New appointment request
                  </p>
                  <p className="text-sm text-gray-500">
                    Sarah Smith - Teeth Cleaning
                  </p>
                  <p className="text-xs text-gray-400">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Appointment reminder sent
                  </p>
                  <p className="text-sm text-gray-500">
                    Mike Johnson - Tomorrow 2:00 PM
                  </p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentistDashboardOverview;
