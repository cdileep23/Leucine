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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PendingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({});

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/request/get-all",
        { withCredentials: true }
      );

      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        toast.error("Failed to fetch requests");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, status) => {
    try {
      setProcessing((prev) => ({ ...prev, [requestId]: true }));

      const response = await axios.patch(
        `http://localhost:5000/api/request/${requestId}`,
        { status },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Request has been ${status.toLowerCase()}`);
        await fetchRequests(); // Refresh the list
      } else {
        toast.error(
          response.data.error || `Failed to ${status.toLowerCase()} request`
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.error || `Error updating request`);
    } finally {
      setProcessing((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Pending Access Requests</h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Software</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Access Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.user.username}</TableCell>
                  <TableCell>{request.software.name}</TableCell>
                  <TableCell>{request.software.description}</TableCell>
                  <TableCell>{request.accessType}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        request.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex  gap-2 items-center">
                    {request.status === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(request.id, "Approved")
                          }
                          disabled={processing[request.id]}
                        >
                          {processing[request.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(request.id, "Rejected")
                          }
                          disabled={processing[request.id]}
                        >
                          {processing[request.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No pending requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PendingRequest;
