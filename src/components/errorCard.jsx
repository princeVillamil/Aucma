


function errorCard({errorMsg}) {
  return (
    <div className="flex flex-col gap-2 p-6 rounded-md shadow-md text-gray-800">
      <h2 className="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 fill-gray-900 shrink-0 text-gray-900">
          <path d="M451.671,348.569,408,267.945V184c0-83.813-68.187-152-152-152S104,100.187,104,184v83.945L60.329,348.568A24,24,0,0,0,81.432,384h86.944c-.241,2.636-.376,5.3-.376,8a88,88,0,0,0,176,0c0-2.7-.135-5.364-.376-8h86.944a24,24,0,0,0,21.1-35.431ZM312,392a56,56,0,1,1-111.418-8H311.418A55.85,55.85,0,0,1,312,392ZM94.863,352,136,276.055V184a120,120,0,0,1,240,0v92.055L417.137,352Z"></path>
          <rect width="32" height="136" x="240" y="112"></rect>
          <rect width="32" height="32" x="240" y="280"></rect>
        </svg>Error!
      </h2>
      {errorMsg.map(msg=>(
        <p className="flex-1 dark:text-gray-600">{msg}</p>
      ))}

    </div>
  )
}

export default errorCard



