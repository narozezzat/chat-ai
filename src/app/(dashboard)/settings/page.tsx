import * as React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { SettingsForm } from '@/features/settings/components/SettingsForm'

export default function SettingsPage(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="إعدادات النظام والمنظمة"
        description="تكوين مفاتيح الربط للنماذج، ضبط ميزانية الاستهلاك الشهرية وإدارة سياسات التفكير البديل."
      />

      <SettingsForm />
    </div>
  )
}
