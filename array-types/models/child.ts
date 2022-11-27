import mongoose from "mongoose";

export interface Child {
  name: string;
}

const childSchema = new mongoose.Schema<Child>({
  name: { type: String, required: true },
});

export const ChildModel = mongoose.model<Child>("Child", childSchema);
