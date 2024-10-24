"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { UserService } from "@/services/Client/UserService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { TaskResponse } from "@/lib/types";
import { TaskService } from "@/services/Client/TaskService";
import { useMutation } from "@tanstack/react-query";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
};

type NewTask = {
  title: string;
  description: string;
};

export default function TasksPage() {
  const { token, setUserInformation } = useUserStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
  });
  const [updatedTask, setUpdatedTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    status: "",
  });
  useEffect(() => {
    if (selectedTask) {
      console.log("Selected task:", selectedTask);
      setUpdatedTask({
        id: selectedTask.id,
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
      });
    }
  }, [selectedTask]);

  const fetchUser = async () => {
    const response = await UserService.getUser();
    return response.data;
  };

  const { data: tasks = [] } = useQuery<TaskResponse[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await TaskService.getTasks();
      return response.data;
    },
    enabled: !!token,
  });

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      console.log("User data:", data);
      setUserInformation(data);
    }
  }, [data, setUserInformation]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setUpdatedTask({
      id: "",
      title: "",
      description: "",
      status: "",
    });
  };

  const getCardColor = (status: "todo" | "doing" | "done") => {
    switch (status) {
      case "todo":
        return "bg-red-50";
      case "doing":
        return "bg-yellow-50";
      case "done":
        return "bg-green-50";
      default:
        return "";
    }
  };

  const addTask = async () => {
    const response = await TaskService.createTask(
      newTask.title,
      newTask.description,
      data.id
    );
    return response.data;
  };

  const deleteTask = async (id: string) => {
    const response = await TaskService.deleteTask(id);
    return response.data;
  };

  const updateTask = async (id: string) => {
    const response = await TaskService.updateTask(
      id,
      updatedTask.title,
      updatedTask.description,
      updatedTask.status
    );
    return response.data;
  };

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      console.log("Task adicionada:", data);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout falhou:", error);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      console.log("Task deletada:", data);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout falhou:", error);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      console.log("Task atualizada:", data);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout falhou:", error);
    },
  });

  const handleAddTask = async () => {
    addTaskMutation.mutate();
  };

  const handleDeleteTask = async (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleUpdateTask = async (id: string) => {
    updateTaskMutation.mutate(id);
  };

  const renderTaskColumn = (status: "todo" | "doing" | "done") => {
    const filteredTasks = tasks.filter((task) => task.status === status);
    return (
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </h2>
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`cursor-pointer ${getCardColor(task.status)} relative`}
              onClick={() => handleTaskClick(task)}
            >
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={(e) => handleDeleteTask(task.id, e)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold mb-6">Task Management</h1>
      <Button onClick={() => setIsAddTaskModalOpen(true)} className="mb-6">
        Add New Task
      </Button>
      <div className="flex space-x-4">
        {renderTaskColumn("todo")}
        <div className="w-px bg-black self-stretch"></div>
        {renderTaskColumn("doing")}
        <div className="w-px bg-black self-stretch"></div>
        {renderTaskColumn("done")}
      </div>
      <Dialog open={!!selectedTask} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={updatedTask.title}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={updatedTask.description}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Select
                onValueChange={(value: string) =>
                  setUpdatedTask({ ...updatedTask, status: value })
                }
                value={updatedTask.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="doing">Doing</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => handleUpdateTask(updatedTask.id)}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddTaskModalOpen} onOpenChange={setIsAddTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
