"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  Clock,
  Target,
  BookOpen,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  MessageCircle,
  Send,
  Sparkles,
  Users,
  Heart,
  Star,
  TrendingDown,
  Eye,
  Coffee,
  Moon,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AIResponse from "./AIResponse";

// Import data
import dashboardData from "@/lib/dashboardData.json";
import dummyData from "@/lib/dummyDataDashboard.json";

interface InsightsProps {}

const Insights: React.FC<InsightsProps> = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Generate insights data
  const generateInsights = () => {
    return {
      writingPatterns: {
        bestWritingTime: "9:00 AM",
        averageSessionLength: "12 minutes",
        mostProductiveDay: "Tuesday",
        writingStreak: dashboardData.user.streak,
        consistencyScore: 78,
        weeklyFrequency: 5.2,
        preferredLength: "Medium (200-400 words)",
        peakHours: ["9:00 AM", "2:00 PM", "8:00 PM"],
        writingVelocity: "+23% vs last month",
      },
      emotionalJourney: {
        dominantMood: "😊",
        moodTrend: "Improving",
        stressLevels: "Moderate",
        positivityScore: 82,
        emotionalRange: ["😊", "🤔", "😌", "💼", "🙂"],
        moodDistribution: {
          positive: 65,
          neutral: 25,
          challenging: 10,
        },
        emotionalGrowth: "+15% positivity",
        resilience: "Strong",
      },
      contentAnalysis: {
        topTopics: ["strategy", "team", "customers", "growth", "planning"],
        averageWordCount: dashboardData.stats.averageWordsPerEntry,
        readingTime: "2.5 minutes",
        complexityScore: "Intermediate",
        keyThemes: ["Leadership", "Product Development", "Team Building"],
        vocabularyRichness: "High",
        sentimentTrend: "Increasingly optimistic",
        actionableInsights: 12,
        reflectionDepth: "Deep",
      },
      growthMetrics: {
        weeklyGrowth: "+15%",
        monthlyGrowth: "+42%",
        goalCompletion: 67,
        milestoneProgress: 3,
        improvementAreas: ["Consistency", "Depth", "Reflection"],
        learningVelocity: "Accelerating",
        selfAwareness: "+28%",
        decisionQuality: "Improving",
      },
    };
  };

  const insights = generateInsights();

  const aiPrompts = [
    {
      category: "Writing Insights",
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
      prompts: [
        "What patterns do you see in my writing style?",
        "How has my writing evolved over time?",
        "What topics do I write about most frequently?",
        "When am I most productive in my writing?",
      ],
    },
    {
      category: "Emotional Analysis",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      prompts: [
        "What emotional patterns emerge from my entries?",
        "How do my moods correlate with my productivity?",
        "What triggers positive vs challenging days?",
        "How can I improve my emotional resilience?",
      ],
    },
    {
      category: "Growth & Goals",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      prompts: [
        "What progress am I making toward my goals?",
        "What obstacles keep appearing in my entries?",
        "How can I accelerate my personal growth?",
        "What should I focus on next quarter?",
      ],
    },
    {
      category: "Leadership Insights",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      prompts: [
        "How has my leadership style evolved?",
        "What team challenges do I mention most?",
        "How do I handle difficult decisions?",
        "What leadership skills should I develop?",
      ],
    },
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setSubmittedQuestion(question);

    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      setShowAIResponse(true);
      setQuestion("");
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setQuestion(prompt);
  };

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="space-y-8">
      {/* Header with Theme Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-3">
              Your Insights 📊
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Deep analysis of your journaling patterns and growth
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={toggleTheme}
            className="h-12 w-12 px-0"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* AI Response Display */}
      {showAIResponse && (
        <AIResponse
          question={submittedQuestion}
          onClose={() => setShowAIResponse(false)}
        />
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {insights.growthMetrics.monthlyGrowth}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Monthly Growth
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {insights.writingPatterns.consistencyScore}%
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Consistency
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {insights.emotionalJourney.positivityScore}%
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Positivity Score
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                {insights.growthMetrics.goalCompletion}%
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Goal Progress
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Insights Tabs */}
      <Tabs defaultValue="patterns" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-muted rounded-lg">
          <TabsTrigger
            value="patterns"
            className="text-base font-medium px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Writing Patterns
          </TabsTrigger>
          <TabsTrigger
            value="emotional"
            className="text-base font-medium px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Emotional Journey
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="text-base font-medium px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Content Analysis
          </TabsTrigger>
          <TabsTrigger
            value="growth"
            className="text-base font-medium px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Growth Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Clock className="mr-4 h-7 w-7 text-blue-500" />
                  Writing Habits
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Best Writing Time</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.writingPatterns.bestWritingTime}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Average Session</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.writingPatterns.averageSessionLength}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Most Productive Day</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.writingPatterns.mostProductiveDay}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Weekly Frequency</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.writingPatterns.weeklyFrequency} entries
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <BarChart3 className="mr-4 h-7 w-7 text-green-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Current Streak</span>
                      <span className="text-xl font-bold">
                        {insights.writingPatterns.writingStreak} days
                      </span>
                    </div>
                    <Progress
                      value={
                        (insights.writingPatterns.writingStreak / 30) * 100
                      }
                      className="h-4"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Consistency Score</span>
                      <span className="text-xl font-bold">
                        {insights.writingPatterns.consistencyScore}%
                      </span>
                    </div>
                    <Progress
                      value={insights.writingPatterns.consistencyScore}
                      className="h-4"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Writing Velocity</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 bg-green-100 text-green-700"
                    >
                      {insights.writingPatterns.writingVelocity}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 lg:col-span-2">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Coffee className="mr-4 h-7 w-7 text-amber-500" />
                  Peak Writing Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="grid grid-cols-3 gap-6">
                  {insights.writingPatterns.peakHours.map((hour, index) => (
                    <div
                      key={index}
                      className="text-center p-6 bg-muted/50 rounded-lg"
                    >
                      <div className="text-3xl mb-2">
                        {index === 0 ? "🌅" : index === 1 ? "☀️" : "🌙"}
                      </div>
                      <div className="text-xl font-bold">{hour}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 20) + 15}% of entries
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotional" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Brain className="mr-4 h-7 w-7 text-purple-500" />
                  Emotional Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Dominant Mood</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">
                        {insights.emotionalJourney.dominantMood}
                      </span>
                      <Badge variant="secondary" className="text-base">
                        Positive
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Mood Trend</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 bg-green-100 text-green-700"
                    >
                      {insights.emotionalJourney.moodTrend}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Positivity Score</span>
                      <span className="text-xl font-bold">
                        {insights.emotionalJourney.positivityScore}%
                      </span>
                    </div>
                    <Progress
                      value={insights.emotionalJourney.positivityScore}
                      className="h-4"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Emotional Growth</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 bg-blue-100 text-blue-700"
                    >
                      {insights.emotionalJourney.emotionalGrowth}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <PieChart className="mr-4 h-7 w-7 text-indigo-500" />
                  Mood Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Positive</span>
                      <span className="text-xl font-bold">
                        {insights.emotionalJourney.moodDistribution.positive}%
                      </span>
                    </div>
                    <Progress
                      value={
                        insights.emotionalJourney.moodDistribution.positive
                      }
                      className="h-4"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Neutral</span>
                      <span className="text-xl font-bold">
                        {insights.emotionalJourney.moodDistribution.neutral}%
                      </span>
                    </div>
                    <Progress
                      value={insights.emotionalJourney.moodDistribution.neutral}
                      className="h-4"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Challenging</span>
                      <span className="text-xl font-bold">
                        {insights.emotionalJourney.moodDistribution.challenging}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        insights.emotionalJourney.moodDistribution.challenging
                      }
                      className="h-4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 lg:col-span-2">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Heart className="mr-4 h-7 w-7 text-red-500" />
                  Emotional Range
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="grid grid-cols-5 gap-6">
                  {insights.emotionalJourney.emotionalRange.map(
                    (mood, index) => (
                      <div
                        key={index}
                        className="text-center p-6 bg-muted/50 rounded-lg"
                      >
                        <div className="text-4xl mb-3">{mood}</div>
                        <div className="text-lg font-bold">
                          {Math.floor(Math.random() * 30) + 10}%
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          of entries
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <BookOpen className="mr-4 h-7 w-7 text-blue-500" />
                  Content Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Average Word Count</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.contentAnalysis.averageWordCount} words
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Reading Time</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.contentAnalysis.readingTime}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Complexity Level</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.contentAnalysis.complexityScore}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Vocabulary Richness</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 bg-purple-100 text-purple-700"
                    >
                      {insights.contentAnalysis.vocabularyRichness}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Zap className="mr-4 h-7 w-7 text-yellow-500" />
                  Content Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Sentiment Trend</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 bg-green-100 text-green-700"
                    >
                      {insights.contentAnalysis.sentimentTrend}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Actionable Insights</span>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {insights.contentAnalysis.actionableInsights} found
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Reflection Depth</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 bg-blue-100 text-blue-700"
                    >
                      {insights.contentAnalysis.reflectionDepth}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Star className="mr-4 h-7 w-7 text-amber-500" />
                  Top Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="flex flex-wrap gap-3">
                  {insights.contentAnalysis.topTopics.map((topic, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-base px-4 py-2"
                    >
                      #{topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Eye className="mr-4 h-7 w-7 text-green-500" />
                  Core Themes
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {insights.contentAnalysis.keyThemes.map((theme, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-lg font-medium">{theme}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <TrendingUp className="mr-4 h-7 w-7 text-green-500" />
                  Growth Trajectory
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Weekly Growth</span>
                      <span className="text-xl font-bold text-green-600">
                        {insights.growthMetrics.weeklyGrowth}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Monthly Growth</span>
                      <span className="text-xl font-bold text-green-600">
                        {insights.growthMetrics.monthlyGrowth}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-lg">Goal Completion</span>
                      <span className="text-xl font-bold">
                        {insights.growthMetrics.goalCompletion}%
                      </span>
                    </div>
                    <Progress
                      value={insights.growthMetrics.goalCompletion}
                      className="h-4"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Self-Awareness</span>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 bg-purple-100 text-purple-700"
                    >
                      {insights.growthMetrics.selfAwareness}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Award className="mr-4 h-7 w-7 text-orange-500" />
                  Development Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground mb-6">
                    Focus areas for continued growth:
                  </p>
                  <div className="space-y-4">
                    {insights.growthMetrics.improvementAreas.map(
                      (area, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                        >
                          <span className="text-lg font-medium">{area}</span>
                          <Badge variant="outline" className="text-base">
                            {Math.floor(Math.random() * 30) + 60}%
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 lg:col-span-2">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center">
                  <Brain className="mr-4 h-7 w-7 text-indigo-500" />
                  Leadership Development
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="text-3xl mb-3">🎯</div>
                    <h4 className="text-lg font-semibold mb-2">
                      Decision Quality
                    </h4>
                    <p className="text-base text-muted-foreground">
                      {insights.growthMetrics.decisionQuality}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="text-3xl mb-3">⚡</div>
                    <h4 className="text-lg font-semibold mb-2">
                      Learning Velocity
                    </h4>
                    <p className="text-base text-muted-foreground">
                      {insights.growthMetrics.learningVelocity}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="text-3xl mb-3">🧠</div>
                    <h4 className="text-lg font-semibold mb-2">
                      Self-Awareness
                    </h4>
                    <p className="text-base text-muted-foreground">
                      {insights.growthMetrics.selfAwareness} improvement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ask AI Section */}
      <div className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ask-ai" className="border rounded-lg">
            <AccordionTrigger className="px-8 py-6 hover:no-underline">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">
                    Get More From Your Journal
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Ask our AI for insights, prompts, and personalized
                    recommendations
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-8 pb-8">
              <div className="space-y-8">
                {/* AI Prompt Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiPrompts.map((category, categoryIndex) => (
                    <Card key={categoryIndex} className="p-6 border-dashed">
                      <div className="flex items-center space-x-3 mb-4">
                        {category.icon}
                        <h4 className="text-xl font-semibold">
                          {category.category}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {category.prompts.map((prompt, promptIndex) => (
                          <Button
                            key={promptIndex}
                            variant="ghost"
                            className="w-full text-left justify-start h-auto p-3 text-base hover:bg-muted/50"
                            onClick={() => handlePromptClick(prompt)}
                          >
                            <MessageCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                            <span className="text-left">{prompt}</span>
                          </Button>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Question Input */}
                <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                      <h4 className="text-2xl font-semibold">
                        Ask Your AI Journal Assistant
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <Textarea
                        placeholder="What would you like to know about your journaling journey? Ask about patterns, get writing prompts, or request insights..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="min-h-[120px] text-lg resize-none"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-base text-muted-foreground">
                          <MessageCircle className="h-5 w-5" />
                          <span>
                            AI responses are based on your journal entries and
                            patterns
                          </span>
                        </div>

                        <Button
                          onClick={handleAskQuestion}
                          disabled={!question.trim() || isLoading}
                          size="lg"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Thinking...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-3" />
                              Ask AI
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6">
                    <div className="text-4xl mb-3">🎯</div>
                    <h5 className="text-xl font-semibold mb-2">Personalized</h5>
                    <p className="text-lg text-muted-foreground">
                      Insights tailored to your unique writing style and
                      patterns
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <div className="text-4xl mb-3">⚡</div>
                    <h5 className="text-xl font-semibold mb-2">Instant</h5>
                    <p className="text-lg text-muted-foreground">
                      Get immediate responses and actionable recommendations
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <div className="text-4xl mb-3">🔒</div>
                    <h5 className="text-xl font-semibold mb-2">Private</h5>
                    <p className="text-lg text-muted-foreground">
                      Your journal data stays secure and confidential
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Insights;
