import { useState, useEffect } from "react";

const API = "https://dark-voice-ab4b.rapidstillz.workers.dev";

export default function Licensing() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [track, setTrack] = useState("");

  const [usage, setUsage] = useState("Film");
  const [duration, setDuration] = useState("1 Year");
  const [territory, setTerritory] = useState("UK");
  const [exclusive, setExclusive] = useState(false);

  const [price, setPrice] = useState(1500);
  const [submitted, setSubmitted] = useState(false);

  // 🔥 PRICING ENGINE
  const calculatePrice = () => {
    let base = 0;

    if (usage === "Film") base = 1500;
    if (usage === "TV") base = 1000;
    if (usage === "Ads") base = 2000;
    if (usage === "Social") base = 500;

    const durationMult =
      duration === "3 Years" ? 1.8 :
      duration === "Perpetual" ? 3 : 1;

    const territoryMult =
      territory === "EU" ? 1.5 :
      territory === "Worldwide" ? 2.2 : 1;

    const exclusivityMult = exclusive ? 2 : 1;

    const finalPrice = Math.round(
      base * durationMult * territoryMult * exclusivityMult
    );

    setPrice(finalPrice);
  };

  // ✅ Correct lifecycle
  useEffect(() => {
    calculatePrice();
  }, [usage, duration, territory, exclusive]);

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    await fetch(`${API}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        company,
        track,
        usage,
        duration,
        territory,
        exclusive,
        value: price,
      }),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Thank you</h1>
        <p>Your licensing request has been submitted.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1>License Music</h1>

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Track Name"
        value={track}
        onChange={(e) => setTrack(e.target.value)}
      />
      <br /><br />

      <h3>Usage</h3>
      <select value={usage} onChange={(e) => setUsage(e.target.value)}>
        <option>Film</option>
        <option>TV</option>
        <option>Ads</option>
        <option>Social</option>
      </select>

      <br /><br />

      <h3>Duration</h3>
      <select value={duration} onChange={(e) => setDuration(e.target.value)}>
        <option>1 Year</option>
        <option>3 Years</option>
        <option>Perpetual</option>
      </select>

      <br /><br />

      <h3>Territory</h3>
      <select value={territory} onChange={(e) => setTerritory(e.target.value)}>
        <option>UK</option>
        <option>EU</option>
        <option>Worldwide</option>
      </select>

      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={exclusive}
          onChange={(e) => setExclusive(e.target.checked)}
        />
        Exclusive License
      </label>

      <br /><br />

      <h2>Estimated Price: £{price}</h2>

      <button onClick={handleSubmit}>
        Request License
      </button>
    </div>
  );
}