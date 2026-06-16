'use client'

import * as React from 'react'
import { EFFORT_LEVELS } from '@/lib/uiConfig'
import type { Effort } from '@/lib/types'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'

interface EffortSelectorProps {
  value: Effort
  onChange: (e: Effort) => void
}

export function EffortSelector({ value, onChange }: EffortSelectorProps): React.JSX.Element {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground/60">{t('effort.label')}</span>
      <Tabs value={value} onValueChange={(val) => onChange(val as Effort)}>
        <TabsList>
          {EFFORT_LEVELS.map((lvl) => (
            <TabsTrigger key={lvl.id} value={lvl.id}>
              {t(`effort.${lvl.id}` as Parameters<typeof t>[0])}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
