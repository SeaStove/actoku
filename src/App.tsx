import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GridPage from "./GridPage";

const baseUrl = "https://actoku-backend.onrender.com/api/";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url] }) => {
        const { data } = await axios.get(`${baseUrl}${url}`);
        return data;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-100 w-100">
        <GridPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
