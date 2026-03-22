import { EXTENSION_MESSAGES } from "@/utils/const";

export default defineContentScript({
  matches: ["<all_urls>"],
  allFrames: true,
  main(ctx) {
    // if main extensions tab, then do nothing
    if (window.top === window.self) return;

    let isSyncing = false;

    window.addEventListener(
      "scroll",
      () => {
        if (isSyncing) return;

        //   START OF: Converting to percentage
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        if (scrollableHeight <= 0) return;

        const percent = window.scrollY / scrollableHeight;

        //   END OF: Converting to percentage

        window.parent.postMessage(
          {
            type: `${EXTENSION_MESSAGES.DECK_SCROLL}`,
            percent: percent,
            source: window.name,
          },
          "*",
        );
      },
      { passive: true },
    );

    window.addEventListener("message", (e) => {
      if (e.data?.type === EXTENSION_MESSAGES.DECK_SET_SCROLL) {
        isSyncing = true;

        const targetY =
          e.data.percent *
          (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: targetY, behavior: "instant" });

        setTimeout(() => {
          isSyncing = false;
        }, 50);
      }
    });
  },
});
