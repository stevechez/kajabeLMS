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

export interface CourseWithFullData {
	id: string;
	title: string;
	thumbnail_url: string | null;
	price: number | null;
	is_published: boolean;
	category: { name: string } | null;
	modules: {
		id: string;
		lessons: {
			id: string;
			title: string; // Add this
			is_free: boolean; // Add this
			user_progress: {
				is_completed: boolean;
			}[];
		}[];
	}[];
}
