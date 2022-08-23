import mongoose from "mongoose";
import { Cat } from "./pet";
import { Hobby } from "./pasttime";

interface Address {
  street: string;
  city?: string;
  country?: string;
}

const addressSchema = new mongoose.Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: false },
  country: { type: String, default: "UK" },
});

export interface Person {
  name: string;
  nickname?: string;
  tags: Array<string>;
  pasttimes: Array<mongoose.Types.ObjectId>;
  address: Address;
  cats: Array<mongoose.Types.ObjectId>;
}

export interface PopulatedPerson
  extends Omit<Omit<Person, "pasttimes">, "cats"> {
  pasttimes: Array<Hobby>;
  cats: Array<Cat>;
}

const personSchema = new mongoose.Schema<Person>({
  name: { type: String, required: true },
  nickname: { type: String, default: "sonny" },
  tags: { type: [String], default: [] },
  pasttimes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "Pasttime",
  },
  address: { type: addressSchema },
  cats: { type: [mongoose.Schema.Types.ObjectId], default: [], ref: "Cat" },
});

export const PersonModel = class PersonModel extends mongoose.model<Person>(
  "Person",
  personSchema
) {
  static personCount = 0;
};
