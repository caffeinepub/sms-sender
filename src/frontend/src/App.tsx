import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { ComposeForm } from "./components/ComposeForm";
import { Header } from "./components/Header";
import { LoginPage } from "./components/LoginPage";
import { SmsHistory } from "./components/SmsHistory";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h2 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Compose and send SMS messages to any country, for free.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <ComposeForm />
          <div className="lg:min-h-[520px]">
            <SmsHistory />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-5 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-primary">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster />
    </div>
  );
}
