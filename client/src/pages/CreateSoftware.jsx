import React, { useState } from "react";
import axios from "axios";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BASE_URL } from "@/utils/url";

const CreateSoftware = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accessLevels: [],
  });
  const [isloading,setIsLoading]=useState(false)

  const accessOptions = ["Read", "Write", "Admin"];

  const handleCheckboxChange = (level) => {
    setFormData((prev) => {
      const accessLevels = prev.accessLevels.includes(level)
        ? prev.accessLevels.filter((l) => l !== level)
        : [...prev.accessLevels, level];
      return { ...prev, accessLevels };
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
console.log(formData)
    if (
      !formData.name ||
      !formData.description ||
      formData.accessLevels.length === 0
    ) {
      toast.error(
        "Please fill all fields and select at least one access level"
      );
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/software/create-software`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response)
      toast.success(response.data.message || "Software created successfully");
     
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create software");
    }finally{
      setFormData({
        name: "",
        description: "",
        accessLevels: [],
      });
      setIsLoading(false)
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-semibold mb-6">Create New Software</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Software Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter software name"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the software"
          />
        </div>

        <div>
          <Label>Access Levels</Label>
          <div className="flex gap-4 mt-2">
            {accessOptions.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={formData.accessLevels.includes(level)}
                  onCheckedChange={() => handleCheckboxChange(level)}
                />
                <Label htmlFor={level}>{level}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" variant={"outline"} className="w-full">
          {isloading ? "Creating..." : " Create Software"}
        </Button>
      </form>
    </div>
  );
};

export default CreateSoftware;
