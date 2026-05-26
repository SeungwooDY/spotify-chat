import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { to: "/liked-songs", label: "Liked Songs" },
  { to: "/top-artists", label: "Top Artists" },
  { to: "/top-songs", label: "Top Songs" },
  { to: "/", label: "Discover", end: true },
  { to: "/inbox", label: "Inbox" },
  { to: "/forum", label: "Forum" },
];

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/profile" className="navbar-avatar">
        <Avatar className="h-13 w-13 border border-black bg-[#E5E5E5]">
          <AvatarImage src="" alt="profile" />
          <AvatarFallback className="bg-[#E5E5E5]">
            <User className="h-7 w-7 text-[#222222]" strokeWidth={2.5} />
          </AvatarFallback>
        </Avatar>
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
      </div>
    </nav>
  );
};

export default Navbar;
