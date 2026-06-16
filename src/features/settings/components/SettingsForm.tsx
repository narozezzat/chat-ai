'use client'

import * as React from 'react'
import { FormBuilder } from '@/components/forms/FormBuilder'
import { settingsSchema, type SettingsFormData } from '@/features/settings/schemas/settingsSchema'
import { CheckCircle2 } from 'lucide-react'

export function SettingsForm(): React.JSX.Element {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSave = async (data: SettingsFormData): Promise<void> => {
    setLoading(true)
    setSuccess(false)
    
    // Mock API saving request delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setLoading(false)
    setSuccess(true)
    
    // Auto clear success banner
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-xl">
      {success ? (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-green-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          <span>تم حفظ الإعدادات بنجاح. تم تطبيق التغييرات على كافة المستخدمين.</span>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border/60 bg-card/15 p-6 shadow-sm">
        <h3 className="text-base font-bold text-foreground mb-1">إعدادات مفاتيح الربط (API Keys)</h3>
        <p className="text-xs text-muted-foreground mb-6">مفاتيح الربط هذه تستخدم في الخادم لتوصيل الاستفسارات إلى النماذج ولا يتم عرضها للمستخدمين.</p>
        
        <FormBuilder
          schema={settingsSchema}
          defaultValues={{
            openaiKey: '••••••••••••••••••••••••••••',
            anthropicKey: '••••••••••••••••••••••••••••',
            geminiKey: '••••••••••••••••••••••••••••',
            enableThinking: true,
            enableFallback: true,
            monthlyLimit: 500,
          }}
          fields={[
            { name: 'openaiKey', label: 'مفتاح OpenAI API Key', type: 'password', placeholder: 'sk-proj-...' },
            { name: 'anthropicKey', label: 'مفتاح Anthropic API Key', type: 'password', placeholder: 'sk-ant-...' },
            { name: 'geminiKey', label: 'مفتاح Gemini API Key', type: 'password', placeholder: 'AIzaSy...' },
            {
              name: 'enableThinking',
              label: 'تفعيل التفكير المطول (Extended Thinking)',
              type: 'switch',
              placeholder: 'النماذج الداعمة للتفكير مثل Claude 3.5 Sonnet ستستهلك وقتاً إضافياً لتحقيق أفضل جودة.',
            },
            {
              name: 'enableFallback',
              label: 'تفعيل التبديل التلقائي عند انقطاع الخدمة (Fallback)',
              type: 'switch',
              placeholder: 'في حال واجه نموذج استعلامات معينة خطأ في الحصة أو الحظر، سيتم التوجيه لنموذج بديل تلقائياً.',
            },
            { name: 'monthlyLimit', label: 'الميزانية الشهرية القصوى للمنظمة ($)', type: 'number', placeholder: '500' },
          ]}
          onSubmit={handleSave}
          loading={loading}
          submitLabel="حفظ التغييرات"
        />
      </div>
    </div>
  )
}
