'use client';

import React from 'react';
import { Modal } from '@mui/material';
import { useAppSelector } from '@/app/redux';
import Image from 'next/image';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const AccessDeniedModal = ({ isOpen, onClose }: Props) => {
    const userRole = useAppSelector((state) => state.global.user?.role);

    return (
        <Modal
            open={isOpen}
            onClose={onClose} // Close the modal when the background is clicked
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                    {/* Close button */}
                    <button
                        onClick={onClose} // Close the modal when the cross button is clicked
                        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Modal content */}
                    <div className="flex flex-col items-center">
                        {/* Illustration */}
                        <Image
                            src="https://res.cloudinary.com/ddwxsev3x/image/upload/v1731830718/Image/xq6bxuhljhtjkv4oftug.png"
                            alt="Access Denied Illustration"
                            className="mb-4 h-40 w-40"
                        />
                        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-800 dark:text-white">
                            Access Denied
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-300">
                            <span className="font-bold">{userRole || 'You'}</span> do not have
                            permission to access this.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AccessDeniedModal;
