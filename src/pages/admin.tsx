import { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
  type DragEndEvent,
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

const getModel = (leads: Lead[]) => {
  const total = leads.length;
  let contacted = 0;
  let won = 0;

  leads.forEach((lead) => {
    const history = lead.history || [];

    if (history.some((item) => item.status === "CONTACTED")) contacted++;
    if (history.some((item) => item.status === "WON")) won++;
  });

  const newToContacted = total === 0 ? 0 : contacted / total;
  const contactedToWon = contacted === 0 ? 0 : won / contacted;
  const newToWon = newToContacted * contactedToWon;
  const confidence = Math.min(1, total / 20);

  return {
    newToContacted: newToContacted * confidence,
    contactedToWon: contactedToWon * confidence,
    newToWon: newToWon * confidence,
    confidence,
  };
};

function Card({ lead, onSelect }: { lead: Lead; onSelect: (lead: Lead) => void }) {
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
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
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

function Column({ status, leads, onSelect }: { status: string; leads: Lead[]; onSelect: (lead: Lead) => void }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} style={{ flex: 1, background: "#111", padding: 10 }}>
      <h3>{status}</h3>
      {leads.map((lead) => (
        <Card key={lead.id} lead={lead} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [price, setPrice] = useState(1500);

  useEffect(() => {
    fetch(`${API}/leads`)
      .then((response) => response.json() as Promise<Lead[]>)
      .then((data) => {
        const fixed = data.map((lead) => {
          if (!lead.history) {
            return {
              ...lead,
              history: [
                {
                  status: "NEW",
                  at: lead.createdAt || Date.now(),
                },
                ...(lead.status !== "NEW" ? [{ status: lead.status, at: Date.now() }] : []),
              ],
            };
          }
          return lead;
        });

        setLeads(fixed);
      });
  }, []);

  const selectLead = (lead: Lead) => {
    setSelected(lead);
    setPrice(typeof lead.value === "number" ? lead.value : 1500);
  };

  const saveDealValue = async () => {
    if (!selected) return;

    const response = await fetch(`${API}/update-status`, {
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

    if (!response.ok) return;

    setLeads((prev) => prev.map((lead) => (lead.id === selected.id ? { ...lead, value: price } : lead)));
    setSelected((current) => (current ? { ...current, value: price } : current));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const newStatus = String(over.id);
    if (!STATUSES.includes(newStatus)) return;

    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead)));
    setSelected((current) => (current?.id === id ? { ...current, status: newStatus } : current));

    const response = await fetch(`${API}/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (!response.ok) {
      window.location.reload();
    }
  };

  const model = getModel(leads);

  const forecast = leads.reduce((sum, lead) => {
    if (!lead.value) return sum;
    if (lead.status === "WON") return sum + lead.value;
    if (lead.status === "CONTACTED") return sum + lead.value * model.contactedToWon;
    if (lead.status === "NEW") return sum + lead.value * model.newToWon;
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
            {STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                leads={leads.filter((lead) => lead.status === status)}
                onSelect={selectLead}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {selected && (
        <div style={{ flex: 1, background: "#111", padding: 20 }}>
          <h2>{selected.name}</h2>
          <h2>£{price}</h2>
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            style={{ marginBottom: 12, width: "100%" }}
          />
          <button onClick={saveDealValue}>Save Deal Value</button>
        </div>
      )}
    </div>
  );
}
