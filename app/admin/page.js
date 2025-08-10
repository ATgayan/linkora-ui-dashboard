"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Users, Users2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "../dashboard-layout";
import { useAuth } from "@/lib/useAuth";

// Mock data for analytics
const genderData = [
  { label: "Male", value: 45, color: "bg-blue-500" },
  { label: "Female", value: 55, color: "bg-green-500" },
];

const yearData = [
  { label: "1st Year", value: 35, color: "bg-blue-400" },
  { label: "2nd Year", value: 28, color: "bg-blue-500" },
  { label: "3rd Year", value: 22, color: "bg-blue-600" },
  { label: "4th Year", value: 15, color: "bg-blue-700" },
];

const topSkills = [
  { name: "Programming", count: 234, color: "#3b82f6" },
  { name: "Design", count: 189, color: "#6366f1" },
  { name: "Writing", count: 156, color: "#8b5cf6" },
  { name: "Photography", count: 134, color: "#a855f7" },
  { name: "Music", count: 98, color: "#c084fc" },
  { name: "Research", count: 87, color: "#d8b4fe" },
];

const topInterests = [
  { name: "Technology", count: 298, color: "#10b981" },
  { name: "Arts", count: 245, color: "#06b6d4" },
  { name: "Sports", count: 198, color: "#8b5cf6" },
  { name: "Music", count: 167, color: "#f59e0b" },
  { name: "Travel", count: 134, color: "#ef4444" },
  { name: "Gaming", count: 123, color: "#84cc16" },
];

const recentActivity = [
  {
    id: 1,
    type: "user_joined",
    message: "New user Alex Johnson joined",
    time: "2 minutes ago",
    icon: Users,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "collaboration_created",
    message: "New collaboration 'Mobile App Project' created",
    time: "15 minutes ago",
    icon: Users2,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "report_submitted",
    message: "User reported for inappropriate content",
    time: "1 hour ago",
    icon: TrendingUp,
    color: "text-red-600",
  },
  {
    id: 4,
    type: "user_approved",
    message: "User Maya Patel approved by admin",
    time: "2 hours ago",
    icon: Users,
    color: "text-green-600",
  },
];

// Bar Chart Component
const BarChart = ({ data }) => {
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <div className="w-20 text-sm font-medium text-right">{item.name}</div>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: item.color,
                }}
              >
                <span className="text-white text-xs font-medium">{item.count}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Pie Chart Component
const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercentage = 0;

  const segments = data.map((item) => {
    const percentage = (item.count / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    cumulativePercentage += percentage;
    return {
      ...item,
      percentage,
      startAngle,
      endAngle: cumulativePercentage * 3.6,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          <circle cx="100" cy="100" r="80" fill="transparent" />
          {segments.map((segment, index) => {
            const { startAngle, endAngle, color } = segment;
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            const x1 = 100 + 80 * Math.cos(startAngleRad);
            const y1 = 100 + 80 * Math.sin(startAngleRad);
            const x2 = 100 + 80 * Math.cos(endAngleRad);
            const y2 = 100 + 80 * Math.sin(endAngleRad);

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`,
            ].join(" ");

            return <path key={index} d={pathData} fill={color} stroke="white" strokeWidth="2" />;
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-sm font-medium">{segment.name}</span>
            <span className="text-sm text-muted-foreground">
              {segment.count} ({segment.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Show loading while checking authentication
  if (loading || !user) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}! Here&apos;s what&apos;s happening on your platform.
            </p>
          </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.3%</div>
            <p className="text-xs text-muted-foreground">User registration rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>User demographics breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {genderData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-10">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* University Year Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>University Year Distribution</CardTitle>
            <CardDescription>Students by academic year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {yearData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.value / 35) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-10">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills and Interests Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Skills - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Skills</CardTitle>
            <CardDescription>Popular skills among users</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={topSkills} />
          </CardContent>
        </Card>

        {/* Top Interests - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Interests</CardTitle>
            <CardDescription>Popular interests among users</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={topInterests} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                  <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
    </ThemeProvider>
  );
}