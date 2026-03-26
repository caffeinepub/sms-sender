import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Header() {
  const { clear, identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 6)}...${principal.slice(-4)}`
    : "";

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground leading-none">
              SMS Sender
            </h1>
            <p className="text-xs text-muted-foreground">
              Global free messaging
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {shortPrincipal && (
            <span className="hidden sm:block text-xs font-mono bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg border border-border">
              {shortPrincipal}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            data-ocid="header.secondary_button"
            className="h-9 px-3 rounded-xl text-sm"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
