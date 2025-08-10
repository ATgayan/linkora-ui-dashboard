"use client";
import { BarChart3, Users, Users2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "./dashboard-layout";

const ICON_MAP = { Users, Users2, TrendingUp };

type GenderData = { label: string; value: number; color: string }[];
type YearData = { label: string; value: number; color: string }[];
type SkillData = { name: string; count: number; color: string }[];
type InterestData = { name: string; count: number; color: string }[];
type ActivityData = {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: string;
  color: string;
}[];

// Percentage Bar Component
const PercentageBar = ({ data }: { data: GenderData | YearData }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percentage = total ? ((item.value / total) * 100).toFixed(1) : 0;
        const barWidth = ((item.value / maxValue) * 100).toFixed(1);

        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-right">
              {item.label}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-between px-2"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: item.color
                      .replace("bg-", "")
                      .replace("-500", ""),
                    background: item.color.includes("blue")
                      ? "#3b82f6"
                      : item.color.includes("pink")
                      ? "#ec4899"
                      : item.color.includes("purple")
                      ? "#8b5cf6"
                      : item.color.includes("green")
                      ? "#10b981"
                      : item.color.includes("orange")
                      ? "#f59e0b"
                      : item.color.includes("red")
                      ? "#ef4444"
                      : "#6b7280",
                  }}
                >
                  <span className="text-white text-xs font-medium">
                    {item.value}
                  </span>
                  <span className="text-white text-xs font-medium">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Pie Chart Component
const PieChart = ({ data }: { data: InterestData }) => {
  const total = data.reduce(
    (sum: number, item: InterestData[number]) => sum + item.count,
    0
  );
  let cumulativePercentage = 0;

  const segments = data.map((item: InterestData[number]) => {
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
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="transform -rotate-90"
        >
          <circle cx="100" cy="100" r="80" fill="transparent" />
          {segments.map((segment: (typeof segments)[number], index: number) => {
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

            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {segments.map((segment: (typeof segments)[number]) => (
          <div key={segment.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
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

export default function Dashboard() {
  // State variables
  const [genderData, setGenderData] = useState<GenderData>([]);
  const [yearData, setYearData] = useState<YearData>([]);
  const [topSkills, setTopSkills] = useState<SkillData>([]);
  const [topInterests, setTopInterests] = useState<InterestData>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityData>([]);

  // useEffect(() => {
  //   fetch("http://localhost:3007/api/dashboard/gender")
  //     .then((res) => res.json())
  //     .then(setGenderData);
  //   fetch("http://localhost:3007/api/dashboard/year")
  //     .then((res) => res.json())
  //     .then(setYearData);
  //   fetch("http://localhost:3007/api/dashboard/skills")
  //     .then((res) => res.json())
  //     .then(setTopSkills);
  //   fetch("http://localhost:3007/api/dashboard/interests")
  //     .then((res) => res.json())
  //     .then(setTopInterests);
  //   fetch("http://localhost:3007/api/dashboard/activity")
  //     .then((res) => res.json())
  //     .then(setRecentActivity);
  // }, []);

  // Bar Chart Component
  const BarChart = ({ data }: { data: SkillData }) => {
    const maxCount = Math.max(
      ...data.map((item: SkillData[number]) => item.count)
    );

    return (
      <div className="space-y-3">
        {data.map((item: SkillData[number]) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-right">
              {item.name}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: item.color,
                  }}
                >
                  <span className="text-white text-xs font-medium">
                    {item.count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Pie Chart Component
  const PieChart = ({ data }: { data: InterestData }) => {
    const total = data.reduce(
      (sum: number, item: InterestData[number]) => sum + item.count,
      0
    );
    let cumulativePercentage = 0;

    const segments = data.map((item: InterestData[number]) => {
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
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="transform -rotate-90"
          >
            <circle cx="100" cy="100" r="80" fill="transparent" />
            {segments.map(
              (segment: (typeof segments)[number], index: number) => {
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

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              }
            )}
          </svg>
        </div>
        <div className="space-y-2">
          {segments.map((segment: (typeof segments)[number]) => (
            <div key={segment.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
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
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening on your platform.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            {/*<Card>
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
            </Card>*/}

            {/*<Card>
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
            </Card>*/}

            {/*<Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+15.3%</div>
                <p className="text-xs text-muted-foreground">User registration rate</p>
              </CardContent>
            </Card>*/}
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
                <PercentageBar data={genderData} />
              </CardContent>
            </Card>

            {/* University Year Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>University Year Distribution</CardTitle>
                <CardDescription>Students by academic year</CardDescription>
              </CardHeader>
              <CardContent>
                <PercentageBar data={yearData} />
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
              <CardDescription>
                Latest platform activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent =
                    ICON_MAP[activity.icon as keyof typeof ICON_MAP] || Users;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50"
                    >
                      <div
                        className={`p-2 rounded-full bg-muted ${activity.color}`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
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
