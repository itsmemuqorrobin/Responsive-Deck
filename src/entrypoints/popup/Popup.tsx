"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader } from "lucide-react";
import {
  getRegisteredOptionsPath,
  isSameExtensionPage,
} from "@/utils/urlMatch";
import { EXTENSION_NAME } from "@/utils/const";

function PopupPage() {
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

  const [isOnOptionsPage, setIsOnOptionsPage] = useState(false);
  const optionsUrl = useMemo(() => {
    const path = getRegisteredOptionsPath();
    return path ? browser.runtime.getURL(path) : "";
  }, []);

  const [hasDashboardTab, setHasDashboardTab] = useState(false);

  useEffect(() => {
    const checkActiveTab = async () => {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      const url = tab?.url ?? "";

      setCurrentTabUrl(url);
      if (!optionsUrl) {
        setIsOnOptionsPage(false);
        return;
      }

      setIsOnOptionsPage(isSameExtensionPage(url, optionsUrl));
    };

    const checkHasDashboardTab = async () => {
      const tabs = await browser.tabs.query({});
      const existingTab = tabs.find((tab) => {
        const url = tab.url ?? "";
        return isSameExtensionPage(url, optionsUrl);
      });

      setHasDashboardTab(!!existingTab);
    };

    checkActiveTab();
    checkHasDashboardTab();
  }, [optionsUrl]);

  const openOrFocusToResponsiveDeck = async () => {
    if (isOnOptionsPage) return;

    const tabs = await browser.tabs.query({});
    const existingTab = tabs.find((tab) => {
      const url = tab.url ?? "";
      return isSameExtensionPage(url, optionsUrl);
    });

    if (!existingTab) {
      const newTab = await browser.tabs.create({
        url: optionsUrl,
        active: true,
      });

      if (newTab.windowId != null) {
        await browser.windows.update(newTab.windowId, { focused: true });
      }
    } else {
      await browser.tabs.update(existingTab?.id, { active: true });

      if (existingTab?.windowId != null) {
        await browser.windows.update(existingTab.windowId, { focused: true });
      }
    }
  };

  return (
    <section className="px-8 py-6  min-w-80 max-w-90 mx-auto">
      <div className="text-center">
        {isloading && (
          <Loader className="text-primary animate-spin [animation-duration:1.6s]" />
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!isloading && !error && (
          <div className={""}>
            {isOnOptionsPage && (
              <div>
                <h1 className="text-xl mb-2 "> {EXTENSION_NAME} </h1>
                <p>You are on the main page</p>
              </div>
            )}

            {hasDashboardTab && !isOnOptionsPage && (
              <div>
                <h1 className="text-xl mb-2 "> {EXTENSION_NAME} Available </h1>
                <p className="text-sm text-black text-center ">
                  You already have the {EXTENSION_NAME} opened in another tab
                </p>
              </div>
            )}

            {!hasDashboardTab && !isOnOptionsPage && (
              <div>
                <h1 className="text-xl mb-2 ">Currently active URL </h1>
                <p className="text-sm text-gray-500 font-roboto_mono text-center  text-ellipsis truncate ">
                  {currentTabUrl}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {!error && !isloading && (
        <>
          {isOnOptionsPage && (
            <div className="mt-6 flex items-center justify-center gap-2"></div>
          )}

          {hasDashboardTab && !isOnOptionsPage && (
            <div className="mt-6 w-full ">
              <button
                className="py-2 px-4 bg-primary text-white font-poppins text-sm cursor-pointer rounded-md w-full
          "
                onClick={openOrFocusToResponsiveDeck}
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {!hasDashboardTab && !isOnOptionsPage && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                className="py-2 px-4 bg-tertiary text-white font-poppins text-sm cursor-pointer rounded-md
          "
              >
                Go with current URL
              </button>
              <button
                className="py-2 px-4 bg-primary text-white font-poppins text-sm cursor-pointer rounded-md
          "
                onClick={openOrFocusToResponsiveDeck}
              >
                Open Dashboard
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default PopupPage;
