import { useEffect, useMemo, useState, type DragEvent, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, ClipboardList, Plus } from 'lucide-react';
import EventTabs from '../components/EventTabs';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeletons';
import { createTask, getTasks, updateTask } from '../data/store';
import type { TaskItem, TaskPriority, TaskStatus } from '../types';
import { TASK_PRIORITIES, TASK_STATUSES, TASK_STATUS_LABELS } from '../constants';
import { validateRequired } from '../validation';
import { formatDate } from '../utils/format';

const PRIORITY_TONE: Record<TaskPriority, 'neutral' | 'info' | 'warning' | 'danger'> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

interface TaskFormState {
  title: string;
  description: string;
  assignee: string;
  priority: TaskPriority;
  deadline: string;
  dependsOn: string;
}

const EMPTY_FORM: TaskFormState = {
  title: '',
  description: '',
  assignee: '',
  priority: 'medium',
  deadline: '',
  dependsOn: '',
};

export function EventTasks() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<{ title: string; assignee: string; deadline: string }>({
    title: '',
    assignee: '',
    deadline: '',
  });
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let isMounted = true;
    getTasks(eventId).then((data) => {
      if (isMounted) {
        setTasks(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, TaskItem[]> = { TODO: [], IN_PROGRESS: [], BLOCKED: [], COMPLETED: [] };
    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [tasks]);

  function dependencyFor(task: TaskItem): TaskItem | undefined {
    if (!task.dependsOn) return undefined;
    return tasks.find((candidate) => candidate.id === task.dependsOn);
  }

  const isValid =
    validateRequired(form.title, 'Title') === '' &&
    validateRequired(form.assignee, 'Assignee') === '' &&
    validateRequired(form.deadline, 'Deadline') === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = {
      title: validateRequired(form.title, 'Title'),
      assignee: validateRequired(form.assignee, 'Assignee'),
      deadline: validateRequired(form.deadline, 'Deadline'),
    };
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.assignee || nextErrors.deadline) {
      return;
    }
    if (!isValid || !eventId) {
      return;
    }

    const created = await createTask({
      eventId,
      title: form.title,
      description: form.description,
      status: form.dependsOn ? 'BLOCKED' : 'TODO',
      priority: form.priority,
      assignee: form.assignee,
      deadline: form.deadline,
      dependsOn: form.dependsOn || null,
    });

    setTasks((previous) => [created, ...previous]);
    setForm(EMPTY_FORM);
    setIsModalOpen(false);
  }

  function handleDragStart(taskId: string) {
    setDraggedTaskId(taskId);
  }

  async function handleDrop(status: TaskStatus, event: DragEvent) {
    event.preventDefault();
    if (!draggedTaskId) return;

    const task = tasks.find((candidate) => candidate.id === draggedTaskId);
    if (!task) return;

    if (status !== 'BLOCKED' && task.dependsOn) {
      const dependency = tasks.find((candidate) => candidate.id === task.dependsOn);
      if (dependency && dependency.status !== 'COMPLETED') {
        setDraggedTaskId(null);
        return;
      }
    }

    const updated = await updateTask(task.id, { status });
    if (updated) {
      setTasks((previous) => previous.map((candidate) => (candidate.id === updated.id ? updated : candidate)));
    }
    setDraggedTaskId(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <EventTabs />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <EventTabs />

      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl">Task board</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-glow hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" /> New task
        </button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-6 h-6" />}
          title="No tasks yet"
          description="Create your first task to start tracking progress for this event."
          action={
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold"
            >
              Create a task
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TASK_STATUSES.map((status) => (
            <div
              key={status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(status, event)}
              className="rounded-2xl bg-surface-card dark:bg-white/5 p-3 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold">{TASK_STATUS_LABELS[status]}</h3>
                <span className="text-xs text-muted bg-white dark:bg-surface-cardDark px-2 py-0.5 rounded-full">
                  {tasksByStatus[status].length}
                </span>
              </div>
              <div className="space-y-3">
                {tasksByStatus[status].map((task) => {
                  const dependency = dependencyFor(task);
                  const isBlockedByDependency = dependency && dependency.status !== 'COMPLETED';
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className="card-surface p-4 cursor-grab active:cursor-grabbing hover:shadow-glow transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium leading-snug">{task.title}</p>
                        <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted line-clamp-2 mb-3">{task.description}</p>

                      {status === 'BLOCKED' && isBlockedByDependency && dependency && (
                        <div className="flex items-start gap-2 text-xs text-danger bg-danger-light dark:bg-danger/10 rounded-lg px-2.5 py-2 mb-3">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>Blocked by "{dependency.title}" ({TASK_STATUS_LABELS[dependency.status]})</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name={task.assignee} size="sm" />
                          <span className="text-xs text-muted">{task.assignee.split(' ')[0]}</span>
                        </div>
                        <span className="text-xs text-muted">{formatDate(task.deadline)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} title="Create task" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {errors.title && <p className="text-xs mt-1 text-danger">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="task-assignee">
                Assignee
              </label>
              <input
                id="task-assignee"
                type="text"
                value={form.assignee}
                onChange={(event) => setForm((previous) => ({ ...previous, assignee: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors.assignee && <p className="text-xs mt-1 text-danger">{errors.assignee}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(event) => setForm((previous) => ({ ...previous, priority: event.target.value as TaskPriority }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="task-deadline">
                Deadline
              </label>
              <input
                id="task-deadline"
                type="date"
                value={form.deadline}
                onChange={(event) => setForm((previous) => ({ ...previous, deadline: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors.deadline && <p className="text-xs mt-1 text-danger">{errors.deadline}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="task-depends-on">
                Depends on
              </label>
              <select
                id="task-depends-on"
                value={form.dependsOn}
                onChange={(event) => setForm((previous) => ({ ...previous, dependsOn: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">None</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-primary shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create task
          </button>
        </form>
      </Modal>
    </div>
  );
}
