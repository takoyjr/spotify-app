import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <div className="w-full bg-212121 rounded-lg p-6 mb-2 flex flex-col mob-round mm ">
      <ul className="text-lg flex flex-col font-bold mob-flex-row navbar-header">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-white mb-2"
              : "mb-2 hover:cursor-pointer text-gray-400 hover:text-white"
          }
        >
          <li className="flex items-center">
            <i className="fa-solid fa-house"></i>
            <span className="ml-4 ">Main</span>
          </li>
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive
              ? "text-white"
              : "hover:cursor-pointer text-gray-400 hover:text-white"
          }
        >
          <li className="flex items-center">
            <i className="fa-solid fa-magnifying-glass"></i>
            <span className="ml-4 ">Search</span>
          </li>
        </NavLink>
      </ul>
    </div>
  );
}
