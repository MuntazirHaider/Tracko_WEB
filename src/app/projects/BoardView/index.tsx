import React from 'react'
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import TaskColumn from './TaskColumn';
import Loading from '@/components/loading';
import Error from '@/components/Error';

type BoardProps = {
    id: string,
    setIsNewTaskModalOpen: (isOpen: boolean) => void;
}

const taskStatus = ["To Do", "In Progress", "Under Review", "Completed"]

const BoardView = ({ id, setIsNewTaskModalOpen }: BoardProps) => {

    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });

    const [updateTaskStatus] = useUpdateTaskStatusMutation();

    if (isLoading) return <Loading/>;
    if (error) return <Error/>;

    const moveTask = (taskId: number, toStatus: string) => {
        updateTaskStatus({ taskId, status: toStatus });
    }

    console.log("tasks", tasks);
    
    return (
        <DndProvider backend={HTML5Backend}>
            <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4'>
                {taskStatus.map((status, index) => (
                    <TaskColumn
                        key={index}
                        status={status}
                        tasks={tasks || []}
                        moveTask={moveTask}
                        setIsNewTaskModalOpen={setIsNewTaskModalOpen}
                    />
                ))}
            </div>
        </DndProvider>
    )
}

export default BoardView