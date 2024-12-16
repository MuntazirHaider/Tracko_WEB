'use client'

import { Task as TaskType, useCreateCommentMutation, useDeleteTaskMutation } from '@/state/api'
import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { format } from 'date-fns';
import Image from 'next/image';
import { Trash, MessageSquareMore } from 'lucide-react';
import { Avatar, Tooltip } from '@mui/material';
import { useAppSelector } from '@/app/redux';
import ConfirmDeleteModal from './deleteTaskModal';
import CommentDrawer from '@/components/CommentDrawer';

type TaskProps = {
    task: TaskType
}

const Task = ({ task }: TaskProps) => {

    const userRole = useAppSelector((state) => state.global.user?.role); 
    const userId = useAppSelector((state) => state.global.user?.userId); 
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const canDrag = userRole !== 'Viewer';
    const [deleteTask, { isLoading }] = useDeleteTaskMutation();
    const [createComment] = useCreateCommentMutation();

    // const {delete}

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: { id: task.id },
        collect: (monitor: any) => ({
            isDragging: !!monitor.isDragging()
        }),
        canDrag: canDrag 
    }));

    const taskTagsSplit = task.tags ? task.tags.split(",") : [];
    const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : '';
    const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : '';
    const numberOfComments = (task.comments && task.comments.length) || 0;
    const PriorityTag: React.FC<{ priority: TaskType["priority"] }> = ({ priority }) => {
        switch (priority) {
            case "Low":
                return <div className="rounded-full px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-700">Low</div>;
            case "Medium":
                return <div className="rounded-full px-2 py-1 text-xs font-semibold bg-green-200 text-green-700">Medium</div>;
            case "High":
                return <div className="rounded-full px-2 py-1 text-xs font-semibold bg-yellow-200 text-yellow-700">High</div>;
            case "Urgent":
                return <div className="rounded-full px-2 py-1 text-xs font-semibold bg-red-200 text-red-700">Urgent</div>;
            default:
                return <div className="rounded-full px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-700">{priority}</div>;
        }
    }

    const handleDeleteTask = () => {
        deleteTask({ taskId: task.id });
        setIsConfirmDeleteModalOpen(false);
    }

    const handleAddComment = async (newComment: string) => {
        if(newComment.length > 0){
            const createdComment = await createComment({
                newComment,
                taskId: task.id ,
                userId
            })
        }
    };

    return (
        <div ref={(instance) => {
            drag(instance)
        }} className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? "opacity-50" : "opacity-100"} ${canDrag ? 'cursor-grab' : 'cursor-not-allowed'}`}>
            {task.attachments && task.attachments.length > 0 && (
                <div className='flex gap-2 overflow-hidden flex-col'>
                    {task.attachments.map((attachment) => (
                        <div key={attachment.id}>
                           <Image src={attachment.fileURL}
                                alt={attachment.fileName}
                                width={400}
                                height={200}
                                className='h-auto w-full rounded-t-md'
                            />
                        </div>
                    ))}
                </div>
            )}
            <div className='p-4 md:p-6'>
                <div className='flex items-start justify-between'>
                    <div className='flex flex-1 flex-wrap items-center gap-2'>
                        {task.priority && <PriorityTag priority={task.priority} />}
                        <div className='flex gap-2'>
                            {taskTagsSplit.map((tag) => (
                                <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs'>
                                    {" "}{tag}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className='flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500'>
                        <Trash size={26} onClick={() => setIsConfirmDeleteModalOpen(true)}/>
                    </button>
                </div>

                <div className='my-3 flex flex-col gap-2 justify-between'>
                    <h4 className='text-md font-bold dark:text-white'>
                        {task.title}
                    </h4>
                    {typeof task.points === "number" && (
                        <div className='text-xs font-semibold dark:text-white'>
                            {task.points} points
                        </div>
                    )}

                    <div className='text-xs text-gray-500 dark:text-neutral-500'>
                        {formattedStartDate && <span>{formattedStartDate} - </span>}
                        {formattedDueDate && <span>{formattedDueDate}</span>}
                    </div>

                    <p className='text-sm text-gray-600 dark:text-neutral-500'>
                        {task.description}
                    </p>

                    <div className='mt-3 border-t border-gray-200 dark:border-stroke-dark' />

                    {/* Users */}
                    <div className='mt-2 flex items-center justify-between'>
                        <div className='flex -space-x-[6px] overflow-hidden'>
                            {task.assignee && (
                                <Tooltip title={task.assignee.username || ''}>
                                    <Avatar
                                        key={task.assignee.userId}
                                        src={`${task.assignee.profilePictureUrl || null}`}
                                        alt={task.assignee.username}
                                        sx={{ width: 34, height: 34 }}
                                    />
                                </Tooltip>
                            )}
                            {task.author && (
                                <Tooltip title={task.author.username || ''}>
                                    <Avatar
                                        key={task.author.userId}
                                        src={`${task.author.profilePictureUrl || null}`}
                                        alt={task.author.username}
                                        sx={{ width: 34, height: 34 }}
                                    />
                                </Tooltip>
                            )}
                        </div>
                        <button className='flex items-center text-gray-500 dark:text-neutral-500 cursor-pointer' onClick={() => setIsDrawerOpen(true)}>
                            <MessageSquareMore size={26} />
                            <span className='ml-1 text-sm dark:text-neutral-400'>
                                {numberOfComments}
                            </span>
                        </button>
                            <CommentDrawer
                                isOpen={isDrawerOpen}
                                onClose={() => setIsDrawerOpen(false)}
                                comments={task.comments || []}
                                onAddComment={handleAddComment}
                            />
                    </div>
                </div>
            </div>
            <ConfirmDeleteModal isOpen={isConfirmDeleteModalOpen} onClose={() => setIsConfirmDeleteModalOpen(false)} onDelete={handleDeleteTask} taskName={task.title}/>
        </div>
    )
}

export default Task