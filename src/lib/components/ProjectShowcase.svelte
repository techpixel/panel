<script lang="ts">
	interface Project {
		title: string;
		description: string;
		author: string;
		image: string;
	}

	let { project }: { project: Project } = $props();

	function truncateDescription(text: string, maxLength: number = 120): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	}
</script>

<div class="project-panel">
	<div class="screenshot">
		{#if project.image}
			<img src={project.image} alt={project.title} />
		{/if}
	</div>
	<div class="details">
		<p class="label">RECENT PROJECT</p>
		<h2 class="title">{project.title}</h2>
		<p class="description">{truncateDescription(project.description)}</p>
		<p class="author">Created by {project.author}</p>
	</div>
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

	.screenshot {
		width: 100%;
		height: 255px;
		overflow: hidden;
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
