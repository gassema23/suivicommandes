import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pilotages/flows/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/pilotages/flows/"!</div>
}
