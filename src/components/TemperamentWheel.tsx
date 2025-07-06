"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

type TemperamentData = {
  sanguine: number;
  choleric: number;
  melancholic: number;
  phlegmatic: number;
};

interface TemperamentWheelProps {
  data: TemperamentData;
}

const CustomAngleAxisTick = (props: any) => {
  const { x, y, textAnchor, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={4}
        textAnchor={textAnchor}
        fill="hsl(var(--muted-foreground))"
        fontSize={12}
      >
        {payload.value}
      </text>
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
  );
}
