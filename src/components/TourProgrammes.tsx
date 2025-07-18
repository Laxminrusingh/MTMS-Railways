import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Calendar, MapPin, User, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddTourProgrammeForm from './AddTourProgrammeForm';

const TourProgrammes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingProgramme, setEditingProgramme] = useState<string | null>(null);

  const { data: tourProgrammes = [], isLoading } = useQuery({
    queryKey: ['tour-programmes'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tour_programmes')
        .select('*')
        .eq('user_id', user.id)
        .order('from_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tour_programmes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-programmes'] });
    },
  });

  const handleEditProgramme = (programmeId: string) => {
    console.log('Editing programme:', programmeId);
    setEditingProgramme(programmeId);
    setShowAddForm(true);
  };

  const filteredProgrammes = tourProgrammes.filter(programme => {
    const matchesSearch = programme.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (fromDate) {
      matchesDate = matchesDate && new Date(programme.from_date) >= new Date(fromDate);
    }
    if (toDate) {
      matchesDate = matchesDate && new Date(programme.from_date) <= new Date(toDate);
    }
    return matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDutyLeaveColor = (dutyLeave: string) => {
    return dutyLeave === 'Duty' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (showAddForm) {
    return <AddTourProgrammeForm onClose={() => setShowAddForm(false)} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Tour Programmes</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
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
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Programme
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProgrammes.map((programme) => (
              <tr key={programme.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-2" size={16} />
                    <div className="text-sm font-medium text-gray-900">{programme.officer}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="flex items-center text-gray-900">
                      <Calendar className="text-gray-400 mr-1" size={14} />
                      {formatDate(programme.from_date)}
                    </div>
                    <div className="flex items-center text-gray-500 mt-1">
                      <Clock className="text-gray-400 mr-1" size={14} />
                      {formatDate(programme.to_date)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {programme.from_location && (
                      <div className="flex items-center text-gray-900">
                        <MapPin className="text-gray-400 mr-1" size={14} />
                        From: {programme.from_location}
                      </div>
                    )}
                    {programme.to_location && (
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="text-gray-400 mr-1" size={14} />
                        To: {programme.to_location}
                      </div>
                    )}
                    {programme.out_to && (
                      <div className="text-gray-500 mt-1">Out to: {programme.out_to}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDutyLeaveColor(programme.duty_leave)}`}>
                    {programme.duty_leave}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={programme.purpose}>
                    {programme.purpose}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(programme.status)}`}>
                    {programme.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditProgramme(programme.id)}
                      className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                      title="Edit programme"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteMutation.mutate(programme.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                      title="Delete programme"
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

      {filteredProgrammes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tour programmes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TourProgrammes;
