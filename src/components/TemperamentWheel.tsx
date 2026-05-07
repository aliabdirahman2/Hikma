"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

type TemperamentData = {
  sanguine: number;
  choleric: number;
  melancholic: number;
  phlegmatic: number;
};

interface TemperamentWheelProps {
  data: TemperamentData;
  shadowData?: TemperamentData;
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
        fontSize={11}
        className="font-headline"
      >
        {payload.value}
      </text>
    </g>
  );
};

export function TemperamentWheel({ data, shadowData }: TemperamentWheelProps) {
  const chartData = [
    { 
      subject: "Sanguine (Air)", 
      Primary: data.sanguine, 
      Shadow: shadowData?.sanguine || 0,
      fullMark: 100 
    },
    { 
      subject: "Choleric (Fire)", 
      Primary: data.choleric, 
      Shadow: shadowData?.choleric || 0,
      fullMark: 100 
    },
    { 
      subject: "Phlegmatic (Water)", 
      Primary: data.phlegmatic, 
      Shadow: shadowData?.phlegmatic || 0,
      fullMark: 100 
    },
    { 
      subject: "Melancholic (Earth)", 
      Primary: data.melancholic, 
      Shadow: shadowData?.melancholic || 0,
      fullMark: 100 
    },
  ];

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="subject" tick={<CustomAngleAxisTick />} />
          <Radar
            name="Primary State"
            dataKey="Primary"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.5}
          />
          {shadowData && (
            <Radar
              name="Shadow State"
              dataKey="Shadow"
              stroke="#4A5568"
              fill="#4A5568"
              fillOpacity={0.3}
            />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
