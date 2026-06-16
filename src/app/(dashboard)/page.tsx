import * as React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DashboardStats } from '@/features/dashboard/components/DashboardStats'
import { DashboardCard } from '@/components/shared/DashboardCard'
import { CostChart } from '@/features/dashboard/components/CostChart'
import { ArrowUpRight, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface RecentLog {
  id: string
  user: string
  model: string
  tokens: string
  cost: string
  time: string
}

const RECENT_LOGS: RecentLog[] = [
  { id: '1', user: 'أحمد محمود', model: 'Gemini 3.5 Flash', tokens: '14,240', cost: '$0.010', time: 'منذ دقيقة' },
  { id: '2', user: 'سارة خالد', model: 'Claude Sonnet 4.5', tokens: '8,410', cost: '$0.063', time: 'منذ 5 دقائق' },
  { id: '3', user: 'أحمد محمود', model: 'GPT-5', tokens: '28,100', cost: '$0.421', time: 'منذ 10 دقائق' },
  { id: '4', user: 'محمد عبد الله', model: 'Gemini 3.1 Flash-Lite', tokens: '2,950', cost: '$0.001', time: 'منذ ربع ساعة' },
]

export default function DashboardPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <PageHeader
        title="لوحة التحكم الإحصائية"
        description="راقب استهلاك الرموز، وتحليل التكاليف ومعدل استجابة النماذج الفعالة."
        action={
          <Button asChild size="sm" className="rounded-xl flex items-center gap-1.5">
            <Link href="/chat">
              <span>فتح استوديو الدردشة</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCard
            title="تحليل استهلاك التكاليف"
            description="مخطط بياني يوضح توزيع تكلفة استعلامات الذكاء الاصطناعي على مدار الأسبوع."
          >
            <CostChart />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard
            title="آخر الاستعلامات النشطة"
            description="الاستهلاك الفوري للأعضاء في آخر ساعة."
          >
            <div className="space-y-4">
              {RECENT_LOGS.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-sm">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">{log.user}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>{log.model}</span>
                    </div>
                  </div>
                  <div className="text-end space-y-1">
                    <div className="font-mono text-xs text-primary font-semibold">{log.tokens} Tokens</div>
                    <div className="text-[10px] text-muted-foreground">{log.time} · {log.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
