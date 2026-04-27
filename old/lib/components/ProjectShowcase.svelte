<script lang="ts">
	import { onMount } from 'svelte';

	interface AirtableProject {
		'First Name': string;
		'Code URL': string;
		'Screenshot': string;
		'GitHub Username': string;
		'Description': string;
		'YSWS–Name': string;
		'Approved At': string;
		'Created': string;
		'Title': string;
	}

	let project: AirtableProject | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function fetchProject() {
		try {
			loading = true;
			error = null;
			const res = await fetch('/api/project');
			if (!res.ok) throw new Error('Failed to fetch project');
			project = await res.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch project';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchProject();
		const interval = setInterval(fetchProject, 60 * 1000);
		return () => clearInterval(interval);
	});

	function truncateDescription(text: string, maxLength: number = 100): string {
		if (!text) return '';
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	}
</script>

<div class="w-full h-full relative">
	<!-- Background image -->
	<div class="absolute inset-0">
		{#if project?.Screenshot}
			<img
				alt=""
				class="absolute inset-0 w-full h-full object-cover"
				src={project.Screenshot}
			/>
		{/if}
		<div class="absolute inset-0" style="background: linear-gradient(16deg, rgb(0, 0, 0) 23%, rgba(0, 0, 0, 0) 103%);"></div>
	</div>

	<!-- Content -->
	<div class="relative h-full p-[36px] pt-[92px] pb-[112px] flex flex-col justify-end">
		{#if loading && !project}
			<div class="font-serif text-white text-[40px]">Loading project...</div>
		{:else if error && !project}
			<div class="font-serif text-red-400 text-[40px]">{error}</div>
		{:else if project}
			<div class="flex flex-col gap-[36px]">
				<div class="flex flex-col gap-[4px]">
					<div class="font-serif text-[#d7d7d7] text-[40px] leading-tight">
						Recent Projects
					</div>
					<div class="font-serif text-white text-[128px] leading-none mb-[12px]">
						{project.Title}
					</div>
					<div class="font-serif text-white text-[40px] leading-tight mt-[8px]">
						{truncateDescription(project.Description)}
					</div>
				</div>

				<div class="font-serif text-[#ccc] text-[32px] leading-tight">
					Created by @{project['GitHub Username']} for {project['YSWS–Name']}
				</div>
			</div>
		{/if}
	</div>
</div>
