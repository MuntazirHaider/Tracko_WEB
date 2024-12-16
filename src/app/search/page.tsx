"use client";

import Error from "@/components/Error";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {
        data: searchResults,
        isLoading,
        isError,
    } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 2,
    });

    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
        },
        500,
    );

    useEffect(() => {
        return handleSearch.cancel;
    }, [handleSearch.cancel]);

    return (
        <div className="p-8">
            <Header title="Search" />
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-1/2 rounded border p-3 shadow"
                    onChange={handleSearch}
                />
            </div>
            <div className="p-5">
                {isLoading && <div className="flex items-center justify-center"><ScaleLoader color="#367ae0"/></div>}
                {isError && <Error/>}
                {!isLoading && !isError && searchResults && (
                    <div>
                        {searchResults.tasks && searchResults.tasks?.length > 0 && (
                            <h1 className="mb-2 text-lg text-black dark:text-white">Tasks</h1>
                        )}
                        {searchResults.tasks?.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}

                        {searchResults.projects && searchResults.projects?.length > 0 && (
                            <h1 className="mb-2 text-lg text-black dark:text-white">Projects</h1>
                        )}
                        {searchResults.projects?.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}

                        {searchResults.users && searchResults.users?.length > 0 && (
                            <h1 className="mb-2 text-lg text-black dark:text-white">Users</h1>
                        )}
                        {searchResults.users?.map((user) => (
                            <UserCard key={user.userId} user={user} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;