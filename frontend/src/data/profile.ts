import type { TechNode } from "../types";

export const profile = {
  name: "ZOHAIB",
  role: "SOFTWARE ENGINEER AND FULL STACK DEVELOPER",
  tagline: "Building scalable web products, interactive experiences, and full-stack systems.",
  photo: "/portrait.jpg", // place your real photo at frontend/public/portrait.jpg
};

export const identity = ["Frontend", "Backend", "Database", "APIs", "Security", "Testing", "CI/CD", "Deployment"];

export const identityStatement = "I build products from interface to infrastructure.";

export const navItems = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT" },
  { to: "/skills", label: "SKILLS" },
  { to: "/education", label: "EDUCATION" },
  { to: "/engineering", label: "ENGINEERING" },
  { to: "/work", label: "WORK" },
  { to: "/lab", label: "LAB" },
  { to: "/journey", label: "JOURNEY" },
  { to: "/blog", label: "BLOG" },
  { to: "/resume", label: "RESUME" },
  { to: "/contact", label: "CONTACT" },
];

export const techNodes: TechNode[] = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Three.js", category: "Frontend" },
  { name: "GSAP", category: "Frontend" },
  { name: "Vite", category: "Tools" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "REST APIs", category: "Backend" },
  { name: "Zod", category: "Backend" },
  { name: "Helmet", category: "Backend" },
  { name: "MongoDB", category: "Databases" },
  { name: "Mongoose", category: "Databases" },
  { name: "GitHub Actions", category: "DevOps" },
  { name: "Docker", category: "DevOps" },
  { name: "Vitest", category: "Testing" },
  { name: "React Testing Library", category: "Testing" },
  { name: "Supertest", category: "Testing" },
  { name: "Figma", category: "Design" },
];

export const education = [
  {
    year: "2019–2020",
    title: "Secondary Education (ICSE)",
    place: "Ling Liang High School, Kolkata",
    detail: "Class X, ICSE board. Scored 89%.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer", "English"],
  },
  {
    year: "2021–2022",
    title: "Higher Secondary Education (ISC)",
    place: "Ling Liang High School, Kolkata",
    detail: "Class XII, ISC board. Scored 72%.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Hindi"],
  },
  {
    year: "2022–2026",
    title: "B.Tech in Information Technology",
    place: "Narula Institute of Technology (MAKAUT)",
    detail: "Core coursework in systems and web engineering. Final CGPA: 7.97/10.",
    subjects: ["Data Structures & Algorithms", "Software Engineering", "Database Concepts", "Web Development", "Systems Concepts"],
  },
];

export const skillGroups: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["Java", "C", "C++", "SQL", "TypeScript", "JavaScript"] },
  { title: "Web Development", items: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "Redux", "Node.js", "Express.js", "REST API Design"] },
  { title: "Databases", items: ["MongoDB", "MySQL", "PostgreSQL"] },
  { title: "Tools & Platforms", items: ["Git", "GitHub", "Postman", "Vercel", "Render", "Clerk Auth"] },
];

/** Skill relationships: each entry lists what it is used with, so the Skills page shows connections rather than percentages. */
export const skillRelations: Record<string, string[]> = {
  "React.js": ["TypeScript", "Redux", "Tailwind CSS", "Vite"],
  TypeScript: ["React.js", "Express.js"],
  "Express.js": ["Node.js", "MongoDB", "REST API Design", "PostgreSQL"],
  MongoDB: ["Express.js", "Node.js"],
  PostgreSQL: ["Express.js", "Node.js"],
  "REST API Design": ["Express.js", "Postman"],
  "Tailwind CSS": ["React.js", "Vite"],
  "Clerk Auth": ["React.js", "Node.js"],
  Git: ["GitHub", "Vercel", "Render"],
};

/** A broader, categorized technical skill set for the "Technical Skills" section on
 *  the Skills page — a fuller inventory alongside the relationship explorer above,
 *  not a replacement for it. */
export const technicalSkillCategories: { title: string; items: string[] }[] = [
  { title: "Frontend Development", items: ["React", "Next.js", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"] },
  { title: "Backend Development", items: ["Node.js", "Python", "PostgreSQL", "MongoDB", "REST APIs"] },
  { title: "UI/UX Design", items: ["Responsive Design", "Wireframing", "Prototyping", "Accessibility", "Design Systems"] },
  { title: "Cloud and AI", items: ["AWS", "CI/CD", "Git", "GitHub", "Postman", "Gemini", "Linux", "Docker", "OpenAI / GPT APIs", "LangChain", "Prompt Engineering"] },
  { title: "Tools & Technologies", items: ["VS Code", "Webpack", "Redux", "Vercel", "Render", "GitHub Pages", "IntelliJ IDEA", "Vite", "Jest", "Testing (Unit/Integration)"] },
  { title: "Creative Skills", items: ["UI/UX", "SVG & Icon Animations", "Design Systems", "UI Animation"] },
];