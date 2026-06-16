'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface ChartDataPoint {
  day: string
  tokens: number
  cost: number
}

const DATA: ChartDataPoint[] = [
  { day: 'الأحد', tokens: 620000, cost: 2.10 },
  { day: 'الإثنين', tokens: 840000, cost: 3.40 },
  { day: 'الثلاثاء', tokens: 910000, cost: 3.80 },
  { day: 'الأربعاء', tokens: 450000, cost: 1.80 },
  { day: 'الخميس', tokens: 730000, cost: 2.90 },
  { day: 'الجمعة', tokens: 310000, cost: 1.20 },
  { day: 'السبت', tokens: 520000, cost: 1.90 },
]

export function CostChart(): React.JSX.Element {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  
  const maxCost = Math.max(...DATA.map((d) => d.cost))
  const height = 160

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>حجم التكاليف اليومية ($)</span>
          </span>
        </div>
        {hoveredIndex !== null ? (
          <span className="text-xs text-foreground font-semibold">
            {DATA[hoveredIndex].day}: <strong className="text-primary font-bold">${DATA[hoveredIndex].cost.toFixed(2)}</strong> ({DATA[hoveredIndex].tokens.toLocaleString()} Tokens)
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60">مرر مؤشر الفأرة على الأعمدة لعرض التفاصيل</span>
        )}
      </div>

      <div className="relative h-[210px] w-full" dir="ltr">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[10px] text-muted-foreground/50 w-8 py-2">
          <span>${maxCost.toFixed(1)}</span>
          <span>${(maxCost * 0.66).toFixed(1)}</span>
          <span>${(maxCost * 0.33).toFixed(1)}</span>
          <span>$0.0</span>
        </div>

        {/* Core Chart Body */}
        <div className="ml-10 h-[170px] border-b border-l border-border/60 relative flex items-end justify-between px-4">
          {DATA.map((d, index) => {
            const ratio = d.cost / maxCost
            const barHeight = Math.max(ratio * height, 10)
            
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Column block */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barHeight }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-8 sm:w-10 rounded-t-md bg-gradient-to-t from-primary/20 to-primary group-hover:from-primary/40 group-hover:to-primary/95 transition-all shadow-lg shadow-primary/5"
                />

                {/* Day label */}
                <span className="absolute top-[175px] text-[10px] text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                  {d.day}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
