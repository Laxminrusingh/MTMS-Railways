import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import AppointmentsTable from '../components/AppointmentsTable';
import AddAppointmentForm from '../components/AddAppointmentForm';
import TourProgrammes from '../components/TourProgrammes';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Listen for the custom event to switch to add appointment tab
  useEffect(() => {
    const handleSwitchToAddAppointment = () => {
      setActiveTab('add-appointment');
    };
    const handleSwitchToAppointments = () => {
      setActiveTab('appointments');
    };

    window.addEventListener('switchToAddAppointment', handleSwitchToAddAppointment);
    window.addEventListener('switchToAppointments', handleSwitchToAppointments);
    
    return () => {
      window.removeEventListener('switchToAddAppointment', handleSwitchToAddAppointment);
      window.removeEventListener('switchToAppointments', handleSwitchToAppointments);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <AppointmentsTable />;
      case 'add-appointment':
        return <AddAppointmentForm />;
      case 'programmes':
        return <TourProgrammes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {/* Full width header */}
      <Header onMenuToggle={toggleSidebar} />

      <div className="flex flex-1">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
