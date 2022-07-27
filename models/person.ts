import mongoose, { HydratedDocument, PopulatedDoc } from "mongoose";
import { Cat } from "./pet";
import { Hobby, Pasttime } from "./pasttime";

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
  pasttimes: mongoose.Types.Array<PopulatedDoc<Pasttime>>;
  address: Address;
  cats: mongoose.Types.Array<PopulatedDoc<Cat>>;
}

export interface PopulatedPerson
  extends Omit<Omit<Person, "pasttimes">, "cats"> {
  pasttimes: HydratedDocument<Hobby>[];
  cats: HydratedDocument<Cat>[];
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

const _Model = mongoose.model<Person>("Person", personSchema);
export const PersonModel = class PersonModel extends _Model {
  static personCount = 0;
} as typeof _Model & { personCount: number };
