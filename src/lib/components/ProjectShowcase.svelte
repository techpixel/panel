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

	function truncateDescription(text: string, maxLength: number = 200): string {
		if (!text) return '';
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	}

	function truncateTitle(text: string, maxLength: number = 30): string {
		if (!text) return '';
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	}
</script>

<div class="flex w-full h-full gap-3 text-[#eae9e6]">
	{#if loading && !project}
		<div class="flex items-center justify-center w-full">
			<p class="text-2xl">Loading project...</p>
		</div>
	{:else if error && !project}
		<div class="flex items-center justify-center w-full">
			<p class="text-2xl text-red-400">{error}</p>
		</div>
	{:else if project}
		<!-- Left side - Details -->
		<div class="flex-1 flex flex-col gap-6 bg-[#211f1f] p-9">
			<div>
				<p class="text-3xl font-normal mb-6">RECENT PROJECTS</p>
				<h2 class="text-8xl font-bold leading-[0.8]">{truncateTitle(project.Title)}</h2>
			</div>

			<div class="flex-1">
				<p class="text-3xl leading-relaxed font-normal">
					{truncateDescription(project.Description)}
				</p>
			</div>

			<div class="flex items-end h-14">
				<p class="text-3xl font-normal">
					Created by @{project['GitHub Username']} for {project['YSWS–Name']}
				</p>
			</div>
		</div>

		<!-- Right side - Screenshot -->
		<div class="flex-1 overflow-hidden rounded-lg">
			{#if project.Screenshot}
				<img
					src={project.Screenshot}
					alt={project['YSWS–Name']}
					class="w-full h-full object-cover"
				/>
			{/if}
		</div>
	{/if}
</div>
