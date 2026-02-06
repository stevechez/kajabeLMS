export interface Course {
	id: string;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	price: number | null;
	is_published: boolean;
	category_id: string | null;
	created_at: string;
	updated_at: string;
}

export interface Module {
	id: string;
	course_id: string;
	title: string;
	order_index: number;
}

export interface Lesson {
	id: string;
	module_id: string;
	title: string;
	content: string | null;
	video_playback_id: string | null;
	order_index: number;
	is_published: boolean;
	is_free: boolean;
	user_progress?: UserProgress[]; // Added for the student view
}

export interface UserProgress {
	id: string;
	user_id: string;
	lesson_id: string;
	is_completed: boolean;
}

// 2. The Extended Type used in Browse and Dashboard
export interface CourseWithFullData extends Course {
	modules: (Module & {
		lessons: Lesson[];
	})[];
	progress?: number | null; // Added to support the Dashboard view
}
