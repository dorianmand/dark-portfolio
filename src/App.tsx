import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectsIndexPage } from './pages/ProjectsIndexPage';
import { ProjectPage } from './pages/ProjectPage';
import { NewsIndexPage } from './pages/NewsIndexPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { ImpressumPage } from './pages/ImpressumPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsIndexPage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="/news" element={<NewsIndexPage />} />
      <Route path="/news/:slug" element={<NewsArticlePage />} />
      <Route path="/articles" element={<Navigate to="/news" replace />} />
      <Route path="/articles/:slug" element={<Navigate to="/news" replace />} />
      <Route path="/impressum" element={<ImpressumPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
