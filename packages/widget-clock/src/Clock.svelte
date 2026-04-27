<script lang="ts">
	import { time } from '@panel/runtime';
	import type { ClockSettings } from './types';

	let { settings = {} }: { settings?: ClockSettings } = $props();
</script>

<div class="relative h-full w-full overflow-hidden">
	<div class="absolute top-[496px] left-0 flex w-[451px] flex-col items-start pb-[8px]">
		<p class="text-[96px] leading-none tracking-[0.96px] whitespace-nowrap text-black">
			{time.label}
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
