import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ScenarioLab from "./pages/ScenarioLab";
import SocialReplay from "./pages/SocialReplay";
import KnowledgeFeed from "./pages/KnowledgeFeed";
import GrowthJourney from "./pages/GrowthJourney";
import EmberCompass from "./pages/EmberCompass";
import Onboarding from "./pages/Onboarding";
import { CreateAccount, SignIn } from "./pages/AuthPage";
import ProductShell from "./components/ProductShell";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/scenario"
          element={
            <ProductShell>
              <ScenarioLab />
            </ProductShell>
          }
        />
        <Route
          path="/replay"
          element={
            <ProductShell>
              <SocialReplay />
            </ProductShell>
          }
        />
        <Route
          path="/knowledge"
          element={
            <ProductShell>
              <KnowledgeFeed />
            </ProductShell>
          }
        />
        <Route
          path="/growth"
          element={
            <ProductShell>
              <GrowthJourney />
            </ProductShell>
          }
        />
        <Route
          path="/compass"
          element={
            <ProductShell>
              <EmberCompass />
            </ProductShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
