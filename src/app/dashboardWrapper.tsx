'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StorageProvider, { useAppDispatch, useAppSelector } from './redux'
import { useRouter } from "next/navigation";
import AuthPages from './auth/page';
import NewProjectModal from './projects/NewProjectModal';
import { Plus } from 'lucide-react';
import roleBasedGuard from '@/app/roleBasedGuard';
import { useGetUserByUsernameQuery } from '@/state/api';
import { setUser } from '@/state';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const router = useRouter();
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const token = useAppSelector((state) => state.global.token);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state) => state.global.user);
  const { data: user, isLoading, isError } = useGetUserByUsernameQuery({username: loggedInUser?.username || ""});
  
    if(user && user.username === loggedInUser?.username && loggedInUser?.role != user.role){
      dispatch(setUser(user));
    }

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    });

    useEffect(() => {
        if (!token) {
            router.push('/auth');
        }
    }, [token, router]);

    const GuardedNewUserModal = roleBasedGuard(NewProjectModal, ['Admin', 'Project Manager']);

    return (
        <>
            {token ? <div className='flex min-h-screen w-full bg-gray-50 text-gray-900'>
                {/* sidebar */}
                <Sidebar />
                <main className={`dark:bg-dark-bg flex w-full flex-col bg-gray-50 ${isSidebarCollapsed ? "" : "md:pl-64"}`}>
                    {/* navbar */}
                    <Navbar />
                    {/* other pages */}
                    {children}
                    {/* create project common button */}
                    <div className='fixed z-50 bottom-8 right-12'>
                        <button
                            className='flex items-center justify-center w-12 h-12 bg-blue-primary text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            onClick={() => setIsCreateProjectModalOpen(true)}>
                            <Plus className='w-6 h-6' onClick={() => setIsCreateProjectModalOpen(true)} />
                        </button>
                    </div>

                    <GuardedNewUserModal isOpen={isCreateProjectModalOpen} onClose={() => setIsCreateProjectModalOpen(false)} />

                </main>
                {/* auth pages */}
            </div> : <AuthPages />}
        </>
    )
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <StorageProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </StorageProvider>
    )
}

export default DashboardWrapper;