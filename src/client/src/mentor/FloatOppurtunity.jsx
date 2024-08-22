import React, { useState } from "react";
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

const FloatOpportunity = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [course, setCourse] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  // const handleStartDateTimeChange = (e) => setStartDateTime(e.target.value);
  const handleEndDateTimeChange = (e) => setEndDateTime(e.target.value);
  const handleCourseChange = (e) => setCourse(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/api/mentor/opportunity/post",
        {
          kerberos: Cookies.get("kerberos"),
          title: title,
          description: description,
          end: endDateTime,
          course: course,
        }
      );
      if (res.status === 201) {
        setTitle("");
        setDescription("");
        // setStartDateTime("");
        setEndDateTime("");
        setCourse("");
        navigate("/mentor/dashboard");
        toast.success("Opportunity floated successfully");
      } else {
        toast.warn("Check the details entered");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error in floating opportunity");
    }
  };

  const courseOptions = [
    { value: "", label: "Select a course" }, // Placeholder option
    { value: "General", label: "CML-101" },
    { value: "CML101", label: "PYL-101" },
    { value: "APL100", label: "APL100" },
    { value: "ELL100", label: "ELL100" },
    { value: "PYL101", label: "PYL101" },
    { value: "COL100", label: "COL100" },
    { value: "MTL101", label: "MTL101" },
    { value: "MTL100", label: "MTL100" },
    { value: "MCP101", label: "MCP101" },
    { value: "MCP100", label: "MCP100" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-4">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Float Opportunity
            </h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-medium">
                Title*
              </label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="course" className="font-medium">
                Course*
              </label>
              <div className="relative">
                <select
                  id="course"
                  value={course}
                  onChange={handleCourseChange}
                  required
                  className="w-full p-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {courseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="font-medium">
                Description*
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                required
                placeholder="Describe the opportunity..."
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* <div className="flex flex-col gap-2">
              <label htmlFor="startDateTime" className="font-medium">
                Start of event
              </label>
              <Input
                type="datetime-local"
                id="startDateTime"
                value={startDateTime}
                onChange={handleStartDateTimeChange}
                className="w-full p-2 border rounded-md"
              />
            </div> */}

            <div className="flex flex-col gap-2">
              <label htmlFor="endDateTime" className="font-medium">
                End of event
              </label>
              <Input
                type="datetime-local"
                id="endDateTime"
                value={endDateTime}
                onChange={handleEndDateTimeChange}
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

export default FloatOpportunity;
