/**
 * LineGraphChart — clean, exam-paper style inline SVG line graph for
 * Academic Writing Task 1 popups. Crisp, monochrome-friendly, prints
 * nicely. Self-contained: pass the data, it draws the rest.
 */

export type LineSeries = {
  name: string;
  color: string;
  points: number[]; // length must match xLabels
};

export type LineGraphChartProps = {
  caption?: string;
  xLabels: string[];
  series: LineSeries[];
  yMax: number;
  yStep: number;
  yUnit?: string;
};

export function LineGraphChart({
  caption,
  xLabels,
  series,
  yMax,
  yStep,
  yUnit,
}: LineGraphChartProps) {
  // SVG view box — clean 16:11 ratio, plenty of breathing room.
  const VB_W = 640;
  const VB_H = 440;

  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 64;

  const plotW = VB_W - padL - padR;
  const plotH = VB_H - padT - padB;

  const xCount = xLabels.length;
  const xAt = (i: number) =>
    xCount === 1 ? padL + plotW / 2 : padL + (i / (xCount - 1)) * plotW;
  const yAt = (v: number) => padT + plotH - (v / yMax) * plotH;

  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  return (
    <figure className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-hidden rounded-xl bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.18)] ring-1 ring-foreground/[0.08]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          xmlns="http://www.w3.org/2000/svg"
          className="block h-full w-full"
          role="img"
          aria-label={caption ?? "Line graph"}
        >
          {/* Y-axis gridlines + labels */}
          {yTicks.map((v) => {
            const y = yAt(v);
            return (
              <g key={`y-${v}`}>
                <line
                  x1={padL}
                  y1={y}
                  x2={padL + plotW}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray={v === 0 ? undefined : "3 4"}
                />
                <text
                  x={padL - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={12}
                  fontFamily='"Nunito", "Inter", system-ui, sans-serif'
                  fontWeight={600}
                  fill="#475569"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Axis lines */}
          <line
            x1={padL}
            y1={padT}
            x2={padL}
            y2={padT + plotH}
            stroke="#0f172a"
            strokeWidth={1.5}
          />
          <line
            x1={padL}
            y1={padT + plotH}
            x2={padL + plotW}
            y2={padT + plotH}
            stroke="#0f172a"
            strokeWidth={1.5}
          />

          {/* X-axis labels + ticks */}
          {xLabels.map((label, i) => {
            const x = xAt(i);
            return (
              <g key={`x-${label}`}>
                <line
                  x1={x}
                  y1={padT + plotH}
                  x2={x}
                  y2={padT + plotH + 5}
                  stroke="#0f172a"
                  strokeWidth={1.25}
                />
                <text
                  x={x}
                  y={padT + plotH + 22}
                  textAnchor="middle"
                  fontSize={12}
                  fontFamily='"Nunito", "Inter", system-ui, sans-serif'
                  fontWeight={600}
                  fill="#334155"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Y-axis title */}
          {yUnit && (
            <text
              transform={`translate(16 ${padT + plotH / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize={11}
              fontFamily='"Nunito", "Inter", system-ui, sans-serif'
              fontWeight={700}
              fill="#0f172a"
              letterSpacing="0.04em"
            >
              {yUnit.toUpperCase()}
            </text>
          )}

          {/* Series lines + dots */}
          {series.map((s) => {
            const d = s.points
              .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`)
              .join(" ");
            return (
              <g key={s.name}>
                <path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.points.map((v, i) => (
                  <circle
                    key={`${s.name}-${i}`}
                    cx={xAt(i)}
                    cy={yAt(v)}
                    r={3.2}
                    fill="white"
                    stroke={s.color}
                    strokeWidth={2}
                  />
                ))}
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${padL} ${VB_H - 22})`}>
            {series.map((s, i) => {
              const itemW = plotW / series.length;
              const x = i * itemW;
              return (
                <g key={`legend-${s.name}`} transform={`translate(${x} 0)`}>
                  <line
                    x1={0}
                    y1={6}
                    x2={20}
                    y2={6}
                    stroke={s.color}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  />
                  <circle cx={10} cy={6} r={3.2} fill="white" stroke={s.color} strokeWidth={2} />
                  <text
                    x={28}
                    y={10}
                    fontSize={12}
                    fontFamily='"Nunito", "Inter", system-ui, sans-serif'
                    fontWeight={700}
                    fill="#0f172a"
                  >
                    {s.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {caption && (
        <figcaption
          className="mt-3 text-[12.5px] leading-snug text-foreground/70"
          style={{
            fontFamily:
              '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
            fontWeight: 600,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
