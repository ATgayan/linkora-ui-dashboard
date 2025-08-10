"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "../dashboard-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/useAuth";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReportedUser {
  id: number;
  name: string;
  email: string;
  reason: string;
  status: string;
  reportedAt: string;
  avatar: string;
}

// Fetch the list of reported users from backend API
const fetchReportedUsers = async (): Promise<ReportedUser[]> => {
  const res = await fetch("http://localhost:3007/api/reported-users");
  return res.json();
};

export default function Reports() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [reports, setReports] = useState<ReportedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Show loading while checking authentication
  if (loading || !user) return null;

  // Load reports once when the component mounts
  useEffect(() => {
    fetchReportedUsers().then(setReports);
  }, []);

  // Mark a report as resolved on the server, then update local state
  const handleResolve = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3007/api/reported-users/${id}/resolve`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        setReports(
          reports.map((report) =>
            report.id === id ? { ...report, status: "resolved" } : report
          )
        );
      }
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  // Filter reports based on search text and selected status
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Review and manage reported users and content
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reports
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {reports.filter((r) => r.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Resolved Today
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {reports.filter((r) => r.status === "resolved").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully handled
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reported Users ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50 sticky top-0 z-10">
                      <tr className="bg-black">
                        <th className="p-4 text-left font-medium">User</th>
                        <th className="p-4 text-left font-medium">Name</th>
                        <th className="p-4 text-left font-medium">Email</th>
                        <th className="p-4 text-left font-medium">Reason</th>
                        <th className="p-4 text-left font-medium">Status</th>
                        <th className="p-4 text-left font-medium">
                          Reported At
                        </th>
                        <th className="p-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((report) => (
                          <tr
                            key={report.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-4">
                              <Avatar>
                                <AvatarImage
                                  src={report.avatar}
                                  alt={report.name}
                                />
                                <AvatarFallback>
                                  {report.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </td>
                            <td className="p-4">{report.name}</td>
                            <td className="p-4">{report.email}</td>
                            <td className="p-4">{report.reason}</td>
                            <td className="p-4">
                              {getStatusBadge(report.status)}
                            </td>
                            <td className="p-4">{report.reportedAt}</td>
                            <td className="p-4">
                              {report.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-100 text-green-800 hover:bg-green-200"
                                  onClick={() => handleResolve(report.id)}
                                >
                                  Resolve
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="py-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                      </PaginationItem>
                      {Array.from({
                        length: Math.ceil(
                          filteredReports.length / itemsPerPage
                        ),
                      }).map((_, index) => (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage(index + 1)}
                            isActive={currentPage === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(
                                Math.ceil(
                                  filteredReports.length / itemsPerPage
                                ),
                                prev + 1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(filteredReports.length / itemsPerPage)
                          }
                        >
                          Next
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  );
}

// Render badges with colors based on report status
function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 border-yellow-300"
        >
          Pending
        </Badge>
      );
    case "resolved":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Resolved
        </Badge>
      );
    case "banned":
      return <Badge variant="destructive">Banned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
 
