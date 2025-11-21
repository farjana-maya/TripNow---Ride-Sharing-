// FILE: src/services/ExportService.js

class ExportService {
  static exportToCSV(data, filename = 'export.csv') {
    try {
      const csv = data.map(row => 
        row.map(cell => {
          const cellStr = String(cell || '');
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      ).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export to CSV failed:', error);
      return false;
    }
  }

  static exportToExcel(data, filename = 'export.xlsx') {
    return this.exportToCSV(data, filename.replace('.csv', '.xlsx'));
  }

  static formatRidesForExport(rides) {
    const headers = [
      'Ride Number', 'Rider Name', 'Rider Email', 'Rider Phone',
      'Driver Name', 'Driver Email', 'Driver Phone', 'Pickup Location',
      'Drop Location', 'Vehicle Type', 'Status', 'Distance (km)',
      'Duration (min)', 'Base Fare', 'Distance Fare', 'Time Fare',
      'Total Fare', 'Commission', 'Driver Earnings', 'Payment Method',
      'Payment Status', 'Scheduled At', 'Accepted At', 'Started At',
      'Completed At', 'Cancelled At', 'Cancellation Reason', 'Notes', 'Created At'
    ];

    const rows = rides.map(ride => [
      ride.ride_number || '', ride.rider?.name || 'N/A',
      ride.rider?.email || 'N/A', ride.rider?.phone || 'N/A',
      ride.driver?.name || 'Not Assigned', ride.driver?.email || 'N/A',
      ride.driver?.phone || 'N/A', ride.pickup_location || '',
      ride.drop_location || '', ride.vehicle_type || '',
      ride.status || '', ride.distance || '0', ride.duration || '0',
      ride.base_fare || '0', ride.distance_fare || '0', ride.time_fare || '0',
      ride.total_fare || '0', ride.commission || '0', ride.driver_earnings || '0',
      ride.payment_method || 'N/A', ride.payment_status || 'unpaid',
      ride.scheduled_at || 'N/A', ride.accepted_at || 'N/A',
      ride.started_at || 'N/A', ride.completed_at || 'N/A',
      ride.cancelled_at || 'N/A', ride.cancellation_reason || 'N/A',
      ride.notes || 'N/A', ride.created_at || ''
    ]);

    return [headers, ...rows];
  }

  static exportToJSON(data, filename = 'export.json') {
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export to JSON failed:', error);
      return false;
    }
  }
}

export default ExportService;