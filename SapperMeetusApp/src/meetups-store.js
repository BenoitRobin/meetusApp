import { writable } from "svelte/store";


const meetups = writable([]);

  const customMeetupsStore = {
      subscribe: meetups.subscribe,
      setMeetup: (meetupArray) => {
        meetups.set(meetupArray)
      },
      addMeetup: (meetupData) => {
          const newMeetup = {
              ...meetupData
          };
          meetups.update(items => {
              return [newMeetup, ...items];
          })
      },
      updateMeetup: (id, meetupData) => {
        meetups.update(items => {
          const meetupIndex = items.findIndex(i => i.id === id);
          const updateMeetup = { ...items[meetupIndex], ...meetupData };
          const updatedMeetups = [...items];
          updatedMeetups[meetupIndex] = updateMeetup;
          return updatedMeetups;

        })
      },

      removeMeetup: (id) => {
        meetups.update(items => {
          return items.filter(i => i.id !== id);
        })
      },

      toggleFavorite: (id) => {
          meetups.update(items => {
            const updatedMeetup = { ...items.find((m) => m.id === id) };
            updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
            const meetupIndex = items.findIndex((m) => m.id === id);
            const updatedMeetups = [...items];
            updatedMeetups[meetupIndex] = updatedMeetup;
            return updatedMeetups;
          });
      }

  };

  export default customMeetupsStore;