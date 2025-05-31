import CreateUserForm from '@/features/users/components/create-user-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pilotages/users/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateUserForm/>
}
