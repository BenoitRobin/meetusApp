<script context="module">
  export function preload(page) {
    return this.fetch("https://meetup-e03f8.firebaseio.com/meetups.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fetching meetups failed, please try later!");
        }
        return res.json();
      })
      .then((data) => {
        const loadedMeetups = [];
        for (const key in data) {
          loadedMeetups.push({
            ...data[key],
            id: key,
          });
        }

        return { fetchedMeetups: loadedMeetups };
        // setTimeout(() => {
        //   isLoading = false;
        //   meetups.setMeetup(loadedMeetups.reverse());
        // }, 1000);
      })
      .catch((err) => {
        error = err;
        isLoading = false;
        console.log(err);
        this.error(500, "Could not fetch Meetups");
      });
  }
</script>

<script>
  import MeetUpItem from "../components/Meetup/MeetUpItem.svelte";
  import MeetupFilter from "../components/Meetup/MeetupFilter.svelte";
  import Button from "../components/UI/Button.svelte";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import EditMeetup from "../components/Meetup/EditMeetup.svelte";
  import Loading from "../components/UI/LoadingSpinner.svelte";
  import meetups from "../meetups-store";

  export let fetchedMeetups;

  let loadedMeetups = [];
  let editMode;
  let editedId;
  let isLoading;
  let unsubscribe;

  const dispatch = createEventDispatcher();

  let favsOnly = false;

  $: filterMeetups = favsOnly
    ? loadedMeetups.filter((m) => m.isFavorite)
    : loadedMeetups;

  onMount(() => {
    unsubscribe = meetups.subscribe((items) => {
      loadedMeetups = items;
    });
    meetups.setMeetup(fetchedMeetups);
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  function setFilter(event) {
    favsOnly = event.detail === 1;
  }

  function savedMeetup(event) {
    editMode = null;
    editedId = null;
  }

  function cancelEdit() {
    editMode = null;
    editedId = null;
  }

  function startEdit(event) {
    editMode = "edit";
    editedId = event.detail;
  }

  function startAdd() {
    editMode = "edit";
  }
</script>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }
  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  #no-meetup {
    margin: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<svelte:head>
  <title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
  <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <Loading />
{:else}
  <section id="meetup-controls">
    <MeetupFilter on:select={setFilter} />
    <Button on:click={startAdd}>New Meetup</Button>
  </section>
  {#if filterMeetups.length === 0}
    <p id="no-meetup">No meetup found, you can start adding some.</p>
  {/if}

  <section id="meetups">
    {#each filterMeetups as meetUp (meetUp.id)}
      <div transition:scale animate:flip={{ duration: 300 }}>
        <MeetUpItem
          id={meetUp.id}
          title={meetUp.title}
          subtitle={meetUp.subtitle}
          description={meetUp.description}
          imageUrl={meetUp.imageUrl}
          email={meetUp.contactEmail}
          address={meetUp.address}
          isFav={meetUp.isFavorite}
          on:showDetails
          on:edit />
      </div>
    {/each}
  </section>
{/if}
