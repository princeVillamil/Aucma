import { useState } from "react";

export default function Alert({errorList, type="success"}) {
  const [visible, setVisible] = useState(true);

  const colors = {
    info: "text-blue-600 border-blue-700 bg-blue-50",
    danger: "text-red-600 border-red-700 bg-red-50",
    success: "text-green-600 border-green-700 bg-green-50",
    warning: "text-yellow-600 border-yellow-700 bg-yellow-50",
    neutral: "text-gray-600 border-gray-700 bg-gray-50",
  };

  if (!visible) return null;

  return (
    <div
      className={`flex items-start justify-between p-4 mb-4 text-sm border rounded-lg ${colors[type]}`}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="shrink-0 inline w-4 h-4 me-3 mt-0.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <div>
            {errorList.map((alert)=>{
                return <><span className="font-medium">{alert.title}</span> <br/></>
            })}
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-lg font-bold leading-none focus:outline-none"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
