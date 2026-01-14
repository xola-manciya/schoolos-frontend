export interface Class {
  id: number
  name: string
  grade: number
  class_teacher: string
  class_teacher_id: number
  student_count: number
  subjects: string[]
}

export const mockClasses: Class[] = [
  {
    id: 1,
    name: 'Grade 10A',
    grade: 10,
    class_teacher: 'Sarah Johnson',
    class_teacher_id: 2,
    student_count: 35,
    subjects: ['Mathematics', 'Physical Sciences', 'English', 'Life Orientation', 'History', 'Accounting'],
  },
  {
    id: 2,
    name: 'Grade 9B',
    grade: 9,
    class_teacher: 'David Williams',
    class_teacher_id: 3,
    student_count: 32,
    subjects: ['Mathematics', 'Natural Sciences', 'English', 'Life Orientation', 'Geography', 'Technology'],
  },
  {
    id: 3,
    name: 'Grade 8C',
    grade: 8,
    class_teacher: 'James Wilson',
    class_teacher_id: 7,
    student_count: 30,
    subjects: ['Mathematics', 'Natural Sciences', 'English', 'Life Orientation', 'Social Sciences', 'Arts'],
  },
  {
    id: 4,
    name: 'Grade 11B',
    grade: 11,
    class_teacher: 'Lisa Taylor',
    class_teacher_id: 6,
    student_count: 28,
    subjects: ['Mathematics', 'Physical Sciences', 'English', 'Life Orientation', 'Accounting', 'Business Studies'],
  },
  {
    id: 5,
    name: 'Grade 12A',
    grade: 12,
    class_teacher: 'Mary Brown',
    class_teacher_id: 4,
    student_count: 25,
    subjects: ['Mathematics', 'Physical Sciences', 'English', 'Life Orientation', 'History', 'Geography'],
  },
]
