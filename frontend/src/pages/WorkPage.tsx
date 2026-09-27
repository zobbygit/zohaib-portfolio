import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../lib/api";
import { projects as staticProjects } from "../data/projects";
import WorkGrid from "../components/WorkGrid";
import SectionHeading from "../components/SectionHeading";

export default function WorkPage() {
  const { data } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects, retry: false });
  const list = data && data.length > 0 ? data : staticProjects;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <SectionHeading eyebrow="WORK" title="Selected work." />
      <p className="mb-10 max-w-2xl text-white/70">Case studies will keep appearing here as projects are added. Hover a project for a preview; each one covers the problem, the solution, features, architecture, and results.</p>
      <WorkGrid projects={list} />
    </div>
  );
}