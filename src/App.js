import * as React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

import Register from "./components/MemberComponents/Register";
import LibrarianDashboard from "./components/LibrarianComponents/LibrarianDashboard";
import MemberDashboard from "./components/MemberComponents/MemberDashboard";

import AdminDashboardLayout from "./components/AdminComponents/AdminDashboardLayout";
import AdminOverview from "./components/AdminComponents/AdminOverview";
import ManageLibrarians from "./components/AdminComponents/ManageLibrarians";
import ManageBooks from "./components/AdminComponents/ManageBooks";
import ManageMembers from "./components/AdminComponents/ManageMembers";

import BorrowRecords from "./components/AdminComponents/BorrowRecords";
import ManageLibBooks from "./components/LibrarianComponents/ManageLibBooks";
import BorrowLibRecords from "./components/LibrarianComponents/BorrowLibRecords";
import MemberSignup from "./components/MemberComponents/MemberSignup";
import OverdueBooks from "./components/LibrarianComponents/OverdueBooks";
import BorrowRequests from "./components/LibrarianComponents/BorrowRequests";
import ReturnAcknowledgement from "./components/LibrarianComponents/ReturnAcknowledgement";
import LibrarianOverview from "./components/LibrarianComponents/LibrarianOverview";

import LoginPage from "./pages/LoginPage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/librarian/login" element={<LibrarianLogin />} />
      <Route path="/member/login" element={<MemberLogin />} /> */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<Register />} />
      <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
      <Route path="/member/dashboard/*" element={<MemberDashboard />} />
      <Route path="/member/signup" element={<MemberSignup />} />

     
     <Route path="/admin/*" element={<AdminDashboardLayout />}>
  <Route index element={<AdminOverview />} />
  <Route path="dashboard" element={<AdminOverview />} />
  <Route path="dashboard/librarians" element={<ManageLibrarians />} />
  <Route path="dashboard/books" element={<ManageBooks/>}/>
  <Route path="dashboard/members" element={<ManageMembers/>}/>
  <Route path="dashboard/history" element={<BorrowRecords/>}/>
  </Route>

   <Route path="/librarian/dashboard" element={<LibrarianDashboard />}>
        <Route path="books" element={<ManageLibBooks />} />
        <Route path="borrow-records" element={<BorrowLibRecords />} />
        <Route index element={<LibrarianOverview />} /> 
        <Route path="overdue" element={<OverdueBooks/>}/>
        <Route path="borrow-requests" element={<BorrowRequests/>}/>
        <Route path="return" element={<ReturnAcknowledgement/>}/>
      </Route>


       
     
    </Routes>
  );
}
