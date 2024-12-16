import Modal from '@/components/Modal';
import { useCreateProjectMutation } from '@/state/api';
import React, { useState } from 'react'
import { formatISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

interface formInterface {
    name?: string;
    date?: string;
}

const NewProjectModal = ({ isOpen, onClose }: Props) => {
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [clientError, setClientError] = useState<formInterface>({});
    const [serverError, setServerError] = useState<string>("");

    const handleSubmit = async () => {
        const errors = isFormValid();
        setClientError(errors);
        if(Object.keys(errors).length !== 0){
            return
        }
        let formattedStartDate, formattedEndDate;
        if(startDate !== ""){
            formattedStartDate = formatISO(new Date(startDate), { representation: 'complete' }) || "";
        }
        if(endDate !== ""){
            formattedEndDate = formatISO(new Date(endDate), { representation: 'complete' }) || "";
        }
        const newProject = await createProject({
            name,
            description,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });
        if(!newProject.data){
            setServerError("Internl server error, Failed to create new project");
            setClientError({})
            return
        }
        setDeafultValue();
        onClose();
    };

    const isFormValid = () => {
        let errors = {};

        if(!name) errors = {...errors, name: "Name is required"}
        if(startDate && endDate && new Date(startDate) > new Date(endDate)) errors = {...errors, date: "Start date should be before End Date"}
        return errors;
    }

    const setDeafultValue = () => {
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setClientError({});
        setServerError("");
    }

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    const errorLabelStyles = "block text-sm font-medium text-red-700";
    const serverErrorLabelStyles = "block text-sm font-medium text-red-700 text-center";

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
            <form
                className='mt-4 space-y-2'
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={inputStyles}
                    placeholder='Project Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label className={errorLabelStyles}>{clientError?.name}</label>
                <textarea
                    className={inputStyles}
                    placeholder='Project Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2'>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                        <input
                            type="date"
                            className={inputStyles}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate}
                        />
                        <label className={errorLabelStyles}>{clientError?.date}</label>
                    </div>
                   <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                        <input
                            type="date"
                            className={inputStyles}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                        />
                        <label className={errorLabelStyles}>{clientError?.date}</label>
                   </div>
                </div>
                <button type='submit' className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-bue-600 focus-offset-2 ${isLoading} ? "cursor-not-allowed opacity-50" : ""}`} disabled={isLoading}>
                    {isLoading ? "Creating.." : "Create Project"}
                </button>
                <label className={serverErrorLabelStyles}>{serverError}</label>
            </form>
        </Modal>
    )
}

export default NewProjectModal