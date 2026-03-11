import { Eye, Activity, BarChart3, FileText, Shield, HelpCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", icon: Eye, active: true },
  { label: "Patient Assessment", icon: Activity },
  { label: "Analytics Dashboard", icon: BarChart3 },
  { label: "Reports", icon: FileText },
  { label: "AI Governance", icon: Shield },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Eye className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Eye Complication Risk</span>
            <p className="text-xs text-muted-foreground">Intelligence Platform</p>
          </div>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className="gap-2 text-sm"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
