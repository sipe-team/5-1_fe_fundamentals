import React from "react";
import { Route, Switch } from "wouter";
import ReactDOM from "react-dom/client";
import NotFoundPage from "@/pages/NotFound";
import { NuqsAdapter } from "nuqs/adapters/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  TimelinePage,
  NewReservationPage,
  MyReservationsPage,
  ReservationDetailPage,
} from "@/pages";
import { DevToolPanel } from "@/DevToolPanel";
import { initializeMockStorage } from "@/mocks/storage";

import "@/styles/reset.css";

async function enableMocking() {
  const { worker } = await import("@/mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

const queryClient = new QueryClient();

initializeMockStorage();

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <DevToolPanel />
          <Switch>
            <Route path="/" component={TimelinePage} />
            <Route path="/reservations/new" component={NewReservationPage} />
            <Route path="/reservations/:id" component={ReservationDetailPage} />
            <Route path="/my-reservations" component={MyReservationsPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </NuqsAdapter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
