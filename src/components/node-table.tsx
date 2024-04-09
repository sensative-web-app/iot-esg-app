"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Node } from "./node";
import { fetchNodes } from "@/lib/queryHelper";
import { useQuery } from "@tanstack/react-query";

export const NodeTable = ({ token }: { token: string }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["nodes"],
    queryFn: () => fetchNodes(token),
  });

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-full h-full flex justify-center ">
      {selectedNode ? (
        <Node node={selectedNode} exitFn={() => setSelectedNode(null)} />
      ) : (
        <Table className="gap-1">
          <TableHeader className="h-full">
            <TableRow className="text-center h-full">
              <TableHead className="text-start text-gray-300">
                Node name
              </TableHead>
              <TableHead className="text-start text-gray-300">
                Device model
              </TableHead>
              <TableHead className="text-center text-gray-300">
                Battery
              </TableHead>
              <TableHead className="text-center text-gray-300">
                Reported at
              </TableHead>
              <TableHead className="text-center text-gray-300">
                Created at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-400 h-full ">
            {!isLoading &&
              data.map((node: any) => (
                <TableRow key={node._id}>
                  <TableCell className="font-medium hover:cursor-pointer hover:underline hover:text-gray-300">
                    <div onClick={() => handleNodeClick(node)}>{node.name}</div>
                  </TableCell>

                  <TableCell>{node.deviceModelName}</TableCell>
                  <TableCell className="text-center">
                    {node.batteryLevel}
                  </TableCell>

                  <TableCell className="text-right">
                    {new Date(node.reportedAt).toLocaleString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(node.createdAt).toLocaleString("en-GB")}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
