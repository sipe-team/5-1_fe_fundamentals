import { createBrowserRouter } from "react-router";
import { Layout } from "@/app/Layout";
import { NotFoundPage } from "@/app/NotFoundPage";
import { CreateReservationPage } from "@/pages/create-reservation/CreateReservationPage";
import { MyReservationsPage } from "@/pages/my-reservations/MyReservationsPage";
import { ReservationDetailPage } from "@/pages/reservation-detail/ReservationDetailPage";
import { TimelinePage } from "@/pages/timeline/TimelinePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <TimelinePage /> },
      { path: "reservations/new", element: <CreateReservationPage /> },
      { path: "reservations/:id", element: <ReservationDetailPage /> },
      { path: "my-reservations", element: <MyReservationsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
