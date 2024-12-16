import { Task } from '@/state/api'
import { format } from 'date-fns'
import Image from 'next/image'
import React from 'react'

type Props = {
    task: Task
}

const getStatusColor = (status: Task["status"]) => {
    switch (status) {
        case 'To Do':
            return 'bg-red-200 text-red-700';
        case 'In Progress':
            return 'bg-blue-200 text-blue-700';
        case 'Under Review':
            return 'bg-yellow-200 text-yellow-700';
        case 'Completed':
            return 'bg-green-200 text-green-700';
        default:
            return 'bg-gray-200 text-gray-700';
    }
}

const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
        case "Low":
            return 'bg-blue-200 text-blue-700';
        case "Medium":
            return 'bg-green-200 text-green-700';
        case "High":
            return 'bg-yellow-200 text-yellow-700';
        case "Urgent":
            return 'bg-red-200 text-red-700';
        default:
            return 'bg-gray-200 text-gray-700';
    }
}

const TaskCard = ({ task }: Props) => {
    return (
        <div className="mb-6 rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:bg-dark-secondary dark:border-gray-700 dark:text-white transition-transform transform hover:scale-[1.03] hover:shadow-xl">
            {/* Attachments Section */}
            {task.attachments && task.attachments.length > 0 && (
                <div className='mb-4'>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300">Attachments:</strong>
                    <div className='mt-2'>
                        <Image
                            src={`/${task.attachments[0].fileURL}`}
                            alt={task.attachments[0].fileName}
                            width={400}
                            height={200}
                            className='rounded-lg'
                        />
                    </div>
                </div>
            )}

            {/* Task Information */}
            <div className='space-y-4'>
                <div className="flex justify-start gap-5">
                    <p>
                        <strong className="font-semibold text-gray-700 dark:text-gray-300">ID:</strong> {task.id}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700 dark:text-gray-300">Title:</strong> {task.title}
                    </p>
                </div>

                <p>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300">Description:</strong> {task.description || "No Description provided"}
                </p>

                <p>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300">Status:</strong>
                    <span className={`inline-block ml-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {task.status}
                    </span>
                </p>
                <p>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300">Priority:</strong>
                    <span className={`inline-block ml-2 rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                </p>

                <p className='flex items-center'>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Tags:</strong>
                    {task.tags ? (
                        <div className='flex flex-nowrap space-x-2'>
                            {task.tags.split(",").map((tag) => (
                                <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700'>
                                    {tag.trim()}
                                </div>
                            ))}
                        </div>
                    ) : "No Tags"}
                </p>

                <div className="flex justify-start gap-5">
                    <p>
                        <strong className="font-semibold text-gray-700 dark:text-gray-300">Start Date:</strong> {task.startDate ? format(new Date(task.startDate), "P") : "Not defined"}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700 dark:text-gray-300">Due Date:</strong> {task.dueDate ? format(new Date(task.dueDate), "P") : "Not defined"}
                    </p>
                </div>

                <div className="flex justify-start gap-5">
                    <p>
                        <strong className="font-semibold text-gray-700 dark:text-gray-300">Author:</strong> {task.author?.username || "Unknown"}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-700 dark:text-gray-300">Assignee:</strong> {task.assignee?.username || "Unknown"}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TaskCard;
