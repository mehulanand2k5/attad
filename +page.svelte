<script lang="ts">

	type ClassEntry = {
		subject: string;
		start: string; // HH:MM
		end: string; // HH:MM
		venue: string;
	};

	type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

	type WeekForm = Record<DayKey, ClassEntry[]>;

	const dayKeys: DayKey[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

	let selectedTab: DayKey = 'Monday';

	let form: WeekForm = {
		Monday: [emptyEntry()],
		Tuesday: [],
		Wednesday: [],
		Thursday: [],
		Friday: []
	};

	function emptyEntry(): ClassEntry {
		return { subject: '', start: '', end: '', venue: '' };
	}

	function addEntry(day: DayKey) {
		form[day] = [...form[day], emptyEntry()];
	}

	function removeEntry(day: DayKey, index: number) {
		form[day] = form[day].filter((_, i) => i !== index);
	}

	// JSON payload submitted via hidden input in the form
	$: payloadStr = JSON.stringify(form);
</script>

<svelte:head>
	<title>Upload Weekly Timetable</title>
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
	<form method="POST" action="?/save" class="max-w-2xl mx-auto px-4 py-6">
		<h1 class="text-2xl font-semibold mb-4">Counselor Timetable Upload</h1>
		<p class="text-sm opacity-70 mb-6">Add classes for each day and save the weekly timetable.</p>

		<!-- Tabs for days -->
		<div role="tablist" class="tabs tabs-boxed mb-4">
			{#each dayKeys as day}
				<button
					role="tab"
					type="button"
					class={"tab " + (selectedTab === day ? 'tab-active' : '')}
					on:click={() => (selectedTab = day)}
				>
					{day}
				</button>
			{/each}
		</div>

		<!-- Day sections -->
		{#each dayKeys as day}
			{#if selectedTab === day}
				<div class="space-y-3">
					<!-- Existing entries -->
					{#if form[day].length === 0}
						<div class="card border border-base-300 bg-base-100">
							<div class="card-body p-4">
								<div class="text-sm opacity-70">No classes yet for {day}.</div>
							</div>
						</div>
					{/if}

					{#each form[day] as entry, i}
						<div class={"card border bg-base-100 " + (i % 2 === 0 ? 'border-base-300' : 'border-base-200 bg-base-200/40')}>
							<div class="card-body p-4 gap-3">
								<div class="grid grid-cols-1 gap-3">
									<label class="form-control w-full">
										<div class="label"><span class="label-text">Subject</span></div>
										<input class="input input-bordered w-full" bind:value={entry.subject} placeholder="e.g., Mathematics" />
									</label>

									<div class="grid grid-cols-2 gap-3">
										<label class="form-control w-full">
											<div class="label"><span class="label-text">Start time</span></div>
											<input type="time" class="input input-bordered w-full" bind:value={entry.start} />
										</label>
										<label class="form-control w-full">
											<div class="label"><span class="label-text">End time</span></div>
											<input type="time" class="input input-bordered w-full" bind:value={entry.end} />
										</label>
									</div>

									<label class="form-control w-full">
										<div class="label"><span class="label-text">Venue</span></div>
										<input class="input input-bordered w-full" bind:value={entry.venue} placeholder="e.g., Room A101" />
									</label>
								</div>

								<div class="card-actions justify-end pt-2">
									<button type="button" class="btn btn-ghost btn-sm" on:click={() => removeEntry(day, i)}>Remove</button>
								</div>
							</div>
						</div>
					{/each}

					<!-- Add class button -->
					<div class="flex">
						<button type="button" class="btn btn-primary w-full" on:click={() => addEntry(day)}>+ Add Class</button>
					</div>
				</div>
			{/if}
		{/each}

		<!-- Hidden payload field -->
		<input type="hidden" name="payload" value={payloadStr} />

		<!-- Submit -->
		<div class="mt-6">
			<button type="submit" class="btn btn-success w-full">Save Weekly Timetable</button>
		</div>
	</form>
</div>
