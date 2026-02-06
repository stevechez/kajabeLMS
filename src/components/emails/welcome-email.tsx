import * as React from 'react';

interface WelcomeEmailProps {
	courseName: string;
	userName: string;
}

export const WelcomeEmail = ({ courseName, userName }: WelcomeEmailProps) => (
	<div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
		<h1>Welcome to the course, {userName}!</h1>
		<p>
			We&quot;re thrilled to have you inside <strong>{courseName}</strong>.
		</p>
		<p>
			Your journey to mastering this topic starts now. Click the button below to
			jump into your first lesson.
		</p>
		<a
			href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
			style={{
				background: '#0369a1',
				color: '#fff',
				padding: '12px 24px',
				borderRadius: '5px',
				textDecoration: 'none',
				display: 'inline-block',
				marginTop: '20px',
			}}
		>
			Go to My Dashboard
		</a>
		<footer style={{ marginTop: '40px', fontSize: '12px', color: '#888' }}>
			If you have any questions, just reply to this email.
		</footer>
	</div>
);
