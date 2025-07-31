import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProblemCard } from "@/components/problem-card";
import { problems, getProblemById } from "@/lib/data";
import { CalendarIcon, UserIcon, Settings, Calendar, LineChart } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  // Get solved problems
  const solvedProblems = user.solvedProblems
    .map(id => getProblemById(id))
    .filter(problem => problem !== undefined);

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* User Info Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-lg">
                  {user.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name || user.username}</CardTitle>
                <CardDescription className="text-base">@{user.username}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.bio && <p className="text-muted-foreground">{user.bio}</p>}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Joined {new Date(user.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {user.streak} day streak
                    </span>
                  </div>
                </div>

                <div className="flex pt-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-md text-center">
                    <div className="text-2xl font-bold">{solvedProblems.length}</div>
                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-md text-center">
                    <div className="text-2xl font-bold">{user.streak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Difficulty Breakdown</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md text-center">
                      <div className="text-lg font-semibold text-green-800 dark:text-green-300">
                        {solvedProblems.filter(p => p?.difficulty === 'Easy').length}
                      </div>
                      <div className="text-xs text-green-800 dark:text-green-300">Easy</div>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md text-center">
                      <div className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                        {solvedProblems.filter(p => p?.difficulty === 'Medium').length}
                      </div>
                      <div className="text-xs text-yellow-800 dark:text-yellow-300">Medium</div>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-md text-center">
                      <div className="text-lg font-semibold text-red-800 dark:text-red-300">
                        {solvedProblems.filter(p => p?.difficulty === 'Hard').length}
                      </div>
                      <div className="text-xs text-red-800 dark:text-red-300">Hard</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Section */}
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="solved" className="w-full">
            <TabsList>
              <TabsTrigger value="solved">Solved Problems</TabsTrigger>
              <TabsTrigger value="progress">Learning Progress</TabsTrigger>
              <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="solved" className="mt-6">
              {solvedProblems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {solvedProblems.map((problem) => (
                    problem && (
                      <ProblemCard
                        key={problem.id}
                        id={problem.id}
                        title={problem.title}
                        difficulty={problem.difficulty}
                        tags={problem.tags}
                        isSolved={true}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md">
                  <UserIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No solved problems yet</h3>
                  <p className="mt-1 text-muted-foreground">
                    Start solving problems to track your progress
                  </p>
                  <Button asChild className="mt-6">
                    <Link to="/problems">Explore Problems</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              <div className="text-center py-12 border rounded-md">
                <LineChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Progress tracking coming soon</h3>
                <p className="mt-1 text-muted-foreground">
                  We're working on adding detailed progress tracking features
                </p>
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="mt-6">
              <div className="text-center py-12 border rounded-md">
                <LineChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">Submission history coming soon</h3>
                <p className="mt-1 text-muted-foreground">
                  We're working on adding detailed submission history
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}