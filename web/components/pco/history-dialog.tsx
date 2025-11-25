"use client"

import { X } from 'lucide-react'

interface PCOHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pco: {
    firstName: string
    lastName: string
    street: string
    phone: string
  }
}

const mockHistory = [
  {
    id: "1",
    date: "May 31 2024",
    type: "Animal Milestone",
    badges: ["Animal Milestone", "Adoption"],
    details: "Animal Name: Henneman Thor",
  },
  {
    id: "2",
    date: "Dec 08 2024",
    type: "Donation",
    badges: ["Donation"],
    details: "Donation Type: others | Notes: Dog Beds | Amount: $ 60",
  },
]

export function PCOHistoryDialog({ open, onOpenChange, pco }: PCOHistoryDialogProps) {
  if (!open) return null

  return (
    <>
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold">History</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="font-semibold text-lg">
                {pco.firstName} {pco.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {pco.street} | {pco.phone}
              </div>
            </div>

            <div className="space-y-4">
              {mockHistory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="font-medium text-muted-foreground min-w-[100px]">{item.date}</div>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        {item.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              badge === "Animal Milestone"
                                ? "bg-blue-100 text-blue-700"
                                : badge === "Adoption"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="text-muted-foreground">{item.details}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
