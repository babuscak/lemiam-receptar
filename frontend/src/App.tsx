import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import LoginPage from './auth/LoginPage';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import Dashboard from './features/dashboard/Dashboard';
import ItemsListPage from './features/items/ItemsListPage';
import ItemDetailPage from './features/items/ItemDetailPage';
import QualificationsPage from './features/qualifications/QualificationsPage';
import RecipesListPage from './features/recipes/RecipesListPage';
import RecipeDetailPage from './features/recipes/RecipeDetailPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<ItemsListPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/recipes" element={<RecipesListPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/qualifications" element={<QualificationsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
