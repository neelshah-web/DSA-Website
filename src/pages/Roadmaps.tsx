import { useState } from "react";
import { roadmaps } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RoadmapCard } from "@/components/roadmap-card";
import { Search } from "lucide-react";

export default function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState<string>("all");

  // Filter roadmaps based on search and level
  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    // Filter by search query
    if (
      searchQuery &&
      !roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by level
    if (level !== "all" && roadmap.level !== level) {
      return false;
    }

    return true;
  });

  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Learning Roadmaps</h1>
      
      <div className="max-w-3xl mb-6">
        <p className="text-muted-foreground">
          Follow structured learning paths to master programming languages, algorithms, and tools.
          Each roadmap provides curated resources and practice problems to help you progress efficiently.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search roadmaps"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Level Filter */}
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              id={roadmap.id}
              title={roadmap.title}
              description={roadmap.description}
              estimatedTime={roadmap.estimatedTime}
              level={roadmap.level}
              progress={0} // In a real app, we would calculate this from user progress
              topicCount={roadmap.topics.length}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              No roadmaps found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}