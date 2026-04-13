import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  title: string
  children: ReactNode
}

function Layout({ children, title }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <nav className="flex gap-4">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-500">타임라인</Link>
          <Link to="/reservation/new" className="text-sm font-medium text-gray-700 hover:text-blue-500">회의실 예약</Link>
          <Link to="/my-reservations" className="text-sm font-medium text-gray-700 hover:text-blue-500">내 예약</Link>
        </nav>
      </header>
      <main className="p-6">
        {title && (
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
        )}
        {children}
      </main>
    </div>
  )
}

export default Layout
