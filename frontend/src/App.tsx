import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import SiteLayout from "./layout/SiteLayout";
import Cursor from "./components/Cursor";
import { AuthProvider } from "./admin/AuthContext";
import RequireAdmin from "./admin/RequireAdmin";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const EducationPage = lazy(() => import("./pages/EducationPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const EngineeringPage = lazy(() => import("./pages/EngineeringPage"));
const JourneyPage = lazy(() => import("./pages/JourneyPage"));
const LabPage = lazy(() => import("./pages/LabPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminOverviewPage = lazy(() => import("./pages/admin/AdminOverviewPage"));
const AdminProjectsPage = lazy(() => import("./pages/admin/AdminProjectsPage"));
const AdminPostsPage = lazy(() => import("./pages/admin/AdminPostsPage"));
const AdminMessagesPage = lazy(() => import("./pages/admin/AdminMessagesPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));

const Fallback = () => <div className="min-h-[60svh]" aria-busy="true" />;

export default function App() {
  return (
    <AuthProvider>
    {/* Mounted here, above every route (including /admin/*), so the custom cursor
        never disappears when navigating into or around the admin area — it used to
        live only inside SiteLayout, which admin routes don't use. */}
    <Cursor />
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route
          path="admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<ProjectPage />} />
          <Route path="engineering" element={<EngineeringPage />} />
          <Route path="journey" element={<JourneyPage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
    </AuthProvider>
  );
}