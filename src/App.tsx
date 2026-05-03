import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

import Home from "@/pages/home";
import Music from "@/pages/music";
import TrackDetail from "@/pages/track-detail";
import Licensing from "@/pages/licensing";
import VisualWorlds from "@/pages/visual-worlds";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Legal from "@/pages/legal";
import Admin from "@/pages/admin";
import MarketPage from "@/pages/market";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Track page views on every route change
function AnalyticsTracker() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Layout>
      <AnalyticsTracker />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/music" component={Music} />
        {/* Market routes MUST come before /music/:id */}
        <Route path="/music/all">{() => <MarketPage slug="all" />}</Route>
        <Route path="/music/western">{() => <MarketPage slug="western" />}</Route>
        <Route path="/music/bollywood">{() => <MarketPage slug="bollywood" />}</Route>
        <Route path="/music/international">{() => <MarketPage slug="international" />}</Route>
        <Route path="/music/:id" component={TrackDetail} />
        <Route path="/licensing" component={Licensing} />
        <Route path="/visual-worlds" component={VisualWorlds} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/legal" component={Legal} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
