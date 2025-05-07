import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Layouts
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProfilePage from './pages/auth/ProfilePage';
import ItemListView from './pages/memorySpaces/ItemListView';
import ItemListDetailView from './pages/memorySpaces/ItemListDetailView';
import TimelineView from './pages/timeline/TimelineView';
import NotFound from './pages/NotFound';
import Gallery from './pages/gallery/Gallery';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import HelpSupport from 'pages/legal/HelpSupport';
import TermsOfUse  from 'pages/legal/TermsOfUse';

// Contexts
import { AuthContext } from './contexts/AuthContext';
import { MemorySpaceProvider } from './contexts/MemorySpaceContext';

import { userService } from './services/UserService';
import CreateItemList from 'components/itemList/CreateItemList';
import { CreateItem } from 'components/gallery/CreateItem';
import ItemDetailView from 'components/gallery/ItemDetailView';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      userService.setCurrentUser(parsedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleUserChange = (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    userService.subscribe(handleUserChange);

    return () => {
      userService.unsubscribe(handleUserChange);
    };
  }, [navigate]);

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="text-center p-4">Lädt...</div>;

    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };


  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
      }}
    >
      <MemorySpaceProvider>
        <div className="flex h-screen bg-gray-100">
          {currentUser && (
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          )}

          <div className="flex flex-col flex-1 overflow-hidden">
            <Header
              onNavigate={(route) => navigate(route)}
              toggleSidebar={setSidebarOpen}
              sidebarOpen={sidebarOpen}
            />

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route
                  path="/login"
                  element={
                    <LoginPage onNavigate={(route) => navigate(route)} />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <RegisterPage onNavigate={(route) => navigate(route)} />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <ForgotPassword
                      onNavigate={(route) => navigate(route)}
                    />
                  }
                />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/item-list"
                  element={
                    <ProtectedRoute>
                      <ItemListView
                        onNavigate={(route) => navigate(route)}
                        onViewSpace={(id) => navigate(`/item-list/${id}`)}
                      />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/item-list/:id"
                  element={
                    <ProtectedRoute>
                      <ItemListDetailView
                        onNavigate={(route) => navigate(route)}
                      />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/item-list/:id/timeline"
                  element={
                    <ProtectedRoute>
                      <TimelineView />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/item-list/create"
                  element={
                    <ProtectedRoute>
                      <CreateItemList onNavigate={(route) => navigate(route)} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/items"
                  element={
                    <ProtectedRoute>
                      <Gallery onNavigate={(route) => navigate(route)} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/items/:id"
                  element={
                    <ProtectedRoute>
                      <ItemDetailView onNavigate={(route) => navigate(route)} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/items/create"
                  element={
                    <ProtectedRoute>
                      <CreateItem onNavigate={(route) => navigate(route)} />
                    </ProtectedRoute>
                  }
                />

                {/* Legal Pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/helpsupport" element={<HelpSupport />} />
                <Route path="/termsofuse" element={<TermsOfUse />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      </MemorySpaceProvider>
    </AuthContext.Provider>
  );
}

export default App;
