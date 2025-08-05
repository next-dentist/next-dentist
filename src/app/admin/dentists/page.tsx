"use client";
import React from "react";
import AdminDentistsList from "./adminDentistsList";

const DentistsAdmin: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminDentistsList />
    </div>
  );
};

export default DentistsAdmin;
