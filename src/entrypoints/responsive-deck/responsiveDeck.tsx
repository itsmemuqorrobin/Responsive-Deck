import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/Tooltip";
import { Input } from "@/components/Input";
import { useGetResponsiveDeckState } from "@/hooks/global/globalState";
import { EXTENSION_MESSAGES } from "@/utils/const";
import { Cable, Globe, Unplug } from "lucide-react";

const DEVICES = [
  { id: "mobile", name: "iPhone 6/7/8", width: 375, height: 667 },
  { id: "tablet", name: "iPad", width: 768, height: 1024 },
  { id: "laptop", name: "General Laptop", width: 1024, height: 800 },
  { id: "desktop", name: "MacBook Pro", width: 1440, height: 900 },
];

export default function ResponsiveDeck() {
  const { url, isUrlValid } = useGetResponsiveDeckState();

  const [zoom, setZoom] = useState(0.6);
  const [toggleScrollSync, setToggleScrollSync] = useState(false);

  const handleToggleSync = () => {
    setToggleScrollSync((prev) => !prev);
  };

  useEffect(() => {
    if (!toggleScrollSync) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === EXTENSION_MESSAGES.DECK_SCROLL) {
        const all_iframes = document.querySelectorAll("iframe");

        all_iframes.forEach((iframe) => {
          if (iframe.name !== e.data?.source && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: `${EXTENSION_MESSAGES.DECK_SET_SCROLL}`,
                percent: e.data.percent,
              },
              "*",
            );
          }
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [toggleScrollSync]);

  return (
    <main className="bg-bg-primary  min-h-screen py-3 px-4">
      <header className={"flex gap-2"}>
        <div className={"w-full"}>
          <Input />
        </div>

        {/* Start of: The Zoom Slider Control */}

        <div className="flex items-center gap-3  px-1 py-1 rounded-full border border-gray-200 h-head-navigation">
          <span className="text-sm text-gray-500 font-medium">Zoom</span>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-24 accent-primary cursor-pointer"
          />
          <span className="text-sm text-gray-700 w-8 text-right font-mono">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* End of: The Zoom Slider Control */}

        {/* Start of: divider */}
        <div className="h-5 w-px bg-gray-400 my-auto" />
        {/* End of: divider */}

        {/* Start of: Scroll Sync toggle */}

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={handleToggleSync}
                className={`max-h-head-navigation  px-1 py-0.5 rounded-sm ${toggleScrollSync ? "bg-bg-secondary" : ""}`}
              >
                <Cable color="#3A4658" size={22} />
              </button>
            }
          >
            Hover
          </TooltipTrigger>
          <TooltipContent
            className={"bg-white"}
            arrowClassName="bg-white fill-white"
          >
            {toggleScrollSync ? (
              <p className="text-[12px] text-gray-700">Scroll Sync Enabled</p>
            ) : (
              <p className="text-[12px] text-gray-700">Scroll Sync Disabled</p>
            )}
          </TooltipContent>
        </Tooltip>

        {/* End of: Scroll Sync toggle */}
      </header>

      {/* Start of: Grid/Deck Section */}
      <section aria-label="Deck Grid Preview">
        {isUrlValid && url ? (
          <section className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-8">
            <div className="flex flex-row items-start justify-start gap-6 min-w-max h-full">
              {DEVICES.map((device) => {
                const scaledWidth = device.width * zoom;
                const scaledHeight = device.height * zoom;

                return (
                  <div key={device.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-gray-700 font-medium text-base">
                        {device.name}
                      </span>
                      <span className="text-gray-400 font-mono text-sm">
                        {device.width}x{device.height}
                      </span>
                    </div>

                    <div
                      className="relative bg-white shadow-xl rounded-md overflow-hidden ring-1 ring-gray-200"
                      style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                      }}
                    >
                      <iframe
                        src={url}
                        title={device.name}
                        name={device.id}
                        style={{
                          width: `${device.width}px`,
                          height: `${device.height}px`,
                          transform: `scale(${zoom})`,
                          transformOrigin: "top left",
                          border: "none",
                        }}
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        className="absolute top-0 left-0 bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className=" mt-12">
            <div className="text-center  text-gray-400">
              <Globe style={{ margin: "0 auto" }} />

              <p className="text-lg font-medium mt-1">
                Enter a URL to preview responsive layouts <br /> (e.g.
                example.com or localhost:3000)
              </p>
            </div>

            <section className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-8">
              <div className="flex flex-row items-start justify-start gap-6 min-w-max h-full">
                {DEVICES.map((device) => {
                  const scaledWidth = device.width * zoom;
                  const scaledHeight = device.height * zoom;

                  return (
                    <div key={device.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-gray-700 font-medium text-base">
                          {device.name}
                        </span>
                        <span className="text-gray-400 font-mono text-sm">
                          {device.width}x{device.height}
                        </span>
                      </div>

                      <div
                        className="relative bg-transparent border-[3px] border-gray-400 border-dashed shadow-xl rounded-md overflow-hidden ring-1 ring-gray-200 flex items-center justify-center"
                        style={{
                          width: `${scaledWidth}px`,
                          height: `${scaledHeight}px`,
                        }}
                      >
                        <p className="text-gray-400 text-sm italic">
                          Your preview will appear here
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </section>
        )}

        {/* End of: Grid/Deck Section */}
      </section>
    </main>
  );
}
