"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DashboardLayout from "../dashboard-layout";

interface ReportedUser {
  id: number;
  name: string;
  email: string;
  reason: string;
  status: string;
  reportedAt: string;
  avatar: string;
}

const fetchReportedUsers = async (): Promise<ReportedUser[]> => {
  const res = await fetch("http://localhost:3007/api/reported-users");
  return res.json();
};

export default function Reports() {
  const [reports, setReports] = useState<ReportedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchReportedUsers().then(setReports);
  }, []);

  const handleResolve = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3007/api/reported-users/${id}/resolve`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        // Update the local state
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
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and manage reported users and content
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pending Reports
              </CardTitle>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {reports.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolved Today
              </CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <AlertTriangle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {reports.filter((r) => r.status === "resolved").length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Successfully handled
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Reports
              </CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {reports.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All time reports
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-900/95 border-gray-200/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md">
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

        {/* Reports Table */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
          <CardHeader className="border-b border-gray-200/50 dark:border-gray-800/50">
            <CardTitle className="text-gray-900 dark:text-white">
              Reported Users ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="border-b bg-gray-50/80 dark:bg-gray-800/80 sticky top-0 z-10 backdrop-blur-sm">
                    <tr className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      <th className="p-4 text-left font-semibold">Avatar</th>
                      <th className="p-4 text-left font-semibold">Name</th>
                      <th className="p-4 text-left font-semibold">Email</th>
                      <th className="p-4 text-left font-semibold">Reason</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">
                        Reported At
                      </th>
                      <th className="p-4 text-left font-semibold">Actions</th>
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
                          className="border-b border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                        >
                          <td className="p-4">
                            <Avatar className="ring-2 ring-gray-200 dark:ring-gray-700">
                              <AvatarImage
                                src={report.avatar}
                                alt={report.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {report.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="p-4 font-medium text-gray-900 dark:text-white">
                            {report.name}
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">
                            {report.email}
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">
                            {report.reason}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(report.status)}
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">
                            {report.reportedAt}
                          </td>
                          <td className="p-4">
                            {report.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-green-300 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:border-green-700 dark:hover:from-green-800/50 dark:hover:to-emerald-800/50"
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

              {/* Pagination */}
              <div className="py-4 px-4 border-t border-gray-200/50 dark:border-gray-800/50">
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
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Previous
                      </Button>
                    </PaginationItem>
                    {Array.from({
                      length: Math.ceil(filteredReports.length / itemsPerPage),
                    }).map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                          className={
                            currentPage === index + 1
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }
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
                              Math.ceil(filteredReports.length / itemsPerPage),
                              prev + 1
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(filteredReports.length / itemsPerPage)
                        }
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
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
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 hover:from-yellow-200 hover:to-orange-200 border border-yellow-300 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400 dark:border-yellow-700">
          Pending
        </Badge>
      );
    case "resolved":
      return (
        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border border-green-300 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:border-green-700">
          Resolved
        </Badge>
      );
    case "banned":
      return (
        <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200 border border-red-300 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400 dark:border-red-700">
          Banned
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          {status}
        </Badge>
      );
  }
}
