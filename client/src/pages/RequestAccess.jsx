import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Eye, Edit, Shield } from "lucide-react";

const RequestAccess = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [accessTypes, setAccessTypes] = useState({});
  const [loading, setLoading] = useState({
    table: false,
    dialog: false,
  });
  const [currentRequest, setCurrentRequest] = useState({
    softwareId: null,
    softwareName: "",
    accessType: "",
  });
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const accessIcons = {
    Read: <Eye className="h-4 w-4" />,
    Write: <Edit className="h-4 w-4" />,
    Admin: <Shield className="h-4 w-4" />,
  };

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        setLoading((prev) => ({ ...prev, table: true }));
        const response = await axios.get(
          "http://localhost:5000/api/software/get-software",
          { withCredentials: true }
        );

        if (response.data.success) {
          setSoftwareList(response.data.data);

          const initialAccess = {};
          response.data.data.forEach((software) => {
            initialAccess[software.id] = software.accessLevels[0] || "Read";
          });
          setAccessTypes(initialAccess);
        } else {
          toast.error("Failed to fetch software list");
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Error fetching software");
      } finally {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    };

    fetchSoftware();
  }, []);

  const handleAccessTypeChange = (softwareId, value) => {
    setAccessTypes((prev) => ({
      ...prev,
      [softwareId]: value,
    }));
  };

  const openRequestDialog = (softwareId, softwareName, accessType) => {
    setCurrentRequest({
      softwareId,
      softwareName,
      accessType,
    });
    setReason("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setReason("");
  };

  const handleRequestAccess = async () => {
    if (!reason) {
      toast.error("Please provide a reason for requesting access");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, dialog: true }));
      const response = await axios.post(
        "http://localhost:5000/api/request",
        {
          softwareId: currentRequest.softwareId,
          reason,
          accessType: currentRequest.accessType,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Access request submitted successfully!");
        closeDialog();
      } else {
        toast.error(response.data.error || "Request failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Request failed");
    } finally {
      setLoading((prev) => ({ ...prev, dialog: false }));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Software Access Request</h2>

      {loading.table && softwareList.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="border">Software Name</TableHead>
                <TableHead className="border">Description</TableHead>
                <TableHead className="border">Access Type</TableHead>
                <TableHead className="border">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {softwareList.map((software) => (
                <TableRow key={software.id}>
                  <TableCell className="border font-medium">
                    {software.name}
                  </TableCell>
                  <TableCell className="border">
                    {software.description}
                  </TableCell>
                  <TableCell className="border">
                    <Select
                      value={
                        accessTypes[software.id] || software.accessLevels[0]
                      }
                      onValueChange={(value) =>
                        handleAccessTypeChange(software.id, value)
                      }
                    >
                      <SelectTrigger className="w-[140px] bg-white">
                        <div className="flex items-center gap-2">
                          {accessIcons[accessTypes[software.id]]}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {software.accessLevels.map((level) => (
                          <SelectItem
                            key={level}
                            value={level}
                            className="hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-2">
                             
                              <span className="text-sm font-medium">
                                {level}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openRequestDialog(
                          software.id,
                          software.name,
                          accessTypes[software.id]
                        )
                      }
                      disabled={loading.table}
                    >
                      Request Access
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {softwareList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center border">
                    No software available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white border-0 shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">Request Access</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Please provide a reason for requesting{" "}
                  <span className="font-medium">
                    {currentRequest.accessType}
                  </span>{" "}
                  access to{" "}
                  <span className="font-medium">
                    {currentRequest.softwareName}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter your reason..."
                    className="col-span-4"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                  className="bg-white hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleRequestAccess}
                  disabled={loading.dialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading.dialog && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loading.dialog ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default RequestAccess;
