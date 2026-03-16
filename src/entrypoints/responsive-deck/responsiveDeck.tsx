import { Input } from "@/components/Input";
import { useGetResponsiveDeckState } from "@/hooks/global/globalState";
import { Globe } from "lucide-react";

const DEVICES = [
  { id: "mobile", name: "iPhone 6/7/8", width: 375, height: 667 },
  { id: "tablet", name: "iPad", width: 768, height: 1024 },
  { id: "laptop", name: "General Laptop", width: 1024, height: 800 },
  { id: "desktop", name: "MacBook Pro", width: 1440, height: 900 },
];

export default function ResponsiveDeck() {
  const { url, isUrlValid } = useGetResponsiveDeckState();

  const [zoom, setZoom] = useState(0.6);

  return (
    <main className="bg-bg-primary  min-h-screen py-3 px-4">
      <header className={"flex gap-4"}>
        <div className={"w-full"}>
          <Input />
        </div>

        {/* Start of: The Zoom Slider Control */}

        {isUrlValid && url && (
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="text-sm text-gray-500 font-medium">Zoom</span>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 accent-blue-600"
            />
            <span className="text-sm text-gray-700 w-8 text-right font-mono">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        )}

        {/* End of: The Zoom Slider Control */}
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
