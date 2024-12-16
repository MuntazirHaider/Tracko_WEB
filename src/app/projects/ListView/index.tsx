import Error from '@/components/Error';
import Header from '@/components/Header';
import Loading from '@/components/loading';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';
import React from 'react'

type ListProps = {
    id: string,
    setIsNewTaskModalOpen: (isOpen: boolean) => void;
}

const ListView = ({ id, setIsNewTaskModalOpen }: ListProps) => {
    const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

    if (isLoading) return <Loading/>
    if (error) return <Error/>
    
    return (
        <div className='px-4 pb-8 xl:px-6'>
            <div className='pt-5'>
                <Header title="List"
                    buttonComponent={
                        <button className='flex rounded items-center bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
                            onClick={() => setIsNewTaskModalOpen(true)}>
                            Add Task
                        </button>
                    }
                    isSmallText
                />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
                {tasks?.map((task: Task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}

export default ListView