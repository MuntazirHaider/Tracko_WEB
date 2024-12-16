import Modal from '@/components/Modal';
import { Roles, useAddUserMutation, User, useUpdateUserMutation } from '@/state/api';
import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { useAppSelector } from '@/app/redux';
import { uploadFile } from '@/lib/uploadUtil';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    row?: User;
    isUpdate?: boolean
}

interface formInterface {
    username?: string;
    password?: string;
}

const NewUserModal = ({ isOpen, onClose, row, isUpdate }: Props) => {
    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const user = useAppSelector((state) => state.global.user);
    const [username, setUsername] = useState<string>(row?.username || "");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<Roles>(row?.role || Roles.Viewer);
    const [profilePictureUrl, setProfilePictureUrl] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [clientError, setClientError] = useState<formInterface>({})
    const [serverError, setServerError] = useState<string>("")

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const img = event.target.files?.[0];
        if (img) {
            setProfilePictureUrl(img);
        }
    };

    const handleSubmit = async () => {
        const errors = isFormValid();
        setClientError(errors);
        if(Object.keys(errors).length !== 0){
            return;
        }
        setIsLoading(true);
        let img = null;
        if (profilePictureUrl) {
            img = await uploadFile(profilePictureUrl);
        }
        if(user?.role === 'Admin'){
            setRole(user.role);
        }
        let response = null;
        if (isUpdate) {
            response = await updateUser({
                userId: row?.userId,
                username,
                role,
                profilePictureUrl: img || row?.profilePictureUrl,
                password: password,
                organizationId: row?.organizationId,
            });
        } else {
            response = await addUser({
                username,
                password,
                role,
                profilePictureUrl: img,
                organizationId: user?.organizationId,
            }).unwrap();
        }

        if(response === null){
            setServerError(`Internal Server Error: Unable to ${isUpdate ? 'update' : 'create'} a user`);
            setIsLoading(false);
            return;
        }

        onClose();
        setIsLoading(false);
        setDefaultValues();
    };

    const setDefaultValues = () => {
        setUsername("");
        setPassword("");
        setRole(row?.role || Roles.Viewer);
        setProfilePictureUrl(null);
        setClientError({});
    }

    const isFormValid = () => {
        const errors: formInterface = {};
        if (!username) {
            errors.username = "Username is required";
        }
        if (!isUpdate && !password) {
            errors.password = "Password is required";
        }
        if(username.length < 2) {
            errors.username = "Username must be at least 2 characters long";
        }
        if(password !== "" && password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }

        return errors;
    }

    const selectStyles = "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    const errorLabelStyles = "block text-sm font-medium text-red-700";
    const serverErrorLabelStyles = "block text-sm font-medium text-red-700 text-center";

    return (
        <Modal isOpen={isOpen} onClose={() => {onClose(); setDefaultValues()}} name={isUpdate ? "Update User" : "Add New User"}>
            <form
                className='mt-4 space-y-6'
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="flex justify-center cursor-pointer relative">
                    <div className="flex justify-center cursor-pointer">
                        <label htmlFor="profile-picture">
                            <Avatar
                                sx={{ width: 100, height: 100, transition: '0.3s' }}
                                variant="rounded"
                                className="hover:bg-gray-600"
                                src={row?.profilePictureUrl}
                            >
                                {profilePictureUrl?.name || "Unknown"}
                            </Avatar>
                        </label>
                    </div>
                    <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className={inputStyles}
                        placeholder='UserName'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className={errorLabelStyles}>{clientError?.username}</label>
                </div>
                <div>
                    <input
                        type='password'
                        className={inputStyles}
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                     <label className={errorLabelStyles}>{clientError?.password}</label>
                </div>
                <select
                    className={selectStyles}
                    value={role}
                    onChange={(e) => setRole(e.target.value as Roles)}
                >
                    <option value={Roles.ProjectManager}>Project Manager</option>
                    <option value={Roles.Developer}>Developer</option>
                    <option value={Roles.Viewer}>Viewer</option>
                </select>
                <button type='submit' className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus-offset-2 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`} disabled={isLoading}>
                    {isUpdate ? (isLoading ? "Updating..." : "Update User") : (isLoading ? "Adding.." : "Add User")}
                </button>
            </form>
        </Modal>
    )
}

export default NewUserModal;