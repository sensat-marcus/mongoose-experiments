import mongoose, { HydratedDocument } from "mongoose";
import { Child } from "./child";

export interface Parent {
  name: string;
  children: Array<mongoose.Types.ObjectId | HydratedDocument<Child>>;
}

const parentSchema = new mongoose.Schema<Parent>({
  name: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
});

export const ParentModel = mongoose.model<Parent>("Parent", parentSchema);
