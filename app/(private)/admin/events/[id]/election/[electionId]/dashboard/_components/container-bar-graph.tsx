import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Trophy, Medal, Star, Users, Vote } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
);

type Props = {
  positionName: string;
  labels: string[];
  dataSet: number[];
  winningSeats?: number;
};

const BarGraphContainer = ({
  positionName,
  labels,
  dataSet,
  winningSeats = 1,
}: Props) => {
  const rankedData = useMemo(() => {
    return labels
      .map((label, index) => ({ name: label, votes: dataSet[index] }))
      .sort((a, b) => b.votes - a.votes);
  }, [labels, dataSet]);

  const totalVotes = useMemo(
    () => dataSet.reduce((sum, v) => sum + v, 0),
    [dataSet],
  );

  // Resolve CSS custom properties for Chart.js
  const getColor = (cssVar: string) => {
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue(cssVar).trim();
    return raw ? `hsl(${raw})` : "#888";
  };

  const chartData = useMemo(() => {
    const winnerColor = getColor("--chart-winner");
    const defaultColor = getColor("--chart-default");

    return {
      labels: rankedData.map((d) => d.name),
      datasets: [
        {
          label: "Votes",
          data: rankedData.map((d) => d.votes),
          backgroundColor: rankedData.map((_, i) =>
            i < winningSeats ? winnerColor : defaultColor,
          ),
          borderColor: rankedData.map((_, i) =>
            i < winningSeats ? getColor("--primary") : getColor("--border"),
          ),
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: "left" as const,
        },
      ],
    };
  }, [rankedData, winningSeats]);

  const chartOptions = useMemo(() => {
    const fg = getColor("--foreground");
    const mutedFg = getColor("--muted-foreground");
    const borderColor = getColor("--border");

    return {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: getColor("--card"),
          titleColor: fg,
          bodyColor: mutedFg,
          borderColor,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: (ctx: any) => `${ctx.parsed.x.toLocaleString()} votes`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: borderColor, drawBorder: false },
          ticks: {
            color: mutedFg,
            font: { family: "var(--font-body)", size: 12 },
          },
        },
        y: {
          grid: { display: false },
          ticks: { color: fg, font: { family: "var(--font-body)", size: 13 } },
        },
      },
    };
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-primary" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-muted-foreground" />;
    return (
      <span className="w-5 text-center text-sm text-muted-foreground font-mono">
        {rank}
      </span>
    );
  };

  return (
    <div className="w-full space-y-5">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Vote className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{positionName}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Users className="h-3.5 w-3.5" />
                  {totalVotes.toLocaleString()} total votes · {labels.length}{" "}
                  candidates
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="font-heading">
              Top {winningSeats}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div style={{ height: Math.max(250, rankedData.length * 55) }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-accent" />
            Ranking Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {rankedData.map((candidate, index) => {
              const isWinner = index < winningSeats;
              const percentage =
                totalVotes > 0
                  ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                  : "0";

              return (
                <div
                  key={candidate.name}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                    isWinner
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(index + 1)}
                    <span
                      className={
                        isWinner
                          ? "font-semibold text-foreground"
                          : "text-foreground"
                      }
                    >
                      {candidate.name}
                    </span>
                    {isWinner && (
                      <Star className="h-4 w-4 text-accent fill-accent" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                    <span className="font-mono text-sm font-semibold tabular-nums">
                      {candidate.votes.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarGraphContainer;
