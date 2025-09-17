import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    save: async ({ request }) => {
        const contentType = request.headers.get('content-type') ?? '';
        let payload: unknown = null;

        try {
            if (contentType.includes('application/json')) {
                payload = await request.json();
            } else {
                const formData = await request.formData();
                const raw = formData.get('payload');
                if (typeof raw === 'string') {
                    payload = JSON.parse(raw);
                }
            }
        } catch (err) {
            console.error('Failed to parse timetable submission', err);
        }

        // Log fields separately for each class entry per day
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
        try {
            const data = payload as Record<string, Array<{ subject: string; start: string; end: string; venue: string }>>;
            for (const day of days) {
                const entries = Array.isArray(data?.[day]) ? data[day] : [];
                entries.forEach((entry, idx) => {
                    console.log(`[${day} #${idx + 1}] Subject:`, entry.subject ?? '');
                    console.log(`[${day} #${idx + 1}] Start:`, entry.start ?? '');
                    console.log(`[${day} #${idx + 1}] End:`, entry.end ?? '');
                    console.log(`[${day} #${idx + 1}] Venue:`, entry.venue ?? '');
                });
            }
        } catch (e) {
            console.error('Unable to log timetable fields separately:', e);
        }

        return { success: true };
    }
};