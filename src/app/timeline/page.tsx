"use client"

import { useAppSelector } from '@/app/redux';
import Error from '@/components/Error';
import Header from '@/components/Header';
import Loading from '@/components/loading';
import { useGetProjectsQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from 'react'

type Props = {
}

type TaskTypeItems = "task" | "milestone" | "project";

const TimeLine = (props: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: projects, isLoading, isError } = useGetProjectsQuery();

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-IN"
    });

    const ganttTasks = useMemo(() => {
        return (
            projects?.map(project => ({
                start: new Date(project.startDate as string),
                end: new Date(project.endDate as string),
                id: `Project-${project.id}`,
                name: project.name,
                progress: 50,
                type: "project" as TaskTypeItems,
                isDisabled: false,
            })) || []
        );
    }, [projects]);

    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    };

    if (isLoading) return <Loading/>
    if (isError || !projects) return <Error/>

    return (
        <div className="max-w-full p-8">
            <header className="mb-4 flex items-center justify-between">
                <Header title="Projects Timeline" />
                <div className="relative inline-block w-64">
                    <select className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white" value={displayOptions.viewMode} onChange={handleViewModeChange}>
                        <option value={ViewMode.Day}>Day</option>
                        <option value={ViewMode.Week}>Week</option>
                        <option value={ViewMode.Month}>Month</option>
                    </select>
                </div>
            </header>

            <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
                <div className="timeline">
                    {projects.length > 0 && <Gantt
                        tasks={ganttTasks}
                        {...displayOptions}
                        columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                        listCellWidth="100px"
                        projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
                        projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
                        projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                    />}
                </div>
            </div>
        </div>
    )
}

export default TimeLine