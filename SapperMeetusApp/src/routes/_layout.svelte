<script>
  import Header from "../components/UI/Header.svelte";
</script>

<style>
  main {
    padding-top: 5rem;
  }
</style>

<Header />

<main>
  <slot />
</main>
