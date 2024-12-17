'use client'
import React, { useState } from 'react'
// components
import Header from '@/components/Header'
import TabButton from './TabButton'
import NewProjectModal from './NewProjectModal'
// icons
import { Clock, Grid3X3, List, PlusSquare, Table } from 'lucide-react'
import roleBasedGuard from '@/app/roleBasedGuard'

type Props = {
  activeTab: string,
  setActiveTab: (tabName: string) => void
}

const TabButtons = [
  { name: 'Board', icon: <Grid3X3 className='h-5 w-5' /> },
  { name: 'List', icon: <List className='h-5 w-5' /> },
  { name: 'TimeLine', icon: <Clock className='h-5 w-5' /> },
  { name: 'Table', icon: <Table className='h-5 w-5' /> }
]


const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  
  const GuardedNewUserModal = roleBasedGuard(NewProjectModal, ['Admin', 'Project Manager']);
  return (
    <div className='px-4 lg:px-6'>

      <GuardedNewUserModal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />

      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header title="Project Development"
          buttonComponent={
            <button className='flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <PlusSquare className='mr-2 h-5 w-5' />
              New Board
            </button>
          }
        />
      </div>

      {/* TABS */}
      <div className='flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center'>
        <div className='flex flex-1 items-center gap-2 md:gap-4'>
          {TabButtons.map((button, index) => (
            <TabButton
              key={index}
              name={button.name}
              icon={button.icon}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ))}
        </div>

        {/* Static Design */}
        {/* <div className='flex items-center gap-2'>
          <button className='text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300'>
            <Filter className='h-5 w-5' />
          </button>
          <button className='text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300'>
            <Share2 className='h-5 w-5' />
          </button>
          <div className='relative'>
            <input type="text" placeholder='Search Task' className='rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white' />
            <Grid3X3 className='absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-500' />
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default ProjectHeader