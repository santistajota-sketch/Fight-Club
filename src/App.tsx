import { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useStore, useAccount } from './store/useStore';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Community from './pages/Community';
import PostPage from './pages/PostPage';
import Learn from './pages/Learn';
import CoursePage from './pages/CoursePage';
import Experts from './pages/Experts';
import ExpertPage from './pages/ExpertPage';
import Analyses from './pages/Analyses';
import AnalysisPage from './pages/AnalysisPage';
import Events from './pages/Events';
import EventPage from './pages/EventPage';
import Modalities from './pages/Modalities';
import ModalityPage from './pages/ModalityPage';
import Progress from './pages/Progress';
import Ranking from './pages/Ranking';
import Favorites from './pages/Favorites';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import SearchPage from './pages/SearchPage';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui';

export default function App() {
  const theme = useStore((s) => s.theme);
  const reduced = useStore((s) => s.reducedMotion);
  const acc = useAccount();
  const first = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    if (!first.current) {
      root.classList.add('theme-anim');
      const t = setTimeout(() => root.classList.remove('theme-anim'), 400);
      root.dataset.theme = theme;
      return () => clearTimeout(t);
    }
    first.current = false;
    root.dataset.theme = theme;
  }, [theme]);
  useEffect(() => { document.documentElement.dataset.reduced = String(reduced); }, [reduced]);

  if (!acc) return (<><Login /><Toaster /></>);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="comunidade" element={<Community />} />
        <Route path="comunidade/post/:id" element={<PostPage />} />
        <Route path="aprender" element={<Learn />} />
        <Route path="aprender/:id" element={<CoursePage />} />
        <Route path="especialistas" element={<Experts />} />
        <Route path="especialistas/:id" element={<ExpertPage />} />
        <Route path="analises" element={<Analyses />} />
        <Route path="analises/:id" element={<AnalysisPage />} />
        <Route path="eventos" element={<Events />} />
        <Route path="eventos/:id" element={<EventPage />} />
        <Route path="modalidades" element={<Modalities />} />
        <Route path="modalidades/:id" element={<ModalityPage />} />
        <Route path="progresso" element={<Progress />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="favoritos" element={<Favorites />} />
        <Route path="apoie" element={<Support />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="perfil/:id" element={<Profile />} />
        <Route path="notificacoes" element={<Notifications />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="admin" element={<Admin />} />
        <Route path="busca" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
