const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load the environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error(
		'❌ Missing environment variables. Check your .env.local file.',
	);
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
	// ... (rest of the script remains the same)
}

main();
