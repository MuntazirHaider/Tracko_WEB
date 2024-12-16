import { useAppSelector } from '@/app/redux';
import Error from '@/components/Error';
import Loading from '@/components/loading';
import { useGetTasksQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from 'react'

type Props = {
    id: string,
    setIsNewTaskModalOpen: (isOpen: boolean) => void;
}

type TaskTypeItems = "task" | "milestone" | "project";

const TimeLineView = ({ id, setIsNewTaskModalOpen }: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-IN"
    });

    const ganttTasks = useMemo(() => {
        return (
            tasks?.map(task => ({
                start: new Date(task.startDate as string),
                end: new Date(task.dueDate as string),
                id: `Task-${task.id}`,
                name: task.title,
                progress: task.points ? (task.points / 10) * 100 : 0,
                type: "task" as TaskTypeItems,
                isDisabled: false,
            })) || []
        );
    }, [tasks]);

    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    };

    if (isLoading) return <Loading/>
    if (error) return <Error/>

    return (
        <div className="px-4 xl:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2 py-5">
                <h1 className="me-2 text-lg font-bold dark:text-white">
                    Project Tasks Timeline
                </h1>
                <div className="relative inline-block w-64">
                    <select className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white" value={displayOptions.viewMode} onChange={handleViewModeChange}>
                        <option value={ViewMode.Day}>Day</option>
                        <option value={ViewMode.Week}>Week</option>
                        <option value={ViewMode.Month}>Month</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
                <div className="timeline">
                    {ganttTasks.length > 0 && <Gantt
                        tasks={ganttTasks}
                        {...displayOptions}
                        columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                        listCellWidth="100px"
                        barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
                        barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                    />}
                </div>
                <div className="px-4 pb-5 pt-1">
                    <button
                        className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                        onClick={() => setIsNewTaskModalOpen(true)}
                    >
                        Add New Task
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TimeLineView