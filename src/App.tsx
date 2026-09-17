import { AppProvider, useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import ToastContainer from '@/components/ui/Toast';

import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import Onboarding from '@/pages/auth/Onboarding';

import Dashboard from '@/pages/Dashboard';
import Generator from '@/pages/Generator';
import BatchStudio from '@/pages/BatchStudio';
import Gallery from '@/pages/Gallery';
import Projects from '@/pages/Projects';
import Templates from '@/pages/Templates';
import Models from '@/pages/Models';
import Editor from '@/pages/Editor';
import Upscaler from '@/pages/Upscaler';
import BackgroundRemover from '@/pages/BackgroundRemover';
import Variations from '@/pages/Variations';
import ImageToImage from '@/pages/ImageToImage';
import Favorites from '@/pages/Favorites';
import History from '@/pages/History';
import Notifications from '@/pages/Notifications';
import Help from '@/pages/Help';
import Changelog from '@/pages/Changelog';

import Billing from '@/pages/account/Billing';
import Settings from '@/pages/account/Settings';
import Usage from '@/pages/account/Usage';
import ApiKeys from '@/pages/account/ApiKeys';
import Team from '@/pages/account/Team';

import type { Page } from '@/lib/types';

function PageRouter() {
  const { currentPage, isAuthenticated, onboardingDone } = useApp();

  if (!isAuthenticated) {
    if (currentPage === 'signup') return <SignUp />;
    if (currentPage === 'forgot-password') return <Login />;
    return <Login />;
  }

  if (!onboardingDone && currentPage === 'onboarding') {
    return <Onboarding />;
  }

  const pageMap: Partial<Record<Page, React.ReactNode>> = {
    dashboard: <Dashboard />,
    generator: <Generator />,
    batch: <BatchStudio />,
    editor: <Editor />,
    upscaler: <Upscaler />,
    'background-remover': <BackgroundRemover />,
    variations: <Variations />,
    'image-to-image': <ImageToImage />,
    projects: <Projects />,
    gallery: <Gallery />,
    favorites: <Favorites />,
    history: <History />,
    templates: <Templates />,
    models: <Models />,
    billing: <Billing />,
    settings: <Settings />,
    usage: <Usage />,
    'api-keys': <ApiKeys />,
    team: <Team />,
    notifications: <Notifications />,
    help: <Help />,
    changelog: <Changelog />,
  };

  const content = pageMap[currentPage] ?? <Dashboard />;

  return <Layout>{content}</Layout>;
}

function App() {
  return (
    <AppProvider>
      <PageRouter />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
