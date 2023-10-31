import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "~core/supabase"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import type { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { UserAuthForm } from "~components/ui/UserAuthForm"
 
import "~style.css"

 

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}



function AuthenticationPage() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    else setUser(null); // Clear the user state
  }

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error(error)
        return
      }
      if (!!data.session) {
        setUser(data.session.user)
      }
    }
 
    init()
  }, [])




  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.12), 0 10px 20px 0 rgba(0, 0, 0, 0.19)', background: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("/background.jpg")'}}>
      <div className="md:hidden">
        {/* add pictures of search. */}
        <Image
          src="/examples/authentication-light.png"
          width={0}
          height={0}
          style={{ width: '100%', height: 'auto' }} // optional
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }} // optional
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Acme Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {user ? (
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome {user.email}
                </h1>
                <h2>
                  check my subscriptions
                </h2>
                <button onClick={logout} className="btn-primary">
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                  </p>
                </div>
                <UserAuthForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthenticationPage