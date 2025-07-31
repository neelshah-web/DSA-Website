import { useState, useEffect } from "react";
import { dailyPuzzles, getProblemById } from "@/lib/data";
import { useAuth, getUserDailyPuzzleDay } from "@/lib/auth";
import { ProblemCard } from "@/components/problem-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function DailyPuzzlesPage() {
  const { user, isAuthenticated } = useAuth();
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [currentWeekProgress, setCurrentWeekProgress] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      // Get the current day based on user's first login
      const day = getUserDailyPuzzleDay();
      setCurrentDay(day);
      
      // Calculate week progress
      if (user?.solvedProblems) {
        const weekPuzzleIds = dailyPuzzles.map(puzzle => puzzle.problemId);
        const solvedWeekPuzzles = weekPuzzleIds.filter(id => 
          user.solvedProblems.includes(id)
        );
        setCurrentWeekProgress(
          Math.round((solvedWeekPuzzles.length / 7) * 100)
        );
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Daily Puzzles</h1>
      
      {!isAuthenticated ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Sign in to access your personalized daily puzzle progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Current Day Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Daily Challenge</CardTitle>
                  <CardDescription>
                    Day {currentDay} of your DSA learning journey
                  </CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your daily puzzles follow a progression from basic to advanced concepts.
                    Each day builds upon the previous day's knowledge.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Week Progress</span>
                    <span>{currentWeekProgress}%</span>
                  </div>
                  <Progress value={currentWeekProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Today's Challenge */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Today's Challenge</h2>
            <div className="max-w-md">
              {(() => {
                const todayPuzzle = dailyPuzzles.find(puzzle => puzzle.day === currentDay);
                if (todayPuzzle) {
                  const problem = getProblemById(todayPuzzle.problemId);
                  if (problem) {
                    return (
                      <ProblemCard
                        id={problem.id}
                        title={problem.title}
                        difficulty={problem.difficulty}
                        tags={problem.tags}
                        isSolved={user?.solvedProblems?.includes(problem.id)}
                        isDaily={true}
                        day={currentDay}
                      />
                    );
                  }
                }
                return (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No challenge available for today.
                    </AlertDescription>
                  </Alert>
                );
              })()}
            </div>
          </div>
        </>
      )}
      
      {/* All Daily Puzzles */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">This Week's Progression</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dailyPuzzles.map((puzzle) => {
            const problem = getProblemById(puzzle.problemId);
            if (!problem) return null;
            
            return (
              <ProblemCard
                key={puzzle.id}
                id={problem.id}
                title={problem.title}
                difficulty={problem.difficulty}
                tags={problem.tags}
                isSolved={user?.solvedProblems?.includes(problem.id)}
                isDaily={true}
                day={puzzle.day}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}