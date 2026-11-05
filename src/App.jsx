import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import AdminSidebar from './components/layout/AdminSidebar';
import TopHeader from './components/layout/TopHeader';

// Pages
import DashboardPage from './pages/DashboardPage';
import MyResourcesPage from './pages/MyResourcesPage';
import FindResourcesPage from './pages/FindResourcesPage';
import NgoDirectoryPage from './pages/NgoDirectoryPage';
import AiRecommendationsPage from './pages/AiRecommendationsPage';
import TransfersPage from './pages/TransfersPage';
import MessagesPage from './pages/MessagesPage';
import DisasterInsightsPage from './pages/DisasterInsightsPage';
import ProfileVerificationPage from './pages/ProfileVerificationPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import PendingApplicationPage from './pages/PendingApplicationPage';

// Store
import { mockStore } from './data/mockStore';
import { api } from './services/api';

export default function App() {
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [currentView, setCurrentView] = useState('login');
  const [toastMessage, setToastMessage] = useState(null);
  const [resourceSearchIntent, setResourceSearchIntent] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    return mockStore.subscribe((newState) => setStoreState({ ...newState }));
  }, []);

  useEffect(() => {
    let active = true;
    api.getCurrentUser()
      .then(({ user }) => {
        if (!active) return;
        if (!user) return;
        mockStore.setAuthenticatedUser(user);
        setCurrentView(user.isAdmin
          ? 'admin-dashboard'
          : user.verificationStatus === 'approved' ? 'dashboard' : 'pending-review');
      })
      .catch((error) => {
        if (!active || error.status === 401) return;
        setAuthError(error.status
          ? error.message
          : 'The sign-in service is unavailable. Use Local Preview to explore the frontend with sample data.');
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });
    return () => { active = false; };
  }, []);

  const { activeRole, currentUser, adminUser } = storeState;

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleLoginSuccess = async (credentials) => {
    const { user } = await api.login(credentials);
    mockStore.setAuthenticatedUser(user);
    setAuthError('');
    showToast(`Welcome, ${user.organization || user.name}`);
    setCurrentView(user.isAdmin
      ? 'admin-dashboard'
      : user.verificationStatus === 'approved' ? 'dashboard' : 'pending-review');
  };

  const handleRegisterSuccess = async (application) => {
    const result = await api.register(application);
    showToast(result.message);
    return result;
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      showToast(error.message || 'Sign out failed. Please try again.');
      return;
    }
    mockStore.clearAuthenticatedUser();
    setAuthError('');
    setCurrentView('login');
    showToast('Signed out successfully.');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory text-sm text-brand-walnut" role="status">
        Restoring secure session…
      </div>
    );
  }

  // If in Auth screens (Login / Register)
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setCurrentView('register')}
        serverError={authError}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegistrationPage
        onRegisterSuccess={handleRegisterSuccess}
        onGoToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'pending-review') {
    return <PendingApplicationPage user={currentUser} onSignOut={handleLogout} />;
  }

  const isAdmin = activeRole === 'admin';
  const activeUser = isAdmin ? adminUser : currentUser;

  return (
    <div className="bg-brand-ivory font-sans text-brand-walnut antialiased selection:bg-brand-sage/30 min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-walnut text-white px-4 py-3 rounded-xl shadow-lg border border-brand-sage/40 flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-brand-sage text-[20px]">info</span>
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Role-Specific Sidebar */}
      {isAdmin ? (
        <AdminSidebar
          activePath={currentView}
          onNavigate={(path) => setCurrentView(path)}
          onLogout={handleLogout}
        />
      ) : (
        <Sidebar
          activePath={currentView}
          onNavigate={(path) => setCurrentView(path)}
          onLogout={handleLogout}
        />
      )}

      {/* Main Workspace Frame */}
      <div className="pl-72 min-h-screen bg-brand-ivory">
        <TopHeader
          user={activeUser}
          isAdmin={isAdmin}
          onNotificationClick={() => setCurrentView('notifications')}
          onProfileClick={() => setCurrentView(isAdmin ? 'admin-dashboard' : 'organisation-profile')}
          onEmergencyClick={() => setCurrentView(isAdmin ? 'admin-emergency' : 'disaster-insights')}
        />

        <main className="pt-20 px-8 pb-24 bg-brand-ivory">
          <div className="max-w-[1400px] mx-auto">
            <aside className="mb-5 flex items-start gap-2 rounded-lg border border-brand-amber/30 bg-brand-amber-light/70 p-3 text-[11px] leading-relaxed text-brand-walnut" aria-label="Data persistence status">
              <span className="material-symbols-outlined text-[17px]" aria-hidden="true">info</span>
              <p>
                Frontend preview mode: registrations, sample documents, transfers, messages, and operational changes stay in this app session and reset when it is refreshed.
              </p>
            </aside>
            {/* NGO Views */}
            {currentView === 'dashboard' && (
              <DashboardPage onNavigate={setCurrentView} onShowToast={showToast} />
            )}
            {currentView === 'my-resources' && (
              <MyResourcesPage onShowToast={showToast} />
            )}
            {currentView === 'find-resources' && (
              <FindResourcesPage
                onShowToast={showToast}
                initialSearch={resourceSearchIntent}
                onNavigateToMessages={() => setCurrentView('messages')}
              />
            )}
            {currentView === 'ngo-directory' && <NgoDirectoryPage />}
            {currentView === 'ai-recommendations' && (
              <AiRecommendationsPage
                onShowToast={showToast}
                onNavigateToTransfers={() => setCurrentView('transfers')}
                onNavigateToMessages={() => setCurrentView('messages')}
              />
            )}
            {currentView === 'transfers' && (
              <TransfersPage onShowToast={showToast} />
            )}
            {currentView === 'messages' && (
              <MessagesPage onShowToast={showToast} />
            )}
            {currentView === 'disaster-insights' && (
              <DisasterInsightsPage
                onShowToast={showToast}
                onNavigateToFindResources={(item = '') => {
                  setResourceSearchIntent(item);
                  setCurrentView('find-resources');
                }}
                onNavigateToTransfers={() => setCurrentView('transfers')}
              />
            )}
            {currentView === 'organisation-profile' && (
              <ProfileVerificationPage onShowToast={showToast} />
            )}
            {currentView === 'notifications' && (
              <NotificationsPage onShowToast={showToast} onNavigate={setCurrentView} />
            )}

            {/* Admin Views */}
            {currentView === 'admin-dashboard' && (
              <AdminDashboardPage
                onNavigateToVerifications={() => setCurrentView('admin-verifications')}
                onShowToast={showToast}
              />
            )}
            {currentView === 'admin-verifications' && (
              <AdminVerificationPage onShowToast={showToast} />
            )}
            {currentView === 'admin-emergency' && (
              <DisasterInsightsPage
                onShowToast={showToast}
                onNavigateToFindResources={(item = '') => {
                  setResourceSearchIntent(item);
                  setCurrentView('find-resources');
                }}
                onNavigateToTransfers={() => setCurrentView('admin-audit')}
              />
            )}
            {currentView === 'admin-audit' && (
              <TransfersPage onShowToast={showToast} />
            )}
          </div>
        </main>
      </div>

      {/* Quick View / Role Switcher Ribbon (Bottom Left) */}
      <div className="fixed bottom-3 left-3 z-50 bg-white/95 backdrop-blur border border-brand-border px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-[12px]">
        <span className="font-display font-bold text-brand-walnut/70 text-[11px] uppercase tracking-wider flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
          Role &amp; View:
        </span>

        {isAdmin ? (
          <>
            <button
              onClick={() => setCurrentView('admin-dashboard')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'admin-dashboard' ? 'bg-brand-walnut text-white' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              Admin Overview
            </button>
            <button
              onClick={() => setCurrentView('admin-verifications')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'admin-verifications' ? 'bg-brand-walnut text-white' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              Application Review
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'dashboard' ? 'bg-brand-sage text-brand-walnut-dark font-semibold' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('my-resources')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'my-resources' ? 'bg-brand-sage text-brand-walnut-dark font-semibold' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              My Resources
            </button>
            <button
              onClick={() => setCurrentView('find-resources')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'find-resources' ? 'bg-brand-sage text-brand-walnut-dark font-semibold' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              Find Resources
            </button>
            <button
              onClick={() => setCurrentView('ai-recommendations')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'ai-recommendations' ? 'bg-brand-sage text-brand-walnut-dark font-semibold' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              AI Matches
            </button>
            <button
              onClick={() => setCurrentView('transfers')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'transfers' ? 'bg-brand-sage text-brand-walnut-dark font-semibold' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              Transfers
            </button>
            <button
              onClick={() => setCurrentView('messages')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentView === 'messages' ? 'bg-brand-sage text-brand-walnut-dark font-semibold' : 'text-brand-walnut hover:bg-brand-ivory'
              }`}
            >
              Messages
            </button>
          </>
        )}

      </div>
    </div>
  );
}
