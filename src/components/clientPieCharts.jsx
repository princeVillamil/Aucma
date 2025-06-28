import { useState, useRef, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const dynamicColors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#22D3EE', '#10B981', '#F59E0B',
  '#EF4444', '#6366F1', '#F472B6', '#34D399', '#F87171', '#FBBF24',
  '#E879F9', '#A855F7', '#14B8A6', '#06B6D4', '#F43F5E', '#8B5CF6',
];

function ClientPieCharts({ clientList }) {
  const [openChart, setOpenChart] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      setTimeout(() => chartRef.current.resize(), 100);
    }
  }, [openChart]);

  if (!clientList || clientList.length === 0) {
    return (
      <section className="container my-10 p-2 mx-auto sm:p-4 dark:text-gray-800">
        <h2 className="mb-4 text-2xl font-semibold leading-tight">Request Analytics</h2>
        <div className="text-center text-gray-500 italic h-[300px] flex items-center justify-center">
          No data available.
        </div>
      </section>
    );
  }

  const statusCounts = { completed: 0, 'in progress': 0, unfinalized: 0 };
  const warehouseCounts = {};
  const timeBuckets = { Morning: 0, Afternoon: 0, Evening: 0 };

  clientList.forEach((client) => {
    const status = client.status || 'unfinalized';
    if (statusCounts[status] !== undefined) statusCounts[status]++;

    const warehouse = client.address?.split(',')[0] || 'Unknown';
    warehouseCounts[warehouse] = (warehouseCounts[warehouse] || 0) + 1;

    const hour = parseInt(client.time?.split(':')[0], 10);
    if (!isNaN(hour)) {
      if (hour < 12) timeBuckets.Morning++;
      else if (hour < 18) timeBuckets.Afternoon++;
      else timeBuckets.Evening++;
    }
  });

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' },
        datalabels: { display: false }, 
    },
  };

  const statusData = {
    labels: ['Completed', 'In Progress', 'Unfinalized'],
    datasets: [{
      label: 'Request Status',
      data: Object.values(statusCounts),
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 1,
    }],
  };

  const warehouseData = {
    labels: Object.keys(warehouseCounts),
    datasets: [{
      label: 'Requests by Warehouse',
      data: Object.values(warehouseCounts),
      backgroundColor: dynamicColors.slice(0, Object.keys(warehouseCounts).length),
      borderWidth: 1,
    }],
  };

  const timeData = {
    labels: ['Morning (Before 12PM)', 'Afternoon (12PM–6PM)', 'Evening (After 6PM)'],
    datasets: [{
      label: 'Request Time Distribution',
      data: Object.values(timeBuckets),
      backgroundColor: ['#60A5FA', '#FBBF24', '#F87171'],
      borderWidth: 1,
    }],
  };

  const renderChart = (id, title, data) => (
    <div
      key={id}
      onClick={() => setOpenChart(id)}
      className="bg-white p-4 rounded-xl shadow-md cursor-pointer group relative"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="absolute top-2 right-2 text-xs text-gray-400 group-hover:opacity-100 opacity-0 transition">Click to enlarge</div>
      <div className="h-[300px] relative">
        <Pie data={data} options={commonOptions} />
      </div>
    </div>
  );

  const getCurrentChartData = () => {
    if (openChart === 'status') return statusData;
    if (openChart === 'warehouse') return warehouseData;
    return timeData;
  };

  const getCurrentLabels = () => {
    if (openChart === 'status') return statusData.labels;
    if (openChart === 'warehouse') return warehouseData.labels;
    return timeData.labels;
  };

  const getCurrentColors = () => {
    if (openChart === 'status') return statusData.datasets[0].backgroundColor;
    if (openChart === 'warehouse') return warehouseData.datasets[0].backgroundColor;
    return timeData.datasets[0].backgroundColor;
  };

  return (
    <>
      <section className="container my-10 p-2 mx-auto sm:p-4 dark:text-gray-800">
        <h2 className="mb-4 text-2xl font-semibold leading-tight">Request Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {renderChart('status', 'Status Breakdown', statusData)}
          {renderChart('warehouse', 'Requests per Warehouse', warehouseData)}
          {renderChart('time', 'Time of Day', timeData)}
        </div>
      </section>

      {openChart && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-[90vw] max-w-4xl h-[80vh] relative overflow-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg"
              onClick={() => setOpenChart(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">
              {openChart === 'status' ? 'Status Breakdown'
                : openChart === 'warehouse' ? 'Requests per Warehouse'
                : 'Time of Day'}
            </h3>
            <div className="w-full max-w-4xl mx-auto h-[500px] flex items-center justify-center gap-6">
              {/* Chart box */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[60%] h-full flex items-center justify-center">
                <Pie
                ref={chartRef}
                key={openChart}
                data={getCurrentChartData()}
                options={{
                    ...commonOptions,
                    plugins: {
                    ...commonOptions.plugins,
                    legend: { display: false },
                    // datalabels: {
                    //     display: true,              
                    //     color: '#fff',              
                    //     font: {
                    //     weight: 'bold',
                    //     size: 16,                 
                    //     },
                    //     formatter: (value) => value,
                    // },
                    },
                }}
                plugins={[ChartDataLabels]}
                />  
              </div>

              {/* Legend box */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[40%] h-full overflow-auto">
                <h4 className="text-md font-semibold mb-2">Legend</h4>
                <ul className="space-y-2 text-sm">
                  {getCurrentLabels().map((label, i) => {
                    const data = getCurrentChartData().datasets[0].data[i];
                    return (
                        <li key={`${label}-${i}`} className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <span
                            className="inline-block w-4 h-4 rounded-sm"
                            style={{ backgroundColor: getCurrentColors()[i] }}
                            ></span>
                            {label}
                        </div>
                        <span className="font-semibold">{data}</span>
                        </li>
                    );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientPieCharts;
