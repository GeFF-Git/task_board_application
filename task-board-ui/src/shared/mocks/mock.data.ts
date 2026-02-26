import { User } from '../../entities/user/model/user.model';
import { Column } from '../../entities/column/model/column.model';
import { Task } from '../../entities/task/model/task.model';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'Kamil Bachanek',
    email: 'kamil@microdose.studio',
    avatar: null,
    role: 'admin',
  },
  {
    id: 'u2',
    fullName: 'Sarah Chen',
    email: 'sarah@microdose.studio',
    avatar: null,
    role: 'member',
  },
  {
    id: 'u3',
    fullName: 'Alex Rivera',
    email: 'alex@microdose.studio',
    avatar: null,
    role: 'member',
  },
];

export const MOCK_COLUMNS: Column[] = [
  { id: 'backlog', name: 'Backlog', icon: 'inbox', color: '#6b7280', order: 0, taskCount: 0 },
  { id: 'in-progress', name: 'In Progress', icon: 'autorenew', color: '#f59e0b', order: 1, taskCount: 0 },
  { id: 'validation', name: 'Validation', icon: 'verified', color: '#8b5cf6', order: 2, taskCount: 0 },
  { id: 'done', name: 'Done', icon: 'check_circle', color: '#10b981', order: 3, taskCount: 0 },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1', code: 'MDS-39', title: 'New microdose website', description: 'Redesign the main website with new branding',
    priority: 'urgent', status: 'backlog', columnId: 'backlog',
    assigneeIds: ['u1'], category: 'New Homepage', categoryEmoji: '🚀',
    dueDate: '2024-07-29', createdAt: '2024-05-20', updatedAt: '2024-05-30',
    commentCount: 13, subtaskCount: 5, subtaskCompleted: 2
  },
  {
    id: 't2', code: 'MDS-56', title: 'Input Styleguide', description: 'Create comprehensive input component styleguide',
    priority: 'normal', status: 'backlog', columnId: 'backlog',
    assigneeIds: ['u1', 'u2'], category: 'Contact', categoryEmoji: '📝',
    dueDate: '2024-06-02', createdAt: '2024-05-18', updatedAt: '2024-05-24',
    commentCount: 4, subtaskCount: 3, subtaskCompleted: 1
  },
  {
    id: 't3', code: 'MDS-41', title: 'Design system tokens', description: 'Define color, spacing, and typography tokens',
    priority: 'normal', status: 'backlog', columnId: 'backlog',
    assigneeIds: ['u2'], category: 'Design System', categoryEmoji: '🎨',
    dueDate: '2024-08-14', createdAt: '2024-05-15', updatedAt: '2024-05-20',
    commentCount: 7, subtaskCount: 4, subtaskCompleted: 0
  },
  {
    id: 't4', code: 'MDS-42', title: 'API documentation portal', description: 'Build developer documentation site',
    priority: 'low', status: 'backlog', columnId: 'backlog',
    assigneeIds: ['u3'], category: 'Documentation', categoryEmoji: '📚',
    dueDate: '2024-09-01', createdAt: '2024-05-10', updatedAt: '2024-05-15',
    commentCount: 2, subtaskCount: 6, subtaskCompleted: 1
  },
  {
    id: 't5', code: 'MDS-43', title: 'Mobile responsive audit', description: 'Audit all pages for mobile responsive issues',
    priority: 'urgent', status: 'backlog', columnId: 'backlog',
    assigneeIds: ['u1', 'u3'], category: 'QA', categoryEmoji: '🔍',
    dueDate: '2024-07-15', createdAt: '2024-05-12', updatedAt: '2024-05-22',
    commentCount: 9, subtaskCount: 8, subtaskCompleted: 3
  },
  {
    id: 't6', code: 'MDS-44', title: 'Performance benchmark', description: 'Set up performance monitoring and benchmarks',
    priority: 'normal', status: 'backlog', columnId: 'backlog',
    assigneeIds: ['u2'], category: 'DevOps', categoryEmoji: '⚡',
    dueDate: '2024-08-20', createdAt: '2024-05-08', updatedAt: '2024-05-18',
    commentCount: 3, subtaskCount: 4, subtaskCompleted: 0
  },
  {
    id: 't7', code: 'MDS-2', title: 'Sales deck', description: 'Create and refine the Q3 sales deck',
    priority: 'low', status: 'in-progress', columnId: 'in-progress',
    assigneeIds: ['u1', 'u2', 'u3'], category: 'Marketing', categoryEmoji: '📢',
    dueDate: '2024-09-19', createdAt: '2024-05-25', updatedAt: '2024-05-31',
    commentCount: 7, subtaskCount: 3, subtaskCompleted: 1
  },
  {
    id: 't8', code: 'MDS-15', title: 'User onboarding flow', description: 'Implement step-by-step onboarding wizard',
    priority: 'urgent', status: 'in-progress', columnId: 'in-progress',
    assigneeIds: ['u1'], category: 'UX', categoryEmoji: '✨',
    dueDate: '2024-07-10', createdAt: '2024-05-20', updatedAt: '2024-05-28',
    commentCount: 11, subtaskCount: 7, subtaskCompleted: 4
  },
  {
    id: 't9', code: 'MDS-22', title: 'Email template system', description: 'Build reusable email template engine',
    priority: 'normal', status: 'in-progress', columnId: 'in-progress',
    assigneeIds: ['u2', 'u3'], category: 'Backend', categoryEmoji: '⚙️',
    dueDate: '2024-08-05', createdAt: '2024-05-14', updatedAt: '2024-05-26',
    commentCount: 5, subtaskCount: 4, subtaskCompleted: 2
  },
  {
    id: 't10', code: 'MDS-30', title: 'Dashboard analytics widget', description: 'Real-time analytics dashboard component',
    priority: 'normal', status: 'in-progress', columnId: 'in-progress',
    assigneeIds: ['u1'], category: 'Analytics', categoryEmoji: '📊',
    dueDate: '2024-08-25', createdAt: '2024-05-22', updatedAt: '2024-05-30',
    commentCount: 3, subtaskCount: 5, subtaskCompleted: 2
  },
  {
    id: 't11', code: 'MDS-1', title: 'Case studies', description: 'Compile case studies from top clients',
    priority: 'urgent', status: 'validation', columnId: 'validation',
    assigneeIds: ['u1', 'u2'], category: 'Fin Tech work', categoryEmoji: '💼',
    dueDate: '2024-09-21', createdAt: '2024-04-15', updatedAt: '2024-04-22',
    commentCount: 1, subtaskCount: 4, subtaskCompleted: 4
  },
  {
    id: 't12', code: 'MDS-12', title: 'Demo reel', description: 'Create demo reel for conference presentations',
    priority: 'normal', status: 'validation', columnId: 'validation',
    assigneeIds: ['u1', 'u2', 'u3'], category: 'Animation 2nd', categoryEmoji: '🎬',
    dueDate: '2024-08-02', createdAt: '2024-04-20', updatedAt: '2024-04-27',
    commentCount: 2, subtaskCount: 5, subtaskCompleted: 5
  },
  {
    id: 't13', code: 'MDS-18', title: 'Accessibility audit fix', description: 'Fix all WCAG 2.1 AA violations',
    priority: 'urgent', status: 'validation', columnId: 'validation',
    assigneeIds: ['u3'], category: 'QA', categoryEmoji: '♿',
    dueDate: '2024-07-25', createdAt: '2024-04-18', updatedAt: '2024-04-25',
    commentCount: 8, subtaskCount: 12, subtaskCompleted: 11
  },
  {
    id: 't14', code: 'MDS-25', title: 'SSO integration', description: 'Implement SAML-based SSO for enterprise clients',
    priority: 'normal', status: 'validation', columnId: 'validation',
    assigneeIds: ['u2'], category: 'Security', categoryEmoji: '🔐',
    dueDate: '2024-08-10', createdAt: '2024-04-22', updatedAt: '2024-04-30',
    commentCount: 6, subtaskCount: 8, subtaskCompleted: 7
  },
  {
    id: 't15', code: 'MDS-28', title: 'Search indexing engine', description: 'Full-text search with Elasticsearch',
    priority: 'low', status: 'validation', columnId: 'validation',
    assigneeIds: ['u1', 'u3'], category: 'Backend', categoryEmoji: '🔎',
    dueDate: '2024-09-05', createdAt: '2024-04-25', updatedAt: '2024-05-02',
    commentCount: 4, subtaskCount: 6, subtaskCompleted: 6
  },
  {
    id: 't16', code: 'MDS-33', title: 'Notification system v2', description: 'Revamp push notification infrastructure',
    priority: 'normal', status: 'validation', columnId: 'validation',
    assigneeIds: ['u2', 'u3'], category: 'Backend', categoryEmoji: '🔔',
    dueDate: '2024-08-18', createdAt: '2024-04-28', updatedAt: '2024-05-05',
    commentCount: 5, subtaskCount: 7, subtaskCompleted: 6
  },
  {
    id: 't17', code: 'MDS-36', title: 'Payment gateway migration', description: 'Migrate from Stripe v2 to v3 API',
    priority: 'urgent', status: 'validation', columnId: 'validation',
    assigneeIds: ['u1'], category: 'Billing', categoryEmoji: '💳',
    dueDate: '2024-07-30', createdAt: '2024-04-30', updatedAt: '2024-05-08',
    commentCount: 15, subtaskCount: 10, subtaskCompleted: 9
  },
  {
    id: 't18', code: 'MDS-43', title: 'Spline animated logo', description: 'Create animated 3D logo with Spline',
    priority: 'low', status: 'done', columnId: 'done',
    assigneeIds: ['u2', 'u3'], category: 'Logo', categoryEmoji: '✨',
    dueDate: '2024-07-13', createdAt: '2024-04-10', updatedAt: '2024-07-29',
    commentCount: 13, subtaskCount: 3, subtaskCompleted: 3
  },
  {
    id: 't19', code: 'MDS-8', title: 'Brand guidelines v2', description: 'Updated brand guidelines document',
    priority: 'normal', status: 'done', columnId: 'done',
    assigneeIds: ['u1'], category: 'Branding', categoryEmoji: '🎨',
    dueDate: '2024-06-20', createdAt: '2024-04-05', updatedAt: '2024-06-18',
    commentCount: 6, subtaskCount: 4, subtaskCompleted: 4
  },
  {
    id: 't20', code: 'MDS-11', title: 'CI/CD pipeline setup', description: 'Configure GitHub Actions for automated deployments',
    priority: 'urgent', status: 'done', columnId: 'done',
    assigneeIds: ['u3'], category: 'DevOps', categoryEmoji: '🚀',
    dueDate: '2024-06-10', createdAt: '2024-04-01', updatedAt: '2024-06-08',
    commentCount: 8, subtaskCount: 6, subtaskCompleted: 6
  },
  {
    id: 't21', code: 'MDS-14', title: 'Customer feedback portal', description: 'Build portal for collecting user feedback',
    priority: 'normal', status: 'done', columnId: 'done',
    assigneeIds: ['u1', 'u2'], category: 'Product', categoryEmoji: '💬',
    dueDate: '2024-07-01', createdAt: '2024-04-08', updatedAt: '2024-06-28',
    commentCount: 10, subtaskCount: 8, subtaskCompleted: 8
  },
  {
    id: 't22', code: 'MDS-19', title: 'Data export module', description: 'CSV and PDF data export functionality',
    priority: 'low', status: 'done', columnId: 'done',
    assigneeIds: ['u2'], category: 'Backend', categoryEmoji: '📤',
    dueDate: '2024-07-20', createdAt: '2024-04-12', updatedAt: '2024-07-18',
    commentCount: 4, subtaskCount: 5, subtaskCompleted: 5
  },
];

export const MOCK_REPORT = {
  totalTasks: 22,
  completedTasks: 5,
  completionPercentage: 22,
  overdueTasks: 1,
  upcomingTasks: 8,
};
