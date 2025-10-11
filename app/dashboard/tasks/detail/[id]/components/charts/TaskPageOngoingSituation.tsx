"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Pie,
  PieChart,
  Rectangle,
  Sector,
  XAxis,
  YAxis,
} from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/ui/shadcn/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/ui/shadcn/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/shadcn/components/ui/select";
import { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";
import { motion, Variants } from "motion/react";
import { ChartBar, PieChartIcon } from "lucide-react";

export const description =
  "An interactive pie chart of ongoing tasks situation";

// Define variants for smoother mode switching
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0, transition: { duration: 0.3 }, height: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  collection: {
    label: "Collection",
  },
  overdue: {
    label: "Overdue",
    color: "var(--chart-1)",
  },
  overdueSoon: {
    label: "Soon",
    color: "var(--chart-2)",
  },
  tomorrow: {
    label: "Tomorrow",
    color: "var(--chart-3)",
  },
  ongoing: {
    label: "Ongoing",
    color: "var(--chart-4)",
  },
  archived: {
    label: "Archived",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export interface OngoingSituation {
  activeFilter?: keyof CategorizedTasks | undefined;
  setActiveFilter?: (n: keyof CategorizedTasks) => void;
  categorizedTasks: CategorizedTasks;
}

export function TaskPageOngoingSituation({
  activeFilter,
  setActiveFilter,
  categorizedTasks,
}: OngoingSituation) {
  const id = "ongoing-situation-chart";
  const [mode, setMode] = React.useState<"pie" | "bar">("pie");
  const filters = [
    "overdue",
    "overdueSoon",
    "tomorrow",
    "ongoing",
    "archived",
  ] as const;

  // Ensure activeFilter is narrowed to one of the allowed filter keys (or default to "ongoing")
  const filter: (typeof filters)[number] = ((): (typeof filters)[number] => {
    if (!activeFilter) return "ongoing";
    return filters.includes(activeFilter as (typeof filters)[number])
      ? (activeFilter as (typeof filters)[number])
      : "ongoing";
  })();

  const situationData = [
    {
      collection: "overdue",
      label: "Overdue",
      tasks: categorizedTasks.overdue?.length,
      fill: "var(--color-overdue)",
    },
    {
      collection: "overdueSoon",
      label: "Overdue Soon",
      tasks: categorizedTasks.overdueSoon?.length,
      fill: "var(--color-overdueSoon)",
    },
    {
      collection: "tomorrow",
      label: "Overdue Tomorrow",
      tasks: categorizedTasks.tomorrow?.length,
      fill: "var(--color-tomorrow)",
    },
    {
      collection: "ongoing",
      label: "Ongoing Tasks",
      tasks: categorizedTasks.ongoing?.length,
      fill: "var(--color-ongoing)",
    },
    {
      collection: "archived",
      label: "Archived Tasks",
      tasks: categorizedTasks.archived?.length,
      fill: "var(--color-archived)",
    },
  ];

  const descriptions: Record<
    keyof Pick<
      CategorizedTasks,
      "overdue" | "overdueSoon" | "tomorrow" | "ongoing" | "archived"
    >,
    string
  > = {
    overdue: "Showing active tasks that have passed their deadline date",
    overdueSoon: "Showing active tasks due within the next 23 hours",
    tomorrow: "Showing active tasks that are due tomorrow",
    ongoing: "Showing active tasks due later or without a deadline date",
    archived: "Showing tasks that have been archived and stored",
  };

  const activeIndex = React.useMemo(
    () => situationData.findIndex((item) => item.collection === filter),
    [activeFilter, categorizedTasks, filter]
  );
  const collections = React.useMemo(
    () => situationData.map((item) => item.collection),
    []
  );

  const isNotRenderable =
    categorizedTasks?.ongoing.length < 1 &&
    categorizedTasks?.overdue.length < 1 &&
    categorizedTasks?.overdueSoon.length < 1 &&
    categorizedTasks?.tomorrow.length < 1;

  return (
    <Card data-chart={id} className="flex flex-col justify-between">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-header">
            Ongoing Situation
          </CardTitle>
          <CardDescription>
            Here is your ongoing tasks report as of today
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {/* Style Picker */}
        <div className="flex justify-end mb-2">
          <div className="relative inline-flex border rounded-full w-42 justify-between">
            {["pie", "bar"].map((value) => {
              const Icon = value === "bar" ? ChartBar : PieChartIcon;

              return (
                <button
                  key={value}
                  onClick={() => setMode(value as "bar" | "pie")}
                  className={`${
                    mode === value ? "text-muted-foreground" : ""
                  } relative z-10 flex-1 py-1 text-center text-xs uppercase cursor-pointer`}
                >
                  <Icon className="block mx-auto w-4 h-4" />
                  {mode === value && (
                    <motion.div
                      layoutId="highlight"
                      className="absolute inset-0 z-[-1] bg-muted rounded-full shadow-sm border"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart - Pie */}
        <div className="flex-1">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mode === "pie" ? "visible" : "exit"}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-1 justify-center min-h-72 max-h-72 pb-0">
              <ChartContainer
                id={id}
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[300px]"
              >
                {isNotRenderable ? (
                  <div className="w-full h-full text-center flex items-center justify-center">
                    Not enough data, report will be shown here once data is
                    sufficient.
                  </div>
                ) : (
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          className="min-w-38 max-w-38"
                          hideLabel
                        />
                      }
                    />
                    <Pie
                      data={situationData}
                      dataKey="tasks"
                      nameKey="collection"
                      innerRadius={60}
                      strokeWidth={5}
                      activeIndex={activeIndex}
                      className="cursor-pointer"
                      onClick={(e) => {
                        setActiveFilter?.(e?.payload?.collection);
                      }}
                      activeShape={({
                        outerRadius = 0,
                        ...props
                      }: PieSectorDataItem) => (
                        <g>
                          <Sector {...props} outerRadius={outerRadius + 5} />
                          <Sector
                            {...props}
                            outerRadius={outerRadius + 20}
                            innerRadius={outerRadius + 10}
                          />
                        </g>
                      )}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {situationData[
                                    activeIndex
                                  ]?.tasks?.toLocaleString() || "0"}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  {chartConfig?.[filter].label}
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                )}
              </ChartContainer>
            </div>
          </motion.div>
        </div>

        {/* Chart - Bar */}
        <div className="flex-1 h-full mt-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mode === "bar" ? "visible" : "exit"}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 min-h-72 max-h-72 pb-0">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={situationData}
                  layout="vertical"
                  margin={{
                    right: 16,
                  }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="collection"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <XAxis dataKey="tasks" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="tasks"
                    layout="vertical"
                    radius={4}
                    activeIndex={activeIndex}
                    className="cursor-pointer fill-(--primary)"
                    onClick={(data) => {
                      setActiveFilter?.(data?.payload?.collection);
                    }}
                    activeBar={({ ...props }) => {
                      return (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          stroke={props.payload.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      );
                    }}
                  >
                    <LabelList
                      dataKey="label"
                      position="insideLeft"
                      className="fill-(--primary-foreground)"
                      offset={8}
                      fontSize={12}
                    />
                    <LabelList
                      dataKey="tasks"
                      position="insideRight"
                      className="fill-(--primary-foreground)"
                      offset={8}
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </motion.div>
        </div>
      </CardContent>

      {/* Select */}
      <div className="px-4 md:px-6">
        {/* Description */}
        <div className="mb-4">
          <h1 className="text-xl font-header">Description</h1>
          <p className="text-xs">{descriptions[filter]}</p>
        </div>
        <Select value={filter} onValueChange={setActiveFilter}>
          <SelectTrigger
            className="h-7 w-full border border-card-foreground/20 shadow-md"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {collections.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
