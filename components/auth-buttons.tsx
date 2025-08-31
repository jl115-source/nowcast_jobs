"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus, LogOut, User, Settings } from "lucide-react"

interface AuthButtonsProps {
  onPageChange: (page: string) => void
}

export function AuthButtons({ onPageChange }: AuthButtonsProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onPageChange("job-board")
  }

  const handleSignIn = () => {
    onPageChange("login")
  }

  const handleSignUp = () => {
    onPageChange("sign-up")
  }

  const handleAccount = () => {
    onPageChange("account")
  }

  if (loading) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {user ? (
        <div className="flex flex-col gap-2">
          <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="truncate max-w-32">{user.user_metadata?.full_name || user.email}</span>
            </div>
          </div>
          <Button
            onClick={handleAccount}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm border shadow-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            Account
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm border shadow-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSignIn}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm border shadow-lg"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button onClick={handleSignUp} size="sm" className="bg-primary/90 backdrop-blur-sm shadow-lg">
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </div>
      )}
    </div>
  )
}
