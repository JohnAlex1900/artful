import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import DesignProcess from "@/pages/design-process";
import Portfolio from "@/pages/portfolio";
import Contact from "@/pages/contact";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import PageTransition from "@/components/page-transition";
import { usePageLoading } from "@/hooks/use-loading";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/design-process" component={DesignProcess} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isLoading = usePageLoading();
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading && <Loading />}
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <PageTransition>
              <Router />
            </PageTransition>
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
