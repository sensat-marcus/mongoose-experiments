import mongoose from "mongoose";
import { Child } from "./child";

export interface Parent {
  name: string;
  children: Array<Child>;
}

const parentSchema = new mongoose.Schema<Parent>({
  name: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
});

export const ParentModel = mongoose.model<Parent>("Parent", parentSchema);
