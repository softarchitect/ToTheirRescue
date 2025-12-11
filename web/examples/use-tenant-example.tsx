/**
 * Example: How to use the Tenant Context in any component
 * 
 * This file demonstrates how to access tenant information
 * in any page or component throughout the application.
 */

"use client"

import { useTenant } from "@/contexts/tenant-context"

export function ExampleComponent() {
  // Access tenant information from context
  const { tenantInfo, tenantName, isLoading, error, refreshTenantInfo } = useTenant()

  // Show loading state
  if (isLoading) {
    return <div>Loading tenant information...</div>
  }

  // Show error state
  if (error) {
    return <div>Error: {error}</div>
  }

  // Use tenant information
  return (
    <div>
      <h1>Welcome to {tenantName}</h1>
      
      {tenantInfo && (
        <div>
          <p>Full Name: {tenantInfo.name}</p>
          <p>Acronym: {tenantInfo.tenantAcronym}</p>
          <p>Email: {tenantInfo.emailAddress}</p>
          <p>Phone: {tenantInfo.phone}</p>
          <p>Address: {tenantInfo.street}, {tenantInfo.city}, {tenantInfo.state} {tenantInfo.zip}</p>
          <p>Country: {tenantInfo.countryName} ({tenantInfo.countryISO2Code})</p>
          <p>Website: {tenantInfo.website}</p>
          
          <button onClick={refreshTenantInfo}>
            Refresh Tenant Info
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Using tenant info in a page component
 */
export function ExamplePage() {
  const { tenantInfo, tenantName } = useTenant()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {tenantName} - Dashboard
      </h1>
      
      {tenantInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm text-gray-600">
            Organization: {tenantInfo.name}
          </p>
          <p className="text-sm text-gray-600">
            Contact: {tenantInfo.emailAddress} | {tenantInfo.phone}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Using tenant info in a form component
 */
export function ExampleForm() {
  const { tenantInfo } = useTenant()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use tenant info in form submission
    if (tenantInfo) {
      console.log("Submitting form for tenant:", tenantInfo.id)
      // Your form submission logic here
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      {tenantInfo && (
        <input type="hidden" name="tenantId" value={tenantInfo.countryId} />
      )}
      <button type="submit">Submit</button>
    </form>
  )
}

