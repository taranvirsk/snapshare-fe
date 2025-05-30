import { useContext, useState, useEffect, createContext } from "react"
import { createClient } from "@supabase/supabase-js"
// import { supabase } from '../supabase'

const AuthContext = createContext()
export const supabase = createClient('https://xoqvsbyhxetxxlfkhspo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvcXZzYnloeGV0eHhsZmtoc3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ1NDY3ODYsImV4cCI6MjAzMDEyMjc4Nn0.PPpPdS1EhJ9EO3lRgjYIVcVp9EqYgFhQGsv5dGqMyuk')

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // get session data if there is an active session
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
      setSession(session)
      setLoading(false)
    })

    // listen for changes to auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
      setSession(session)
      setLoading(false)
    })

    // cleanup the useEffect hook
    return () => {
      subscription?.unsubscribe()
    }
  }, [])
  const value = {
    signUp: data => supabase.auth.signUp(data),
    signIn: data => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}