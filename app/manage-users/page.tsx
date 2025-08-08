"use client";

import { useEffect, useState } from "react";
import { Check, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "../dashboard-layout";

// 👇 import your fetch function (make sure path is correct)
import { fetchUsersFromBackend } from "@/lib/fetchUsers"; // 👈

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // ✅ Fetch user data from backend on first render
  useEffect(() => {
    fetchUsersFromBackend().then((data) => {
      // Add missing fields like id, avatar, joinDate if not provided by backend
      const enhanced = data.map((user, index) => ({
        ...user,
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
  };

  const handleBan = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: "banned" } : user
      )
    );
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
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pending
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
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden p-4 md:p-8">
          <div className="flex-none mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground">
              Review and manage user accounts on the platform
            </p>
          </div>

          {/* Filters */}
          <Card className="flex-none mb-4">
            <CardHeader className="py-3">
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search users..."
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
                    <SelectContent className="bg-white dark:bg-gray-950 border shadow-lg">
                      <SelectItem
                        value="all"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        All Status
                      </SelectItem>
                      <SelectItem
                        value="Active"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Active
                      </SelectItem>
                      <SelectItem
                        value="Pending"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Pending
                      </SelectItem>
                      <SelectItem
                        value="Banned"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Banned
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border shadow-lg">
                      <SelectItem
                        value="all"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        All Genders
                      </SelectItem>
                      <SelectItem
                        value="Male"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="Female"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border shadow-lg">
                      <SelectItem
                        value="all"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        All Years
                      </SelectItem>
                      <SelectItem
                        value="1st Year"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        1st Year
                      </SelectItem>
                      <SelectItem
                        value="2nd Year"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        2nd Year
                      </SelectItem>
                      <SelectItem
                        value="3rd Year"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        3rd Year
                      </SelectItem>
                      <SelectItem
                        value="4th Year"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        4th Year
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="flex-1 min-h-0 overflow-hidden">
            <CardHeader className="py-3 flex-none">
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-48px)]">
              <table className="w-full min-w-[800px]">
                <thead className="border-b bg-muted/50 sticky top-0 z-10">
                  <tr className="text-sm font-medium text-muted-foreground bg-black">
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={
                          filteredUsers.length > 0 &&
                          selectedUsers.length === filteredUsers.length
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left font-medium">User</th>
                    <th className="p-4 text-left font-medium">Email</th>
                    <th className="p-4 text-left font-medium">Gender</th>
                    <th className="p-4 text-left font-medium">Year</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.university}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{user.email}</td>
                      <td className="p-4 text-sm">{user.gender}</td>
                      <td className="p-4 text-sm">{user.year}</td>
                      <td className="p-4">{getStatusBadge(user.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {user.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {user.status !== "banned" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBan(user.id)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  );
}
