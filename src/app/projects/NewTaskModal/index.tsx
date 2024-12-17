import Modal from '@/components/Modal';
import { Priority, Status, useCreateAttachmentMutation, useCreateTaskMutation } from '@/state/api';
import React, { useState } from 'react'
import { formatISO } from 'date-fns';
import { useAppSelector } from '@/app/redux';
import { uploadFile } from '@/lib/uploadUtil';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id: number
}

interface formInterface {
    title?: string;
    tags?: string;
    date?: string;
}

const NewTaskModal = ({ isOpen, onClose, id }: Props) => {
    const user = useAppSelector((state) => state.global.user);
    const [createTask] = useCreateTaskMutation();
    const [createAttachment] = useCreateAttachmentMutation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [priority, setPriority] = useState<Priority>(Priority.Medium);
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [authorUserId, setAuthorUserId] = useState(String(user?.userId) || "");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState('');
    const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
    const [clientError, setClientError] = useState<formInterface>({})
    const [serverError, setServerError] = useState<string>("")

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files).slice(0, 3);
            setImages(fileArray);
            setImagePreview(fileArray.map((file) => file.name).join(', '));
        }
    };

    const handleSubmit = async () => {
        const errors = isFormValid();
        setClientError(errors);
        if(Object.keys(errors).length !== 0){
            return;
        }
        let formattedStartDate, formattedDueDate;
        if(startDate !== ""){
            formattedStartDate = formatISO(new Date(startDate), { representation: 'complete' }) || "";
        }
        if(dueDate !== ""){
            formattedDueDate = formatISO(new Date(dueDate), { representation: 'complete' }) || "";
        }
        
        setIsCreatingTask(true)
        const newTask = await createTask({
            title,
            description,
            status,
            priority,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            authorUserId: parseInt(authorUserId),
            assignedUserId: parseInt(assignedUserId),
            projectId: id,
        });

        if(!newTask.data){
            setServerError("Internal server error, Failed to create task.");
            setIsCreatingTask(false);
            return;
        }
        
        const uploadedImageUrls: Array<string> = [];
        for (const image of images) {
        const uploadedImage = await uploadFile(image); 
        if (uploadedImage) uploadedImageUrls.push(uploadedImage);
        }

        if(uploadedImageUrls.length > 0) {
            for(const fileURL of uploadedImageUrls) {
                await createAttachment({
                    fileURL,
                    taskId: newTask.data?.id,
                    userId: newTask.data?.authorUserId
                })
            }
        }

        onClose();
        setIsCreatingTask(false)
        setDeafultValue();
    };

    const setDeafultValue = () => {
        setTitle("");
        setDescription("");
        setStatus(Status.ToDo);
        setPriority(Priority.Medium);
        setTags("");
        setStartDate("");
        setDueDate("");
        setAuthorUserId("");
        setAssignedUserId("");
        setClientError({});
    }

    const isFormValid = () => {
        let errors = {};

        if(!title) errors = {...errors, title: "Title is required"};
        if(startDate && dueDate && new Date(startDate) > new Date(dueDate)) errors = { ...errors, date: "Start Date can not be after due date" }
        if(tags !== ""){
            const regex = /^(\s*|[^,\s]+(,[^,\s]+)*)$/;
            const res = regex.test(tags.trim());
            if(!res) errors = {...errors, tags: "Invalid tags format" }
        }

        return errors;
    }
    
    const selectStyles =
        "block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    const errorLabelStyles = "block text-sm font-medium text-red-700";
    const serverErrorLabelStyles = "block text-sm font-medium text-red-700 text-center";    

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
            <form
                className='mt-4 space-y-4'
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div>
                    <input
                        type="text"
                        className={inputStyles}
                        placeholder='Task Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label className={errorLabelStyles}>{clientError?.title}</label>
                </div>
                <textarea
                    className={inputStyles}
                    placeholder='Task Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2'>
                    <select
                        className={selectStyles}
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                    >
                        <option value="">Select Status</option>
                        <option value={Status.ToDo}>To Do</option>
                        <option value={Status.InProgress}>In Progress</option>
                        <option value={Status.UnderReview}>Under Review</option>
                        <option value={Status.Completed}>Completed</option>
                    </select>
                    <select
                        className={selectStyles}
                        value={priority}
                        onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}
                    >
                        <option value="">Select Priority</option>
                        <option value={Priority.Urgent}>Urgent</option>
                        <option value={Priority.High}>High</option>
                        <option value={Priority.Medium}>Medium</option>
                        <option value={Priority.Low}>Low</option>
                        <option value={Priority.Backlog}>Backlog</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Attach Images
                    </label>
                    <input
                        type="file"
                        className={inputStyles}
                        multiple
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Selected: {imagePreview}
                        </p>
                    )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    You can upload up to 3 images only.
                </p>
                </div>
                <div>
                    <input
                        type="text"
                        className={inputStyles}
                        placeholder='Tags (comma separated) e.g: frontend,react,easy'
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <label className={errorLabelStyles}>{clientError?.tags}</label>
                </div>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2'>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                        <input
                            type="date"
                            placeholder='Start Date'
                            className={inputStyles}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={dueDate}
                        />
                        <label className={errorLabelStyles}>{clientError?.date}</label>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                        <input
                            type="date"
                            placeholder='Due Date'
                            className={inputStyles}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            min={startDate}
                        />
                        <label className={errorLabelStyles}>{clientError?.date}</label>
                    </div>
                </div>
                <input
                    type="text"
                    className={inputStyles}
                    placeholder='Author User ID'
                    value={authorUserId}
                    onChange={(e) => setAuthorUserId(e.target.value)}
                />
                <input
                    type="text"
                    className={inputStyles}
                    placeholder='Assigned User ID'
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                />
                <button type='submit' className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-bue-600 focus-offset-2 ${isCreatingTask} ? "cursor-not-allowed opacity-50" : ""}`} disabled={isCreatingTask}>
                    {isCreatingTask ? "Adding.." : "Add Task"}
                </button>
                <label className={serverErrorLabelStyles}>{serverError}</label>
            </form>
        </Modal>
    )
}

export default NewTaskModal