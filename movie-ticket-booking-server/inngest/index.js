import { Inngest } from "inngest";
import { User } from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest functions to save user into the database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0]?.email_address || "",
        image: image_url
      };

      await User.create(userData);

      return { ok: true };
    } catch (error) {
      console.error("Failed to sync user from Clerk:", error);
      return { ok: false, error: error.message };
    }
  }
);

//Inngest functions to delete user into the database
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async({event}) => {
        const {id, name, email, image} = event.data
        await User.findByIdAndDelete(id)
         return { ok: true };
    }
)

//Inngest functions to update user into the database
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-with-clerk'},
    {event: 'clerk/user.updated'},
    async({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
         const userData = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0]?.email_address || "",
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData, { new: true, upsert: true })
         return { ok: true };
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
