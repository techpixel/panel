<script lang="ts">
	import { News } from '@panel/widget-news';
	import { Weather } from '@panel/widget-weather';
</script>

<div class="flex h-full w-full items-stretch gap-[36px]">
	<div class="h-full w-[655px] flex-shrink-0">
		<Weather settings={{ location: 'Burlington, Vermont' }} />
	</div>
	<div class="h-full flex-1">
		<News />
	</div>
</div>
