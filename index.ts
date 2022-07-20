import mongoose, { HydratedDocument } from "mongoose";
import { Hobby, HobbyModel } from "./models/hobby";
import { Person, PersonModel } from "./models/person";

const clearAll = async (): Promise<void> => {
  await PersonModel.deleteMany({});
  await HobbyModel.deleteMany({});
};

const createHobby = async (): Promise<void> => {
  const hobby = await new HobbyModel({ name: "Starcraft" }).save();
  console.log("Hobby " + hobby._id.toString() + " has been saved");
};

const newMe = async (): Promise<HydratedDocument<Person>> => {
  const hobby = await HobbyModel.findOne({ name: "Starcraft" });
  const person = new PersonModel({
    name: "Marcus",
    tags: ["Aviva's husband"],
    address: { street: "Oxford st" },
  });
  if (hobby) {
    person.hobbies.push(hobby);
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
  return person.populate<Hobby>("hobbies");
};

const showMe = (me: Person): void => {
  console.log("Me:", me);
  console.log("Sub doc:", me.address);
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();
  await createHobby();
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
