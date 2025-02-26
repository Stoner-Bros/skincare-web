import {
  BookOpen,
  CalendarArrowDown,
  MessageCircleHeart,
  MessagesSquare,
  NotebookText,
  PanelsTopLeft,
  UserRound,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tổng quan",
      url: "/dashboard",
      icon: PanelsTopLeft,
      isActive: false,
      // items: [],
    },
    {
      title: "Dịch vụ",
      url: "#",
      icon: NotebookText,
      isActive: false,
      items: [
        {
          title: "Chăm sóc da",
          url: "/dashboard/skin-care",
        },
        {
          title: "Triệt lông",
          url: "/dashboard/hair-removal",
        },
        {
          title: "Tắm trắng",
          url: "/dashboard/whitening-bath",
        },
        {
          title: "Thải độc",
          url: "/dashboard/detox",
        },
        {
          title: "Bảng giá",
          url: "/dashboard/detox",
        },
      ],
    },
    {
      title: "Blog",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Toàn bộ",
          url: "/dashboard/all-blog",
        },
        {
          title: "Chờ duyệt",
          url: "/dashboard/waiting-blog",
        },
      ],
    },
    {
      title: "Order",
      url: "#",
      icon: CalendarArrowDown,
      isActive: false,
      items: [
        {
          title: "Checkin",
          url: "/dashboard/order-checkin",
        },
        {
          title: "Toàn bộ",
          url: "/dashboard/order-all",
        },
      ],
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: MessageCircleHeart,
      isActive: false,
      // items: [],
    },
    {
      title: "User",
      url: "#",
      icon: UserRound,
      isActive: false,
      items: [
        {
          title: "Customer",
          url: "/dashboard/user-customer",
        },
        {
          title: "Skin Therapist",
          url: "/dashboard/user-skintherapist",
        },
        {
          title: "Staff",
          url: "/dashboard/user-staff",
        },
        {
          title: "Account",
          url: "/dashboard/user-accounts",
        },
      ],
    },
    {
      title: "Hỗ trợ khách hàng",
      url: "#",
      icon: MessagesSquare,
      isActive: false,
      items: [
        {
          title: "Quản lý đơn tư vấn",
          url: "/dashboard/manage-consulting-order",
        },
        {
          title: "Skinsenger",
          url: "/dashboard/skinsenger",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <img src="/LuxSpaLogo.svg" alt="logo" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
