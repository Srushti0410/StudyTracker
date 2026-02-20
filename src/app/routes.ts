import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Goals } from "./components/Goals";
import { Performance } from "./components/Performance";
import { WorkTracker } from "./components/WorkTracker";
import { CalendarView } from "./components/CalendarView";
import { Profile } from "./components/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    Component: Layout, // Pathless layout route
    children: [
      { path: "dashboard", Component: Dashboard },
      { path: "goals", Component: Goals },
      { path: "performance", Component: Performance },
      { path: "tracker", Component: WorkTracker },
      { path: "calendar", Component: CalendarView },
      { path: "profile", Component: Profile },
    ],
  },
]);
