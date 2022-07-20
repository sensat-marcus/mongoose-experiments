import mongoose from "mongoose";

export interface Hobby {
  name: string;
}

const hobbySchema = new mongoose.Schema<Hobby>({ name: { type: String } });

export const HobbyModel = mongoose.model<Hobby>("Hobby", hobbySchema);
