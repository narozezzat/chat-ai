import * as React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { UserTable } from '@/features/users/components/UserTable'

export default function UsersPage(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="إدارة أعضاء المنظمة"
        description="إدارة المستخدمين النشطين، وتخصيص حصص الاستهلاك اليومية وتعديل مستويات الصلاحيات."
      />

      <div className="rounded-2xl border border-border/40 bg-card/10 p-6">
        <UserTable />
      </div>
    </div>
  )
}
