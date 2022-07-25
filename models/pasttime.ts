import mongoose from "mongoose";

export interface Pasttime {
  name: string;
}

export interface ESport extends Pasttime {
  league: string;
}

export interface Craft extends Pasttime {
  makes: string;
}

export type Hobby = ESport | Craft;

const pasttimeSchema = new mongoose.Schema<Pasttime>({
  name: { type: String },
});

export const PasttimeModel = mongoose.model<Pasttime>(
  "Pasttime",
  pasttimeSchema
);

const esportSchema = new mongoose.Schema<ESport>({ league: { type: String } });

export const ESportModel = PasttimeModel.discriminator<
  ESport,
  mongoose.Model<ESport>
>("ESport", esportSchema);

const craftSchema = new mongoose.Schema<Craft>({ makes: { type: String } });

export const CraftModel = PasttimeModel.discriminator<
  Craft,
  mongoose.Model<Craft>
>("Craft", craftSchema);
