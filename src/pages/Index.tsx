import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, FileCode, BarChart } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { problems } from "@/lib/data";

export default function IndexPage() {
  const { isAuthenticated } = useAuth();
  const latestProblems = problems.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Master Data Structures & Algorithms
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Supercharge your coding skills with daily practice, structured roadmaps, and hands-on problem solving.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="px-8">
                  <Link to={isAuthenticated ? "/problems" : "/register"}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/roadmaps">View Roadmaps</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto flex justify-center">
              <div className="w-full h-full max-w-[400px] rounded-lg border bg-muted p-6 flex flex-col space-y-4 shadow-lg">
                <div className="rounded-md bg-background p-3 text-sm text-primary font-mono">
                  <pre>
                    <code>{`// Example problem
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return null;
}`}</code>
                  </pre>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Practice with real interview questions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
                Everything you need to become a better programmer
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Problem Solving</h3>
              <p className="text-muted-foreground text-center">
                Hundreds of curated coding challenges with detailed solutions and explanations
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Daily Puzzles</h3>
              <p className="text-muted-foreground text-center">
                Build a coding habit with progressive daily challenges from easy to hard
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Learning Roadmaps</h3>
              <p className="text-muted-foreground text-center">
                Structured learning paths with resources, projects and practice problems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Problems */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Latest Problems</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
                Start solving these popular challenges
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            {latestProblems.map((problem) => (
              <div key={problem.id} className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{problem.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    problem.difficulty === "Easy" 
                      ? "bg-green-100 text-green-600" 
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{problem.description.substring(0, 100)}...</p>
                <div className="flex items-center justify-between mt-4 pt-2 border-t">
                  <div className="flex space-x-1">
                    {problem.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 text-xs bg-muted rounded-full">
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs bg-muted rounded-full">
                        +{problem.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/problems/${problem.id}`}>Solve</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/problems">
                View All Problems
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why CodeCraft?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mx-auto">
                Join thousands of developers improving their skills
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 md:grid-cols-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold">500+</div>
                <p className="text-sm text-muted-foreground">Coding Problems</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold">20+</div>
                <p className="text-sm text-muted-foreground">Learning Roadmaps</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold">365</div>
                <p className="text-sm text-muted-foreground">Daily Puzzles</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl font-bold">10k+</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Start Your Coding Journey Today</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
                Join CodeCraft and take your programming skills to the next level
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="px-8">
                <Link to={isAuthenticated ? "/problems" : "/register"}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}