import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "KS Digital — Digital, done thoughtfully", description: "Digital products, websites and technology services built thoughtfully for growing businesses.", applicationName: "KS Digital", manifest: "/manifest.json", appleWebApp: { capable: true, statusBarStyle: "default", title: "KS Digital" }, icons: { icon: "/icon.svg" } };
export const viewport: Viewport = { themeColor: "#f8faff", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
