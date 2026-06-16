'use client'

import * as React from 'react'
import { useForm, FieldValues, DefaultValues, Path, PathValue, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>
  label: string
  placeholder?: string
  type: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'switch'
  options?: { value: string; label: string }[]
}

interface FormBuilderProps<T extends FieldValues> {
  schema: z.ZodType<T, any, any>
  defaultValues?: DefaultValues<T>
  fields: FormFieldConfig<T>[]
  onSubmit: (data: T) => void | Promise<void>
  submitLabel?: string
  loading?: boolean
}

export function FormBuilder<T extends FieldValues>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  submitLabel = "حفظ",
  loading = false,
}: FormBuilderProps<T>): React.JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        {fields.map((field) => {
          const error = errors[field.name]?.message as string | undefined
          const isSwitch = field.type === 'switch'

          if (isSwitch) {
            const val = watch(field.name)
            return (
              <div key={field.name} className="flex items-center justify-between rounded-xl border border-border/80 bg-card/45 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor={field.name} className="text-sm font-medium">{field.label}</Label>
                  {field.placeholder ? (
                    <p className="text-xs text-muted-foreground">{field.placeholder}</p>
                  ) : null}
                </div>
                <Switch
                  id={field.name}
                  checked={!!val}
                  onCheckedChange={(checked) => setValue(field.name, checked as unknown as PathValue<T, Path<T>>)}
                />
              </div>
            )
          }

          return (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  className="rounded-xl border-border/80 bg-background/50"
                  {...register(field.name)}
                />
              ) : field.type === 'select' ? (
                <Select
                  value={watch(field.name) || ''}
                  onValueChange={(val) => setValue(field.name, val as unknown as PathValue<T, Path<T>>)}
                >
                  <SelectTrigger id={field.name} className="rounded-xl border-border/80 bg-background/50">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card">
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    )) || null}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="rounded-xl border-border/80 bg-background/50"
                  {...register(field.name)}
                />
              )}
              {error ? (
                <p className="text-xs text-red-400 font-semibold">{error}</p>
              ) : null}
            </div>
          )
        })}
      </div>
      <Button type="submit" disabled={loading} className="w-full rounded-xl">
        {loading ? "جاري الحفظ..." : submitLabel}
      </Button>
    </form>
  )
}
