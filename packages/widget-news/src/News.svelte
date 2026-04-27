<script lang="ts">
	import { Newspaper } from 'lucide-svelte';
	import type { NewsHeadline, NewsSettings } from './types';

	let { settings = {} }: { settings?: NewsSettings } = $props();

	const fallback: NewsHeadline[] = [
		{ source: 'BBC', title: 'Tech earnings beat expectations as cloud demand surges' },
		{ source: 'AP', title: 'Climate summit yields new carbon pricing framework' },
		{ source: 'Reuters', title: 'Discovery rewrites bronze age timeline' }
	];

	const headlines = $derived(settings.headlines ?? fallback);
</script>

<div
	class="relative flex h-full w-full flex-col gap-[28px] overflow-hidden bg-[#1f1a17] p-[32px] text-white"
>
	<div class="flex items-center gap-[16px]">
		<Newspaper size={48} color="#eae9e6" strokeWidth={2} />
		<p class="text-[40px] leading-none tracking-[0.4px]">News</p>
	</div>
	<div class="flex flex-1 flex-col gap-[28px]">
		{#each headlines as item}
			<article class="flex flex-col gap-[6px] border-l-[3px] border-white/30 pl-[16px]">
				<p
					class="font-grotesk text-[20px] leading-none tracking-[0.2px] text-white/60 uppercase"
				>
					{item.source}
				</p>
				<p class="font-grotesk text-[28px] leading-[1.2] text-white">{item.title}</p>
			</article>
		{/each}
	</div>
</div>
