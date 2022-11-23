import mongoose from "mongoose";

export interface Address {
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
  address: Address;
}

const personSchema = new mongoose.Schema<Person>({
  name: { type: String, required: true },
  address: { type: addressSchema },
});

export const PersonModel = mongoose.model<Person>("Person", personSchema);
