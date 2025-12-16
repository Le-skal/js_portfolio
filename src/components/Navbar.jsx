import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LanguageToggle } from "./LanguageToggle";

export const Navbar = ({ hideLanguageToggle = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.screenY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed w-full z-40 transition-all duration-300 border-b",
        isScrolled
          ? "py-4 bg-background/95 backdrop-blur-md border-gray-800"
          : "py-8 bg-transparent border-transparent"
      )}
    >
      <div className="w-full flex items-center justify-end px-6 md:px-12 lg:px-16">
        {/* Language toggle - absolutely positioned */}
        <div
          className={cn(
            "absolute left-6 md:left-12 lg:left-16 top-4 transition-all duration-500",
            hideLanguageToggle ? "opacity-0 pointer-events-none translate-x-[-20px]" : "opacity-100 pointer-events-auto translate-x-0"
          )}
        >
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
};
