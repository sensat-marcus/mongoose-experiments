import mongoose, { PopulatedDoc } from "mongoose";
import { Cat } from "./pet";
import { Hobby } from "./hobby";

interface Address {
  street: string;
  city?: string;
  country: string;
}

const addressSchema = new mongoose.Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: false },
  country: { type: String, default: "UK" },
});

export interface Person {
  name: string;
  nickname?: string;
  tags: mongoose.Types.Array<string>;
  hobbies: mongoose.Types.Array<PopulatedDoc<Hobby>>;
  address: Address;
  cats: mongoose.Types.Array<PopulatedDoc<Cat>>;
}

export interface PopulatedPerson extends Omit<Omit<Person, "hobbies">, "cats"> {
  hobbies: Hobby[];
  cats: Cat[];
}

const personSchema = new mongoose.Schema<Person>({
  name: { type: String, required: true },
  nickname: { type: String, default: "sonny" },
  tags: { type: [String], default: [] },
  hobbies: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "Hobby",
  },
  address: { type: addressSchema },
  cats: { type: [mongoose.Schema.Types.ObjectId], default: [], ref: "Cat" },
});

export const PersonModel = mongoose.model<Person>("Person", personSchema);
