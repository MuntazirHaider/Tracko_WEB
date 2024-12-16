// src/app/auth/signin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignInMutation, useSignUpMutation } from "@/state/api";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/state";

type AuthFormProps = {
    isLogin: boolean;
    setIsLogin: Function;
}

interface formInterface {
    username?: string;
    organizationName?: string;
    industryType?: string;
    established?: string;
    password?: string;
}

export default function AuthForm({ isLogin, setIsLogin }: AuthFormProps) {
    const [username, setUsername] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [industryType, setIndustryType] = useState("")
    const [isOtherOptionSelected, setIsOtherOptionSelected] = useState(false);
    const [customIndustryType, setCustomIndustryType] = useState("");
    const [established, setEstablished] = useState("");
    const [password, setPassword] = useState("");
    const [clientError, setClientError] = useState<formInterface>({})
    const [serverError, setServerError] = useState<string>("")
    const router = useRouter();
    const dispatch = useDispatch();
    const [signIn, info] = useSignInMutation();
    const [signUp, { isLoading, error }] = useSignUpMutation();

    const handleResetFields = () => {
        setUsername("");
        setOrganizationName("");
        setIndustryType("");
        setIsOtherOptionSelected(false);
        setCustomIndustryType("");
        setEstablished("");
        setPassword("");
        setClientError({});
        setServerError("");
    }

    const handlePageChange = () => {
        handleResetFields();
        setIsLogin(!isLogin);
    }

    const isFormValid = () => {
        let errors = {};
        if(isLogin){
            if(!username) errors = {...errors, username: "Username is required"};
            if(!password) errors = {...errors, password: "Password is required"};
            if(username.length < 2 || password.length < 6) setServerError("Invalid credentials");
        }else{
            if(!username) errors = {...errors, username: "Username is required"};
            if(!password) errors = {...errors, password: "Password is required"};
            if(!established) errors = {...errors, established: "Established Date is required"};
            if(!organizationName) errors = {...errors, organizationName: "organizationName is required"};
            if(username.length < 2) errors = {...errors, username: "Username should be atleast 2 character long"};
            if(password.length < 6) errors = {...errors, password: "Password should be atleast 6 character long"};
            if(industryType === "") errors = {...errors, industryType: "Industry type is required"};
            if(isOtherOptionSelected && customIndustryType === "") errors = {...errors, industryType: "Industry type is required"};
        }
        return errors
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = isFormValid();
        setClientError(errors);
        if(Object.keys(errors).length !== 0){
            return;
        }
        try {
            let response = null;
            if (isLogin) {
                response = await signIn({ username, password }).unwrap();
                
                dispatch(setToken(response.data[0]));
                dispatch(setUser(response.data[1]));
                router.push('/users');
            } else {
                response = await signUp({ username, password, organizationName, industry: isOtherOptionSelected ? customIndustryType : industryType, established }).unwrap();
                handlePageChange();
            }
            if(response === null){
                setServerError(`Internal server error: Failed to ${isLogin ? "login" : "register"}, Please try after some time`);
                return;
            }
            handleResetFields();
        } catch (error) {
            console.error('Authorization failed:', error);
        }
    };

    const industriesOptions = ["IT", "Graphic Design and Multimedia", "E-commerce and Retail Technology", "Manufacturing and Industrial Automation", "Personal", "Other"];
    const errorLabelStyles = "block text-sm font-medium text-red-700";
    const serverErrorLabelStyles = "block text-sm font-medium text-red-700 text-center mt-1";

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4">{isLogin ? "Sign In" : "Register New User"}</h1>
                <form onSubmit={handleSubmit}>
                    {/* username */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            // required
                            className={"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"}
                        />
                        <label className={errorLabelStyles}>{clientError?.username}</label>
                    </div>

                    {!isLogin &&
                        <div>
                            {/* organization name*/}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    // required
                                    className={"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"}
                                />
                                <label className={errorLabelStyles}>{clientError?.organizationName}</label>
                            </div>

                            {/* Industry type */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Industry
                                </label>
                                <select
                                    value={industryType}
                                    onChange={(e) => {
                                        setIndustryType(e.target.value);
                                        setIsOtherOptionSelected(e.target.value === "Other");
                                    }}
                                    // required
                                    className={"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"}
                                >
                                    <option value="" disabled>Select an industry type</option>
                                    {industriesOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {isOtherOptionSelected && (
                                    <input
                                        type="text"
                                        placeholder="Please describe your work."
                                        value={customIndustryType}
                                        onChange={(e) => setCustomIndustryType(e.target.value)}
                                        // required={isOtherOptionSelected}
                                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                                    />
                                )}
                                <label className={errorLabelStyles}>{clientError?.industryType}</label>
                            </div>

                            {/* established  date*/}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Established
                                </label>
                                <input
                                    type="date"
                                    value={established}
                                    onChange={(e) => setEstablished(e.target.value)}
                                    // required
                                    className={"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"}
                                    max={new Date().toISOString().split("T")[0]}
                                />
                                <label className={errorLabelStyles}>{clientError?.established}</label>
                            </div>
                        </div>
                    }
                    {/* password */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // required
                            className={"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"}
                        />
                        <label className={errorLabelStyles}>{clientError?.password}</label>
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-2 text-white font-bold rounded-md ${isLoading || info.isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } transition duration-200`}
                        disabled={isLoading || info.isLoading}
                    >
                        {isLoading || info.isLoading ? (
                            <span className="flex justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z" /><path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity=".3" /><path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 13h-2v-2h2v2zm1-4H9V7h3v6z" /></svg>
                                Loading...
                            </span>
                        ) : (
                            <span>
                                {isLogin ? "Login" : "Register"}
                            </span>
                        )}
                    </button>
                </form>

                <p className="flex justify-end mt-2 font-medium hover:text-blue-primary hover:cursor-pointer" onClick={handlePageChange}>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                <label className={serverErrorLabelStyles}>{serverError}</label>
            </div>
        </div>
    );
}