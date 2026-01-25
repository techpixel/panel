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

	function truncateDescription(text: string, maxLength: number = 120): string {
		if (!text) return '';
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	}
</script>

<div class="project-panel">
	{#if loading && !project}
		<div class="loading">
			<p>Loading project...</p>
		</div>
	{:else if error && !project}
		<div class="error">
			<p>{error}</p>
		</div>
	{:else if project}
		<div class="screenshot">
			{#if project.Screenshot}
				<img src={project.Screenshot} alt={project['YSWS–Name']} />
			{/if}
		</div>
		<div class="details">
			<p class="label">RECENT PROJECT</p>
			<h2 class="title">{project.Title}</h2>
			<p class="description">{truncateDescription(project.Description)}</p>
			<p class="author">Created by @{project['GitHub Username']} for {project['YSWS–Name']}</p>
		</div>
	{/if}
</div>

<style>
	@font-face {
		font-family: 'Space Mono';
		src: url('https://fonts.gstatic.com/s/spacemono/v12/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2') format('woff2');
		font-weight: 400;
		font-style: normal;
		font-display: swap;
	}
	@font-face {
		font-family: 'Space Mono';
		src: url('https://fonts.gstatic.com/s/spacemono/v12/i7dMIFZifjKcF5UAWdDRaPpZYFKQHg.woff2') format('woff2');
		font-weight: 700;
		font-style: normal;
		font-display: swap;
	}
	@font-face {
		font-family: 'Space Grotesk';
		src: url('https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2') format('woff2');
		font-weight: 700;
		font-style: normal;
		font-display: swap;
	}

	.project-panel {
		background-color: #211f1f;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		color: #eae9e6;
	}

	.loading,
	.error {
		padding: 24px;
		font-family: 'Space Mono', monospace;
		font-size: 14px;
	}

	.error {
		color: #ff6b6b;
	}

	.screenshot {
		width: 100%;
		height: 255px;
		overflow: hidden;
		background-color: #1a1818;
	}

	.screenshot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.details {
		padding: 24px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.label {
		font-family: 'Space Mono', monospace;
		font-size: 16px;
		margin: 0 0 4px 0;
	}

	.title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 32px;
		font-weight: bold;
		margin: 0 0 8px 0;
	}

	.description {
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		font-weight: bold;
		margin: 0 0 8px 0;
		line-height: 1.5;
	}

	.author {
		font-family: 'Space Mono', monospace;
		font-size: 12px;
		font-weight: bold;
		margin: 0;
	}
</style>
