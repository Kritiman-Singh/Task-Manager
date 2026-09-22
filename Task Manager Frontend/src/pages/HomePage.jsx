import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  LayoutDashboard,
  ListTodo,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuthStore } from "@/utils/auth";

const DEMO_TASKS = [
  { id: 1, title: "Design homepage mockup", tag: "Today", done: true },
  { id: 2, title: "Fix OAuth redirect on Vercel", tag: "Today", done: true },
  { id: 3, title: "Team standup meeting", tag: "Tomorrow", done: false },
  { id: 4, title: "Write weekly progress report", tag: "This week", done: false },
];

function HomePage() {
  const authenticated =
    useAuthStore((state) => state.status) === "authenticated";
  const [tasks, setTasks] = useState(DEMO_TASKS);

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const completed = tasks.filter((t) => t.done).length;
  const progress = Math.round((completed / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>TaskFlow | Organize your work</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple task management for busy teams</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Organize your work, one task at a time
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Create tasks, plan your day on the calendar, track completion and
            productivity analytics — all in one clean dashboard.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {authenticated ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">
                    Get started free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Free forever · Login with Google or GitHub
          </p>
        </div>
      </section>

      {/* Live demo preview */}
      <section>
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Today&apos;s tasks
                    </CardTitle>
                    <CardDescription>
                      Try it — tick a task off, just like in the app.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {completed}/{tasks.length} done
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={progress} className="h-2" />
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-md border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={
                        task.done
                          ? "flex-1 text-sm text-muted-foreground line-through"
                          : "flex-1 text-sm"
                      }
                    >
                      {task.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {task.tag}
                    </Badge>
                  </button>
                ))}
                <Link to={authenticated ? "/dashboard" : "/register"}>
                  <Button variant="ghost" size="sm" className="mt-1 gap-2">
                    <Plus className="h-4 w-4" /> Create your own tasks
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:col-span-2">
              <MiniStat
                icon={<ListTodo className="h-5 w-5" />}
                title="My Tasks"
                desc="All open tasks in one focused list."
              />
              <MiniStat
                icon={<CalendarDays className="h-5 w-5" />}
                title="Calendar"
                desc="Plan tasks day-by-day on a monthly view."
              />
              <MiniStat
                icon={<BarChart3 className="h-5 w-5" />}
                title="Analytics"
                desc="Daily, weekly & monthly productivity insights."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-14">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-semibold">
            Everything you need to stay on track
          </h2>
          <p className="mt-2 text-muted-foreground">
            A complete workspace: dashboard, tasks, calendar and reports.
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4">
          <Feature
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Smart Dashboard"
            desc="Today's tasks, upcoming deadlines and stats at a glance."
          />
          <Feature
            icon={<ListTodo className="h-5 w-5" />}
            title="Task Management"
            desc="Create, edit, complete and organize tasks with priorities."
          />
          <Feature
            icon={<CalendarDays className="h-5 w-5" />}
            title="Calendar View"
            desc="See your workload spread across days and weeks."
          />
          <Feature
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Completed History"
            desc="A full record of everything you've finished."
          />
          <Feature
            icon={<BarChart3 className="h-5 w-5" />}
            title="Analytics"
            desc="Completion rates and trends to improve your routine."
          />
          <Feature
            icon={<Settings className="h-5 w-5" />}
            title="Profile & Settings"
            desc="Manage your account, theme and preferences."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mt-14">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-semibold">Get going in 3 steps</h2>
          <p className="mt-2 text-muted-foreground">
            From signup to organized in under a minute.
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-3 px-4">
          <Step
            n={1}
            title="Create your account"
            desc="Register with email or one click via Google/GitHub."
          />
          <Step
            n={2}
            title="Add your tasks"
            desc="Capture everything on your plate with due dates."
          />
          <Step
            n={3}
            title="Track & complete"
            desc="Check things off and watch your analytics grow."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14">
        <div className="mx-auto max-w-6xl px-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-between gap-3 p-6 text-center md:flex-row md:text-left">
              <div>
                <CardTitle className="text-xl">
                  Ready to get organized?
                </CardTitle>
                <CardDescription>
                  Join TaskFlow and manage your first task in seconds.
                </CardDescription>
              </div>
              <div className="flex gap-3">
                {authenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg">Open Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg">Create account</Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline">
                        Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ========== Subcomponents ========== */

function MiniStat({ icon, title, desc }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border bg-card">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="grid h-9 w-9 place-items-center rounded-md border bg-card">
          {icon}
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Included in your dashboard
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Works on mobile & desktop
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Free to use
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

function Step({ n, title, desc }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Badge variant="secondary">Step {n}</Badge>
        <CardTitle className="mt-1 text-base">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        <p className="mt-3 text-sm text-muted-foreground">
          No setup needed — everything runs in your browser.
        </p>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-muted-foreground md:flex-row md:text-left">
        <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <Link to="/login">Login</Link>
          <span>·</span>
          <Link to="/register">Register</Link>
          <span>·</span>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}

export default HomePage;
