import { SoundSettings } from "@/components/SoundSettings";
import { Moon, Sun } from "lucide-react";
import type * as React from "react";
import { useCallback, useEffect, useState } from "react";

export function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("daggerheart-theme");
    if (saved === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("daggerheart-theme", next);
      return next;
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-primary/30 shadow-subtle bg-gradient-to-b from-background to-card print:hidden">
      <div className="flex items-center justify-between px-4 py-3 w-full phone-layout md:desktop-layout">
        <div className="flex items-center gap-2">
          <img
            src="/assets/app-logo.png"
            alt="Dagger's Sheet"
            className="h-9 w-9 object-contain animate-logo-glow"
          />
          <h1 className="font-display text-lg font-bold tracking-wide text-foreground">
            Dagger's Sheet
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <SoundSettings />
          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="rounded-md bg-transparent border border-primary/40 text-primary hover:bg-primary/10 p-2 transition-smooth"
            data-ocid="theme.toggle_button"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-muted/40 border-t border-border py-4 mt-auto print:hidden">
      <div className="text-center text-xs text-muted-foreground">
        &copy; {year}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full px-4 py-4 animate-fade-up phone-layout md:desktop-layout">
        {children}
      </main>
      <Footer />
    </div>
  );
}
