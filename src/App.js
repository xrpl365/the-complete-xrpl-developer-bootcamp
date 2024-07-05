import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/Main";
import ManageAccount from "./pages/ManageAccount";
import ImportAccount from "./pages/ImportAccount";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Main />}
          ></Route>
          <Route
            path="/manage-account"
            element={<ManageAccount />}
          ></Route>
          <Route
            path="/import-account"
            element={<ImportAccount />}
          ></Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
