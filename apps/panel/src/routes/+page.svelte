<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import ScreenStrip from '$lib/components/ScreenStrip.svelte';
	import { screens } from '$lib/screens';
	import { navigation } from '$lib/stores/navigation.svelte';
</script>

<div
	class="font-unbounded flex h-[800px] w-[1280px] flex-col gap-[36px] bg-[#ece6d3] p-[36px]"
	ontouchstart={navigation.handleTouchStart}
	ontouchmove={navigation.handleTouchMove}
	ontouchend={navigation.handleTouchEnd}
	ontouchcancel={navigation.handleTouchEnd}
>
	<Nav {screens} />
	<ScreenStrip {screens} />
</div>
