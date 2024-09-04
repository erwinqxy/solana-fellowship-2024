import { PropsWithChildren } from 'react'

export default function SiteHeading({ children }: PropsWithChildren<{}>) {
  return (
    <h1 className=" self-center bg-gradient-to-r from-gray-600   
 to-gray-800 bg-clip-text text-8xl font-bold text-transparent">
      {children}
    </h1>
  )
}