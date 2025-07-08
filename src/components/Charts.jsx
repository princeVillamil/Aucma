import { useState, useRef, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getDocumentById } from "../firebase/firestore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getAuth } from "firebase/auth";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const dynamicColors = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#22D3EE",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#F472B6",
  "#34D399",
  "#F87171",
  "#FBBF24",
  "#E879F9",
  "#A855F7",
  "#14B8A6",
  "#06B6D4",
  "#F43F5E",
  "#8B5CF6",
];

function ClientPieCharts({ clientList }) {
  const [openChart, setOpenChart] = useState(null);
  const chartRef = useRef(null);
  clientList = clientList.filter(
    (client) => client.status?.toLowerCase() !== "cancelled"
  );

  useEffect(() => {
    if (chartRef.current) setTimeout(() => chartRef.current.resize(), 100);
  }, [openChart]);

  if (!clientList || clientList.length === 0) {
    return (
      <section className="container my-10 p-2 mx-auto sm:p-4 dark:text-gray-800">
        <h2 className="mb-4 text-2xl font-semibold leading-tight">
          Request Analytics
        </h2>
        <div className="text-center text-gray-500 italic h-[300px] flex items-center justify-center">
          No data available.
        </div>
      </section>
    );
  }

  const statusCounts = {
    Scheduled: 0,
    "In Progress": 0,
    Completed: 0,
    Pending: 0,
  };
  const addressCounts = {};

  clientList.forEach((client) => {
    const status = client.status || "Pending";
    if (statusCounts[status] !== undefined) statusCounts[status]++;
    else statusCounts.Pending++;

    const area = client.address?.split(",")[0] || "Unknown";
    addressCounts[area] = (addressCounts[area] || 0) + 1;
  });

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", onClick: null },
      datalabels: { display: false },
    },
  };

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Request Status",
        data: Object.values(statusCounts),
        backgroundColor: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const addressData = {
    labels: Object.keys(addressCounts),
    datasets: [
      {
        label: "Requests by Address",
        data: Object.values(addressCounts),
        backgroundColor: dynamicColors.slice(
          0,
          Object.keys(addressCounts).length
        ),
        borderWidth: 1,
      },
    ],
  };

  const technicianData = useMemo(() => {
    const technicianCounts = {};

    clientList.forEach((client) => {
      const name = client.technician || "No Technician Assigned";
      technicianCounts[name] = (technicianCounts[name] || 0) + 1;
    });

    return {
      labels: Object.keys(technicianCounts),
      datasets: [
        {
          label: "Requests by Technician",
          data: Object.values(technicianCounts),
          backgroundColor: dynamicColors.slice(
            0,
            Object.keys(technicianCounts).length
          ),
          borderWidth: 1,
        },
      ],
    };
  }, [clientList]);

  const renderChart = (id, title, data) => (
    <div
      key={id}
      onClick={() => setOpenChart(id)}
      className="bg-white p-4 rounded-xl cursor-pointer group relative"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="absolute top-2 right-2 text-xs text-gray-400 group-hover:opacity-100 opacity-0 transition">
        Click to enlarge
      </div>
      <div className="h-[300px] relative">
        <Pie data={data} options={commonOptions} />
      </div>
    </div>
  );

  const getCurrentChartData = () => {
    if (openChart === "status") return statusData;
    if (openChart === "address") return addressData;
    return technicianData;
  };

  const getCurrentLabels = () => {
    if (openChart === "status") return statusData.labels;
    if (openChart === "address") return addressData.labels;
    return technicianData.labels;
  };

  const getCurrentColors = () => {
    if (openChart === "status") return statusData.datasets[0].backgroundColor;
    if (openChart === "address") return addressData.datasets[0].backgroundColor;
    return technicianData.datasets[0].backgroundColor;
  };

  const handleExportAsPDF = async () => {
    const input = document.getElementById("chart-dialog");
    if (!input) return alert("Chart container not found.");

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const generatedBy =
      currentUser?.displayName || currentUser?.email || "Anonymous";

    pdf.setFontSize(10);
    pdf.text(`Generated on: ${formattedDate}`, margin, 10);
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      20,
      pageWidth - 2 * margin,
      Math.min(imgHeight, pageHeight - 40)
    );
    pdf.text(`Page 1 | Generated by: ${generatedBy}`, margin, pageHeight - 10);
    pdf.save(`chart-${openChart}-${now.toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-xl bg-white py-6 px-6 mx-10">
          {renderChart("status", "Status Breakdown", statusData)}
          {renderChart("address", "Requests by Address", addressData)}
          {technicianData &&
            renderChart("technician", "Requests by Technician", technicianData)}
        </div>
      </section>

      {openChart && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center">
          <div
            id="chart-dialog"
            className="bg-white p-4 rounded-xl w-[90vw] max-w-4xl h-[80vh] relative overflow-auto"
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg"
              onClick={() => setOpenChart(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">
              {openChart === "status"
                ? "Status Breakdown"
                : openChart === "address"
                ? "Requests by Address"
                : "Requests by Technician"}
            </h3>
            <div className="w-full max-w-4xl mx-auto h-[500px] flex items-center justify-center gap-6">
              <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[60%] h-full relative">
                <Pie
                  ref={chartRef}
                  key={openChart}
                  data={getCurrentChartData()}
                  options={{
                    ...commonOptions,
                    plugins: {
                      ...commonOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                  plugins={[ChartDataLabels]}
                />
                <button
                  onClick={handleExportAsPDF}
                  className="absolute top-2 left-2 p-2 text-blue-600 hover:text-blue-800"
                  title="Download PDF"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[40%] h-full overflow-auto">
                <h4 className="text-md font-semibold mb-2">Legend</h4>
                <ul className="space-y-2 text-sm">
                  {getCurrentLabels().map((label, i) => {
                    const data = getCurrentChartData().datasets[0].data[i];
                    return (
                      <li
                        key={`${label}-${i}`}
                        className="flex items-center gap-2 justify-between"
                      >
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

      <div
        id="export-all-charts"
        className="absolute -top-[9999px] left-0 p-6 bg-white w-[1000px] mx-auto space-y-10"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Status Breakdown
        </h2>

        {/* Status Chart */}
        <div className="flex items-start gap-6 w-full h-[300px]">
          <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[60%] h-full relative">
            <Pie data={statusData} options={commonOptions} />
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[40%] h-full overflow-auto">
            <h4 className="text-md font-semibold mb-2">Legend</h4>
            <ul className="space-y-2 text-sm">
              {statusData.labels.map((label, i) => (
                <li
                  key={`status-${label}-${i}`}
                  className="flex items-center gap-2 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor:
                          statusData.datasets[0].backgroundColor[i],
                      }}
                    ></span>
                    {label}
                  </div>
                  <span className="font-semibold">
                    {statusData.datasets[0].data[i]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Requests by Address
        </h2>

        {/* Address Chart */}
        <div className="flex items-start gap-6 w-full h-[300px]">
          <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[60%] h-full relative">
            <Pie data={addressData} options={commonOptions} />
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[40%] h-full overflow-auto">
            <h4 className="text-md font-semibold mb-2">Legend</h4>
            <ul className="space-y-2 text-sm">
              {addressData.labels.map((label, i) => (
                <li
                  key={`address-${label}-${i}`}
                  className="flex items-center gap-2 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor:
                          addressData.datasets[0].backgroundColor[i],
                      }}
                    ></span>
                    {label}
                  </div>
                  <span className="font-semibold">
                    {addressData.datasets[0].data[i]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Requests by Technician
        </h2>

        {/* Technician Chart */}
        <div className="flex items-start gap-6 w-full h-[300px]">
          <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[60%] h-full relative">
            <Pie data={technicianData} options={commonOptions} />
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-md flex-1 max-w-[40%] h-full overflow-auto">
            <h4 className="text-md font-semibold mb-2">Legend</h4>
            <ul className="space-y-2 text-sm">
              {technicianData.labels.map((label, i) => (
                <li
                  key={`tech-${label}-${i}`}
                  className="flex items-center gap-2 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor:
                          technicianData.datasets[0].backgroundColor[i],
                      }}
                    ></span>
                    {label}
                  </div>
                  <span className="font-semibold">
                    {technicianData.datasets[0].data[i]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientPieCharts;
