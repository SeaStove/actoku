import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GridPage from "./GridPage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url] }) => {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}${url}`
        );
        return data;
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <GridPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-100 w-100">
      <RouterProvider router={router} />
        
      </div>
    </QueryClientProvider>
  );
}

export default App;
