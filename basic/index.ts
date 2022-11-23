import mongoose, { HydratedDocument } from "mongoose";
import { PersonModel, Address, Person } from "./models/person";
import { EmployerModel } from "./models/employer";

const clearAll = async (): Promise<void> => {
  await PersonModel.deleteMany({});
  await EmployerModel.deleteMany({});
};

const createPerson = async (
  name: string,
  address: Address
): Promise<HydratedDocument<Person>> => {
  const person = new PersonModel({
    name: name,
    address: address,
  });
  await person.save();
  return person;
};

const findPerson = async (name: string): Promise<HydratedDocument<Person>> => {
  const person = await PersonModel.findOne({ name: name });
  if (!person) {
    throw new Error("Not found");
  }
  return person;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  const person = await createPerson("Marcus", { street: "Oxford st" });
  console.log("Person saved", person);

  const foundPerson = await findPerson("Marcus");
  console.log("Person found", foundPerson);

  const employer = new EmployerModel({ name: "Acme inc", people: [person] });
  await employer.save();
  console.log("Employer saved", employer);

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
