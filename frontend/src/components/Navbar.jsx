import { NavLink } from "react-router-dom";
import {
  User, Heart, Mic2, Music, Compass,
  Mail, MessageCircle, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const mainLinks = [
  { to: "/", label: "Discover", icon: Compass, end: true },
  { to: "/liked-songs", label: "Liked Songs", icon: Heart },
  { to: "/top-artists", label: "Top Artists", icon: Mic2 },
  { to: "/top-songs", label: "Top Songs", icon: Music },
  { to: "/inbox", label: "Inbox", icon: Mail },
  { to: "/forum", label: "Forum", icon: MessageCircle },
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

      {/* Main links + spacer + logout */}
      <div className="navbar-links">
        {mainLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn("navbar-link", isActive && "navbar-link-active")
            }
          >
            <Icon className="navbar-link-icon" />
            <span className="navbar-link-label">{label}</span>
          </NavLink>
        ))}

        {/* Pushes logout to bottom on desktop */}
        <div className="navbar-spacer" />

        {/* Logout */}
        <NavLink
          to="/login"
          className={({ isActive }) =>
            cn("navbar-link", "navbar-logout-link", isActive && "navbar-link-active")
          }
        >
          <LogOut className="navbar-link-icon" />
          <span className="navbar-link-label">Logout</span>
        </NavLink>

        {/* Mobile: profile avatar */}
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
