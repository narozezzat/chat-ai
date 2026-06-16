import * as React from 'react'
import { StatsCard } from '@/components/shared/StatsCard'
import { MessageSquare, Coins, Cpu, Zap } from 'lucide-react'

export function DashboardStats(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="إجمالي الاستفسارات"
        value="1,248"
        description="استعلام نشط هذا الأسبوع"
        icon={MessageSquare}
        trend={{ value: 12.5, direction: 'up' }}
      />
      <StatsCard
        title="تكلفة الاستهلاك"
        value="$18.42"
        description="من الحد الأقصى الشهري $100"
        icon={Coins}
        trend={{ value: 8.2, direction: 'up' }}
      />
      <StatsCard
        title="الرموز المستهلكة (Tokens)"
        value="4.8M"
        description="متوسط 3.8K رمز لكل محادثة"
        icon={Cpu}
        trend={{ value: 4.1, direction: 'down' }}
      />
      <StatsCard
        title="سرعة الاستجابة"
        value="1.2s"
        description="متوسط سرعة استجابة النموذج"
        icon={Zap}
        trend={{ value: 15.4, direction: 'up' }}
      />
    </div>
  )
}
