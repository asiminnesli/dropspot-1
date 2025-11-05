import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Drops from "./pages/drops";
import AdminDrops from "./pages/admin/drops";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./layout/default";
import { Toaster } from "react-hot-toast";
import "./i18n";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Layout>
                <Drops />
              </Layout>
            }
          />
          <Route
            path="/admin/drops"
            element={
              <Layout>
                <AdminDrops />
              </Layout>
            }
          />
        </Routes>
      </Router>
      <Toaster position="bottom-right" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;