"use client";

import { useState, useEffect } from "react";

import ResponsiveDeck from "@/assets/responsiveDeck.svg";
import { Loader } from "lucide-react";

function App() {
  const [currentTabUrl, setCurrentTabUrl] = useState("");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const getCurrentTabUrl = async () => {
      try {
        setIsloading(true);

        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!cancelled) {
          setCurrentTabUrl(tabs[0].url || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Oops Failed to get current tab url",
          );
        }
      } finally {
        if (!cancelled) {
          setIsloading(false);
        }
      }
    };

    getCurrentTabUrl();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-8 py-6 max-w-87.5 min-w-80 mx-auto">
      <div className="">
        <h1 className="text-xl mb-2 font-roboto_mono">Currently active URL </h1>

        {isloading && (
          <Loader className="text-primary animate-spin [animation-duration:1.6s]" />
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!isloading && !error && (
          <p className="text-sm text-gray-500">{currentTabUrl}</p>
        )}
      </div>
    </section>
  );
}

export default App;
