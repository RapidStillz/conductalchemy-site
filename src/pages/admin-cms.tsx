import { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const API = "https://dark-voice-ab4b.rapidstillz.workers.dev";

type Lead = {
  id: string;
  name: string;
  track: string;
  company: string;
  email: string;
  priority: string;
  status: string;
  notes?: string;
};

const STATUSES = ["NEW", "CONTACTED", "WON"];

function Card({ lead, onSelect }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(lead)}
      style={{
        ...style,
        background: "#1a1a1d",
        padding: 12,
        marginTop: 10,
        borderRadius: 8,
        cursor: "grab",
        borderLeft:
          lead.priority === "HIGH"
            ? "4px solid red"
            : lead.priority === "MEDIUM"
            ? "4px solid orange"
            : "4px solid green",
      }}
    >
      <strong>{lead.name}</strong>
      <div>{lead.track}</div>
      <div>{lead.company}</div>
    </div>
  );
}

function Column({ status, leads, onSelect }: any) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        background: "#111",
        padding: 10,
        borderRadius: 10,
        minHeight: 300,
      }}
    >
      <h3>{status}</h3>
      {leads.map((lead: Lead) => (
        <Card key={lead.id} lead={lead} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function AdminCMS() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [usageType, setUsageType] = useState("Film");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    fetch(`${API}/leads`)
      .then((res) => res.json())
      .then(setLeads);
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const id = active.id;
    const newStatus = over.id;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: newStatus } : l
      )
    );

    await fetch(`${API}/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  const generateQuote = () => {
    if (!selected) return;

    let price = 0;

    if (usageType === "Film") price = 1500;
    if (usageType === "TV") price = 1000;
    if (usageType === "Ads") price = 2000;
    if (usageType === "Social") price = 500;

    setQuote(`Hi ${selected.name},

Thanks for your interest in "${selected.track}".

Based on your intended use (${usageType}), the licensing fee would be:

£${price}

Let me know if you'd like to proceed.

Best,
Conduct Alchemy`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0b0b0c", color: "#fff" }}>
      {/* BOARD */}
      <div style={{ flex: 3, padding: 20 }}>
        <h1>Conduct Alchemy — Leads</h1>

        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
          <div style={{ display: "flex", gap: 20 }}>
            {STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                leads={leads.filter((l) => l.status === status)}
                onSelect={setSelected}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* SIDE PANEL */}
      {selected && (
        <div style={{ flex: 1, background: "#111", padding: 20 }}>
          <h2>{selected.name}</h2>
          <p>{selected.email}</p>
          <p>{selected.company}</p>

          <hr />

          <h3>Generate Quote</h3>

          <select
            value={usageType}
            onChange={(e) => setUsageType(e.target.value)}
          >
            <option>Film</option>
            <option>TV</option>
            <option>Ads</option>
            <option>Social</option>
          </select>

          <br /><br />
          <button onClick={generateQuote}>Generate Quote</button>

          <br /><br />
          <textarea
            value={quote}
            readOnly
            style={{ width: "100%", height: 150 }}
          />

          <br /><br />
          <button onClick={() => navigator.clipboard.writeText(quote)}>
            Copy Quote
          </button>
        </div>
      )}
    </div>
  );
}
