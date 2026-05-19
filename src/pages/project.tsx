import { useParams } from "wouter";
import { useState, useEffect } from "react";

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("projects_v1");
    if (!data) return;

    const projects = JSON.parse(data);
    const found = projects.find((p: any) => p.slug === slug);
    setProject(found);
  }, [slug]);

  if (!project) return <div className="p-10 text-white">Not found</div>;

  if (project.access === "private") {
    return <div className="p-10 text-white">This project is private</div>;
  }

  if (project.access === "invite" && !unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="border p-6">
          <h2 className="mb-4">Enter Access Code</h2>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-black border p-2 mb-2 w-full"
          />

          <button
            onClick={() => {
              if (input === project.password) {
                setUnlocked(true);
              }
            }}
            className="border px-4 py-2"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-serif mb-4">{project.title}</h1>

      {project.cover && (
        <img src={project.cover} className="w-full mb-6" />
      )}

      <p className="text-white/70 mb-6">{project.description}</p>

      {project.video && (
        <div className="relative w-full pb-[56.25%] mb-6">
          <iframe
            src={project.video}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
