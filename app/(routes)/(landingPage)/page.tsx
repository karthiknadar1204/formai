import React from 'react'
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { Button } from "@/components/ui/button"

const LandingPage = () => {
  return (
    <div>
      <div>LandingPage</div>
      <LoginLink>
        <Button>Sign in</Button>
      </LoginLink>
      <RegisterLink>
        <Button>Sign up</Button>
      </RegisterLink>
    </div>
  )
}

export default LandingPage