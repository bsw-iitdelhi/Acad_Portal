import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { ComplexNavbar } from "../components/newAppbar";

const StudentProfile = ({ isMod }) => {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [personalInfo, setPersonalInfo] = useState({});
  const [profile, setProfile] = useState({
    name: "",
    phone_number: "",
  });
  const [key, setKey] = useState({
    oldpassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const info = await axios.get(
        `http://localhost:3001/api/student/profile/${Cookies.get("kerberos")}`
      );
      if (info.status === 200) {
        const department = info.data.kerberos;

        setPersonalInfo(info.data);
      } else {
        toast.error("Error in fetching personal info");
      }
    } catch (er) {
      console.log(er);
      toast.error("Error in fetching personal info");
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.put(
        "http://localhost:3001/api/student/profile/" + Cookies.get("kerberos"),
        profile
      );
      if (res.status === 200) {
        toast.success("Profile updated successfully");
        setProfile({
          name: "",
          phone_number: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/api/studnet/profile/changePassword",
        {
          kerberos: Cookies.get("kerberos"),
          oldPassword: key.oldpassword,
          newPassword: key.newPassword,
        }
      );
      if (res.status === 200) {
        toast.success("Password changed successfully");
        setKey({
          oldpassword: "",
          newPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
      toast.warn("Please check if the old password is correct");
    }
  };

  return (
    <>
      <ComplexNavbar />
      <div className="min-h-screen bg-gray-100 flex mt-2">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-200 shadow-md transition-transform duration-300 ease-in-out">
          <ul className="list-none p-0 m-0">
            <li
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                activeTab === "personal-info"
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("personal-info")}
            >
              Personal Info
            </li>
            <li
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                activeTab === "edit-info"
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("edit-info")}
            >
              Edit Profile
            </li>
            <li
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                activeTab === "change-password"
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("change-password")}
            >
              Change Password
            </li>
            {/* <li
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                activeTab === "approved-activities"
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("approved-activities")}
            >
              Approved Activities
            </li>
            <li
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                activeTab === "other-activities"
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("other-activities")}
            >
              Other Activities
            </li> */}
          </ul>
        </div>
        {/* Content */}
        <div className="w-3/4 p-4">
          {activeTab === "personal-info" && (
            <Card className="w-full mb-4">
              <CardBody>
                <Typography variant="h5" className="mb-4">
                  Personal Info
                </Typography>
                <div className="mb-4">
                  <Typography>
                    <strong>Name:</strong> {personalInfo.name}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong>{" "}
                    {`${personalInfo.kerberos}@iitd.ac.in`}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {personalInfo.phone_number}
                  </Typography>
                  <Typography>
                    <strong>Department:</strong>{" "}
                    {personalInfo.kerberos?.slice(0, 3).toUpperCase()}
                  </Typography>
                </div>
              </CardBody>
            </Card>
          )}
          {activeTab === "edit-info" && (
            <Card className="w-full mb-4">
              <CardBody>
                <Typography variant="h5" className="mb-4">
                  Edit Profile
                </Typography>
                <form
                  onSubmit={handleEditProfile}
                  className="flex flex-col gap-4"
                >
                  <Input
                    type="text"
                    label="New Name"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile({ ...profile, name: e.target.value });
                    }}
                    required
                  />
                  <Input
                    type="phone"
                    label="Phone-Number"
                    value={profile.phone_number}
                    onChange={(e) => {
                      setProfile({ ...profile, phone_number: e.target.value });
                    }}
                    required
                  />
                  <Button type="submit" color="blue" ripple="light">
                    Edit
                  </Button>
                </form>
              </CardBody>
            </Card>
          )}
          {activeTab === "change-password" && (
            <Card className="w-full mb-4">
              <CardBody>
                <Typography variant="h5" className="mb-4">
                  Change Password
                </Typography>
                <form
                  onSubmit={handleChangePassword}
                  className="flex flex-col gap-4"
                >
                  <Input
                    type="password"
                    label="Old Password"
                    value={key.oldpassword}
                    onChange={(e) => {
                      setKey({ ...key, oldpassword: e.target.value });
                    }}
                    required
                  />
                  <Input
                    type="password"
                    label="New Password"
                    value={key.newPassword}
                    onChange={(e) => {
                      setKey({ ...key, newPassword: e.target.value });
                    }}
                    required
                  />
                  <Button type="submit" color="blue" ripple="light">
                    Change Password
                  </Button>
                </form>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
