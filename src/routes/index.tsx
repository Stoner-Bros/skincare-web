import DashboardLayout from "@/components/layout/dashboard-layout";
import LoginPage from "@/pages/Auth/Login";
import WaitingBlog from "@/pages/Dashboard/Blog/WaitingBlog";
import Feedbacks from "@/pages/Dashboard/Feedbacks";
import AllOrder from "@/pages/Dashboard/Order/AllOrder";
import CheckInOrder from "@/pages/Dashboard/Order/CheckIn";
import Overview from "@/pages/Dashboard/Overview";
import Detox from "@/pages/Dashboard/Services/Detox";
import HairRemoval from "@/pages/Dashboard/Services/HairRemoval";
import Pricing from "@/pages/Dashboard/Services/Pricing";
import Skincare from "@/pages/Dashboard/Services/Skincare";
import WhiteningBath from "@/pages/Dashboard/Services/WhiteningBath";
import ManageConsultingOrders from "@/pages/Dashboard/SupportCustomer/ManageConsultingOrders";
import Skinsenger from "@/pages/Dashboard/SupportCustomer/Skinsenger";
import Accounts from "@/pages/Dashboard/User/Accounts";
import Customer from "@/pages/Dashboard/User/Customer";
import SkinTherapist from "@/pages/Dashboard/User/SkinTherapist";
import Staff from "@/pages/Dashboard/User/Staff";
import Home from "@/pages/Home";
import AboutUs from "@/pages/AboutUs/AboutUs";
import Services from "@/pages/Home/services";
import ContentPolicy from "@/pages/AboutUs/ContentPrivacy";
import PrivacyPolicy from "@/pages/AboutUs/PrivacyPolicy";
import Questionpage from "@/pages/Quiz/questionpage";
import QuizPage from "@/pages/Quiz/quizpage";
import AllTherapist from "@/pages/Therapists/allTherapist";
import NotFound from "@/pages/AboutUs/AboutUs";
import { Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import HomeLayout from "@/components/layout/home-layout";

// ----------------------------------------------------------------------

export default function AppRouter() {
  const systemRoute = [
    {
      path: "/dashboard",
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: <Overview />,
          index: true,
        },
        {
          path: "/dashboard/skin-care",
          element: <Skincare />,
        },
        {
          path: "/dashboard/hair-removal",
          element: <HairRemoval />,
        },
        {
          path: "/dashboard/whitening-bath",
          element: <WhiteningBath />,
        },
        {
          path: "/dashboard/detox",
          element: <Detox />,
        },
        {
          path: "/dashboard/pricing",
          element: <Pricing />,
        },
        {
          path: "/dashboard/all-blog",
          element: <AllOrder />,
        },
        {
          path: "/dashboard/waiting-blog",
          element: <WaitingBlog />,
        },
        {
          path: "/dashboard/order-checkin",
          element: <CheckInOrder />,
        },
        {
          path: "/dashboard/order-all",
          element: <AllOrder />,
        },
        {
          path: "/dashboard/feedback",
          element: <Feedbacks />,
        },
        {
          path: "/dashboard/user-customer",
          element: <Customer />,
        },
        {
          path: "/dashboard/user-skintherapist",
          element: <SkinTherapist />,
        },
        {
          path: "/dashboard/user-staff",
          element: <Staff />,
        },
        {
          path: "/dashboard/user-accounts",
          element: <Accounts />,
        },
        {
          path: "/dashboard/manage-consulting-order",
          element: <ManageConsultingOrders />,
        },
        {
          path: "/dashboard/skinsenger",
          element: <Skinsenger />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <HomeLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </HomeLayout>
      ),
      children: [
        {
          element: <Home />,
          index: true,
        },
        { path: "/login", element: <LoginPage /> },
        { path: "/quiz", element: <QuizPage /> },
        { path: "/about-us", element: <AboutUs /> },
        { path: "/therapist", element: <AllTherapist /> },
        { path: "/question", element: <Questionpage /> },
        { path: "/services", element: <Services /> },
        { path: "/content-policy", element: <ContentPolicy /> },
        { path: "/privacy-policy", element: <PrivacyPolicy /> },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes([...systemRoute, ...publicRoutes]);

  return routes;
}
