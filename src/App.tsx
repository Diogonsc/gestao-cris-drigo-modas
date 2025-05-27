import { Toaster } from "./components/ui/toaster";
import { AppRoutes } from "./routes";
import { Layout } from "./components/layout";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isLoginPage ? (
        <AppRoutes />
      ) : (
        <Layout>
          <AppRoutes />
        </Layout>
      )}
      <Toaster />
    </>
  );
}

export default App;
