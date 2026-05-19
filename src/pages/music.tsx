import { useEffect, useState } from "react";

type Market = "western" | "indian" | "arab" | "global";

type Version = {
  name: string;
  url: string;
};

type Track = {
  id: number;
  title: string;
  artist: string;
  markets: Market[];
  releaseType: "featured" | "new" | "standard";
  versions: Version[];
  createdAt: number;
};

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [market, setMarket] = useState<Market>("western");

  useEffect(() => {
    const data = localStorage.getItem("tracks_v2");
    if (data) {
      setTracks(JSON.parse(data));
    }
  }, []);

  // FILTER by market
  const filtered = tracks.filter(
    (t) => t.markets.length === 0 || t.markets.includes(market)
  );

  // SORT
  const sorted = [...filtered].sort((a, b) => {
    const order = { featured: 0, new: 1, standard: 2 };
    return order[a.releaseType] - order[b.releaseType];
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-serif mb-8">Music</h1>

      {/* Market Selector */}
      <div className="flex gap-3 mb-8">
        {["western", "indian", "arab", "global"].map((m) => (
          <button
            key={m}
            onClick={() => setMarket(m as Market)}
            className={`px-4 py-2 text-xs uppercase border ${
              market === m ? "bg-white text-black" : ""
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Tracks */}
      <div className="space-y-6">
        {sorted.length === 0 && (
          <p className="text-gray-500">No tracks yet</p>
        )}

        {sorted.map((t) => (
          <div
            key={t.id}
            className="border border-gray-700 p-5 space-y-3"
          >
            <div>
              <h2 className="text-xl font-serif">{t.title}</h2>
              <p className="text-sm text-gray-400">{t.artist}</p>
            </div>

            <div className="text-xs text-gray-500">
              {t.releaseType.toUpperCase()} • {t.markets.join(", ")}
            </div>

            {/* Versions */}
            <div className="space-y-2">
              {t.versions.map((v, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm">{v.name}</span>

                  {v.url && (
                    <audio controls src={v.url} className="h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
