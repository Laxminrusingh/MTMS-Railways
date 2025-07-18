import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, User, FileText, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddTourProgrammeFormProps {
  onClose: () => void;
}

const AddTourProgrammeForm = ({ onClose }: AddTourProgrammeFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    officer: '',
    leavingHqOn: '',
    comingBackOn: '',
    purpose: '',
    goingTo: '',
    leaveOrDuty: 'Duty',
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('tour_programmes')
        .insert({
          user_id: user.id,
          officer: data.officer,
          from_date: data.leavingHqOn,
          to_date: data.comingBackOn,
          to_location: data.goingTo,
          from_location: null,
          duty_leave: data.leaveOrDuty,
          purpose: data.purpose,
          status: 'active',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-programmes'] });
      window.alert('Tour programme added successfully!');
      onClose();
    },
    onError: (error: any) => {
      window.alert('Failed to add tour programme: ' + (error?.message || error));
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

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar size={24} />
            Add Tour Programme
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Tour Programme/Leave Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Officer's Name:
              </label>
              <input
                type="text"
                name="officer"
                value={formData.officer}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leaving HQ on:
              </label>
              <input
                type="datetime-local"
                name="leavingHqOn"
                value={formData.leavingHqOn}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coming Back on:
              </label>
              <input
                type="datetime-local"
                name="comingBackOn"
                value={formData.comingBackOn}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose:
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={2}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter Purpose"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Going to:
              </label>
              <input
                type="text"
                name="goingTo"
                value={formData.goingTo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave or Duty:
              </label>
              <select
                name="leaveOrDuty"
                value={formData.leaveOrDuty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Duty">Duty</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={addMutation.isPending}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save size={20} />
            {addMutation.isPending ? 'Adding...' : 'Add Programme'}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <X size={20} />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTourProgrammeForm;
