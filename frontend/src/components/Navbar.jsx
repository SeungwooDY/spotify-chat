import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { to: "/liked-songs", label: "Liked Songs" },
  { to: "/top-artists", label: "Top Artists" },
  { to: "/top-songs", label: "Top Songs" },
  { to: "/", label: "Discover", end: true },
  { to: "/inbox", label: "Inbox" },
  { to: "/forum", label: "Forum" },
  { to: "/login", label: "Logout" },
];

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      {/* Desktop: profile section */}
      <NavLink to="/profile" className="navbar-profile-desktop">
        <Avatar className="h-12 w-12 border-2 border-white/25 bg-[#E5E5E5]">
          <AvatarImage src={user?.profileImage}
            alt={user?.displayName} />
              <AvatarFallback className="bg-[#E5E5E5]">
                <User className="h-6 w-6 text-[#222222]" strokeWidth={2.5} />
              </AvatarFallback>
        </Avatar>
          <span className="navbar-profile-label">My Profile</span>
      </NavLink>

      <div className="navbar-links">
        {navLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn("navbar-link", isActive && "navbar-link-active")
            }
          >
            {label}
          </NavLink>
        ))}
        <NavLink to="/profile" className="navbar-profile-mobile">
          <Avatar className="h-9 w-9 border border-black bg-[#E5E5E5]">
            {user?.profileImage && <AvatarImage src={user.profileImage} alt={user.displayName} />}
            <AvatarFallback className="bg-[#E5E5E5]">
              <User className="h-4 w-4 text-[#222222]" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
