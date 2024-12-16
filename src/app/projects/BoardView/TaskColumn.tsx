import { Task as TaskType } from '@/state/api';
import { EllipsisVertical, ListPlus, SquarePlus } from 'lucide-react';
import React from 'react'
import { useDrop } from 'react-dnd';
import Task from './Task';

type TaskColumnProps = {
    status: string;
    tasks: TaskType[];
    moveTask: (taskId: number, toStatus: string) => void;
    setIsNewTaskModalOpen: (isOpen: boolean) => void;
}

const TaskColumn = ({ status, tasks, moveTask, setIsNewTaskModalOpen }: TaskColumnProps) => {

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item: { id: number }) => moveTask(item.id, status),
        collect: (monitor: any) => ({
            isOver: !!monitor.isOver()
        })
    }));

    const filteredTask = tasks.filter((task) => task.status === status);
    const taskCount = filteredTask.length;

    const statusColor: any = {
        "To Do": "#ff0000",
        "In Progress": "#2563EB",
        "Under Review": "#D97706",
        "Completed": "#059669"
    }

    return (
        <div ref={(instance) => { drop(instance) }} className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}>
            <div className='mb-3 flex w-full'>
                <div className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
                    style={{ backgroundColor: statusColor[status] }}
                />

                <div className='flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary'>
                    <h3 className='flex items-center text-lg font-semibold dark:text-white'>
                        {status}{" "}
                        <span className='ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary' style={{ width: "1.5rem", height: "1.5rem" }}>
                            {taskCount}
                        </span>
                    </h3>
                    <button className='flex h-6 w-5 items-center justify-center dark:text-neutral-500' onClick={() => setIsNewTaskModalOpen(true)}>
                        <ListPlus size={26} />
                    </button>
                </div>
            </div>

            {filteredTask.map((task) => (
                <Task key={task.id} task={task} />
            ))}
        </div>
    )
}

export default TaskColumn