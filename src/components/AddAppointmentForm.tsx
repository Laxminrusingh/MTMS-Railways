import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, MapPin, Users, FileText, Save, X } from 'lucide-react';

const AddAppointmentForm = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    appointmentWith: '',
    appointmentMeeting: '',
    venue: '',
    purpose: '',
    participants: '',
    priority: 'medium',
    reminderTime: '30',
    tourProgrammeId: ''
  });

  // Fetch tour programmes for linking
  const { data: tourProgrammes = [] } = useQuery({
    queryKey: ['tour-programmes-for-appointment'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tour_programmes')
        .select('id, officer, purpose, from_date, to_date')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('from_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          appointment_date: data.appointmentDate,
          appointment_time: data.appointmentTime,
          appointment_with: data.appointmentWith,
          appointment_meeting: data.appointmentMeeting,
          venue: data.venue,
          purpose: data.purpose,
          participants: data.participants || null,
          priority: data.priority,
          reminder_time: parseInt(data.reminderTime),
          tour_programme_id: data.tourProgrammeId || null,
          status: 'confirmed'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      handleReset();
      alert('Appointment scheduled successfully!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleReset = () => {
    setFormData({
      appointmentDate: '',
      appointmentTime: '',
      appointmentWith: '',
      appointmentMeeting: '',
      venue: '',
      purpose: '',
      participants: '',
      priority: 'medium',
      reminderTime: '30',
      tourProgrammeId: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar size={24} />
          Add New Appointment
        </h2>
        <button
          type="button"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              window.dispatchEvent(new CustomEvent('switchToAppointments'));
            }
          }}
          className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md font-medium transition-colors"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Appointment Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment With *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="appointmentWith"
                  value={formData.appointmentWith}
                  onChange={handleChange}
                  placeholder="e.g., DRM Office, Station Manager"
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Conference Room A, DRM Office"
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose/Agenda *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the purpose and agenda of the meeting..."
              required
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors font-medium disabled:opacity-50"
          >
            <Save size={20} />
            {addMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md transition-colors font-medium"
          >
            <X size={20} />
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointmentForm;
