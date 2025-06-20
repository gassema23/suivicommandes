import React from 'react'

export default function FormTitle({title}: { title: string }) {
  return (
    <div className='font-medium px-4 py-1 bg-secondary text-secondary-foreground border-b'>{title}</div>
  )
}
