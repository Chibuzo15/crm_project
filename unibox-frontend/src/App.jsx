import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <main className="min-h-[100vh] w-[100vw]">
        <AppRoutes />
      </main>
    </Provider>
  );
}

export default App;
