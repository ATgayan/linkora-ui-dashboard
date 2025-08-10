"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  // Always redirect to login first - this makes login the default landing page
  useEffect(() => {
    router.push("/login")
  }, [router])

  // Return null while redirecting
  return null
}