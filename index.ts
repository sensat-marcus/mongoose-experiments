import mongoose, { HydratedDocument } from "mongoose";
import { PasttimeModel, ESportModel, Hobby } from "./models/pasttime";
import { Person, PersonModel, PopulatedPerson } from "./models/person";
import { Cat, CatModel } from "./models/pet";

const clearAll = async (): Promise<void> => {
  await PersonModel.deleteMany({});
  await PasttimeModel.deleteMany({});
  await CatModel.deleteMany({});
};

const createPasttime = async (): Promise<void> => {
  const pasttime = await new ESportModel({
    name: "Starcraft",
    league: "diamond",
  }).save();
  console.log("Pasttime " + pasttime._id.toString() + " has been saved");
};

const createCat = async (): Promise<void> => {
  const cat = await new CatModel({ name: "Biscuit" }).save();
  console.log("Cat " + cat._id.toString() + " has been saved");
  console.log("Cat says", cat.meow());
};

const newMe = async (): Promise<HydratedDocument<Person>> => {
  const pasttime = await PasttimeModel.findOne({ name: "Starcraft" });
  const cat = await CatModel.findOne({ name: "Biscuit" });
  const person = new PersonModel({
    name: "Marcus",
    tags: ["aviva", "husband"],
    address: { street: "Oxford st" },
    pasttimes: [],
    cats: [],
  });
  if (pasttime) {
    person.pasttimes.push(pasttime._id);
  }
  if (cat) {
    person.cats.push(cat._id);
  }
  return person;
};

const saveMe = async (me: HydratedDocument<Person>): Promise<void> => {
  await me.save();
  PersonModel.personCount++;
  console.log(
    "Person " +
      PersonModel.personCount.toString() +
      " " +
      me._id.toString() +
      " has been saved"
  );
};

const findMe = async (): Promise<HydratedDocument<PopulatedPerson> | null> => {
  const me = PersonModel.findOne({
    name: "Marcus",
    "address.street": /Oxford/,
    tags: { $in: "husband" },
  })
    .populate<{
      pasttimes: HydratedDocument<Hobby>[];
    }>("pasttimes")
    .populate<{ cats: HydratedDocument<Cat>[] }>("cats");
  return me;
};

const showMe = (me: HydratedDocument<PopulatedPerson>): void => {
  console.log("Person is type:", me.constructor.name);
  console.log("Person is a model:", me instanceof PersonModel);
  console.log("Me:", me);
  console.log("Me object:", me.toObject());
  if (me.populated("cats") && me.cats[0]) {
    console.log("Function Cat says", me.cats[0].meow());
    console.log("Cat is type:", me.cats[0].constructor.name);
  } else {
    console.log("Function Cat says nothing", me.cats[0]);
  }
  if (
    me.populated("pasttimes") &&
    me.pasttimes[0] &&
    "league" in me.pasttimes[0]
  ) {
    console.log("League:", me.pasttimes[0].league);
    console.log("Hobby is type:", me.pasttimes[0].constructor.name);
  }
};

const findMeAgain = async (query: {
  _id: string;
}): Promise<HydratedDocument<Person> | null> => {
  return PersonModel.findOne(query);
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();
  await createPasttime();
  await createCat();
  await saveMe(await newMe());
  const person = await findMe();
  if (person?.cats[0]) {
    console.log("Directly cat says", person.cats[0].meow());
  }
  if (person?.pasttimes[0] && "league" in person.pasttimes[0]) {
    console.log("My league is", person?.pasttimes[0].league);
  }
  if (person) {
    showMe(person);
    const samePerson = await findMeAgain({ _id: person._id.toString() });
    console.log("Back again:", samePerson);
  }
  await mongoose.disconnect();
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
