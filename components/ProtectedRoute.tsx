// "use client";

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

 

//   // Show loading spinner while checking auth
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   // If not authenticated, don't render anything (redirect will happen)
//   if (!user) {
//     return null;
//   }

//   return <>{children}</>;
// };