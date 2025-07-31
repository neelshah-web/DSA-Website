import { useState } from "react";
import { problems } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { ProblemCard } from "@/components/problem-card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Extract all unique tags from problems
const allTags = Array.from(
  new Set(problems.flatMap((problem) => problem.tags))
).sort();

export default function ProblemsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter problems based on search, difficulty, tags, and status
  const filteredProblems = problems.filter((problem) => {
    // Filter by search query
    if (
      searchQuery &&
      !problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by difficulty
    if (difficulty !== "all" && problem.difficulty !== difficulty) {
      return false;
    }

    // Filter by tags
    if (
      selectedTags.length > 0 &&
      !selectedTags.some((tag) => problem.tags.includes(tag))
    ) {
      return false;
    }

    // Filter by status (solved/unsolved)
    if (statusFilter === "solved") {
      return user?.solvedProblems?.includes(problem.id) || false;
    } else if (statusFilter === "unsolved") {
      return !user?.solvedProblems?.includes(problem.id);
    }

    return true;
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Problems</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search problems"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Tabs 
            value={statusFilter} 
            onValueChange={setStatusFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="solved">Solved</TabsTrigger>
              <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              id={problem.id}
              title={problem.title}
              difficulty={problem.difficulty}
              tags={problem.tags}
              isSolved={user?.solvedProblems?.includes(problem.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              No problems found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}