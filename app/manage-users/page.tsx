"use client";

import { useEffect, useState } from "react";
import { Check, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DashboardLayout from "../dashboard-layout";
import { fetchUsersFromBackend } from "@/lib/fetchUsers";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  year: string;
  status: string;
  university: string;
  avatar: string;
  joinDate: string;
}

export default function ManageUsers() {
  const handleResolve = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: "resolved" } : user
      )
    );
    toast({
      title: "User Resolved",
      description: "The user's issue has been marked as resolved.",
    });
  };
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // ✅ Fetch user data from backend on first render
  useEffect(() => {
    fetchUsersFromBackend().then((data) => {
      // Add missing fields and normalize status to lowercase
      const enhanced = data.map((user: any, index: number) => ({
        ...user,
        status: user.status ? user.status.toLowerCase() : "pending",
        id: index + 1,
        avatar: "/placeholder.svg?height=40&width=40",
        joinDate: "2024-01-01", // static placeholder
      }));
      setUsers(enhanced);
    });
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesGender =
      genderFilter === "all" || user.gender === genderFilter;
    const matchesYear = yearFilter === "all" || user.year === yearFilter;

    return matchesSearch && matchesStatus && matchesGender && matchesYear;
  });

  const handleApprove = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: "active" } : user
      )
    );
    toast({
      title: "User Approved",
      description: "The user has been approved and is now active.",
    });
  };

  const handleBan = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: "banned" } : user
      )
    );
    toast({
      title: "User Banned",
      description: "The user has been banned.",
    });
  };

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border border-green-300 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:border-green-700">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 hover:from-yellow-200 hover:to-orange-200 border border-yellow-300 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400 dark:border-yellow-700">
            Pending
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200 border border-red-300 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400 dark:border-red-700">
            Banned
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 hover:from-blue-200 hover:to-indigo-200 border border-blue-300 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400 dark:border-blue-700">
            Resolved
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
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden p-6">
        <div className="flex-none mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Manage Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and manage user accounts on the platform
          </p>
        </div>

        {/* Filters */}
        <Card className="flex-none mb-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
          <CardHeader className="py-4">
            <CardTitle className="text-gray-900 dark:text-white">
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-900/95 border-gray-200/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-36 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-900/95 border-gray-200/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md">
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-36 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-900/95 border-gray-200/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md">
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="flex-1 min-h-0 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
          <CardHeader className="py-4 flex-none border-b border-gray-200/50 dark:border-gray-800/50">
            <CardTitle className="text-gray-900 dark:text-white">
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="border-b bg-gray-50/80 dark:bg-gray-800/80 sticky top-0 z-10 backdrop-blur-sm">
                    <tr className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={
                            filteredUsers.length > 0 &&
                            selectedUsers.length === filteredUsers.length
                          }
                          onCheckedChange={toggleSelectAll}
                          className="border-gray-300 dark:border-gray-600"
                        />
                      </th>
                      <th className="p-4 text-left font-semibold">User</th>
                      <th className="p-4 text-left font-semibold">Email</th>
                      <th className="p-4 text-left font-semibold">Gender</th>
                      <th className="p-4 text-left font-semibold">Year</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleSelectUser(user.id)}
                            className="border-gray-300 dark:border-gray-600"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="ring-2 ring-gray-200 dark:ring-gray-700">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.university}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                          {user.gender}
                        </td>
                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                          {user.year}
                        </td>
                        <td className="p-4">{getStatusBadge(user.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.id)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition-all duration-200"
                              disabled={
                                user.status === "active" ||
                                user.status === "resolved"
                              }
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBan(user.id)}
                              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-md transition-all duration-200"
                              disabled={
                                user.status === "banned" ||
                                user.status === "resolved"
                              }
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
