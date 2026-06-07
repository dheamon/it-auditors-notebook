import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div
      className="flex"
      style={{ minHeight: 'calc(100vh - 128px)', background: '#F7FAFC' }}
    >
      <DashboardSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
