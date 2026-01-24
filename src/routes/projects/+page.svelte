<script>
	let projects = [
		{
			title: 'Engine of Dread',
			description: `It is a First Person Horror Game. This was my First First Person Game and I created it for Siege First at the time of siege of Siege I was very new to Godot and I created a Game With a horror witch(which does not even rotate the player) and at that time the game was very Bad But Then Decided to remake it. In this Game All the Things are Created Again except the Camera Controller of the Player. I did not used any assets from outside or previous version. I have Created all the Assets by myself in Blender. This is the main reason This Game is not Completed Yet. Because This is my First Time Creating a Game with all the assets created by me...`,
			author: '@rykugod',
			image: '/project-screenshot.png'
		}
	];

	let selectedProject = projects[0];
</script>

<div class="flex w-[1280px] h-[800px] bg-[#130101]">
	<!-- Left Sidebar -->
	<div class="w-[500px] bg-[rgba(19,1,1,0.8)] flex flex-col justify-start pt-[96px] px-[25px] gap-[16px] overflow-hidden">
		<div class="flex flex-col gap-[16px]">
			<h1 class="font-['Mona_Sans_VF'] font-semibold text-[64px] leading-[64px] text-white">
				{selectedProject.title}
			</h1>
			<p class="font-['Mona_Sans_VF'] font-semibold text-[16px] leading-normal text-white h-[280px] overflow-y-auto">
				{selectedProject.description}
			</p>
			<p class="font-['Mona_Sans_VF'] font-extrabold text-[16px] leading-normal text-white">
				Created by {selectedProject.author}
			</p>
		</div>
	</div>

	<!-- Right Content Area -->
	<div class="flex-1 relative bg-[#130101]">
		<img alt="" src={selectedProject.image} class="absolute inset-0 w-full h-full object-cover pointer-events-none" />
	</div>
</div>

<style global>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
