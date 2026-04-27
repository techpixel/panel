<script lang="ts">
	import type { PlaceholderSettings } from './types';

	let { settings }: { settings: PlaceholderSettings } = $props();
</script>

<div class="relative h-full w-full">
	<div class="absolute top-[496px] left-0 flex flex-col items-start pb-[8px]">
		<p class="text-[96px] leading-none tracking-[0.96px] whitespace-nowrap text-black">
			{settings.title}
		</p>
		{#if settings.subtitle}
			<p
				class="font-grotesk text-[36px] leading-none tracking-[0.36px] whitespace-nowrap text-[#333]"
			>
				{settings.subtitle}
			</p>
		{/if}
	</div>
</div>
