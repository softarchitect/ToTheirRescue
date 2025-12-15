"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { inviteUser, updateUser, type UserVM } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserVM | null
  onSuccess?: () => void
}

const roles = [
  { value: "Administrator", label: "Administrator" },
  { value: "AnimalManager", label: "Animal Manager" },
  { value: "Veterinarian", label: "Veterinarian" },
  { value: "AnimalCaretaker", label: "Animal Caretaker" },
  { value: "SuperAdministrator", label: "Super Administrator" },
]

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Administrator",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          role: user.role || "Administrator",
        })
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          role: "Administrator",
        })
      }
    }
  }, [open, user])

  const handleSave = async () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Error",
        description: "First name is required.",
        variant: "destructive",
      })
      return
    }
    if (!formData.lastName.trim()) {
      toast({
        title: "Error",
        description: "Last name is required.",
        variant: "destructive",
      })
      return
    }
    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required.",
        variant: "destructive",
      })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
        className: "!bg-white",
      })
      return
    }

    try {
      setSaving(true)

      if (user) {
        await updateUser(user.id, {
          id: user.id,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          role: formData.role,
        })
        toast({
          title: "Success",
          description: "User updated successfully.",
        })
      } else {
        await inviteUser({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          roleName: formData.role,
        })
        toast({
          title: "Success",
          description: "User invitation sent successfully.",
        })
      }

      onOpenChange(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "Administrator",
      })
      onSuccess?.()
    } catch (error: any) {
      console.error("Failed to save user", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save user.",
        variant: "destructive",
        className: "!bg-white",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {user ? "Edit User Detail" : "Invite User"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4">
            <FloatingInput
              id="user-firstname"
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              disabled={saving}
            />

            <FloatingInput
              id="user-lastname"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              disabled={saving}
            />
          </div>

          <FloatingInput
            id="user-email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={saving || !!user}
          />

          <FloatingSelect
            label="Role"
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
            disabled={saving}
            className="min-h-10"
          >
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </FloatingSelect>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (user ? "Updating..." : "Sending...") : (user ? "Update" : "Invite")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

