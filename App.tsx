import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Marketplace } from './pages/Marketplace';
import { Login } from './pages/Login';
import { CreateEditListing } from './pages/CreateEditListing';
import { ListingDetail } from './pages/ListingDetail';
import { AdminPanel } from './pages/AdminPanel';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { useStore } from './store';

function App() {
  const { checkSession } = useStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<CreateEditListing />} />
          <Route path="/edit-post/:id" element={<CreateEditListing />} />
          <Route path="/account/:id" element={<ListingDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/control-panel" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
