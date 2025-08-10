"use client"

import { useState } from "react"
import { Calendar, Search, Shield, Trash2, UserCheck, UserX } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard"

// Sample audit log data
const initialAuditLogs = [
  {
    id: 1,
    action: "User Approved",
    actionType: "user_approved",
    target: "Alex Johnson",
    targetType: "user",
    adminName: "Admin User",
    adminAvatar: "/placeholder.svg?height=32&width=32",
    timestamp: "2024-01-16 14:30:25",
    details: "User profile approved and activated",
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    action: "Collaboration Banned",
    actionType: "collaboration_banned",
    target: "Music Production Project",
    targetType: "collaboration",
    adminName: "Admin User",
    adminAvatar: "/placeholder.svg?height=32&width=32",
    timestamp: "2024-01-16 13:45:12",
    details: "Collaboration banned due to inappropriate content",
    ipAddress: "192.168.1.100",
  },
  {
    id: 3,
    action: "User Banned",
    actionType: "user_banned",
    target: "Sam Rodriguez",
    targetType: "user",
    adminName: "Admin User",
    adminAvatar: "/placeholder.svg?height=32&width=32",
    timestamp: "2024-01-16 12:15:08",
    details: "User banned for harassment and inappropriate behavior",
    ipAddress: "192.168.1.100",
  },
  {
    id: 4,
    action: "User Deleted",
    actionType: "user_deleted",
    target: "Casey Brown",
    targetType: "user",
    adminName: "Admin User",
    adminAvatar: "/placeholder.svg?height=32&width=32",
    timestamp: "2024-01-16 11:20:45",
    details: "User account permanently deleted",
    ipAddress: "192.168.1.100",
  },
  {
    id: 5,
    action: "Collaboration Approved",
    actionType: "collaboration_approved",
    target: "Research Paper on AI Ethics",
    targetType: "collaboration",
    adminName: "Admin User",
    adminAvatar: "/placeholder.svg?height=32&width=32",
    timestamp: "2024-01-16 10:30:22",
    details: "Collaboration project approved and made public",
    ipAddress: "192.168.1.100",
  },
  {
    id: 6,
    action: "Report Resolved",
    actionType: "report_resolved",
    target: "Riley Garcia",
    targetType: "report",
    adminName: "Admin User",
    adminAvatar: "/placeholder.svg?height=32&width=32",
    timestamp: "2024-01-16 09:45:33",
    details: "Spam report resolved, user warned",
    ipAddress: "192.168.1.100",
  },
]

export default function AuditLog() {
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.actionType === actionFilter

    return matchesSearch && matchesAction
  })

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "user_approved":
        return <UserCheck className="h-4 w-4 text-green-600" />
      case "user_banned":
        return <UserX className="h-4 w-4 text-red-600" />
      case "user_deleted":
        return <Trash2 className="h-4 w-4 text-red-600" />
      case "collaboration_approved":
        return <UserCheck className="h-4 w-4 text-green-600" />
      case "collaboration_banned":
        return <UserX className="h-4 w-4 text-red-600" />
      case "report_resolved":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case "user_approved":
      case "collaboration_approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "user_banned":
      case "collaboration_banned":
        return <Badge variant="destructive">Banned</Badge>
      case "user_deleted":
        return <Badge variant="destructive">Deleted</Badge>
      case "report_resolved":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Resolved</Badge>
      default:
        return <Badge variant="outline">{actionType}</Badge>
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
            <p className="text-muted-foreground">Track all administrative actions and system changes</p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLogs.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users Approved</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {auditLogs.filter((log) => log.actionType === "user_approved").length}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users Banned</CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {auditLogs.filter((log) => log.actionType === "user_banned").length}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Resolved</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {auditLogs.filter((log) => log.actionType === "report_resolved").length}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
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
                    placeholder="Search audit logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Action Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="user_approved">User Approved</SelectItem>
                      <SelectItem value="user_banned">User Banned</SelectItem>
                      <SelectItem value="user_deleted">User Deleted</SelectItem>
                      <SelectItem value="collaboration_approved">Collaboration Approved</SelectItem>
                      <SelectItem value="collaboration_banned">Collaboration Banned</SelectItem>
                      <SelectItem value="report_resolved">Report Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Log ({filteredLogs.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-medium">Action</th>
                      <th className="p-4 text-left font-medium">Target</th>
                      <th className="p-4 text-left font-medium">Admin</th>
                      <th className="p-4 text-left font-medium">Timestamp</th>
                      <th className="p-4 text-left font-medium">Details</th>
                      <th className="p-4 text-left font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.actionType)}
                            <span className="font-medium">{log.action}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{log.target}</div>
                            <div className="text-xs text-muted-foreground capitalize">{log.targetType}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={log.adminAvatar || "/placeholder.svg"} alt={log.adminName} />
                              <AvatarFallback>{log.adminName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{log.adminName}</div>
                              <div className="text-xs text-muted-foreground">{log.ipAddress}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{log.timestamp}</td>
                        <td className="p-4">
                          <div className="text-sm text-muted-foreground max-w-xs line-clamp-2">{log.details}</div>
                        </td>
                        <td className="p-4">{getActionBadge(log.actionType)}</td>
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
