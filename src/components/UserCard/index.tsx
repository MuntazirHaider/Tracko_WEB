import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
    user: User;
};

const UserCard = ({ user }: Props) => {
    return (
        <div className="mb-6 rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:bg-dark-secondary dark:border-gray-700 dark:text-white transition-transform transform hover:scale-[1.03] hover:shadow-xl">
            {user.profilePictureUrl && (

                <div className='mb-4'>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300">Attachments:</strong>
                    <div className='mt-2'>
                        <Image
                            src={user.profilePictureUrl}
                            alt="profile picture"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    </div>
                </div>
            )}
            <div className='space-y-4'>
                <p>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300">Name:</strong> {user.username}
                </p>
                <p>
                    <strong className="font-semibold text-gray-700 dark:text-gray-300">Email:</strong> {user.email}
                </p>
            </div>
        </div>
    );
};

export default UserCard;