import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, Edit, Trash2, Plus } from 'lucide-react';

const AppointmentsTable = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!user) return [];
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
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const handleEditAppointment = (appointmentId: string) => {
    console.log('Editing appointment:', appointmentId);
    setEditingAppointment(appointmentId);
    // Switch to add appointment tab with edit mode
    const event = new CustomEvent('switchToAddAppointment', { 
      detail: { editMode: true, appointmentId } 
    });
    window.dispatchEvent(event);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.appointment_meeting.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (fromDate) {
      matchesDate = matchesDate && new Date(appointment.appointment_date) >= new Date(fromDate);
    }
    if (toDate) {
      matchesDate = matchesDate && new Date(appointment.appointment_date) <= new Date(toDate);
    }
    return matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  const handleAddNewAppointment = () => {
    // This will be handled by the parent component (Index.tsx) to switch tabs
    const event = new CustomEvent('switchToAddAppointment');
    window.dispatchEvent(event);
  };

  // Helper to get row color based on date
  const getRowColor = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    today.setHours(0,0,0,0);
    date.setHours(0,0,0,0);
    const diff = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 0) return 'bg-green-200'; // today
    if (diff === 1) return 'bg-yellow-200'; // tomorrow
    return 'bg-blue-100'; // other days
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Appointments & Meetings</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddNewAppointment}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              <Plus size={20} />
              Add New Appointment
            </button>
            
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="From date"
            />
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="To date"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment/Meeting</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className={`hover:bg-gray-50 transition-colors ${getRowColor(appointment.appointment_date)}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatDate(appointment.appointment_date)}</div>
                  <div className="text-sm text-gray-500">{formatTime(appointment.appointment_time)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{appointment.appointment_with}</div>
                  <div className="text-sm text-gray-500">{appointment.appointment_meeting}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.venue}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={appointment.purpose}>
                    {appointment.purpose}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditAppointment(appointment.id)}
                      className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                      title="Edit appointment"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteMutation.mutate(appointment.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                      title="Delete appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No appointments found matching your criteria.</p>
        </div>
      )}

      {/* Legend for row colors */}
      <div className="flex gap-4 mt-4 px-6 pb-6">
        <div className="flex items-center gap-2"><span className="inline-block w-6 h-6 bg-green-200 border rounded"></span> Today</div>
        <div className="flex items-center gap-2"><span className="inline-block w-6 h-6 bg-yellow-200 border rounded"></span> Tomorrow</div>
        <div className="flex items-center gap-2"><span className="inline-block w-6 h-6 bg-blue-100 border rounded"></span> Other Days</div>
      </div>
    </div>
  );
};

export default AppointmentsTable;
