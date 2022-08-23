import mongoose from "mongoose";

type Sex = "M" | "F";

export interface CatData {
  name: string;
  sex: string;
}

export interface CatMethods {
  meow(): string;
}

export type CatType = mongoose.Model<CatData, {}, CatMethods>;
export interface Cat extends CatType, CatMethods {}

const catSchema = new mongoose.Schema<CatData, CatType, CatMethods>({
  name: { type: String },
  sex: { type: String },
});
catSchema.method("meow", () => "meow!");

export const CatModel = mongoose.model<CatData, CatType>("Cat", catSchema);
