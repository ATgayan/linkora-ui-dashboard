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

// Sample collaboration data
const initialCollaborations = [
  {
    id: 1,
    title: "Mobile App Development Project",
    createdBy: "Alex Johnson",
    createdByAvatar: "/placeholder.svg?height=32&width=32",
    tags: ["Programming", "React Native", "UI/UX"],
    status: "pending",
    createdDate: "2024-01-15",
    description: "Looking for developers to build a campus events mobile app",
  },
  {
    id: 2,
    title: "Research Paper on AI Ethics",
    createdBy: "Maya Patel",
    createdByAvatar: "/placeholder.svg?height=32&width=32",
    tags: ["Research", "AI", "Ethics"],
    status: "approved",
    createdDate: "2024-01-14",
    description: "Collaborative research on ethical implications of AI in education",
  },
  {
    id: 3,
    title: "Photography Exhibition Planning",
    createdBy: "Jordan Lee",
    createdByAvatar: "/placeholder.svg?height=32&width=32",
    tags: ["Photography", "Event Planning", "Art"],
    status: "pending",
    createdDate: "2024-01-13",
    description: "Organizing a campus-wide photography exhibition",
  },
  {
    id: 4,
    title: "Music Production Collaboration",
    createdBy: "Taylor Smith",
    createdByAvatar: "/placeholder.svg?height=32&width=32",
    tags: ["Music", "Production", "Audio"],
    status: "banned",
    createdDate: "2024-01-12",
    description: "Creating original music for university talent show",
  },
  {
    id: 5,
    title: "Startup Idea Development",
    createdBy: "Sam Rodriguez",
    createdByAvatar: "/placeholder.svg?height=32&width=32",
    tags: ["Business", "Startup", "Innovation"],
    status: "approved",
    createdDate: "2024-01-11",
    description: "Developing a sustainable tech startup idea",
  },
]

export default function ManageCollaborations() {
  const [collaborations, setCollaborations] = useState(initialCollaborations)
  const [selectedCollaborations, setSelectedCollaborations] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCollaborations = collaborations.filter((collab) => {
    const matchesSearch =
      collab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || collab.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleApprove = (collabId: number) => {
    setCollaborations(
      collaborations.map((collab) => (collab.id === collabId ? { ...collab, status: "approved" } : collab)),
    )
  }

  const handleBan = (collabId: number) => {
    setCollaborations(
      collaborations.map((collab) => (collab.id === collabId ? { ...collab, status: "banned" } : collab)),
    )
  }

  const handleDelete = (collabId: number) => {
    setCollaborations(collaborations.filter((collab) => collab.id !== collabId))
  }

  const toggleSelectCollaboration = (collabId: number) => {
    setSelectedCollaborations((prev) =>
      prev.includes(collabId) ? prev.filter((id) => id !== collabId) : [...prev, collabId],
    )
  }

  const toggleSelectAll = () => {
    if (selectedCollaborations.length === filteredCollaborations.length) {
      setSelectedCollaborations([])
    } else {
      setSelectedCollaborations(filteredCollaborations.map((collab) => collab.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
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
            <h1 className="text-3xl font-bold tracking-tight">Manage Collaborations</h1>
            <p className="text-muted-foreground">Review and manage collaboration projects on the platform</p>
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
                    placeholder="Search collaborations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Collaborations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Collaborations ({filteredCollaborations.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={
                            filteredCollaborations.length > 0 &&
                            selectedCollaborations.length === filteredCollaborations.length
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="p-4 text-left font-medium">Title</th>
                      <th className="p-4 text-left font-medium">Created By</th>
                      <th className="p-4 text-left font-medium">Tags</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollaborations.map((collab) => (
                      <tr key={collab.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedCollaborations.includes(collab.id)}
                            onCheckedChange={() => toggleSelectCollaboration(collab.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{collab.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{collab.description}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={collab.createdByAvatar || "/placeholder.svg"} alt={collab.createdBy} />
                              <AvatarFallback>{collab.createdBy.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{collab.createdBy}</div>
                              <div className="text-xs text-muted-foreground">{collab.createdDate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {collab.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {collab.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{collab.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(collab.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {collab.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(collab.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {collab.status !== "banned" && (
                              <Button size="sm" variant="destructive" onClick={() => handleBan(collab.id)}>
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Collaboration</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(collab.id)}>
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
