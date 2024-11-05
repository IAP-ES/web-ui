"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { UserService } from "@/services/Client/UserService";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Trash2, Calendar } from "lucide-react";
import { TaskResponse } from "@/lib/types";
import { TaskService } from "@/services/Client/TaskService";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { toast } from "@/hooks/use-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  deadline: Date | null;
  created_at: string;
};

type NewTask = {
  title: string;
  description: string;
  priority: number;
  deadline: Date | null;
};

export default function Component() {
  const queryClient = useQueryClient();
  const { token, setUserInformation } = useUserStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: 0,
    deadline: null,
  });
  const [updatedTask, setUpdatedTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    status: "",
    priority: 1,
    deadline: null,
    created_at: "",
  });

  const [sortBy, setSortBy] = useState<"deadline" | "createdAt">("deadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: tasks = [], refetch: refetchTasks } = useQuery<TaskResponse[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await TaskService.getTasks();
      return response.data;
    },
    enabled: !!token,
  });

  const sortTasks = useCallback(
    (a: Task, b: Task) => {
      if (sortBy === "deadline") {
        const aDate = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const bDate = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      } else if (sortBy === "createdAt") {
        console.log(
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    },
    [sortBy, sortOrder]
  );

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = tasks;
    if (priorityFilter !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === Number(priorityFilter)
      );
    }
    return filteredTasks.sort(sortTasks);
  }, [tasks, sortTasks, priorityFilter]);

  useEffect(() => {
    if (selectedTask) {
      setUpdatedTask({
        ...selectedTask,
        deadline: selectedTask.deadline
          ? new Date(selectedTask.deadline)
          : null,
      });
    }
  }, [selectedTask]);

  const fetchUser = async () => {
    const response = await UserService.getUser();
    return response.data;
  };

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  });

  useEffect(() => {
    if (userData) {
      setUserInformation(userData);
    }
  }, [userData, setUserInformation]);

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
      priority: 1,
      deadline: null,
      created_at: "",
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
    if (!newTask.title || newTask.priority === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return null;
    }
    const response = await TaskService.createTask(
      newTask.title,
      newTask.description,
      newTask.priority,
      newTask.deadline?.toISOString().split("T")[0],
      userData.id
    );
    return response.data;
  };

  const deleteTask = async (id: string) => {
    const response = await TaskService.deleteTask(id);
    return response.data;
  };

  const updateTask = async (task: Task) => {
    if (!task.title || task.priority === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return null;
    }
    const response = await TaskService.updateTask(
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.deadline ? task.deadline.toISOString().split("T")[0] : null
    );
    return response.data;
  };

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries(["tasks"]);
        setIsAddTaskModalOpen(false);
        setNewTask({
          title: "",
          description: "",
          priority: 0,
          deadline: null,
        });
      }
    },
    onError: (error) => {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries(["tasks"]);
        closeModal();
      }
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddTask = () => {
    addTaskMutation.mutate();
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleUpdateTask = () => {
    updateTaskMutation.mutate(updatedTask);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as "todo" | "doing" | "done";

    queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map((task) =>
        task.id === draggableId ? { ...task, status: newStatus } : task
      );
    });

    const taskToUpdate = tasks.find((task) => task.id === draggableId);
    if (taskToUpdate) {
      const updatedTaskData = { ...taskToUpdate, status: newStatus };
      updateTaskMutation.mutate({
        ...updatedTaskData,
        deadline: updatedTaskData.deadline
          ? new Date(updatedTaskData.deadline)
          : null,
      });
    }
  };

  const renderTasks = () => {
    return (
      <div className="flex space-x-4">
        {renderTaskColumn("todo")}
        <div className="w-px bg-black self-stretch"></div>
        {renderTaskColumn("doing")}
        <div className="w-px bg-black self-stretch"></div>
        {renderTaskColumn("done")}
      </div>
    );
  };

  const TaskCard = ({ task, index }: { task: Task; index: number }) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-pointer ${getCardColor(
            task.status as "todo" | "doing" | "done"
          )} relative`}
          onClick={() => handleTaskClick(task)}
        >
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-2">{task.description}</p>
            {task.deadline && (
              <p className="text-sm text-gray-500 mb-2">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </p>
            )}
            <div className="absolute bottom-2 right-2 items-center justify-center">
              <Badge
                style={{
                  backgroundColor:
                    task.priority == 3
                      ? "#ff4d4f"
                      : task.priority == 2
                      ? "#ffc107"
                      : "#28a745",
                  color: "white",
                }}
              >
                {task.priority == 1
                  ? "Low"
                  : task.priority == 2
                  ? "Medium"
                  : "High"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  const renderTaskColumn = (status: "todo" | "doing" | "done") => {
    const filteredTasks = filteredAndSortedTasks.filter(
      (task) => task.status === status
    );
    return (
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-1 p-4"
          >
            <h2 className="text-xl font-bold mb-4">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            <div className="space-y-4">
              {filteredTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold mb-6">Task Management</h1>
        <Button
          onClick={() => {
            setIsAddTaskModalOpen(true);
            setNewTask({
              title: "",
              description: "",
              priority: 0,
              deadline: null,
            });
          }}
          className="mb-6"
        >
          Add New Task
        </Button>
        <div className="flex space-x-4 mb-6">
          <div className="w-1/3">
            <Label htmlFor="sort-by">Sort by</Label>
            <Select
              onValueChange={(value) => {
                setSortBy(value as "deadline" | "createdAt");
                setSortOrder("asc");
              }}
              defaultValue="deadline"
            >
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="createdAt">Created At</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/3">
            <Label htmlFor="sort-order">Sort Order</Label>
            <Select
              onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
              defaultValue="asc"
            >
              <SelectTrigger id="sort-order">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>

                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/3">
            <Label htmlFor="filter-priority">Filter by Priority</Label>
            <Select onValueChange={setPriorityFilter} defaultValue="all">
              <SelectTrigger id="filter-priority">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="1">Low</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {renderTasks()}
        <Dialog open={!!selectedTask} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={updatedTask.title}
                  onChange={(e) =>
                    setUpdatedTask({ ...updatedTask, title: e.target.value })
                  }
                  required
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
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  onValueChange={(value) =>
                    setUpdatedTask({ ...updatedTask, priority: Number(value) })
                  }
                  value={updatedTask.priority.toString()}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Change priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <div className="flex items-center">
                  <DatePicker
                    selected={updatedTask.deadline}
                    onChange={(date: Date | null) =>
                      setUpdatedTask({ ...updatedTask, deadline: date })
                    }
                    customInput={<Input />}
                    dateFormat="MMMM d, yyyy"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() =>
                      setUpdatedTask({ ...updatedTask, deadline: null })
                    }
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  onValueChange={(value) =>
                    setUpdatedTask({ ...updatedTask, status: value })
                  }
                  value={updatedTask.status}
                  required
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
              <Button onClick={handleUpdateTask}>Update</Button>
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
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  required
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
              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, priority: Number(value) })
                  }
                  value={newTask.priority.toString()}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <div className="flex items-center">
                  <DatePicker
                    selected={newTask.deadline}
                    onChange={(date: Date | null) =>
                      setNewTask({ ...newTask, deadline: date })
                    }
                    customInput={<Input />}
                    dateFormat="MMMM d, yyyy"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => setNewTask({ ...newTask, deadline: null })}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DragDropContext>
  );
}
