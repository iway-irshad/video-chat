import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { LogOutIcon, ShipWheelIcon, UserXIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamly
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <NotificationBell />
          </div>

          {/* TODO */}
          <ThemeSelector />

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar cursor-pointer">
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-lg mt-3">
              <li>
                <Link to="/rejected-requests" className="flex items-center gap-2">
                  <UserXIcon className="h-4 w-4" />
                  Rejected Requests
                </Link>
              </li>
            </ul>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;