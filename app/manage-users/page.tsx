"use client";

import { useEffect, useState } from "react";
import { Check, UserX, Loader2 } from "lucide-react";
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
import DashboardLayout from "../dashboard";

import { useToast } from "@/components/ui/use-toast";

type Achievement = {
  title: string;
  description?: string;
  year: string;
}

export type Post = {
  id: string;
  title: string;
  content: string;
}

export type Props = {
  posts?: Post[];
}

export type User = {
  uid: string;
  fullName: string;
  degreeCard?: string | null;
  Gender?: string | null;
  profilePicture?: string | null;
  bannerImage?: string | null;
  email?: string | null;
  profileCompleteness: number;
  university?: {
    name?: string | null;
    faculty?: string | null;
    degree?: string | null;
    universityYear?: string | null;
    positions?: string | null;
  };
  relationshipState?: string | null;
  location?: string | null;
  joinDate?: string | null;
  personality?: {
    type: string | null;
    whoAmI?: string | null;
    hobbies?: string[];
    interests?: string | null;
    achievements?: Achievement[] | null;
    abilities?: string[] | null;
    skills?: string[];
  };
  socialPreferences?: {
    workWithPeople?: string;
    beAroundPeople?: string;
  };
  activity?: {
    posts?: number;
  };
  role?: string;
  register_state?: string;
  userquality?: string;
  profile_state?: string;
}

interface PendingUserFilters {
  search?: string;
  status?: string;
  gender?: string;
  year?: string;
  page?: number;
  limit?: number;
}

interface ApiResponse {
  success: boolean;
  data: User[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  message?: string;
}

interface ApiError {
  success: false;
  error: string;
  message: string;
}

export default function ManageUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [badgeState, setBadgeState] = useState('pending');
  
  // Loading states for individual actions
  const [approvingUsers, setApprovingUsers] = useState<Set<string>>(new Set());
  const [banningUsers, setBanningUsers] = useState<Set<string>>(new Set());
  const [bulkApproving, setBulkApproving] = useState(false);

  const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());
        if (statusFilter && statusFilter !== "all") queryParams.append("status", statusFilter);
        if (genderFilter && genderFilter !== "all") queryParams.append("gender", genderFilter);
        if (yearFilter && yearFilter !== "all") queryParams.append("year", yearFilter);
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", "20");

        const url = `${baseurl}/admin/pending-users?${queryParams.toString()}`;
        console.log("Fetching from URL:", url);

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", res.status);
        console.log("Response headers:", Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error Response:", errorText);
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Raw API Response:", data);
        console.log("Data type:", typeof data);
        console.log("Data keys:", Object.keys(data));

        if (data && typeof data === 'object') {
          // Handle different API response structures
          if (data.success === true || data.success === undefined) {
            const userData = data.data || data.users || data.result || data;
            const usersArray = Array.isArray(userData) ? userData : [];
            
            console.log("Processed users array:", usersArray);
            console.log("Users array length:", usersArray.length);
            
            setUsers(usersArray);
            setTotalPages(data.totalPages || Math.ceil((data.totalCount || usersArray.length) / 20) || 1);
            setTotalCount(data.totalCount || usersArray.length || 0);
            
            if (usersArray.length === 0) {
              console.warn("No users found in API response");
            }
          } else {
            console.error("API returned error:", data.message || data.error);
            toast({
              title: "Error",
              description: data.message || data.error || "Failed to fetch users",
              variant: "destructive",
            });
            setUsers([]);
            setTotalPages(1);
            setTotalCount(0);
          }
        } else {
          console.error("Invalid API response format:", data);
          setUsers([]);
          setTotalPages(1);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch pending users:", err);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please check your connection and try again.",
          variant: "destructive",
        });
        setUsers([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce for search
    const timeoutId = setTimeout(fetchUsers, searchQuery ? 500 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, genderFilter, yearFilter, currentPage, baseurl, toast]);

  
 // Handle user approval with optimistic UI update
const handleApprove = async (uid: string) => {
  setApprovingUsers((prev) => new Set([...prev, uid]));

  // Save current users for rollback
  const oldUsers = [...users];

  // Optimistic UI: instantly mark as approved
  setUsers((prev) =>
    prev.map((user) =>
      user.uid === uid ? { ...user, profile_state: "Approved" } : user
    )
  );

  try {
    console.log("Approving user with UID:", uid);
    const response = await fetch(`${baseurl}/admin/user-state`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statedata: "Approved",
        uid: uid,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // Remove from selection if selected
      setSelectedUsers((prev) => prev.filter((id) => id !== uid));

      toast({
        title: "✅ User Approved Successfully",
        description: "The user's status has been updated to Approved.",
      });
    } else {
      throw new Error(result.message || "Failed to approve user");
    }
  } catch (error) {
    console.error("Error approving user:", error);

    // Rollback UI changes
    setUsers(oldUsers);

    toast({
      title: "❌ Approval Failed",
      description: "Failed to approve user. Please try again.",
      variant: "destructive",
    });
  } finally {
    setApprovingUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(uid);
      return newSet;
    });
  }
};

// Handle user ban with optimistic UI update
const handleBan = async (uid: string) => {
  setBanningUsers((prev) => new Set([...prev, uid]));

  // Store old users list for rollback in case of error
  const oldUsers = [...users];

  // Instant UI update (change profile_state to "Banned")
  setUsers((prev) =>
    prev.map((user) =>
      user.uid === uid ? { ...user, profile_state: "Banned" } : user
    )
  );

  try {
    console.log("Banning user with UID:", uid);
    const response = await fetch(`${baseurl}/admin/user-state`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statedata: "Banned",
        uid: uid,
        reason: "Banned by administrator",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    setBadgeState(result.state);

    if (result.success) {
     
      setSelectedUsers((prev) => prev.filter((id) => id !== uid));
      toast({
        title: "🚫 User Banned Successfully",
        description:
          "The user's status has been updated to Banned.",
      });
    } else {
      throw new Error(result.message || "Failed to ban user");
    }
  } catch (error) {
    console.error("Error banning user:", error);

    // Rollback UI changes
    setUsers(oldUsers);

    toast({
      title: "❌ Ban Failed",
      description: "Failed to ban user. Please try again.",
      variant: "destructive",
    });
  } finally {
    setBanningUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(uid);
      return newSet;
    });
  }
};

  // Handle user resolution
  const handleResolve = async (userId: string) => {
    try {
      const response = await fetch(`${baseurl}/admin/pending-user/${userId}/resolve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resolve',
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setUsers((prev) =>
          prev.map((user) =>
            user.uid === userId ? { ...user, register_state: "resolved" } : user
          )
        );
        toast({
          title: "User Resolved",
          description: "The user's issue has been marked as resolved.",
        });
      } else {
        throw new Error(result.message || 'Failed to resolve user');
      }
    } catch (error) {
      console.error('Error resolving user:', error);
      toast({
        title: "Error",
        description: "Failed to resolve user. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    if (selectedUsers.length === 0) return;

    setBulkApproving(true);
    
    try {
      const response = await fetch(`${baseurl}/admin/pending-user/bulk-approve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action: 'bulk_approve',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const approvedCount = selectedUsers.length;
        
        // Remove approved users from table
        setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.uid)));
        
        // Clear selections
        setSelectedUsers([]);
        
        // Update total count
        setTotalCount(prev => prev - approvedCount);
        
        toast({
          title: "🎉 Bulk Approval Successful",
          description: `${approvedCount} users have been approved and are now active.`,
          
        });
      } else {
        throw new Error(result.message || 'Failed to approve users');
      }
    } catch (error) {
      console.error('Error bulk approving users:', error);
      toast({
        title: "❌ Bulk Approval Failed",
        description: "Failed to approve selected users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBulkApproving(false);
    }
  };

  // Client-side filtering (if needed)
  const filteredUsers = users.filter(user => {
    // If API doesn't handle filtering, do it client-side
    const matchesSearch = !searchQuery.trim() || 
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.profile_state === "Approved") ||
      (statusFilter === "pending" && user.profile_state === "pending") ||
      (statusFilter === "banned" && user.profile_state === "Banned") ||
      (statusFilter === "resolved" && user.register_state === "resolved");
    
    const matchesGender = genderFilter === "all" || user.Gender === genderFilter;
    
    const matchesYear = yearFilter === "all" || user.university?.universityYear === yearFilter;
    
    return matchesSearch && matchesStatus && matchesGender && matchesYear;
  });

  const toggleSelectUser = (userId: string) => {
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
      setSelectedUsers(filteredUsers.map((user) => user.uid));
    }
  };

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "Approved":
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
    case "Banned":
      return (
        <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200 border border-red-300 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400 dark:border-red-700">
          Banned
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700">
          Unknown
        </Badge>
      );
  }
};

  const getUserInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination controls
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
            Review and manage user accounts on the platform ({totalCount} total users)
          </p>
          {/* Debug info - remove in production */}
          <div className="text-xs text-gray-500 mt-1">
            Showing {filteredUsers.length} users | Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="flex-none mb-4 bg-blue-50/90 dark:bg-blue-900/20 backdrop-blur-sm border-blue-200/80 dark:border-blue-800/80 shadow-lg">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {selectedUsers.length} user(s) selected
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleBulkApprove}
                    disabled={bulkApproving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {bulkApproving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Approve Selected
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  placeholder="Search users by name or email..."
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
                    <SelectItem value="resolved">Resolved</SelectItem>
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
              {loading && <Loader2 className="inline h-4 w-4 ml-2 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full table-auto">
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
                      <th className="p-4 text-left font-semibold">University Year</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                            <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            <p className="mb-2">No users found matching the current filters.</p>
                            <p className="text-sm">
                              Total users in database: {totalCount} | 
                              Current page: {currentPage} | 
                              API base URL: {baseurl || 'Not configured'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isApproving = approvingUsers.has(user.uid);
                        const isBanning = banningUsers.has(user.uid);
                        
                        return (
                          <tr
                            key={user.uid}
                            className="border-b border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                          >
                            <td className="p-4">
                              <Checkbox
                                checked={selectedUsers.includes(user.uid)}
                                onCheckedChange={() => toggleSelectUser(user.uid)}
                                className="border-gray-300 dark:border-gray-600"
                                disabled={isApproving || isBanning}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={user.profilePicture || undefined}
                                    alt={user.fullName || 'User'}
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                    {getUserInitials(user.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {user.fullName || 'No name'}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.university?.name || 'No university'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                              {user.email || 'N/A'}
                            </td>
                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                              {user.Gender || 'N/A'}
                            </td>
                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                              {user.university?.universityYear || 'N/A'}
                            </td>
                            <td className="p-4">{getStatusBadge(user.profile_state)}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(user.uid)}
                                  disabled={
                                    isApproving || 
                                    isBanning ||
                                    user.profile_state === "Approved" ||
                                    user.profile_state === "resolved"
                                  }
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-w-[90px]"
                                >
                                  {isApproving ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                      Approving...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBan(user.uid)}
                                  disabled={
                                    isApproving || 
                                    isBanning ||
                                    user.profile_state === "Banned" ||
                                    user.register_state === "resolved"
                                  }
                                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-w-[80px]"
                                >
                                  {isBanning ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                      Banning...
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="h-4 w-4 mr-1" />
                                      Banned
                                    </>
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200/50 dark:border-gray-800/50">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalCount)} of {totalCount} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      const isCurrentPage = page === currentPage;
                      return (
                        <Button
                          key={page}
                          size="sm"
                          variant={isCurrentPage ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={isCurrentPage ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 text-gray-500">...</span>
                        <Button
                          size="sm"
                          variant={currentPage === totalPages ? "default" : "outline"}
                          onClick={() => handlePageChange(totalPages)}
                          disabled={loading}
                          className={currentPage === totalPages ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}