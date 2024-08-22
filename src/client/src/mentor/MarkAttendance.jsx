import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const MarkAttendance = () => {
  const [date, setDate] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [photo, setPhoto] = useState([]);
  const navigate = useNavigate();
  const handleDateChange = (e) => setDate(e.target.value);
  const handleDiscussionChange = (e) => setDiscussion(e.target.value);
  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //extract form data...
    const formData = new FormData();
    formData.append("date", date);
    formData.append("description", discussion);
    formData.append("kerberos", Cookies.get("kerberos"));
    formData.append("photo", photo);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/mentor/attendance/post",
        formData,
        { headers: "Content-Type:multipart/form-data" }
      );
      if (res.status === 201) {
        setDate("");
        setDiscussion("");
        setPhoto([]);
        navigate("/mentor/dashboard");
        toast.success("Attendance marked successfully");
      } else {
        toast.warn("Size of photo should be less than 50KB");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error in marking attendance");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-4">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Mark Attendance
            </h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="font-medium">
                Date: Session date*
              </label>
              <Input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="discussion" className="font-medium">
                What was discussed in this session?*
              </label>
              <Textarea
                id="discussion"
                value={discussion}
                onChange={handleDiscussionChange}
                required
                placeholder="Describe the session..."
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="photo" className="font-medium justify-center">
                Photo of session*
              </label>
              <Input
                type="file"
                id="photo"
                onChange={handlePhotoChange}
                accept="image/*"
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <Button
              type="submit"
              color="blue"
              ripple="light"
              className="mt-4 w-full"
            >
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default MarkAttendance;
