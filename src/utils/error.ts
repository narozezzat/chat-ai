export function getErrorMessage(error: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  const err = error as { error?: { message?: string }; message?: string }
  if (err?.error?.message) {
    return err.error.message
  }
  if (err?.message) {
    return err.message
  }
  
  return fallback
}
