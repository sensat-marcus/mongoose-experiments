import mongoose from "mongoose";
import { Person } from "./person";

export interface Employer {
  name: string;
  people: Array<Person>;
}

const employerSchema = new mongoose.Schema<Employer>({
  name: { type: String, required: true },
});

export const EmployerModel = mongoose.model<Employer>(
  "Employer",
  employerSchema
);
