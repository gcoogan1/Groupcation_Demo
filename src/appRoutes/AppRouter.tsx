import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./appRoutes";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {ROUTES.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          )
})}
      </Routes>
    </Router>
  );
};

export default AppRouter;
