import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { INDICATORS, getIndicatorStatus } from '../../engine/indicators';
import { useGameStore } from '../../store/gameStore';
import { useSimulationStore } from '../../store/simulationStore';
import { useUIStore } from '../../store/uiStore';

const STATUS_COLORS: Record<string, string> = {
  healthy: '#16A34A',
  watch: '#2B4C7E',
  alert: '#C87A2A',
  critical: '#DC2626',
  tipping: '#8B1A1A',
};

export default function CurvesPanel() {
  const { indicators } = useGameStore();
  const { scenarios, initialized, initialize } = useSimulationStore();
  const { showScenarios, selectedYear, setSelectedYear } = useUIStore();
  const [activeIndicators, setActiveIndicators] = useState<Set<string>>(
    new Set(INDICATORS.map((i) => i.id))
  );

  useEffect(() => {
    if (!initialized) initialize();
  }, [initialized, initialize]);

  // Build chart data: one point per year
  const maxYear = 100;
  const chartData = Array.from({ length: maxYear + 1 }, (_, year) => {
    const point: Record<string, number | string> = { year };
    INDICATORS.forEach((ind) => {
      const arr = indicators[ind.id as keyof typeof indicators];
      point[`player_${ind.id}`] = arr?.[year] ?? arr?.[arr.length - 1] ?? ind.initialValue;
    });
    if (showScenarios) {
      scenarios.forEach((scenario) => {
        INDICATORS.forEach((ind) => {
          const arr = scenario.data[ind.id as keyof typeof scenario.data];
          point[`${scenario.id}_${ind.id}`] = arr?.[year] ?? 0;
        });
      });
    }
    return point;
  });

  const toggleIndicator = (id: string) => {
    setActiveIndicators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm p-4 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
          Trajectoires des indicateurs
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">An {selectedYear}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Indicator toggles */}
      <div className="flex flex-wrap gap-2">
        {INDICATORS.map((ind) => {
          const currentVal = (indicators[ind.id as keyof typeof indicators] as number[])?.[selectedYear]
            ?? ind.initialValue;
          const status = getIndicatorStatus(currentVal, ind);
          const active = activeIndicators.has(ind.id);
          return (
            <button
              key={ind.id}
              onClick={() => toggleIndicator(ind.id)}
              className={`px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                active ? 'text-white' : 'bg-white text-gray-400 border-gray-200'
              } ${status === 'tipping' ? 'pulse-warning' : ''}`}
              style={active ? { backgroundColor: ind.color, borderColor: ind.color } : {}}
            >
              {ind.label}
              {status === 'critical' || status === 'tipping' ? ' ⚠' : ''}
            </button>
          );
        })}
      </div>

      {/* Main chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              label={{ value: 'Années', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
              tick={{ fontSize: 10 }}
            />
            <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value: any, name: any) => {
                const pct = `${Math.round((value as number) * 100)}%`;
                const label = String(name).replace(/^(player_|BAU_|REFORM_|TRANSITION_)/, '');
                return [pct, label];
              }}
              labelFormatter={(label) => `Année ${label}`}
            />
            <ReferenceLine x={selectedYear} stroke="#4A4A6A" strokeDasharray="4 4" />

            {/* Critical thresholds */}
            {INDICATORS.filter((i) => activeIndicators.has(i.id)).map((ind) => (
              <ReferenceLine
                key={`crit_${ind.id}`}
                y={ind.criticalThreshold}
                stroke={ind.color}
                strokeOpacity={0.3}
                strokeDasharray="2 4"
              />
            ))}

            {/* Player curves */}
            {INDICATORS.filter((i) => activeIndicators.has(i.id)).map((ind) => (
              <Line
                key={`player_${ind.id}`}
                type="monotone"
                dataKey={`player_${ind.id}`}
                stroke={ind.color}
                strokeWidth={2.5}
                dot={false}
                name={ind.label}
              />
            ))}

            {/* Scenario curves (dotted) */}
            {showScenarios &&
              scenarios.map((scenario) =>
                INDICATORS.filter((i) => activeIndicators.has(i.id)).map((ind) => (
                  <Line
                    key={`${scenario.id}_${ind.id}`}
                    type="monotone"
                    dataKey={`${scenario.id}_${ind.id}`}
                    stroke={scenario.color}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                    opacity={0.4}
                    name={`${scenario.label} — ${ind.label}`}
                  />
                ))
              )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend scenarios */}
      {showScenarios && (
        <div className="flex gap-4 text-xs text-gray-500 justify-center">
          <span className="flex items-center gap-1">
            <span className="w-6 border-t-2 border-dashed" style={{ borderColor: '#8B1A1A' }} />
            Business as usual
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 border-t-2 border-dashed" style={{ borderColor: '#C87A2A' }} />
            Réformes
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 border-t-2 border-dashed" style={{ borderColor: '#1A5C2A' }} />
            Transition systémique
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 border-t-2 border-solid border-gray-700" />
            Votre trajectoire
          </span>
        </div>
      )}

      {/* Indicator status grid */}
      <div className="grid grid-cols-4 gap-2">
        {INDICATORS.map((ind) => {
          const arr = indicators[ind.id as keyof typeof indicators] as number[];
          const val = arr?.[selectedYear] ?? arr?.[arr.length - 1] ?? ind.initialValue;
          const status = getIndicatorStatus(val, ind);
          return (
            <div
              key={ind.id}
              className="rounded-lg p-2 text-center text-xs"
              style={{ backgroundColor: `${ind.color}15`, border: `1px solid ${ind.color}40` }}
            >
              <div className="font-bold" style={{ color: STATUS_COLORS[status] }}>
                {Math.round(val * 100)}%
              </div>
              <div className="text-gray-600 leading-tight mt-0.5" style={{ fontSize: '0.65rem' }}>
                {ind.label}
              </div>
              {(status === 'critical' || status === 'tipping') && (
                <div className="text-red-600 font-bold pulse-warning">⚠</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
