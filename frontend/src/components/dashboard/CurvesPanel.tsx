import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { INDICATORS, getIndicatorStatus } from '../../engine/indicators';
import { useGameStore } from '../../store/gameStore';
import { useSimulationStore } from '../../store/simulationStore';
import { useUIStore } from '../../store/uiStore';

export default function CurvesPanel() {
  const { indicators } = useGameStore();
  const { scenarios, initialized, initialize } = useSimulationStore();
  const { showScenarios, selectedYear, setSelectedYear } = useUIStore();
  const [activeInds, setActiveInds] = useState<Set<string>>(
    new Set(['climate', 'ecosystems', 'equity', 'resilience'])
  );

  useEffect(() => { if (!initialized) initialize(); }, [initialized, initialize]);

  const chartData = Array.from({ length: 101 }, (_, year) => {
    const pt: Record<string, number | string> = { year };
    INDICATORS.forEach(ind => {
      const arr = indicators[ind.id as keyof typeof indicators] as number[];
      pt[`p_${ind.id}`] = arr?.[year] ?? arr?.[arr.length - 1] ?? ind.initialValue;
    });
    if (showScenarios) {
      scenarios.forEach(s => {
        INDICATORS.forEach(ind => {
          const arr = s.data[ind.id as keyof typeof s.data] as number[];
          pt[`${s.id}_${ind.id}`] = arr?.[year] ?? 0;
        });
      });
    }
    return pt;
  });

  const toggle = (id: string) => setActiveInds(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const getVal = (id: string) => {
    const arr = indicators[id as keyof typeof indicators] as number[];
    return arr?.[selectedYear] ?? arr?.[arr.length - 1] ?? 0.4;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-200 font-bold text-sm">Trajectoires</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">An {selectedYear}</span>
            <input
              type="range" min={0} max={100} value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-20 accent-blue-500"
            />
          </div>
        </div>

        {/* Indicator value badges */}
        <div className="grid grid-cols-4 gap-1.5">
          {INDICATORS.map(ind => {
            const val = getVal(ind.id);
            const status = getIndicatorStatus(val, ind);
            const active = activeInds.has(ind.id);
            const pct = Math.round(val * 100);
            return (
              <button
                key={ind.id}
                onClick={() => toggle(ind.id)}
                className={`rounded-lg p-2 text-center transition-all border ${
                  active ? 'border-transparent' : 'border-slate-700 bg-slate-800/40'
                } ${status === 'tipping' ? 'pulse-warning' : ''}`}
                style={active ? { backgroundColor: `${ind.color}25`, borderColor: `${ind.color}60` } : {}}
              >
                <div
                  className={`text-sm font-black leading-none ${
                    status === 'tipping' ? 'text-red-400' :
                    status === 'critical' ? 'text-red-400' :
                    status === 'alert' ? 'text-amber-400' :
                    status === 'watch' ? 'text-slate-300' : 'text-emerald-400'
                  }`}
                >
                  {pct}%
                </div>
                <div className="text-slate-500 leading-tight mt-0.5" style={{ fontSize: '0.6rem' }}>
                  {ind.label.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 px-2 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -28, bottom: 4 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" />
            <XAxis
              dataKey="year" tick={{ fontSize: 9, fill: '#475569' }}
              tickLine={false} axisLine={false}
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={v => `${Math.round(v * 100)}%`}
              tick={{ fontSize: 9, fill: '#475569' }}
              tickLine={false} axisLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: any, name: any) => {
                const pct = `${Math.round((value as number) * 100)}%`;
                const label = String(name).replace(/^(p_|BAU_|REFORM_|TRANSITION_)/, '');
                return [pct, label];
              }}
              labelFormatter={l => `Année ${l}`}
            />
            <ReferenceLine x={selectedYear} stroke="#475569" strokeDasharray="3 3" strokeWidth={1} />

            {/* Tipping point lines */}
            {INDICATORS.filter(i => activeInds.has(i.id)).map(ind => (
              <ReferenceLine
                key={`tp_${ind.id}`}
                y={ind.tippingPoint}
                stroke={ind.color} strokeOpacity={0.2} strokeDasharray="1 6"
              />
            ))}

            {/* Scenario curves */}
            {showScenarios && scenarios.map(s =>
              INDICATORS.filter(i => activeInds.has(i.id)).map(ind => (
                <Line
                  key={`${s.id}_${ind.id}`}
                  dataKey={`${s.id}_${ind.id}`}
                  stroke={s.color} strokeWidth={1}
                  strokeDasharray="4 4" dot={false} opacity={0.35}
                />
              ))
            )}

            {/* Player curves */}
            {INDICATORS.filter(i => activeInds.has(i.id)).map(ind => (
              <Line
                key={`p_${ind.id}`}
                dataKey={`p_${ind.id}`}
                stroke={ind.color} strokeWidth={2.5}
                dot={false} name={ind.label}
                style={{ filter: `drop-shadow(0 0 3px ${ind.color}60)` }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario legend */}
      {showScenarios && (
        <div className="px-4 pb-3 flex-shrink-0 flex flex-col gap-1">
          <p className="text-slate-600 text-xs mb-1">Scénarios de référence (pointillés)</p>
          {[
            { color: '#8B1A1A', label: 'Business as usual' },
            { color: '#C87A2A', label: 'Réformes incrémentales' },
            { color: '#16A34A', label: 'Transition systémique' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-6 border-t-2 border-dashed" style={{ borderColor: s.color }} />
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
