<script lang="ts">
	import type { StatusSettings, StatusValue } from './types';

	let { settings = {} }: { settings?: StatusSettings } = $props();

	let value = $state<StatusValue>(settings.initialStatus ?? 'busy');
	let endsInMin = $state(settings.initialEndsInMin ?? 15);

	const color = $derived(value === 'busy' ? '#f85454' : '#7bc47f');
	const label = $derived(value === 'busy' ? 'Busy' : 'Free');
	const sub = $derived(value === 'busy' ? `Ends ${endsInMin} min` : `Free for ${endsInMin} min`);
</script>

<div class="relative h-full w-full overflow-hidden" style:background-color={color}>
	<div class="absolute bottom-[32px] left-[32px] flex flex-col items-start pb-[8px]">
		<p class="w-[329px] text-[96px] leading-none tracking-[0.96px] text-white">{label}</p>
		<p
			class="font-grotesk text-[40px] leading-none tracking-[0.4px] whitespace-nowrap text-white/60"
		>
			{sub}
		</p>
	</div>
</div>
