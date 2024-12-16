import Modal from '@/components/Modal';
import React from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    taskName: string
};

const ConfirmDeleteModal = ({ isOpen, onClose, onDelete, taskName }: Props) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Delete Task" >
            <div className="p-4">
                <p className="text-center text-lg font-medium mb-3 dark:text-white text-gray-700">
                    Are you sure you want to delete {taskName} task?
                </p>
                    <button
                        className="flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 focus-offset-2"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
