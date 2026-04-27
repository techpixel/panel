<script lang="ts">
	import { Clock } from '@panel/widget-clock';
	import { Status } from '@panel/widget-status';
</script>

<div class="flex h-full w-full items-center gap-[36px]">
	<div class="h-full min-w-0 flex-1">
		<Clock settings={{ subtitle: 'Cloudy • 5°F' }} />
	</div>
	<div class="h-full w-[558px] flex-shrink-0">
		<Status settings={{ initialStatus: 'busy', initialEndsInMin: 15 }} />
	</div>
</div>
