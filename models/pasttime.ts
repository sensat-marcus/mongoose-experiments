import mongoose from "mongoose";

export interface Pasttime {
  name: string;
}

const pasttimeSchema = new mongoose.Schema<Pasttime>({
  name: { type: String },
});

export const PasttimeModel = mongoose.model<Pasttime>(
  "Pasttime",
  pasttimeSchema
);
