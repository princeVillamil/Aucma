

export function ClientList({clientInfo}) {
  function truncateText(text, wordLimit) {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  }
  function formatDateToLong(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
  }

  return (
    <div class="relative flex flex-col my-1 bg-white">
      <div class="mb-0 pt-3 pb-1">
        <span class="text-sm text-white font-medium bg-gray-900 py-1 px-2 border rounded-lg">
          {/* Jan 2, 2025 */}
          {formatDateToLong(clientInfo.date)}
        </span>
      </div>
      
      <div class="p-2">
        <h5 class="mb-2 text-slate-800 text-xl font-semibold">
          {clientInfo.name}
        </h5>
        <p class="text-slate-600 leading-normal font-light">
          {truncateText(
            clientInfo.description,
            10
          )}
        </p>
      </div>
      {/* <div className="flex justify-end mt-1 px-2 sm:flex-row">
        <button className="px-6 py-2 rounded-sm shadow-sm bg-gray-900 text-white">More</button>
	    </div> */}
    </div>
  );
}

export default ClientList;



