import { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const API = "https://dark-voice-ab4b.rapidstillz.workers.dev";

type HistoryItem = {
  status: string;
  at: number;
};

type Lead = {
  id: string;
  name: string;
  track: string;
  company: string;
  status: string;
  value?: number;
  createdAt?: number;
  history?: HistoryItem[];
};

const STATUSES = ["NEW", "CONTACTED", "WON"];

// 🔥 TRUE CONVERSION MODEL
const getModel = (leads: Lead[]) => {
  let total = leads.length;
  let contacted = 0;
  let won = 0;

  leads.forEach((l) => {
    const history = l.history || [];

    if (history.some((h) => h.status === "CONTACTED")) contacted++;
    if (history.some((h) => h.status === "WON")) won++;
  });

  const newToContacted = total === 0 ? 0 : contacted / total;
  const contactedToWon = contacted === 0 ? 0 : won / contacted;
  const newToWon = newToContacted * contactedToWon;

  // 🔥 CONFIDENCE
  const confidence = Math.min(1, total / 20);

  return {
    newToContacted: newToContacted * confidence,
    contactedToWon: contactedToWon * confidence,
    newToWon: newToWon * confidence,
    confidence,
  };
};

// CARD
function Card({ lead, onSelect }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseUp={() => onSelect(lead)}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        background: "#1a1a1d",
        padding: 12,
        marginTop: 10,
        borderRadius: 8,
      }}
    >
      <strong>{lead.name}</strong>
      <div>{lead.track}</div>
      <div>{lead.value ? `£${lead.value}` : "No value set"}</div>
    </div>
  );
}

// COLUMN
function Column({ status, leads, onSelect }: any) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} style={{ flex: 1, background: "#111", padding: 10 }}>
      <h3>{status}</h3>
      {leads.map((l: Lead) => (
        <Card key={l.id} lead={l} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [price, setPrice] = useState(1500);

  // LOAD
  useEffect(() => {
    fetch(`${API}/leads`)
      .then((r) => r.json())
      .then((data) => {
        // 🔥 BACKFILL HISTORY
        const fixed = data.map((l: Lead) => {
          if (!l.history) {
            return {
              ...l,
              history: [
                {
                  status: "NEW",
                  at: l.createdAt || Date.now(),
                },
                ...(l.status !== "NEW"
                  ? [{ status: l.status, at: Date.now() }]
                  : []),
              ],
            };
          }
          return l;
        });

        setLeads(fixed);
      });
  }, []);

  // SAVE VALUE
  const saveDealValue = async () => {
    if (!selected) return;

    await fetch(`${API}/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selected.id,
        status: selected.status,
        value: price,
      }),
    });

    setLeads((prev) =>
      prev.map((l) =>
        l.id === selected.id ? { ...l, value: price } : l
      )
    );
  };

  // DRAG
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  const model = getModel(leads);

  const forecast = leads.reduce((sum, l) => {
    if (!l.value) return sum;

    if (l.status === "WON") return sum + l.value;
    if (l.status === "CONTACTED")
      return sum + l.value * model.contactedToWon;
    if (l.status === "NEW")
      return sum + l.value * model.newToWon;

    return sum;
  }, 0);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0b0b0c", color: "#fff" }}>
      
      <div style={{ flex: 3, padding: 20 }}>
        <h1>Conversion Intelligence</h1>

        <div style={{ marginBottom: 20 }}>
          <div>NEW → CONTACTED: {(model.newToContacted * 100).toFixed(0)}%</div>
          <div>CONTACTED → WON: {(model.contactedToWon * 100).toFixed(0)}%</div>
          <div>NEW → WON: {(model.newToWon * 100).toFixed(0)}%</div>
          <div>Confidence: {(model.confidence * 100).toFixed(0)}%</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <strong>Forecast: £{Math.round(forecast)}</strong>
        </div>

        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
          <div style={{ display: "flex", gap: 20 }}>
            {STATUSES.map((s) => (
              <Column
                key={s}
                status={s}
                leads={leads.filter((l) => l.status === s)}
                onSelect={setSelected}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {selected && (
        <div style={{ flex: 1, background: "#111", padding: 20 }}>
          <h2>{selected.name}</h2>
          <h2>£{price}</h2>
          <button onClick={saveDealValue}>Save Deal Value</button>
        </div>
      )}
    </div>
  );
}