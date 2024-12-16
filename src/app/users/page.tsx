"use client";

import { useGetUsersQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
// import Image from "next/image";
import Avatar from '@mui/material/Avatar';
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { UserPen, UserPlus } from "lucide-react";
import NewUserModal from "./NewUserModal";
import roleBasedGuard from "@/app/roleBasedGuard";
import Error from "@/components/Error";
import Loading from "@/components/loading";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Users = () => {
const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <Avatar
            src={`${params.row.profilePictureUrl}`}
            alt={params.row.username}
            sx={{ width: 24, height: 24 }}
          />
        </div>
      </div>
    ),
  },
  { field: "role", headerName: "Role", width: 150 },
  {
    field: "update",
    headerName: "Update",
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center cursor-pointer">
        <UserPen onClick={() => handleUpdate(params.row)} className="w-6 h-6"/>
      </div>
    )
  },
];


  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState<boolean>(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState<boolean>(false);
  const GuardedNewUserModal = roleBasedGuard(NewUserModal, ['Admin', 'Project Manager']);
  const [currUser, setcurrUser] = useState<any>(null);

  const handleUpdate = (user: any) => {
    setcurrUser(user);
    setIsUpdateUserModalOpen(true);
  }

  if (isLoading) return <Loading/>;
  if (isError || !users) return <Error/>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header title="Users" buttonComponent={
        <button className='flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
          onClick={() => setIsNewUserModalOpen(true)}
        >
          <UserPlus className='mr-2 h-5 w-5' />
          New User
        </button>
      } />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
          pagination
          pageSizeOptions={[5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>

      <GuardedNewUserModal isOpen={isNewUserModalOpen} onClose={() => setIsNewUserModalOpen(false)} />
      <GuardedNewUserModal isOpen={isUpdateUserModalOpen} onClose={() => setIsUpdateUserModalOpen(false)} isUpdate row={currUser}/>
    </div>
  );
};

export default Users;
