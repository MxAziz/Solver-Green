// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   Users,
//   CalendarRange,
//   Wallet,
//   UsersRound,
//   Megaphone,
//   Settings2,
//   LogOut,
//   Menu,
//   X,
//   PanelLeftClose,
//   PanelLeftOpen,
//   Terminal,
// } from "lucide-react";

// // ---------- Types ----------
// type NavItem = {
//   label: string;
//   href: string;
//   icon: React.ComponentType<{ className?: string }>;
//   badge?: number;
// };

// type SidebarProps = {
//   adminName?: string;
//   adminRole?: string;
//   /** Optional count shown as a live badge on "Registered Users" */
//   newRegistrationsCount?: number;
//   onLogout?: () => void;
// };

// // ---------- Nav data ----------
// const OVERVIEW_ITEMS: NavItem[] = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
// ];

// const MANAGE_ITEMS: Omit<NavItem, "badge">[] = [
//   { label: "Events", href: "/dashboard/events", icon: CalendarRange },
//   { label: "Verify Payments", href: "/dashboard/payments", icon: Wallet },
//   { label: "Members", href: "/dashboard/members", icon: UsersRound },
//   { label: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
//   { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
// ];

// export default function Sidebar({
//   adminName = "Admin",
//   adminRole = "Super Admin",
//   newRegistrationsCount,
//   onLogout,
// }: SidebarProps) {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   // Close the mobile drawer automatically whenever the route changes.
//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   // Prevent background scroll while the mobile drawer is open.
//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   const isActive = (href: string) =>
//     href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

//   return (
//     <>
//       {/* ---------------- Mobile top bar / trigger ---------------- */}
//       {/* Hamburger only — no logo/name here. The logo & club name only
//           appear once the drawer is opened (see the sidebar header below). */}
//       <div className="sticky top-0 z-30 flex items-center border-b border-[#E4EAE3] bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
//         <button
//           type="button"
//           onClick={() => setMobileOpen(true)}
//           aria-label="Open menu"
//           className="rounded-lg p-2 text-[#101913] transition hover:bg-[#F4F7F3]"
//         >
//           <Menu className="h-5 w-5" />
//         </button>
//       </div>

//       {/* ---------------- Mobile backdrop ---------------- */}
//       {mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           aria-hidden
//           className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
//         />
//       )}

//       {/* ---------------- Sidebar ---------------- */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col bg-[#0E2B1C] text-white transition-transform duration-300 ease-out
//           ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
//           lg:sticky lg:inset-y-auto lg:top-0 lg:left-auto lg:h-screen lg:translate-x-0 lg:self-start
//           ${collapsed ? "lg:w-20" : "lg:w-72"}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-5">
//           <Link
//             href="/dashboard"
//             className={`flex items-center gap-3 overflow-hidden ${collapsed ? "lg:justify-center lg:w-full" : ""}`}
//           >
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img src="/logo/sg-logo.png" alt="Solver Green" className="h-6 w-6 object-contain" />
//             </div>
//             <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
//               <p className="font-display truncate text-sm font-semibold text-white">
//                 Solver Green
//               </p>
//               <p className="font-mono-brand flex items-center gap-1 truncate text-[10px] tracking-wide text-[#C99A44]">
//                 <Terminal className="h-2.5 w-2.5" />
//                 admin_panel
//               </p>
//             </div>
//           </Link>

//           {/* Mobile close */}
//           <button
//             type="button"
//             onClick={() => setMobileOpen(false)}
//             aria-label="Close menu"
//             className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
//           >
//             <X className="h-5 w-5" />
//           </button>

//           {/* Desktop collapse toggle */}
//           <button
//             type="button"
//             onClick={() => setCollapsed((c) => !c)}
//             aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             className="hidden rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:block"
//           >
//             {collapsed ? (
//               <PanelLeftOpen className="h-4.5 w-4.5" />
//             ) : (
//               <PanelLeftClose className="h-4.5 w-4.5" />
//             )}
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
//           <NavGroup label="Overview" collapsed={collapsed}>
//             {OVERVIEW_ITEMS.map((item) => (
//               <NavLink
//                 key={item.href}
//                 item={item}
//                 active={!!isActive(item.href)}
//                 collapsed={collapsed}
//               />
//             ))}

//             {/* Registered users — highlighted call-to-action */}
//             <NavLink
//               item={{
//                 label: "Registered Users",
//                 href: "/dashboard/registrations",
//                 icon: Users,
//                 badge: newRegistrationsCount,
//               }}
//               active={!!isActive("/dashboard/registrations")}
//               collapsed={collapsed}
//               emphasize
//             />
//           </NavGroup>

//           <NavGroup label="Manage" collapsed={collapsed}>
//             {MANAGE_ITEMS.map((item) => (
//               <NavLink
//                 key={item.href}
//                 item={item}
//                 active={!!isActive(item.href)}
//                 collapsed={collapsed}
//               />
//             ))}
//           </NavGroup>
//         </nav>

//         {/* Footer / admin profile */}
//         <div className="border-t border-white/10 p-3">
//           <div
//             className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? "lg:justify-center" : ""}`}
//           >
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F7A4D] text-sm font-semibold text-white">
//               {adminName.charAt(0).toUpperCase()}
//             </div>
//             <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
//               <p className="truncate text-sm font-medium text-white">{adminName}</p>
//               <p className="truncate text-xs text-white/50">{adminRole}</p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onLogout}
//             className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-red-500/10 hover:text-red-300 ${
//               collapsed ? "lg:justify-center" : ""
//             }`}
//           >
//             <LogOut className="h-4 w-4 shrink-0" />
//             <span className={collapsed ? "lg:hidden" : ""}>Log out</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// // ---------- Building blocks ----------
// function NavGroup({
//   label,
//   collapsed,
//   children,
// }: {
//   label: string;
//   collapsed: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <p
//         className={`font-mono-brand mb-2 px-3 text-[10px] uppercase tracking-[0.15em] text-white/35 ${
//           collapsed ? "lg:hidden" : ""
//         }`}
//       >
//         {label}
//       </p>
//       <div className="space-y-1">{children}</div>
//     </div>
//   );
// }

// function NavLink({
//   item,
//   active,
//   collapsed,
//   emphasize,
// }: {
//   item: NavItem;
//   active: boolean;
//   collapsed: boolean;
//   emphasize?: boolean;
// }) {
//   const Icon = item.icon;

//   return (
//     <Link
//       href={item.href}
//       title={collapsed ? item.label : undefined}
//       className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
//         ${collapsed ? "lg:justify-center" : ""}
//         ${
//           active
//             ? "bg-[#1F7A4D] text-white shadow-[0_6px_16px_-6px_rgba(31,122,77,0.6)]"
//             : emphasize
//               ? "bg-white/5 text-[#C99A44] hover:bg-white/10"
//               : "text-white/70 hover:bg-white/10 hover:text-white"
//         }`}
//     >
//       {active && (
//         <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#3FAE73] lg:block hidden" />
//       )}
//       <Icon className="h-4.5 w-4.5 shrink-0" />
//       <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>

//       {typeof item.badge === "number" && item.badge > 0 && (
//         <span
//           className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C99A44] px-1.5 text-[11px] font-semibold text-[#0E2B1C] ${
//             collapsed ? "lg:absolute lg:-right-1 lg:-top-1 lg:ml-0" : ""
//           }`}
//         >
//           {item.badge}
//         </span>
//       )}
//     </Link>
//   );
// }