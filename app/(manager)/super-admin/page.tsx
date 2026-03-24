"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Vendor = {
    id: string
    name: string
    slug: string
    created_at: string
}

type Profile = {
    id: string
    full_name: string | null
    role: string
    vendor_id: string | null
}

export default function SuperAdminPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)

    // Create vendor form
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState(false)

    // Assign user state
    const [assigningVendorId, setAssigningVendorId] = useState<string | null>(null)
    const [assignError, setAssignError] = useState<string | null>(null)

    useEffect(() => {
        fetchAll()
    }, [])

    async function fetchAll() {
        const [vendorsRes, profilesRes] = await Promise.all([
            supabase.from("vendors").select("*").order("created_at", { ascending: false }),
            supabase.from("profiles").select("*"),
        ])

        if (!vendorsRes.error) setVendors(vendorsRes.data || [])
        if (!profilesRes.error) setProfiles(profilesRes.data || [])
        setLoading(false)
    }

    // Get users assigned to a specific vendor
    const getUsersForVendor = (vendorId: string) => {
        return profiles.filter((p) => p.vendor_id === vendorId)
    }

    // Get users not assigned to any vendor
    const getUnassignedUsers = () => {
        return profiles.filter((p) => !p.vendor_id && p.role !== "super-admin")
    }

    const handleCreateVendor = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !slug.trim()) {
            setFormError("Please fill in both Name and Slug.")
            return
        }
        setSubmitting(true)
        setFormError(null)
        setFormSuccess(false)

        try {
            const qrSecret = Math.random().toString(36).substring(2, 15)

            const { error } = await supabase
                .from("vendors")
                .insert({
                    name: name.trim(),
                    slug: slug.trim().toLowerCase().replace(/ /g, "-"),
                    qr_secret: qrSecret,
                })

            if (error) {
                setFormError(error.message)
            } else {
                setName("")
                setSlug("")
                setFormSuccess(true)
                fetchAll()
                setTimeout(() => setFormSuccess(false), 3000)
            }
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Something went wrong")
        }
        setSubmitting(false)
    }

    const handleAssignUser = async (userId: string, vendorId: string) => {
        setAssignError(null)
        const { error } = await supabase
            .from("profiles")
            .update({ vendor_id: vendorId })
            .eq("id", userId)

        if (error) {
            setAssignError(error.message)
        } else {
            setAssigningVendorId(null)
            fetchAll()
        }
    }

    const handleUnassignUser = async (userId: string) => {
        setAssignError(null)
        const { error } = await supabase
            .from("profiles")
            .update({ vendor_id: null })
            .eq("id", userId)

        if (error) {
            setAssignError(error.message)
        } else {
            fetchAll()
        }
    }

    if (loading) return <div className="p-8 text-zinc-400">Loading vendors...</div>

    const unassignedUsers = getUnassignedUsers()

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black italic text-orange-500 mb-8 uppercase tracking-tight">SaaS SUPER ADMIN</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Create Vendor */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Create Vendor Form */}
                    <Card className="bg-zinc-950 border-zinc-800 rounded-none">
                        <CardHeader>
                            <CardTitle className="text-zinc-100 italic">REGISTER NEW VENDOR</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateVendor} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-zinc-500 uppercase">Vendor Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                            setSlug(e.target.value.toLowerCase().replace(/ /g, "-"))
                                        }}
                                        className="bg-zinc-900 border-zinc-800 rounded-none"
                                        placeholder="Blue Lagoon Bar"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-zinc-500 uppercase">Slug (URL Part)</label>
                                    <Input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 rounded-none"
                                        placeholder="blue-lagoon"
                                    />
                                </div>
                                {formError && (
                                    <div className="bg-red-500/10 border border-red-500/50 p-3 text-red-400 text-xs font-mono break-all">
                                        ⚠ {formError}
                                    </div>
                                )}
                                {formSuccess && (
                                    <div className="bg-green-500/10 border border-green-500/50 p-3 text-green-400 text-xs font-mono">
                                        ✓ Vendor activated successfully!
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-orange-500 hover:bg-orange-600 rounded-none italic font-black"
                                >
                                    {submitting ? "REGISTERING..." : "ACTIVATE VENDOR"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* How It Works */}
                    <Card className="bg-zinc-950 border-zinc-800 rounded-none">
                        <CardHeader>
                            <CardTitle className="text-zinc-100 italic text-sm">HOW VENDOR ONBOARDING WORKS</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs text-zinc-500 font-mono">
                            <div className="flex gap-2">
                                <span className="text-orange-500 font-bold">1.</span>
                                <span>Create a vendor (bar) here.</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-orange-500 font-bold">2.</span>
                                <span>Ask the bar owner to sign up at <code className="text-zinc-300">/signup</code></span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-orange-500 font-bold">3.</span>
                                <span>They will appear in &quot;Unassigned Users&quot; below.</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-orange-500 font-bold">4.</span>
                                <span>Click &quot;Assign User&quot; on the vendor card to link them.</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-orange-500 font-bold">5.</span>
                                <span>They can now log in and manage their bar!</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Vendors + Users */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold italic text-zinc-400">ACTIVE VENDORS ({vendors.length})</h2>

                    {assignError && (
                        <div className="bg-red-500/10 border border-red-500/50 p-3 text-red-400 text-xs font-mono break-all">
                            ⚠ {assignError}
                        </div>
                    )}

                    <div className="grid gap-4">
                        {vendors.map((v) => {
                            const assignedUsers = getUsersForVendor(v.id)
                            const isAssigning = assigningVendorId === v.id

                            return (
                                <Card key={v.id} className="bg-zinc-950 border-zinc-800 rounded-none overflow-hidden">
                                    <div className="p-4 flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-zinc-100 text-lg uppercase">{v.name}</h3>
                                            <p className="text-xs font-mono text-zinc-500 tracking-wider">SLUG: /{v.slug}/</p>
                                        </div>
                                        <Badge className="bg-zinc-800 text-zinc-400 rounded-none font-mono text-[10px]">
                                            UID: {v.id.slice(0, 8)}
                                        </Badge>
                                    </div>

                                    {/* Assigned Users */}
                                    <div className="border-t border-zinc-800 px-4 py-3">
                                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
                                            Assigned Admins ({assignedUsers.length})
                                        </p>
                                        {assignedUsers.length === 0 ? (
                                            <p className="text-xs text-zinc-600 italic">No admins assigned yet</p>
                                        ) : (
                                            <div className="space-y-1">
                                                {assignedUsers.map((u) => (
                                                    <div key={u.id} className="flex items-center justify-between bg-zinc-900 px-3 py-2">
                                                        <div>
                                                            <span className="text-sm text-zinc-200">{u.full_name || "Unnamed"}</span>
                                                            <span className="text-xs text-zinc-600 ml-2 font-mono">{u.id.slice(0, 8)}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-400 text-xs h-7 px-2"
                                                            onClick={() => handleUnassignUser(u.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Assign User Button / Dropdown */}
                                        {!isAssigning ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 rounded-none border-zinc-700 text-xs font-bold uppercase italic hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                                                onClick={() => setAssigningVendorId(v.id)}
                                                disabled={unassignedUsers.length === 0}
                                            >
                                                {unassignedUsers.length === 0 ? "No users to assign" : "+ Assign User"}
                                            </Button>
                                        ) : (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-[10px] font-mono text-orange-500 uppercase">Select a user to assign:</p>
                                                {unassignedUsers.map((u) => (
                                                    <div
                                                        key={u.id}
                                                        className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-3 py-2 hover:border-orange-500 cursor-pointer transition-colors"
                                                        onClick={() => handleAssignUser(u.id, v.id)}
                                                    >
                                                        <div>
                                                            <span className="text-sm text-zinc-200">{u.full_name || "Unnamed"}</span>
                                                            <Badge className="ml-2 bg-zinc-800 text-zinc-500 rounded-none font-mono text-[10px]">
                                                                {u.role}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-orange-500 text-xs font-bold italic">ASSIGN →</span>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs text-zinc-500"
                                                    onClick={() => setAssigningVendorId(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Unassigned Users Section */}
                    {unassignedUsers.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold italic text-zinc-400 mb-4">
                                UNASSIGNED USERS ({unassignedUsers.length})
                            </h2>
                            <div className="grid gap-2">
                                {unassignedUsers.map((u) => (
                                    <Card key={u.id} className="bg-zinc-950 border-zinc-800 rounded-none p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-zinc-100 uppercase">{u.full_name || "Unnamed"}</h3>
                                            <p className="text-xs font-mono text-zinc-500">{u.role} • {u.id.slice(0, 8)}</p>
                                        </div>
                                        <Badge className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-none font-mono text-[10px]">
                                            WAITING FOR ASSIGNMENT
                                        </Badge>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
