import mongoose, { HydratedDocument } from "mongoose";
import { Hobby, HobbyModel } from "./models/hobby";
import { Person, PersonModel } from "./models/person";
import { Cat, CatModel } from "./models/pet";

const clearAll = async (): Promise<void> => {
  await PersonModel.deleteMany({});
  await HobbyModel.deleteMany({});
  await CatModel.deleteMany({});
};

const createHobby = async (): Promise<void> => {
  const hobby = await new HobbyModel({ name: "Starcraft" }).save();
  console.log("Hobby " + hobby._id.toString() + " has been saved");
};

const createCat = async (): Promise<void> => {
  const cat = await new CatModel({ name: "Biscuit" }).save();
  console.log("Cat " + cat._id.toString() + " has been saved");
  console.log("Cat says", cat.meow());
};

const newMe = async (): Promise<HydratedDocument<Person>> => {
  const hobby = await HobbyModel.findOne({ name: "Starcraft" });
  const cat = await CatModel.findOne({ name: "Biscuit" });
  const person = new PersonModel({
    name: "Marcus",
    tags: ["Aviva's husband"],
    address: { street: "Oxford st" },
  });
  if (hobby) {
    person.hobbies.push(hobby);
  }
  if (cat) {
    person.cats.push(cat);
  }
  return person;
};

const saveMe = async (me: HydratedDocument<Person>): Promise<void> => {
  await me.save();
  console.log("Person " + me._id.toString() + " has been saved");
};

const findMe = async (): Promise<HydratedDocument<Person>> => {
  const person = await PersonModel.findOne({ name: "Marcus" });
  if (!person) {
    throw new Error("No Person");
  }
  await person.populate<{ hobbies: Hobby[] }>("hobbies");
  await person.populate<{ cats: Cat[] }>("cats");
  return person;
};

const showMe = (me: Person): void => {
  console.log("Me:", me);
  console.log("Cat says", (me.cats[0] as mongoose.Types.ObjectId & Cat).meow());
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();
  await createHobby();
  await createCat();
  await saveMe(await newMe());
  const person = await findMe();
  await mongoose.disconnect();
  showMe(person);
  return 0;
};

main()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    mongoose
      .disconnect()
      .then((result) => {
        console.log("disconnected:", result);
      })
      .catch(console.error);
  });
