"use client"

import React, { useState } from 'react';
import { Priority, Project, Status, Task, useGetProjectsQuery, useGetTasksQuery } from '@/state/api';
import { useAppSelector } from '../redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Header from '@/components/Header';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import Loading from '@/components/loading';
import Error from '@/components/Error';

const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
];

const COLORS: Record<Status, string> = {
    "To Do": "#FF0000",
    "In Progress": "#0088FE",
    "Under Review": "#FFBB28",
    "Completed": "#00C49F",
};

const HomePage = () => {

    const [selectedProjectId, setSelectedProjectId] = useState<number>(0);

    const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery({ projectId: selectedProjectId });
    const { data: projects, isLoading: isProjectsLoading, isError: projectError } = useGetProjectsQuery();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if (tasksLoading || isProjectsLoading) return <Loading/>;
    if (tasksError || !tasks || !projects || projectError) return <Error/>;

    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = parseInt(event.target.value, 10);
        setSelectedProjectId(projectId);
    };

    const priorityCount = tasks.reduce(
        (acc: Record<string, number>, task: Task) => {
            const { priority } = task;
            acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
            return acc;
        },
        {},
    );

    const taskDistribution = Object.keys(priorityCount).map((key) => ({
        name: key,
        count: priorityCount[key],
    }));

    const statusCount = tasks.reduce(
        (acc: Record<Status, number>, task: Task) => {
            const status = task.status as Status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        },
        {
            "To Do": 0,
            "In Progress": 0,
            "Under Review": 0,
            "Completed": 0,
        }
    );

    const taskStatusDistribution = Object.keys(statusCount).map((status) => ({
        name: status as Status,
        count: statusCount[status as Status],
    }));

    const chartColors = isDarkMode
        ? {
            bar: "#8884d8",
            barGrid: "#303030",
            pieFill: "#4A90E2",
            text: "#FFFFFF",
        }
        : {
            bar: "#8884d8",
            barGrid: "#E0E0E0",
            pieFill: "#82ca9d",
            text: "#000000",
        };

    return (
        <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
            <div className=' flex justify-between'>
                {/* header */}
                <Header title="Project Management Dashboard" />

                {/* Dropdown to select project */}
                <select
                    id="project-select"
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                    className="rounded border p-2 dark:bg-dark-secondary dark:text-white mb-4"
                >
                    <option key={0} value={0}>
                        None
                    </option>
                    {projects.map((project: Project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Task Priority Distribution (bar chart) */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Task Priority Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={taskDistribution}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={chartColors.barGrid}
                            />
                            <XAxis dataKey="name" stroke={chartColors.text} />
                            <YAxis stroke={chartColors.text} />
                            <Tooltip
                                contentStyle={{
                                    width: "min-content",
                                    height: "min-content",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="count" fill={chartColors.bar} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Status Distribution (pie chart) */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Task Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                dataKey="count"
                                data={taskStatusDistribution}
                            >
                                {taskStatusDistribution.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.name]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Table */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Your Tasks
                    </h3>
                    <div style={{ height: 400, width: "100%" }}>
                        <DataGrid
                            rows={tasks}
                            columns={taskColumns}
                            checkboxSelection
                            loading={tasksLoading}
                            getRowClassName={() => "data-grid-row"}
                            getCellClassName={() => "data-grid-cell"}
                            pageSizeOptions={[5, 10, 25]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            className={dataGridClassNames}
                            sx={dataGridSxStyles(isDarkMode)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
