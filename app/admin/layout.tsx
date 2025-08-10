import { AuthProvider } from "@/lib/useAuth"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
    
  );
}