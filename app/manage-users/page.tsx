"use client"

import { useState } from "react"
import { Check, MoreHorizontal, Search, Trash2, UserX } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard-layout"

// Sample user data
const initialUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@stanford.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "Male",
    year: "2nd Year",
    status: "pending",
    university: "Stanford University",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Maya Patel",
    email: "maya.patel@mit.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "Female",
    year: "3rd Year",
    status: "active",
    university: "MIT",
    joinDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Jordan Lee",
    email: "jordan.lee@harvard.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "Non-binary",
    year: "1st Year",
    status: "pending",
    university: "Harvard University",
    joinDate: "2024-01-12",
  },
  {
    id: 4,
    name: "Taylor Smith",
    email: "taylor.smith@ucla.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "Female",
    year: "4th Year",
    status: "active",
    university: "UCLA",
    joinDate: "2024-01-08",
  },
  {
    id: 5,
    name: "Sam Rodriguez",
    email: "sam.rodriguez@berkeley.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "Male",
    year: "2nd Year",
    status: "banned",
    university: "UC Berkeley",
    joinDate: "2024-01-05",
  },
]

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesGender = genderFilter === "all" || user.gender === genderFilter
    const matchesYear = yearFilter === "all" || user.year === yearFilter

    return matchesSearch && matchesStatus && matchesGender && matchesYear
  })

  const handleApprove = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "active" } : user)))
  }

  const handleBan = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "banned" } : user)))
  }

  const handleDelete = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "banned":
        return <Badge variant="destructive">Banned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground">Review and manage user accounts on the platform</p>
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
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
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

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
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
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.university}</div>
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
                              <Button size="sm" variant="destructive" onClick={() => handleBan(user.id)}>
                                <UserX className="h-4 w-4 mr-1" />
                                Ban
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(user.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
  )
}
