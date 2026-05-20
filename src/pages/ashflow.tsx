import { useMemo, useState } from "react";

type CheckIn = {
  energy: number;
  heelPain: number;
  cravings: number;
  sleep: number;
};

const profile = {
  age: 54,
  height: "6ft / 183cm",
  weightKg: 104.1,
  waistRelaxedIn: 46.5,
  waistTenseIn: 45,
  startMinutes: 12,
  goal: "Reduce waist, lose fat quickly but safely, improve insulin sensitivity and rebuild fitness without a gym.",
};

const videos = [
  {
    label: "Day 1-3: Tai Chi reset",
    title: "7 Minute Chi - Tai Chi for Beginners",
    embed: "https://www.youtube-nocookie.com/embed/cEvSqHZIj8w",
    note: "Use this when energy is low, sleep was poor, or heel pain is above 3/10.",
  },
  {
    label: "Day 4-7: Low impact fat loss",
    title: "Team Body Project - beginner low impact training",
    embed: "https://www.youtube-nocookie.com/embed/H0c-4nZjIWQ",
    note: "Keep the steps small. No jumping. Stop any move that aggravates the heel.",
  },
  {
    label: "Heel care",
    title: "Bob & Brad - plantar fasciitis style relief",
    embed: "https://www.youtube-nocookie.com/embed/F7W4s5TbUpQ",
    note: "Use after training or in the evening. This does not replace a clinician if symptoms worsen.",
  },
];

const meals = [
  {
    time: "07:00",
    title: "Fast begins / hydration",
    items: ["Water", "Black coffee or green tea", "No sugar, juice, biscuits or milk-heavy drinks"],
  },
  {
    time: "12:00",
    title: "Meal 1 - protein first",
    items: ["3 eggs or chicken/tuna/salmon", "Large salad or spinach/mushrooms/tomatoes", "Greek yoghurt, berries or nuts if needed"],
  },
  {
    time: "16:00",
    title: "Optional bridge",
    items: ["Only if genuinely hungry", "Boiled eggs, cottage cheese, nuts or Greek yoghurt", "Avoid cereal bars and crisps"],
  },
  {
    time: "19:00",
    title: "Dinner - lean and simple",
    items: ["Chicken, fish, turkey or tofu", "Large vegetables", "Small portion lentils, chickpeas or sweet potato only if training was done"],
  },
  {
    time: "20:00",
    title: "Kitchen closed",
    items: ["Water or herbal tea only", "Protect sleep", "No late-night bread, sweets or leftovers"],
  },
];

const weeklyPlan = [
  "Mon: 12 min Tai Chi + chair strength",
  "Tue: 12 min low-impact walk workout",
  "Wed: 12 min Tai Chi + heel care",
  "Thu: 12 min low-impact walk workout",
  "Fri: 12 min Tai Chi + wall pushups + glute bridges",
  "Sat: 20-30 min easy outdoor walk if heel allows",
  "Sun: recovery, mobility and meal prep",
];

function getAdaptiveSession(checkIn: CheckIn) {
  if (checkIn.heelPain >= 4) {
    return {
      title: "Heel-protective Tai Chi reset",
      minutes: 10,
      focus: "Breathing, upper-body mobility, cloud hands, seated calf pumps and gentle heel care.",
      warning: "Avoid walking workouts today. If heel pain spreads, burns, tingles, or affects sensation, arrange a foot check.",
    };
  }

  if (checkIn.sleep <= 5 || checkIn.energy <= 4) {
    return {
      title: "Low-stress metabolic starter",
      minutes: 12,
      focus: "Tai Chi flow, chair squats, wall pushups, dead bugs and calm breathing.",
      warning: "Do not compensate for poor sleep with a punishing workout. Consistency beats punishment.",
    };
  }

  if (checkIn.cravings >= 7) {
    return {
      title: "Craving-control session",
      minutes: 15,
      focus: "Low-impact cardio flow plus a strict protein-first first meal at noon.",
      warning: "Cravings usually mean the food environment needs tightening, not willpower lectures.",
    };
  }

  return {
    title: "Standard fat-loss foundation",
    minutes: 15,
    focus: "Low-impact walk workout, chair squats, incline pushups and glute bridges.",
    warning: "Keep effort at 6/10. Finish feeling better than when you started.",
  };
}

export default function AshFlow() {
  const [checkIn, setCheckIn] = useState<CheckIn>({ energy: 5, heelPain: 2, cravings: 5, sleep: 6 });
  const [activeVideo, setActiveVideo] = useState(0);
  const session = useMemo(() => getAdaptiveSession(checkIn), [checkIn]);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.kicker}>AshFlow AI / private prototype</p>
          <h1 style={styles.h1}>12-minute daily fat-loss and metabolic reset</h1>
          <p style={styles.lede}>{profile.goal}</p>
          <div style={styles.statsGrid}>
            <Stat label="Start" value={`${profile.weightKg}kg`} />
            <Stat label="Waist" value={`${profile.waistRelaxedIn}\" relaxed`} />
            <Stat label="Session" value={`${profile.startMinutes} mins`} />
            <Stat label="Method" value="Tai Chi + low impact" />
          </div>
        </div>
        <div style={styles.coachCard}>
          <p style={styles.cardEyebrow}>Today&apos;s adaptive session</p>
          <h2 style={styles.h2}>{session.title}</h2>
          <p style={styles.sessionMinutes}>{session.minutes} minutes</p>
          <p style={styles.body}>{session.focus}</p>
          <p style={styles.warning}>{session.warning}</p>
        </div>
      </section>

      <section style={styles.gridTwo}>
        <div style={styles.panel}>
          <h2 style={styles.h2}>Morning check-in</h2>
          <Slider label="Energy" value={checkIn.energy} onChange={(energy) => setCheckIn({ ...checkIn, energy })} />
          <Slider label="Heel pain" value={checkIn.heelPain} onChange={(heelPain) => setCheckIn({ ...checkIn, heelPain })} />
          <Slider label="Cravings" value={checkIn.cravings} onChange={(cravings) => setCheckIn({ ...checkIn, cravings })} />
          <Slider label="Sleep quality" value={checkIn.sleep} onChange={(sleep) => setCheckIn({ ...checkIn, sleep })} />
        </div>

        <div style={styles.panel}>
          <h2 style={styles.h2}>Train alongside</h2>
          <div style={styles.videoWrap}>
            <iframe
              title={videos[activeVideo].title}
              src={videos[activeVideo].embed}
              style={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p style={styles.body}>{videos[activeVideo].note}</p>
          <div style={styles.buttonRow}>
            {videos.map((video, index) => (
              <button
                key={video.label}
                type="button"
                onClick={() => setActiveVideo(index)}
                style={index === activeVideo ? styles.buttonActive : styles.button}
              >
                {video.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.gridTwo}>
        <div style={styles.panel}>
          <h2 style={styles.h2}>14-day food reset</h2>
          <p style={styles.body}>Default eating window: 12:00-20:00. This is designed to feel familiar to Ramadan discipline without triggering a post-fast rebound.</p>
          {meals.map((meal) => (
            <div key={meal.time} style={styles.timelineItem}>
              <strong>{meal.time} - {meal.title}</strong>
              <ul style={styles.ul}>
                {meal.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={styles.panel}>
          <h2 style={styles.h2}>Week 1 structure</h2>
          <ul style={styles.planList}>
            {weeklyPlan.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div style={styles.ruleBox}>
            <strong>First 14 days: remove</strong>
            <p style={styles.body}>Bread, rice, pasta, pastries, biscuits, crisps, fruit juice, sugary drinks and late-night snacks. Not forever - just the reset.</p>
          </div>
          <div style={styles.ruleBox}>
            <strong>Track weekly</strong>
            <p style={styles.body}>Weight, waist at belly button, front/side photo, post-meal sleepiness, 3am waking, heel pain.</p>
          </div>
        </div>
      </section>

      <section style={styles.footerNote}>
        <strong>Safety note:</strong> This prototype supports behaviour change and tracking. It does not diagnose prediabetes, fatty liver or foot/nerve conditions. HbA1c, fasting glucose and liver function tests would give you useful baseline data without forcing medication.
      </section>
    </main>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={styles.sliderLabel}>
      <span>{label}: <strong>{value}/10</strong></span>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={styles.slider}
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statLabel}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", padding: "32px", background: "#10140f", color: "#f4f0e7", fontFamily: "Inter, system-ui, sans-serif" },
  hero: { display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, .8fr)", gap: "24px", alignItems: "stretch", maxWidth: "1180px", margin: "0 auto 24px" },
  kicker: { color: "#a7d58b", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "12px", fontWeight: 700 },
  h1: { fontFamily: "Playfair Display, Georgia, serif", fontSize: "clamp(40px, 7vw, 78px)", lineHeight: 0.95, margin: "8px 0 18px" },
  h2: { margin: "0 0 12px", fontSize: "24px" },
  lede: { maxWidth: "760px", color: "#d8d1c2", fontSize: "18px", lineHeight: 1.6 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(120px, 1fr))", gap: "12px", marginTop: "28px" },
  stat: { padding: "16px", borderRadius: "18px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" },
  statLabel: { display: "block", color: "#aaa394", fontSize: "12px", marginBottom: "6px" },
  coachCard: { padding: "24px", borderRadius: "28px", background: "linear-gradient(145deg, #25331e, #171d14)", border: "1px solid rgba(167,213,139,.28)", boxShadow: "0 20px 60px rgba(0,0,0,.25)" },
  cardEyebrow: { color: "#a7d58b", marginTop: 0, fontSize: "13px", textTransform: "uppercase", letterSpacing: ".12em" },
  sessionMinutes: { display: "inline-block", padding: "8px 12px", borderRadius: "999px", background: "#a7d58b", color: "#10140f", fontWeight: 800 },
  body: { color: "#d8d1c2", lineHeight: 1.6 },
  warning: { color: "#ffe7a3", lineHeight: 1.55, fontSize: "14px" },
  gridTwo: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px", maxWidth: "1180px", margin: "0 auto 24px" },
  panel: { padding: "24px", borderRadius: "24px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)" },
  sliderLabel: { display: "block", margin: "18px 0", color: "#f4f0e7" },
  slider: { width: "100%", accentColor: "#a7d58b", marginTop: "8px" },
  videoWrap: { position: "relative", paddingTop: "56.25%", borderRadius: "18px", overflow: "hidden", background: "#050805", border: "1px solid rgba(255,255,255,.08)" },
  iframe: { position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 },
  buttonRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" },
  button: { border: "1px solid rgba(255,255,255,.14)", background: "transparent", color: "#f4f0e7", padding: "10px 12px", borderRadius: "999px", cursor: "pointer" },
  buttonActive: { border: "1px solid #a7d58b", background: "#a7d58b", color: "#10140f", padding: "10px 12px", borderRadius: "999px", cursor: "pointer", fontWeight: 800 },
  timelineItem: { borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "14px", marginTop: "14px" },
  ul: { color: "#d8d1c2", paddingLeft: "20px", lineHeight: 1.65 },
  planList: { color: "#d8d1c2", paddingLeft: "20px", lineHeight: 1.8 },
  ruleBox: { marginTop: "18px", padding: "16px", borderRadius: "18px", background: "rgba(167,213,139,.08)", border: "1px solid rgba(167,213,139,.18)" },
  footerNote: { maxWidth: "1180px", margin: "0 auto", padding: "18px 22px", borderRadius: "20px", background: "rgba(255,231,163,.08)", color: "#fff3c9", lineHeight: 1.6 },
};
