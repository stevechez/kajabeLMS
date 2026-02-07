import { CourseWithFullData, Lesson } from '@/types';

export const getNextLesson = (
	course: CourseWithFullData,
	currentLessonId: string,
): Lesson | null => {
	// 1. Get all lessons in order
	const allLessons = course.modules
		.sort((a, b) => a.order_index - b.order_index)
		.flatMap(module =>
			module.lessons.sort((a, b) => a.order_index - b.order_index),
		);

	// 2. Find current index
	const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

	// 3. Return next lesson or null
	return allLessons[currentIndex + 1] || null;
};
