"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TemperamentData = {
  sanguine: number;
  choleric: number;
  melancholic: number;
  phlegmatic: number;
};

interface TemperamentWheelProps {
  data: TemperamentData;
}

const temperamentDescriptions: Record<string, string> = {
  Sanguine: "Air element. Associated with optimism and sociality.",
  Choleric: "Fire element. Associated with ambition and leadership.",
  Phlegmatic: "Water element. Associated with calmness and peace.",
  Melancholic: "Earth element. Associated with thoughtfulness and sensitivity.",
};

const CustomAngleAxisTick = (props: any) => {
  const { x, y, textAnchor, payload } = props;
  const term = payload.value.split(" (")[0];
  const description =
    temperamentDescriptions[term as keyof typeof temperamentDescriptions] || "";

  const termWidth = term.length * 7;
  let finalX = x;
  
  if (textAnchor === "start") {
    finalX = x + 8;
  } else if (textAnchor === "end") {
    finalX = x - 8 - termWidth;
  } else {
    finalX = x - termWidth / 2;
  }

  return (
    <g>
      <text
        x={finalX}
        y={y + 4}
        textAnchor="start"
        fill="hsl(var(--muted-foreground))"
        fontSize={12}
      >
        {term}
      </text>
      <foreignObject x={finalX + termWidth + 4} y={y - 8} width={16} height={16}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full flex items-center justify-center cursor-pointer">
              <Eye className="h-4 w-4 text-muted-foreground/70 hover:text-primary" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </foreignObject>
    </g>
  );
};

export function TemperamentWheel({ data }: TemperamentWheelProps) {
  const chartData = [
    { subject: "Sanguine (Air)", value: data.sanguine, fullMark: 100 },
    { subject: "Choleric (Fire)", value: data.choleric, fullMark: 100 },
    { subject: "Phlegmatic (Water)", value: data.phlegmatic, fullMark: 100 },
    { subject: "Melancholic (Earth)", value: data.melancholic, fullMark: 100 },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="subject" tick={<CustomAngleAxisTick />} />
          <Radar
            name="Temperament"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </TooltipProvider>
  );
}
