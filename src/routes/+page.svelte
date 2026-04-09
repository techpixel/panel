<script>
    import { fly } from 'svelte/transition';
    import DateTime from "$lib/components/DateTime.svelte";
    import Departures from "$lib/components/Departures.svelte";
    import ProjectShowcase from "$lib/components/ProjectShowcase.svelte";
    import Weather from "$lib/components/Weather.svelte";
    import { pagination } from "$lib/stores/pagination.svelte";
</script>

<div class="w-full h-full overflow-hidden relative">
    {#key pagination.currentPage}
        <div in:fly={{ duration: 600, x: 1280 * pagination.direction }} out:fly={{ duration: 600, x: -1280 * pagination.direction }} class="absolute inset-0">
            {#if pagination.currentPage === 0}
                <DateTime />
            {:else if pagination.currentPage === 1}
                <Weather />
            {:else if pagination.currentPage === 2}
                <ProjectShowcase />
            {:else if pagination.currentPage === 3}
                <Departures />
            {/if}
        </div>
    {/key}
</div>
