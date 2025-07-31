import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, ThumbsUp, Users, Clock, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock discussion data
const discussionTopics = [
  {
    id: "1",
    title: "Understanding Time Complexity in Two Sum",
    author: "john_doe",
    authorAvatar: "https://i.pravatar.cc/150?u=john_doe",
    date: "2023-07-25",
    replies: 15,
    likes: 32,
    tags: ["two-sum", "time-complexity", "algorithms"],
    excerpt: "I'm trying to understand the time complexity of different approaches to solve the Two Sum problem. Can someone explain why the hash map approach is O(n)?"
  },
  {
    id: "2",
    title: "Best way to learn Graph Algorithms?",
    author: "coder123",
    authorAvatar: "https://i.pravatar.cc/150?u=coder123",
    date: "2023-07-23",
    replies: 24,
    likes: 45,
    tags: ["graph", "learning", "algorithms"],
    excerpt: "I've been struggling with graph algorithms. What's the best approach to learn and master them? Any recommended resources or practice problems?"
  },
  {
    id: "3",
    title: "Dynamic Programming vs Greedy Algorithms",
    author: "algo_fan",
    authorAvatar: "https://i.pravatar.cc/150?u=algo_fan",
    date: "2023-07-20",
    replies: 30,
    likes: 67,
    tags: ["dynamic-programming", "greedy", "comparison"],
    excerpt: "When should I use dynamic programming versus greedy algorithms? I'm having trouble understanding when each approach is more suitable."
  },
  {
    id: "4",
    title: "JavaScript Map vs Object for Hash Tables",
    author: "js_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=js_dev",
    date: "2023-07-18",
    replies: 12,
    likes: 28,
    tags: ["javascript", "hash-table", "data-structures"],
    excerpt: "When implementing hash table solutions in JavaScript, should I use Map or plain objects? What are the performance implications?"
  },
  {
    id: "5",
    title: "How to approach Hard problems efficiently?",
    author: "newbie_coder",
    authorAvatar: "https://i.pravatar.cc/150?u=newbie_coder",
    date: "2023-07-15",
    replies: 42,
    likes: 89,
    tags: ["hard-problems", "problem-solving", "tips"],
    excerpt: "I'm intimidated by Hard difficulty problems. What strategies or approaches do you use when tackling these challenging problems?"
  }
];

// Popular tags
const popularTags = [
  "algorithms", "data-structures", "dynamic-programming", "arrays", 
  "strings", "binary-trees", "graphs", "linked-list", "recursion", 
  "two-pointers", "sorting", "searching"
];

export default function DiscussPage() {
  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussion Forum</h1>
          <p className="text-muted-foreground">
            Connect with fellow learners, ask questions, and share insights
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search discussions" className="pl-10" />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="trending" className="mb-6">
            <TabsList>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Discussion Topics */}
          <div className="space-y-4">
            {discussionTopics.map((topic) => (
              <Card key={topic.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <Link to={`/discuss/${topic.id}`} className="hover:text-primary transition-colors">
                      {topic.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                      <AvatarFallback>{topic.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{topic.author}</span>
                    <span className="flex items-center text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(topic.date).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {topic.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {topic.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {topic.replies} replies
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {topic.likes} likes
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="mx-1">1</Button>
            <Button variant="outline" className="mx-1">2</Button>
            <Button variant="outline" className="mx-1">3</Button>
            <Button variant="outline" className="mx-1">...</Button>
            <Button variant="outline" className="mx-1">10</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["john_doe", "algo_fan", "js_dev", "coder123", "newbie_coder"].map((user, i) => (
                  <div key={user} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${user}`} alt={user} />
                      <AvatarFallback>{user.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user}</p>
                      <p className="text-xs text-muted-foreground">{100 - i * 15} contributions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Join Community */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Join Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with other developers to discuss problems, share solutions, and learn together.
              </p>
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}