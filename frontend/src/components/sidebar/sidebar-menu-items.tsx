"use client";
import { Home, Music, Search, ListMusic, Heart, History, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";

export default function SidebarMenuItems() {
  const path = usePathname();

  // Menu items.
  let items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      active: false,
    },
    {
      title: "Create",
      url: "/create",
      icon: Music,
      active: false,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
      active: false,
    },
    {
      title: "Playlists",
      url: "/playlists",
      icon: ListMusic,
      active: false,
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
      active: false,
    },
    {
      title: "History",
      url: "/history",
      icon: History,
      active: false,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      active: false,
    },
  ];

  items = items.map((item) => ({
    ...item,
    active: item.url === path,
  }));

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.active}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
