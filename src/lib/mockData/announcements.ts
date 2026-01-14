export interface Announcement {
  id: number
  title: string
  content: string
  category: 'GENERAL' | 'ACADEMIC' | 'EVENT' | 'URGENT' | 'HOLIDAY'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  author: string
  created_at: string
  is_active: boolean
  target_audience: 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS'
}

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Welcome Back - New Academic Year 2025',
    content: 'Welcome to all students, parents, and staff for the 2025 academic year. Classes commence on 15 January 2025. We look forward to a successful year ahead!',
    category: 'GENERAL',
    priority: 'HIGH',
    author: 'John Doe',
    created_at: '2025-01-01T08:00:00Z',
    is_active: true,
    target_audience: 'ALL',
  },
  {
    id: 2,
    title: 'Mid-Year Examination Timetable Released',
    content: 'The mid-year examination timetable is now available. Students can collect their timetables from the admin office or download from the portal. Exams begin on 10 June 2025.',
    category: 'ACADEMIC',
    priority: 'HIGH',
    author: 'Sarah Johnson',
    created_at: '2025-05-15T10:30:00Z',
    is_active: true,
    target_audience: 'STUDENTS',
  },
  {
    id: 3,
    title: 'Sports Day - 20 March 2025',
    content: 'Our annual sports day will take place on 20 March 2025 at the school grounds. All students are encouraged to participate. Parents are welcome to attend and support their children.',
    category: 'EVENT',
    priority: 'MEDIUM',
    author: 'David Williams',
    created_at: '2025-02-28T14:00:00Z',
    is_active: true,
    target_audience: 'ALL',
  },
  {
    id: 4,
    title: 'Payment Deadline - School Fees',
    content: 'Reminder: The deadline for the first term school fees payment is 31 January 2025. Please ensure all payments are made on time to avoid any inconvenience.',
    category: 'URGENT',
    priority: 'HIGH',
    author: 'Peter Smith',
    created_at: '2025-01-15T09:00:00Z',
    is_active: true,
    target_audience: 'PARENTS',
  },
  {
    id: 5,
    title: 'Easter Holiday Notice',
    content: 'School will be closed for Easter holidays from 18 April to 28 April 2025. Classes will resume on 29 April 2025. Have a blessed Easter!',
    category: 'HOLIDAY',
    priority: 'MEDIUM',
    author: 'John Doe',
    created_at: '2025-03-30T11:00:00Z',
    is_active: true,
    target_audience: 'ALL',
  },
  {
    id: 6,
    title: 'Parent-Teacher Conference - 15 February',
    content: 'Parent-teacher conferences will be held on 15 February 2025 from 14:00 to 18:00. Parents are requested to schedule appointments with respective teachers.',
    category: 'EVENT',
    priority: 'HIGH',
    author: 'Sarah Johnson',
    created_at: '2025-02-01T08:30:00Z',
    is_active: true,
    target_audience: 'PARENTS',
  },
  {
    id: 7,
    title: 'New Library Books Available',
    content: 'We have added 150 new books to our school library covering various subjects. Students are encouraged to visit the library and explore the new collection.',
    category: 'ACADEMIC',
    priority: 'LOW',
    author: 'Emily Davis',
    created_at: '2025-02-10T12:00:00Z',
    is_active: true,
    target_audience: 'STUDENTS',
  },
  {
    id: 8,
    title: 'Staff Development Day - No Classes',
    content: 'There will be no classes on Friday, 7 March 2025 due to staff development training. Students do not need to come to school on this day.',
    category: 'GENERAL',
    priority: 'HIGH',
    author: 'John Doe',
    created_at: '2025-02-25T15:00:00Z',
    is_active: true,
    target_audience: 'ALL',
  },
  {
    id: 9,
    title: 'Science Fair Competition - Call for Entries',
    content: 'The annual science fair will be held on 25 April 2025. Students interested in participating should submit their project proposals to Mr. Wilson by 30 March 2025.',
    category: 'EVENT',
    priority: 'MEDIUM',
    author: 'James Wilson',
    created_at: '2025-03-05T10:00:00Z',
    is_active: true,
    target_audience: 'STUDENTS',
  },
  {
    id: 10,
    title: 'COVID-19 Safety Protocols',
    content: 'Reminder to all staff and students to continue following COVID-19 safety protocols. Masks are optional but recommended. Hand sanitizers are available throughout the school.',
    category: 'URGENT',
    priority: 'MEDIUM',
    author: 'John Doe',
    created_at: '2025-01-10T09:30:00Z',
    is_active: true,
    target_audience: 'ALL',
  },
]
