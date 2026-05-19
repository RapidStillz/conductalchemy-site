function AdminPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://dark-voice-ab4b.rapidstillz.workers.dev/admin")
      .then(res => res.json())
      .then(setData);
  }, []);

  const licence = data
    .filter(d => d.data?.type === "licence")
    .sort((a, b) => b.data.score - a.data.score); // SORT BY VALUE

  const getColor = (priority: string) => {
    if (priority === "HIGH") return "red";
    if (priority === "MEDIUM") return "orange";
    return "gray";
  };

  return (
    <div style={{ color: "white", padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Deal Pipeline</h1>

      {licence.map((item) => (
        <div
          key={item.data.id}
          style={{
            border: "1px solid #444",
            padding: "16px",
            marginBottom: "10px",
            borderLeft: `5px solid ${getColor(item.data.priority)}`
          }}
        >

          <div style={{ fontWeight: "bold" }}>
            {item.data.trackId}
          </div>

          <div>{item.data.name} ({item.data.email})</div>

          <div>
            Priority: <span style={{ color: getColor(item.data.priority) }}>
              {item.data.priority}
            </span>
          </div>

          <div>Score: {item.data.score}</div>
          <div>Status: {item.data.status}</div>

          <div style={{ marginTop: "10px" }}>
            {item.data.usageType} | {item.data.budget} | {item.data.licenseType}
          </div>

        </div>
      ))}
    </div>
  );
}
