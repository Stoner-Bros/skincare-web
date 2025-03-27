import {
  BookOpen,
  CalendarArrowDown,
  MessageCircleHeart,
  MessageCircleQuestion,
  MessagesSquare,
  NotebookText,
  PanelsTopLeft,
  UserRound,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import serviceService from "@/services/service.services";
import { useNavigate } from "react-router-dom";

// Khởi tạo trạng thái ban đầu
const initialNavData = {
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
          url: "/dashboard/price",
        },
      ],
    },
    {
      title: "Skin Test",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Quản lý bài kiểm tra",
          url: "/dashboard/skin-test",
        },
        {
          title: "Quản lý kết quả",
          url: "/dashboard/skin-test/manage",
        },
        //  {
        //     title: "Thêm mới",
        //     url: "/dashboard/skin-test/create",
        //   },
      ],
    },
    {
      title: "Đặt lịch",
      url: "#",
      icon: CalendarArrowDown,
      isActive: false,
      items: [
        {
          title: "Checkin",
          url: "/dashboard/order-checkin",
        },
        {
          title: "Chờ duyệt",
          url: "/dashboard/order-waiting",
        },
        {
          title: "Toàn bộ",
          url: "/dashboard/order-all",
        },
      ],
    },
    {
      title: "Người dùng",
      url: "#",
      icon: UserRound,
      isActive: false,
      items: [
        {
          title: "Khách hàng",
          url: "/dashboard/user-customer",
        },
        {
          title: "Chuyên gia da",
          url: "/dashboard/user-skintherapist",
        },
        {
          title: "Nhân viên",
          url: "/dashboard/user-staff",
        },
        {
          title: "Tài khoản",
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
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: MessageCircleHeart,
      isActive: false,
      // items: [],
    },
    {
      title: "Tư vấn",
      url: "/dashboard/consultation",
      icon: MessageCircleQuestion,
      isActive: false,
    },
    {
      title: "Blog",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Đợi duyệt",
          url: "/dashboard/waiting-blog",
        },
        {
          title: "Đã duyệt",
          url: "/dashboard/all-blog",
        },
      ],
    },
    {
      title: "Comment",
      url: "/dashboard/comment",
      icon: MessageCircleHeart,
      isActive: false,
      // items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navData, setNavData] = useState(initialNavData);
  const navigate = useNavigate();

  // Lấy danh sách dịch vụ từ API và cập nhật menu
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getServices();

        let servicesList: any[] = [];
        if (Array.isArray(response)) {
          servicesList = response;
        } else if ("items" in response) {
          servicesList = response.items;
        }

        // Nếu có danh sách dịch vụ, cập nhật lại menu
        if (servicesList && servicesList.length > 0) {
          const newNavData = { ...navData };

          // Tìm menu dịch vụ
          const serviceMenuIndex = newNavData.navMain.findIndex(
            (item) => item.title === "Dịch vụ"
          );

          if (serviceMenuIndex !== -1) {
            // Tạo items mới từ danh sách dịch vụ
            const serviceItems = servicesList.map((service) => ({
              title: service.serviceName,
              url: `/dashboard/services/treatments/${service.serviceId}`,
              serviceId: service.serviceId,
            }));

            // Cập nhật items cho menu dịch vụ
            newNavData.navMain[serviceMenuIndex].items = serviceItems;

            // Cập nhật state
            setNavData(newNavData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách dịch vụ:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <img src="/logo.gif" alt="logo" onClick={() => navigate("/")} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
