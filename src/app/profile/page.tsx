'use client'

import Header from "@/components/Header";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import { Avatar } from "@mui/material";
import { uploadFile } from "@/lib/uploadUtil";
import { Roles, useUpdateProfileMutation } from "@/state/api";
import { useDispatch } from "react-redux";
import { setUser } from "@/state";

interface FormInterface {
    password?: string;
    confirmPassword?: string;
    profilePictureUrl?: string;
    other?: string;
}

const Profile = () => {
    const user = useAppSelector((state) => state.global.user);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [profilePictureUrl, setProfilePictureUrl] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [clientError, setClientError] = useState<FormInterface>({});
    const [serverError, setServerError] = useState<string>("");
    const [updateProfile] = useUpdateProfileMutation();
    const dispatch = useDispatch();

    const labelStyles = "block text-sm font-medium dark:text-white";
    const errorLabelStyles = "block text-sm font-medium text-red-700";
    const serverErrorLabelStyles = "block text-sm font-medium text-red-700 text-center";

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none cursor-pointer";
    const OnlyViewStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none cursor-not-allowed";

        const isFormValid = () => {
            let errors = {}; 
        
            // Check for matching passwords
            if (password.trim() !== confirmPassword.trim()) {
                errors = { ...errors, password: "Passwords do not match" };
            }
        
            // Check for empty updates
            if (!password.trim() && !profilePictureUrl) {
                errors = { ...errors, other: "Please provide something to update" };
            }
        
            // Check for valid password length
            if (password.trim() && (password.trim().length < 6 || password.trim().length > 12)) {
                errors = { ...errors, password: "Password must be between 6 and 12 characters long" };
            }

            return errors;
        };
        

    const defaultFieldValue = () => {
        setPassword("");
        setConfirmPassword("");
        setProfilePictureUrl(null);
        setServerError("");
        setClientError({});
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const img = event.target.files?.[0];
        if (img) {
            setProfilePictureUrl(img);
        }
    };

    const handleUpdateUser = async () => {

        const errors = isFormValid();
        setClientError(errors);
        if (Object.keys(errors).length !== 0) {
            return;
        }

        if (!user) return;
        setIsLoading(true);

        const body: {
            userId: any,
            username: string,
            role: Roles,
            organizationId: any,
            password?: string,
            profilePictureUrl?: string
        } = {
            "userId": user.userId,
            "username": user.username,
            "role": user.role,
            "organizationId": Number(user.organizationId),
        }

        if (password) body.password = password;
        if (profilePictureUrl) {
            const uploadedImg = await uploadFile(profilePictureUrl);
            body.profilePictureUrl = uploadedImg;
        }

        const updatedUser = await updateProfile(body);
        if (updatedUser?.data) {
            dispatch(setUser(updatedUser?.data));
        }else{
            setServerError("Internal Server Error, Failed to update user");
        }
        defaultFieldValue();
        setIsLoading(false);
    }

    return (
        <div className="p-8">
            <Header title="Profile" />
            <div className="flex justify-center cursor-pointer">
                <label htmlFor="profilePicture">
                    {/* <Avatar sx={{ width: 100, height: 100, transition: '0.3s' }} className="hover:opacity-40" variant="rounded" src={!profilePictureUrl?.name ? user?.profilePictureUrl || user?.username[0] || "U" : profilePictureUrl?.name}></Avatar> */}
                    <Avatar sx={{ width: 100, height: 100, transition: '0.3s' }} className="hover:opacity-40" variant="rounded" src={profilePictureUrl?.name ? '' : user?.profilePictureUrl}>{profilePictureUrl?.name || user?.username}</Avatar>
                </label>
                <label className={errorLabelStyles}>{clientError?.profilePictureUrl}</label>
                <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            </div>
            <div className="space-y-4">
                <div>
                    <label className={labelStyles}>Username</label>
                    <input
                        type="text"
                        className={OnlyViewStyles}
                        placeholder='Username'
                        value={user?.username || "Unknown"}
                    />
                </div>
                <div>
                    <label className={labelStyles}>Role</label>
                    <div className={OnlyViewStyles}>{user?.role || "Viewer"}</div>
                </div>
                <div>
                    <label className={labelStyles}>Password</label>
                    <input
                        type="password"
                        className={inputStyles}
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className={errorLabelStyles}>{clientError?.password}</label>
                </div>
                <div>
                    <label className={labelStyles}>Confirm Password</label>
                    <input
                        type="password"
                        className={inputStyles}
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label className={errorLabelStyles}>{clientError?.password}</label>
                </div>
            </div>
            <button type='submit' className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-bue-600 focus-offset-2 ${!isFormValid() || isLoading} ? "cursor-not-allowed opacity-50" : ""}`} disabled={isLoading} onClick={handleUpdateUser}>
                {isLoading ? "Updating.." : "Update"}
            </button>
            <label className={serverErrorLabelStyles}>{clientError?.other}</label>
            <label className={serverErrorLabelStyles}>{serverError}</label>
        </div>
    );
};

export default Profile;