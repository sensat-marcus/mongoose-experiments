import mongoose from "mongoose";

export interface CatData {
  name: string;
}

export interface CatMethods {
  meow(): string;
}

export interface Cat extends CatData, CatMethods {}

type CatType = mongoose.Model<CatData, {}, CatMethods>;

const catSchema = new mongoose.Schema<CatData, CatType, CatMethods>({
  name: { type: String },
});
catSchema.method("meow", () => "meow!");

export const CatModel = mongoose.model<CatData, CatType>("Cat", catSchema);
