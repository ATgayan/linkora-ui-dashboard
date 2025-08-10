"use client"

import { useState } from "react"

type ToastProps = {
  title: string
  description: string
  variant?: "default" | "destructive"
}

// This is a simplified version of the toast hook for demonstration purposes
export function toast(props: ToastProps) {
  // In a real implementation, this would use a context provider
  // For now, we'll just log to console
  console.log(`Toast: ${props.title} - ${props.description}`)

  // In a browser environment, we can show a native toast
  if (typeof window !== "undefined") {
    const message = `${props.title}: ${props.description}`
    if (props.variant === "destructive") {
      console.error(message)
    } else {
      console.log(message)
    }

    // Use the browser's notification API if available and permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(props.title, { body: props.description })
    }
  }

  return {
    id: Date.now().toString(),
    ...props,
  }
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; description: string }>>([])

  return {
    toast,
    toasts,
    dismiss: (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    },
  }
}
