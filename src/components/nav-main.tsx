"use client";

import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import AddService from "@/pages/Services/add-service";
import { useToast } from "@/hooks/use-toast";
import serviceService from "@/services/service.services";
import EditService from "@/pages/Services/edit-service";
import AccessControl from "./AccessControl";
import { UserRole } from "@/context/RoleContext";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      serviceId?: number;
    }[];
    allowedRoles?: UserRole[];
  }[];
}) {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const { toast } = useToast();

  const handleAddServiceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddServiceOpen(true);
  };

  const handleAddServiceClose = () => {
    setIsAddServiceOpen(false);
  };

  const handleEditServiceClick = async (
    e: React.MouseEvent,
    serviceId: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await serviceService.getServiceById(serviceId);
      setSelectedService(response);
      setIsEditServiceOpen(true);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin dịch vụ",
        variant: "destructive",
      });
    }
  };

  const handleEditServiceClose = () => {
    setIsEditServiceOpen(false);
    setSelectedService(null);
  };

  const handleDeleteService = async (
    e: React.MouseEvent,
    serviceId: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) {
      try {
        await serviceService.deleteService(serviceId);
        toast({
          title: "Thành công",
          description: "Đã xóa dịch vụ thành công",
        });
        // Refresh the page to update the sidebar
        window.location.reload();
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa dịch vụ",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <AccessControl allowedRoles={item.allowedRoles}>
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.items ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.title === "Dịch vụ" && (
                          <Plus
                            className="ml-auto h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-800"
                            onClick={handleAddServiceClick}
                          />
                        )}
                        {item.title !== "Dịch vụ" && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="flex justify-between items-center pr-0"
                            >
                              <div className="flex w-full">
                                <Link to={subItem.url} className="flex-grow">
                                  <span>{subItem.title}</span>
                                </Link>
                                {item.title === "Dịch vụ" &&
                                  subItem.serviceId && (
                                    <div className="flex gap-2 ml-2">
                                      <Pencil
                                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-800"
                                        onClick={(e) =>
                                          handleEditServiceClick(
                                            e,
                                            subItem.serviceId!
                                          )
                                        }
                                      />
                                      <Trash2
                                        className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-800"
                                        onClick={(e) =>
                                          handleDeleteService(
                                            e,
                                            subItem.serviceId!
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <Link to={item.url} className="w-full">
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                )}
              </SidebarMenuItem>
            </Collapsible>
          </AccessControl>
        ))}
      </SidebarMenu>

      {/* Modal thêm dịch vụ */}
      <AddService open={isAddServiceOpen} onClose={handleAddServiceClose} />

      {/* Modal chỉnh sửa dịch vụ */}
      {selectedService && (
        <EditService
          open={isEditServiceOpen}
          onClose={handleEditServiceClose}
          service={selectedService}
        />
      )}
    </SidebarGroup>
  );
}
