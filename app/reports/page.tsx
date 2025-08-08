"use client";

import { useState } from "react";
import { AlertTriangle, Search, UserX } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Sample reports data
const initialReports = [
  {
    id: 1,
    reportedUser: "Sam Rodriguez",
    reportedUserAvatar: "/placeholder.svg?height=32&width=32",
    reason: "Inappropriate content sharing",
    description:
      "User has been sharing inappropriate images in collaboration posts",
    reportedBy: "Anonymous",
    dateReported: "2024-01-16",
    severity: "high",
    status: "pending",
  },
  {
    id: 2,
    reportedUser: "Casey Brown",
    reportedUserAvatar: "/placeholder.svg?height=32&width=32",
    reason: "Harassment in comments",
    description:
      "Multiple users reported harassment and bullying behavior in comments",
    reportedBy: "Multiple users",
    dateReported: "2024-01-15",
    severity: "high",
    status: "pending",
  },
  {
    id: 3,
    reportedUser: "Riley Garcia",
    reportedUserAvatar: "/placeholder.svg?height=32&width=32",
    reason: "Spam messaging",
    description:
      "User has been sending unsolicited promotional messages to other users",
    reportedBy: "Jamie Wilson",
    dateReported: "2024-01-14",
    severity: "medium",
    status: "pending",
  },
  {
    id: 4,
    reportedUser: "Morgan Kim",
    reportedUserAvatar: "/placeholder.svg?height=32&width=32",
    reason: "Fake profile information",
    description: "User appears to be using false identity and credentials",
    reportedBy: "Drew Patel",
    dateReported: "2024-01-13",
    severity: "medium",
    status: "pending",
  },
  {
    id: 5,
    reportedUser: "Quinn Chen",
    reportedUserAvatar: "/placeholder.svg?height=32&width=32",
    reason: "Inappropriate language",
    description: "User has been using offensive language in public posts",
    reportedBy: "Avery Thompson",
    dateReported: "2024-01-12",
    severity: "low",
    status: "resolved",
  },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportedUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || report.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleBanUser = (reportId: number) => {
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, status: "banned" } : report
      )
    );
  };

  const handleResolve = (reportId: number) => {
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, status: "resolved" } : report
      )
    );
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300 "
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
  };

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

          {/* Summary Cards */}
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
                  High Severity
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {reports.filter((r) => r.severity === "high").length}
                </div>
                <p className="text-xs text-muted-foreground">Critical issues</p>
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

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                    </SelectContent>
                  </Select>
                  <Select
                    value={severityFilter}
                    onValueChange={setSeverityFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Reported Users ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-medium">
                        Reported User
                      </th>
                      <th className="p-4 text-left font-medium">Reason</th>
                      <th className="p-4 text-left font-medium">Reported By</th>
                      <th className="p-4 text-left font-medium">Date</th>
                      <th className="p-4 text-left font-medium">Severity</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  report.reportedUserAvatar ||
                                  "/placeholder.svg"
                                }
                                alt={report.reportedUser}
                              />
                              <AvatarFallback>
                                {report.reportedUser.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {report.reportedUser}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-sm">
                              {report.reason}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {report.description}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{report.reportedBy}</td>
                        <td className="p-4 text-sm">{report.dateReported}</td>
                        <td className="p-4">
                          {getSeverityBadge(report.severity)}
                        </td>
                        <td className="p-4">{getStatusBadge(report.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {report.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBanUser(report.id)}
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Ban User
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResolve(report.id)}
                                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                >
                                  Resolve
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  );
}
