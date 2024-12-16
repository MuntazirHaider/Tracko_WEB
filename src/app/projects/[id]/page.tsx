'use client'
import React, { useState } from 'react'
// components
import ProjectHeader from '@/app/projects/ProjectHeader';
import BoardView from '../BoardView';
import ListView from '../ListView';
import TimeLineView from '../TimeLineView';
import TableView from '../TableView';
import NewTaskModal from '../NewTaskModal';
import roleBasedGuard from '@/app/roleBasedGuard';

type Props = {
    params: { id: string }
}


const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const GuardedNewUserModal = roleBasedGuard(NewTaskModal, ['Admin', 'Project Manager']);
    return (
        <div>
            <GuardedNewUserModal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} id={Number(id)} />

            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "Board" && (
                <BoardView id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />
            )}
            {activeTab === "List" && (
                <ListView id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />
            )}
            {activeTab === "TimeLine" && (
                <TimeLineView id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />
            )}
            {activeTab === "Table" && (
                <TableView id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />
            )}
        </div>
    )
}

export default Project