import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectsIndexPage } from './pages/ProjectsIndexPage';
import { ProjectPage } from './pages/ProjectPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { ResearchPage } from './pages/ResearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { ImpressumPage } from './pages/ImpressumPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LanguageProvider } from './lib/language';

/**
 * The German tree is a literal duplicate of the English one, mounted under
 * /de. Each page reads its language back out via useLang() (see lib/language)
 * rather than taking it as a route param — that keeps every page's own logic
 * unaware of routing. Only project and article pages actually branch on
 * language today; everything else still renders English chrome around
 * translated content until the UI-string workbook comes back translated.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsIndexPage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="/news" element={<Navigate to="/research" replace />} />
      <Route path="/news/:slug" element={<NewsArticlePage />} />
      <Route path="/articles" element={<Navigate to="/research" replace />} />
      <Route path="/articles/:slug" element={<Navigate to="/research" replace />} />
      <Route path="/research" element={<ResearchPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/impressum" element={<ImpressumPage />} />
      {/* The German label is the one people look for, so /datenschutz resolves
          in both trees rather than only under /de. */}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/datenschutz" element={<PrivacyPage />} />

      <Route path="/de" element={<HomePage />} />
      <Route path="/de/projects" element={<ProjectsIndexPage />} />
      <Route path="/de/projects/:slug" element={<ProjectPage />} />
      <Route path="/de/news" element={<Navigate to="/de/research" replace />} />
      <Route path="/de/news/:slug" element={<NewsArticlePage />} />
      <Route path="/de/research" element={<ResearchPage />} />
      <Route path="/de/profile" element={<ProfilePage />} />
      <Route path="/de/impressum" element={<ImpressumPage />} />
      <Route path="/de/datenschutz" element={<PrivacyPage />} />
      <Route path="/de/privacy" element={<PrivacyPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}
