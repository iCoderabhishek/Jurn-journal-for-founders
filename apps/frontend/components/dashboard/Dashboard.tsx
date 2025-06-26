"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  PlusCircle,
  TrendingUp,
  Target,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  Flame,
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import components
import Timeline from "./Timeline";
import Insights from "./Insights";
import AskAI from "./AskAI";

// Import API hooks and types
import { useAPI } from "@/hooks/useAPI";
import {
  userAPI,
  entryAPI,
  milestoneAPI,
  quoteAPI,
  analyticsAPI,
  User,
  Entry,
  EntryTag,
  Milestone,
  Quote,
  Analytics,
  ApiResponse,
} from "@/config/axios";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "timeline" | "insights" | "goals"
  >("dashboard");

  // API calls with proper typing
  const {
    data: userResponse,
    loading: userLoading,
    error: userError,
  } = useAPI<User>(() => userAPI.getProfile());

  const { data: entriesResponse, loading: entriesLoading } = useAPI<Entry[]>(
    () => entryAPI.getEntries({ limit: 3 })
  );

  const { data: milestonesResponse, loading: milestonesLoading } = useAPI<
    Milestone[]
  >(() => milestoneAPI.getMilestones());

  const { data: dailyQuoteResponse, loading: quoteLoading } = useAPI<Quote>(
    () => quoteAPI.getDailyQuote()
  );

  const { data: analyticsResponse, loading: analyticsLoading } =
    useAPI<Analytics>(() => analyticsAPI.getAnalytics());

  // Extract data from responses with proper null checks
  const user = userResponse;
  const entries = entriesResponse || [];
  const milestones = milestonesResponse || [];
  const dailyQuote = dailyQuoteResponse;
  const analytics = analyticsResponse;

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Apply dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days since joining
  const daysSinceJoined = user
    ? Math.floor(
        (new Date().getTime() - new Date(user.joinedDate).getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  const iconMap: { [key: string]: React.ComponentType<any> } = {
    PlusCircle,
    Calendar,
    TrendingUp,
    Target,
  };

  const handleNavigation = (
    view: "dashboard" | "timeline" | "insights" | "goals"
  ) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "timeline":
        return <Timeline />;
      case "insights":
        return <Insights />;
      case "goals":
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                Your Goals 🎯
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your objectives and celebrate achievements
              </p>
            </div>
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-lg text-muted-foreground">
                Goal tracking and management features are in development
              </p>
            </Card>
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 18
                  ? "afternoon"
                  : "evening"}{" "}
              👋
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              Ready to capture today's insights?
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-2xl font-semibold">
              {user?.currentStreak || 0}
            </span>
            <span className="text-base text-muted-foreground">day streak</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <div className="text-3xl font-bold">{user?.totalEntries || 0}</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Total Entries</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <div className="text-3xl font-bold">{user?.currentStreak || 0}</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Day Streak</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-green-500" />
            <div className="text-3xl font-bold">
              {analytics?.entries.recent || 0}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">This Week</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <div className="text-3xl font-bold">
              {Math.round(
                (analytics?.words.total || 0) / (analytics?.entries.total || 1)
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Avg Words</p>
        </Card>
      </div>

      {/* Enhanced Daily Quote */}
      {dailyQuote && (
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <CardContent className="p-8 relative">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">💭</div>
              <div className="flex-1">
                <div className="mb-4">
                  <Badge variant="secondary" className="text-sm px-3 py-1 mb-4">
                    Quote of the Day
                  </Badge>
                </div>
                <blockquote className="text-2xl lg:text-3xl font-medium italic mb-4 leading-relaxed">
                  "{dailyQuote.text}"
                </blockquote>
                <cite className="text-lg text-muted-foreground font-medium">
                  — {dailyQuote.author}
                </cite>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold flex items-center">
          <span className="mr-3">⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-start space-y-3 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center space-x-3">
              <PlusCircle className="h-6 w-6" />
              <span className="text-lg font-medium">New Entry</span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Start writing today's journal
            </p>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-start space-y-3 hover:scale-[1.02] transition-transform"
            onClick={() => handleNavigation("timeline")}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6" />
              <span className="text-lg font-medium">Timeline</span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Browse your journal history
            </p>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-start space-y-3 hover:scale-[1.02] transition-transform"
            onClick={() => handleNavigation("insights")}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6" />
              <span className="text-lg font-medium">Insights</span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              View progress and analytics
            </p>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-start space-y-3 hover:scale-[1.02] transition-transform"
            onClick={() => handleNavigation("goals")}
          >
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6" />
              <span className="text-lg font-medium">Goals</span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Track your objectives
            </p>
          </Button>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold flex items-center">
            <span className="mr-3">📝</span>
            Recent Entries
          </h3>
          <Button variant="ghost" size="lg" className="text-base">
            View All
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {entriesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {entries.slice(0, 3).map((entry: Entry) => (
              <Card
                key={entry.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{entry.mood || "📝"}</span>
                    <div>
                      <h4 className="font-medium text-lg">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{entry.wordCount}w</span>
                  </div>
                </div>
                <p className="text-base text-muted-foreground mb-4 line-clamp-2">
                  {entry.content.substring(0, 150)}...
                </p>
                <div className="flex flex-wrap gap-2">
                  {entry.entryTags.slice(0, 3).map((entryTag: EntryTag) => (
                    <Badge
                      key={entryTag.id}
                      variant="secondary"
                      className="text-sm"
                    >
                      {entryTag.tag.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Ask AI Section */}
      <AskAI />

      {/* Milestones */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold flex items-center">
          <span className="mr-3">🎯</span>
          Milestones
        </h3>

        {milestonesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.slice(0, 3).map((milestone: Milestone) => (
              <Card key={milestone.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {milestone.achieved ? "🏆" : "⏳"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-lg">{milestone.title}</h4>
                      {milestone.achieved && (
                        <Badge variant="secondary" className="text-sm">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {milestone.description}
                    </p>
                    {!milestone.achieved && milestone.targetValue && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{milestone.currentValue}</span>
                          <span>{milestone.targetValue}</span>
                        </div>
                        <Progress
                          value={
                            (milestone.currentValue / milestone.targetValue) *
                            100
                          }
                          className="h-3"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">📔</div>
            <h1 className="text-2xl font-bold">Jurn</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-10 w-10 px-0"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-10 w-10 px-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-background">
          <div className="flex flex-col flex-1 pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">📔</div>
                <h1 className="text-3xl font-bold">Jurn</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-10 w-10 px-0"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* User Profile */}
            <div className="px-6 mb-6">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                <div className="text-3xl">{user?.avatar || "👤"}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {daysSinceJoined} days journaling
                  </p>
                </div>
              </div>
            </div>

            <nav className="px-6 space-y-2">
              <Button
                variant={currentView === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start text-base h-12"
                onClick={() => handleNavigation("dashboard")}
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
              <Button
                variant={currentView === "timeline" ? "secondary" : "ghost"}
                className="w-full justify-start text-base h-12"
                onClick={() => handleNavigation("timeline")}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Timeline
              </Button>
              <Button
                variant={currentView === "insights" ? "secondary" : "ghost"}
                className="w-full justify-start text-base h-12"
                onClick={() => handleNavigation("insights")}
              >
                <TrendingUp className="mr-3 h-5 w-5" />
                Insights
              </Button>
              <Button
                variant={currentView === "goals" ? "secondary" : "ghost"}
                className="w-full justify-start text-base h-12"
                onClick={() => handleNavigation("goals")}
              >
                <Target className="mr-3 h-5 w-5" />
                Goals
              </Button>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background border-r">
            <div className="flex flex-col pt-20 pb-4 overflow-y-auto">
              <div className="px-6 mb-6">
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                  <div className="text-3xl">{user?.avatar || "👤"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {daysSinceJoined} days journaling
                    </p>
                  </div>
                </div>
              </div>
              <nav className="px-6 space-y-2">
                <Button
                  variant={currentView === "dashboard" ? "secondary" : "ghost"}
                  className="w-full justify-start text-base h-12"
                  onClick={() => handleNavigation("dashboard")}
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  Dashboard
                </Button>
                <Button
                  variant={currentView === "timeline" ? "secondary" : "ghost"}
                  className="w-full justify-start text-base h-12"
                  onClick={() => handleNavigation("timeline")}
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  Timeline
                </Button>
                <Button
                  variant={currentView === "insights" ? "secondary" : "ghost"}
                  className="w-full justify-start text-base h-12"
                  onClick={() => handleNavigation("insights")}
                >
                  <TrendingUp className="mr-3 h-5 w-5" />
                  Insights
                </Button>
                <Button
                  variant={currentView === "goals" ? "secondary" : "ghost"}
                  className="w-full justify-start text-base h-12"
                  onClick={() => handleNavigation("goals")}
                >
                  <Target className="mr-3 h-5 w-5" />
                  Goals
                </Button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-6 lg:p-10">{renderCurrentView()}</main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
