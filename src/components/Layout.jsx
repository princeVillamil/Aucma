import Navbar from "./Navbar";
import Header from "./Header";

export default function Layout({ children, currentPage, headerType="admin" }) {
  console.log(currentPage)
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen bg-gray-50">
      <aside className="bg-white border-r border-gray-200">
        <Navbar headerType={headerType}/>
      </aside>

      <main className="">
        <Header currentPage={currentPage} headerType={headerType}/>
        {children}
      </main>
    </div>
  );
}