import { Project } from "@/state/api";
import React from "react";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:bg-dark-secondary dark:border-gray-700 dark:text-white transition-transform transform hover:scale-[1.03] hover:shadow-xl">
      <div className='space-y-4'>
        <p>
          <strong className="font-semibold text-gray-700 dark:text-gray-300">Name:</strong> {project.name}
        </p>
        <p>
          <strong className="font-semibold text-gray-700 dark:text-gray-300">Decription:</strong> {project.description}
        </p>
        <p>
          <strong className="font-semibold text-gray-700 dark:text-gray-300">Start Date: </strong> {project.startDate}
        </p>
        <p>
          <strong className="font-semibold text-gray-700 dark:text-gray-300">End Date:</strong> {project.endDate}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;