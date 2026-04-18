import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CreateProvider } from "./contexts/CreateContext";
import Home from "./pages/Home";
import CreateStep1 from "./pages/CreateStep1";
import CreateStep2 from "./pages/CreateStep2";
import CreateStep3 from "./pages/CreateStep3";
import Account from "./pages/Account";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/create"} component={CreateStep1} />
      <Route path={"/create/strategy"} component={CreateStep2} />
      <Route path={"/create/result"} component={CreateStep3} />
      <Route path={"/account"} component={Account} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CreateProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CreateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
