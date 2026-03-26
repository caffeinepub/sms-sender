import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-5 shadow-card">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tight">
            SMS Sender
          </h1>
          <p className="text-muted-foreground text-base">
            Send free SMS to any country worldwide
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-card-foreground mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to start sending messages
            </p>
          </div>

          <Button
            data-ocid="login.primary_button"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="w-full h-12 text-base font-semibold rounded-xl"
            size="lg"
          >
            {isLoggingIn || isInitializing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg
                role="img"
                aria-label="Google"
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <title>Google</title>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {isLoggingIn ? "Signing in..." : "Continue with Google"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-5 leading-relaxed">
            Secure authentication powered by Internet Identity.
            <br />
            No password required.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["🌍 All Countries", "⚡ Free SMS", "📋 Message History"].map(
            (feat) => (
              <span
                key={feat}
                className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium"
              >
                {feat}
              </span>
            ),
          )}
        </div>
      </motion.div>
    </div>
  );
}
