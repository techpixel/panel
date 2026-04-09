<script lang="ts">
	import { onMount } from 'svelte';

	let currentTime = $state('');
	let currentDate = $state('');
	let backgroundImage = $state('');
	let images: string[] = $state([]);
	let imageIndex = $state(0);

	function updateDateTime() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'pm' : 'am';
		const displayHour = hours % 12 || 12;
		currentTime = `${displayHour}:${minutes}${ampm}`;

		currentDate = now.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	async function fetchAlbum() {
		try {
			const res = await fetch('/api/album');
			if (!res.ok) return;
			images = await res.json();
			if (images.length > 0) {
				imageIndex = Math.floor(Math.random() * images.length);
				backgroundImage = images[imageIndex];
			}
		} catch {
			// silently fail, no background shown
		}
	}

	function nextImage() {
		if (images.length <= 1) return;
		imageIndex = (imageIndex + 1) % images.length;
		backgroundImage = images[imageIndex];
	}

	onMount(() => {
		updateDateTime();
		fetchAlbum();
		const timeInterval = setInterval(updateDateTime, 1000);
		const imageInterval = setInterval(nextImage, 60 * 1000);
		return () => {
			clearInterval(timeInterval);
			clearInterval(imageInterval);
		};
	});
</script>

<div class="w-full h-full relative">
	<!-- Background image -->
	<div class="absolute inset-0">
		{#if backgroundImage}
			<img
				alt=""
				class="absolute inset-0 w-full h-full object-cover"
				src={backgroundImage}
			/>
		{/if}
		<div class="absolute inset-0 bg-black/40"></div>
	</div>

	<!-- Content -->
	<div class="relative h-full p-[36px] pt-[92px] pb-[112px] flex flex-col justify-end">
		<div class="flex flex-col pb-2">
			<div class="font-serif text-[#d7d7d7] text-[40px] leading-none">
				{currentDate}
			</div>
			<div class="font-serif text-white text-[128px] leading-none">
				{currentTime}
			</div>
		</div>
	</div>
</div>
