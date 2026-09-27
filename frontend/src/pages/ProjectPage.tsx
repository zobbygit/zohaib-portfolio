import { Link, useParams } from "react-router-dom";
import { findProject } from "../data/projects";
import ProjectPreview from "../components/ProjectPreview";
import NotFoundPage from "./NotFoundPage";
import { Seo } from "../lib/seo";

interface Section {
  id: string;
  title: string;
  body?: string;
  list?: string[];
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = findProject(slug);
  if (!project) return <NotFoundPage />;

  const sections: Section[] = [
    { id: "overview", title: "OVERVIEW", body: project.longDescription },
    { id: "problem", title: "PROBLEM", body: project.problem },
    { id: "solution", title: "SOLUTION", body: project.solution },
    { id: "features", title: "FEATURES", list: project.features },
    { id: "architecture", title: "ARCHITECTURE", list: project.architecture },
    { id: "technology", title: "TECHNOLOGY", list: project.technologies },
    { id: "challenges", title: "CHALLENGES", list: project.challenges },
    { id: "results", title: "RESULTS", list: project.results },
  ];
  const visible = sections.filter((s) => (s.body && s.body.trim()) || (s.list && s.list.length > 0));

  return (
    <article className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Seo title={project.title} description={project.description} path={`/work/${project.slug}`} image={project.image || undefined} />
      <Link to="/work" data-cursor="view" className="font-mono text-xs tracking-widest text-white/50 hover:text-accent">← BACK TO WORK</Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-accent">{project.category.toUpperCase()}</p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.95]">{project.title}</h1>
          <p className="mt-6 text-lg text-white/70">{project.description}</p>
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs tracking-widest">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" data-cursor="view" className="rounded-full bg-white px-5 py-3 text-ink hover:bg-accent">LIVE DEMO ↗</a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-cursor="view" className="rounded-full border border-white/25 px-5 py-3 hover:border-accent hover:text-accent">GITHUB ↗</a>
            )}
          </div>
        </div>
        <ProjectPreview slug={project.slug} src={project.image} alt={`${project.title} preview`} />
      </div>

      <nav aria-label="Project sections" className="mt-16 flex flex-wrap gap-2">
        {visible.map((s) => <a key={s.id} href={`#${s.id}`} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] tracking-widest text-white/60 hover:border-accent hover:text-accent">{s.title}</a>)}
      </nav>

      <div className="mt-12 grid gap-14">
        {visible.map((s) => (
          <section key={s.id} id={s.id} className="border-t border-white/10 pt-8">
            <h2 className="font-mono text-xs tracking-[0.25em] text-accent">{s.title}</h2>
            {s.body && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/80">{s.body}</p>}
            {s.list && (
              <ul className="mt-4 grid max-w-3xl gap-2 text-white/80 md:grid-cols-2">
                {s.list.map((item) => <li key={item} className="flex gap-3"><span className="text-accent">▹</span>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
