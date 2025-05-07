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
  
  // Authentifizierung beim Start prüfen
  useEffect(() => {
    // Einfache Simulation - in einer echten App würden wir Token prüfen
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      userService.setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleUserChange = (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user)
      } else {
        setCurrentUser(null);
        localStorage.removeItem('user');
        navigate('/login');
      }
      
    };

    userService.subscribe(handleUserChange);

    // Cleanup on unmount
    return () => {
      userService.unsubscribe(handleUserChange);
    };
  }, []);

  // Geschützte Route - leitet zu Login weiter, wenn nicht angemeldet
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Lädt...</div>;
    
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <AuthContext.Provider value={{ 
      user: currentUser,
      isAuthenticated: !!currentUser
    }}>
      <MemorySpaceProvider>
        <div className="flex h-screen bg-gray-100">
          {currentUser && (
            <Sidebar 
              isOpen={sidebarOpen} 
              setIsOpen={setSidebarOpen}
            />
          )}
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header 
              onNavigate={(route) => navigate(route)} 
              toggleSidebar={setSidebarOpen}
              sidebarOpen={sidebarOpen}
            />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route path="/login" element={<LoginPage onNavigate={(route) => navigate(route)} />} />
                <Route path="/register" element={<RegisterPage onNavigate={(route) => navigate(route)} />} />
                <Route path="/forgot-password" element={<ForgotPassword onNavigate={(route) => navigate(route)} />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/item-list" element={
                  <ProtectedRoute>
                    <ItemListView onNavigate={(route) => navigate(route)} onViewSpace={(id) => navigate(`/item-list/${id}`)} />
                  </ProtectedRoute>
                } />
                
                <Route path="/item-list/:id" element={
                  <ProtectedRoute>
                    <ItemListDetailView onNavigate={(route) => navigate(route)} />
                  </ProtectedRoute>
                } />
                
                <Route path="/item-list/:id/timeline" element={
                  <ProtectedRoute>
                    <TimelineView />
                  </ProtectedRoute>
                } />

                <Route path="/item-list/create" element={
                  <ProtectedRoute>
                    <CreateItemList onNavigate={(route) => navigate(route)} />
                  </ProtectedRoute>
                } />
                
                <Route path="/items" element={
                  <ProtectedRoute>
                    <Gallery onNavigate={(route) => navigate(route)}  />
                  </ProtectedRoute>
                } />

                <Route path="/items/:id" element={
                  <ProtectedRoute>
                    <ItemDetailView onNavigate={(route) => navigate(route)} />
                  </ProtectedRoute>
                } />

                <Route path="/items/create" element={
                  <ProtectedRoute>
                    <CreateItem onNavigate={(route) => navigate(route)}  />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
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