import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://dark-voice-ab4b.rapidstillz.workers.dev/admin")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="text-white p-10">

      <h1 className="text-2xl mb-6">Admin</h1>

      {data.map((item, i) => (
        <div key={i} className="border p-4 mb-4">

          <div>Type: {item.data.type}</div>
          <div>Track: {item.data.trackId}</div>

          {item.data.email && <div>Email: {item.data.email}</div>}
          {item.data.name && <div>Name: {item.data.name}</div>}
          {item.data.company && <div>Company: {item.data.company}</div>}
          {item.data.usage && <div>Usage: {item.data.usage}</div>}

        </div>
      ))}

    </div>
  );
}
