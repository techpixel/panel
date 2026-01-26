<script>
    import Ad from "$lib/components/Ad.svelte";
    import Departures from "$lib/components/Departures.svelte";
    import ProjectShowcase from "$lib/components/ProjectShowcase.svelte";
    import Weather from "$lib/components/Weather.svelte";
    import { pagination } from "$lib/stores/pagination.svelte";
</script>

{#if pagination.currentPage === 0}
    <Weather />
{:else if pagination.currentPage === 1}
    <Departures />
{:else if pagination.currentPage === 2}
    <ProjectShowcase />
{:else if pagination.currentPage === 3}
    <Ad />
{/if}
