"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  delay?: number
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, delay = 0 }: StatCardProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="overflow-hidden border-border/40 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground"> {title} </p>
              <p className="text-3xl font-bold tracking-tight"> {value} </p>
              {trend && (
                <p className={`text-sm font-medium ${trendUp ? "text-green-600" : "text-orange-600"}`}>{trend}</p>
              )}
            </div>
            <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-3 shadow-md">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
