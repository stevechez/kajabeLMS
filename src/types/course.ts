export interface Lesson {
	id: string;
}

export interface Module {
	id: string;
	lessons: Lesson[];
}

export interface CourseWithLessons {
	id: string;
	title: string;
	thumbnail_url: string | null;
	price: number | null;
	is_published: boolean;
	modules: Module[];
}
