import React from 'react';
import { Calendar, Clock, TrendingUp, AlertCircle, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!user) return [];
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          tour_programmes (
            officer,
            purpose
          )
        `)
        .eq('user_id', user.id)
        .gte('appointment_date', todayStr)
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: tourProgrammes = [], isLoading: isLoadingTourProgrammes } = useQuery({
    queryKey: ['dashboard-tour-programmes'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tour_programmes')
        .select('*')
        .eq('user_id', user.id)
        .order('from_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDutyLeaveColor = (dutyLeave: string) => {
    switch (dutyLeave) {
      case 'duty': return 'bg-blue-500';
      case 'leave': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    East Coast Railway Management System
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 lg:ml-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        {/* Appointments and Meetings */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Appointments & Meetings</h2>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ) : appointments.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {appointments.slice(0, 6).map((appointment, index) => (
                    <li key={appointment.id}>
                      <div className="relative pb-8">
                        {index !== Math.min(appointments.length, 6) - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(appointment.status)}`}>
                              <Clock className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {appointment.appointment_meeting}
                              </p>
                              <p className="text-sm text-gray-500">
                                with {appointment.appointment_with}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {appointment.venue}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <div>{formatDate(appointment.appointment_date)}</div>
                              <div className="text-xs">{formatTime(appointment.appointment_time)}</div>
                              <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(appointment.status)}`}>
                                  {appointment.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {appointments.length > 6 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Showing 6 of {appointments.length} appointments
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new appointment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tour Programmes Summary */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Recent Tour Programmes</h2>
            </div>
            {isLoadingTourProgrammes ? (
              <div className="animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ) : tourProgrammes.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {tourProgrammes.slice(0, 5).map((programme, index) => (
                    <li key={programme.id}>
                      <div className="relative pb-6">
                        {index !== Math.min(tourProgrammes.length, 5) - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getDutyLeaveColor(programme.duty_leave)}`}> 
                              <User className="h-4 w-4 text-purple-700" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {programme.officer} <span className="text-xs text-gray-500 ml-2">({programme.duty_leave})</span>
                              </p>
                              <p className="text-xs text-gray-500">
                                {programme.purpose}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {programme.from_location ? `From: ${programme.from_location}` : ''} {programme.to_location ? `To: ${programme.to_location}` : ''}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <div>{formatDate(programme.from_date)} - {formatDate(programme.to_date)}</div>
                              <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(programme.status)}`}>
                                  {programme.status || 'active'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {tourProgrammes.length > 5 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Showing 5 of {tourProgrammes.length} tour programmes
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tour programmes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new tour programme.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
