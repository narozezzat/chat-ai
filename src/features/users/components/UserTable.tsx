'use client'

import * as React from 'react'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/DataTable'
import { DataTablePagination } from '@/components/tables/DataTablePagination'
import { DataTableFilters } from '@/components/tables/DataTableFilters'
import { SearchInput } from '@/components/shared/SearchInput'
import { ActionBar } from '@/components/tables/ActionBar'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FormBuilder } from '@/components/forms/FormBuilder'
import { userSchema, type UserFormData } from '@/features/users/schemas/userSchema'

interface Member {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  limit: number
  queries: number
}

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'أحمد محمود', email: 'ahmed@company.com', role: 'admin', limit: 5000, queries: 1240 },
  { id: '2', name: 'سارة خالد', email: 'sara@company.com', role: 'member', limit: 2000, queries: 890 },
  { id: '3', name: 'محمد عبد الله', email: 'mohamed@company.com', role: 'member', limit: 2000, queries: 110 },
  { id: '4', name: 'فاطمة عمر', email: 'fatima@company.com', role: 'member', limit: 5000, queries: 4890 },
  { id: '5', name: 'خالد السعيد', email: 'khaled@company.com', role: 'member', limit: 1000, queries: 950 },
]

export function UserTable(): React.JSX.Element {
  const [members, setMembers] = React.useState<Member[]>(INITIAL_MEMBERS)
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState('ALL')
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  // Modals state
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [editingMember, setEditingMember] = React.useState<Member | null>(null)

  const columns = React.useMemo<ColumnDef<Member>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded border-border bg-muted/50 focus:ring-primary h-4 w-4"
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-border bg-muted/50 focus:ring-primary h-4 w-4"
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'الاسم',
        cell: ({ row }) => <span className="font-semibold">{row.getValue('name')}</span>,
      },
      {
        accessorKey: 'email',
        header: 'البريد الإلكتروني',
      },
      {
        accessorKey: 'role',
        header: 'الدور',
        cell: ({ row }) => {
          const val = row.getValue('role') as string
          return (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                val === 'admin'
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'bg-zinc-500/10 text-zinc-400'
              }`}
            >
              {val === 'admin' ? 'مدير النظام' : 'عضو'}
            </span>
          )
        },
      },
      {
        accessorKey: 'limit',
        header: 'حد الاستعلامات',
        cell: ({ row }) => {
          const limit = row.getValue('limit') as number
          const queries = row.original.queries
          const percent = Math.min((queries / limit) * 100, 100)
          return (
            <div className="space-y-1.5 min-w-[150px]">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{queries} / {limit}</span>
                <span>{percent.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    percent > 90
                      ? 'bg-red-500'
                      : percent > 60
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: 'إجراءات',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setEditingMember(row.original)
                setIsAddOpen(true)
              }}
              aria-label="Edit member"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={() => {
                setEditingMember(row.original)
                setIsDeleteOpen(true)
              }}
              aria-label="Delete member"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const filteredMembers = React.useMemo(() => {
    return members.filter((m) => {
      const matchesRole = roleFilter === 'ALL' || m.role === roleFilter.toLowerCase()
      const searchStr = `${m.name} ${m.email}`.toLowerCase()
      const matchesSearch = searchStr.includes(globalFilter.toLowerCase())
      return matchesRole && matchesSearch
    })
  }, [members, roleFilter, globalFilter])

  const table = useReactTable({
    data: filteredMembers,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleAddOrEdit = (data: UserFormData): void => {
    if (editingMember) {
      setMembers((cur) =>
        cur.map((m) =>
          m.id === editingMember.id
            ? { ...m, name: data.name, email: data.email, role: data.role, limit: data.limit }
            : m
        )
      )
    } else {
      const newM: Member = {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        role: data.role,
        limit: data.limit,
        queries: 0,
      }
      setMembers((cur) => [newM, ...cur])
    }
    setIsAddOpen(false)
    setEditingMember(null)
  }

  const handleDeleteConfirm = (): void => {
    if (editingMember) {
      setMembers((cur) => cur.filter((m) => m.id !== editingMember.id))
      setEditingMember(null)
      setIsDeleteOpen(false)
      setRowSelection({})
    }
  }

  const handleBulkDelete = (): void => {
    const selectedIndices = Object.keys(rowSelection).filter((key) => rowSelection[key])
    const selectedIds = selectedIndices.map((idx) => filteredMembers[Number(idx)]?.id).filter(Boolean)
    
    setMembers((cur) => cur.filter((m) => !selectedIds.includes(m.id)))
    setRowSelection({})
  }

  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            placeholder="البحث عن اسم أو بريد..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <DataTableFilters
            filters={[
              {
                columnId: 'role',
                label: 'الدور',
                value: roleFilter,
                onChange: setRoleFilter,
                options: [
                  { value: 'ADMIN', label: 'مدير النظام' },
                  { value: 'MEMBER', label: 'عضو' },
                ],
              },
            ]}
          />
        </div>
        <Button onClick={() => { setEditingMember(null); setIsAddOpen(true); }} className="rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>إضافة عضو</span>
        </Button>
      </div>

      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} />

      <ActionBar
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
        actions={[
          {
            label: 'حذف المحدد',
            onClick: handleBulkDelete,
            variant: 'destructive',
            icon: Trash2,
          },
        ]}
      />

      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setEditingMember(null); }}>
        <DialogContent className="max-w-md bg-card border-border/80 rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للأعضاء'}</DialogTitle>
            <DialogDescription>أدخل تفاصيل العضو، وسيتم تطبيق سياسات استهلاك النماذج عليه تلقائياً.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <FormBuilder
              schema={userSchema}
              defaultValues={{
                name: editingMember?.name || '',
                email: editingMember?.email || '',
                role: editingMember?.role || 'member',
                limit: editingMember?.limit || 2000,
              }}
              fields={[
                { name: 'name', label: 'اسم العضو', type: 'text', placeholder: 'مثال: أحمد عبد الله' },
                { name: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'name@company.com' },
                {
                  name: 'role',
                  label: 'دور الصلاحية',
                  type: 'select',
                  placeholder: 'اختر دوراً',
                  options: [
                    { value: 'admin', label: 'مدير النظام (كامل الصلاحيات)' },
                    { value: 'member', label: 'عضو (استهلاك النماذج فقط)' },
                  ],
                },
                { name: 'limit', label: 'حد الاستهلاك الأقصى للرموز (Query Limit)', type: 'number', placeholder: '2000' },
              ]}
              onSubmit={handleAddOrEdit}
              submitLabel={editingMember ? 'تعديل العضو' : 'إنشاء العضو'}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="حذف العضو"
        description={`هل أنت متأكد من رغبتك في حذف العضو "${editingMember?.name || ''}"؟ لا يمكن التراجع عن هذا الإجراء وسيتم قطع وصوله للنظام.`}
        confirmLabel="حذف العضو"
        cancelLabel="تراجع"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
