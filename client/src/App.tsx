import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SemanticProvider } from "@/context/SemanticContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Editor from "@/pages/Editor";
import Graph from "@/pages/Graph";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/editor" component={Editor}/>
      <Route path="/graph" component={Graph}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SemanticProvider>
          <Toaster />
          <Router />
        </SemanticProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;