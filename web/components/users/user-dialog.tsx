"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { inviteUser, updateUser, fetchUserRoles, type UserVM, type UserRoleDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserVM | null
  onSuccess?: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const [saving, setSaving] = useState(false)
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Administrator",
  })
  const { toast } = useToast()

  // Fetch roles from API when dialog opens
  useEffect(() => {
    if (open) {
      loadRoles()
    }
  }, [open])

  const loadRoles = async () => {
    setLoadingRoles(true)
    try {
      const fetchedRoles = await fetchUserRoles()
      // Format role names for display (e.g., "SuperAdministrator" -> "Super Administrator")
      let formattedRoles = fetchedRoles.map((role) => ({
        value: role.name,
        label: role.name.replace(/([a-z])([A-Z])/g, "$1 $2"),
      }))

      // Exclude SuperAdministrator when inviting new users (not when editing existing user)
      if (!user) {
        formattedRoles = formattedRoles.filter(
          role => role.value.toLowerCase() !== "superadministrator"
        )
      }

      setRoles(formattedRoles)

      // Update role in form data after roles are loaded
      if (formattedRoles.length > 0) {
        if (user) {
          // Find matching role by name (case-insensitive)
          const matchingRole = formattedRoles.find(
            r => r.value.toLowerCase() === (user.role || "").toLowerCase()
          )
          setFormData(prev => ({
            ...prev,
            role: matchingRole?.value || user.role || formattedRoles[0].value,
          }))
        } else {
          // Set default role for new user (exclude SuperAdministrator)
          const defaultRole = formattedRoles.find(r => r.value === "Administrator") || formattedRoles[0]
          setFormData(prev => ({
            ...prev,
            role: defaultRole.value,
          }))
        }
      }
    } catch (error) {
      console.error("Failed to load roles", error)
      toast({
        title: "Error",
        description: "Failed to load roles. Using default roles.",
        variant: "destructive",
      })
      // Fallback to default roles if API fails (exclude SuperAdministrator)
      const fallbackRoles = [
        { value: "Administrator", label: "Administrator" },
      ]
      setRoles(fallbackRoles)
    } finally {
      setLoadingRoles(false)
    }
  }

  // Initialize form data when dialog opens or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        // Find matching role by name (case-insensitive) if roles are already loaded
        const matchingRole = roles.find(
          r => r.value.toLowerCase() === (user.role || "").toLowerCase()
        )
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          role: matchingRole?.value || user.role || roles[0]?.value || "Administrator",
        })
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          role: roles[0]?.value || "Administrator",
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
            disabled={saving || loadingRoles}
            className="min-h-10"
          >
            {loadingRoles ? (
              <SelectItem value="loading" disabled>
                Loading roles...
              </SelectItem>
            ) : roles.length === 0 ? (
              <SelectItem value="no-roles" disabled>
                No roles available
              </SelectItem>
            ) : (
              roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))
            )}
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

