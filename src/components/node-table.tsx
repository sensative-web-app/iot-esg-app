"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Node } from "./node";

export const NodeTable = ({ nodes }: { nodes: any }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div>
      {selectedNode ? (
        <Node node={selectedNode} exitFn={() => setSelectedNode(null)} />
      ) : (
        <Table className="">
          <TableCaption className="mb-6">
            A list of IoT Nodes in the network.
          </TableCaption>
          <TableFooter>
            <TableRow>
              <TableHead>Total nodes</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>

              <TableCell className="text-right">{nodes.length}</TableCell>
            </TableRow>
          </TableFooter>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-start">Node name</TableHead>
              <TableHead className="text-start">Device model</TableHead>
              <TableHead className="text-center">Battery</TableHead>
              <TableHead className="text-center">Reported at</TableHead>
              <TableHead className="text-center">Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-300">
            {nodes.map((node: any) => (
              <TableRow key={node._id}>
                <TableCell className="font-medium hover:cursor-pointer hover:underline">
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
