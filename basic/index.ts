import mongoose, { HydratedDocument } from "mongoose";
import { ChildModel, Child } from "./models/child";
import { Parent, ParentModel } from "./models/parent";

const clearAll = async (): Promise<void> => {
  await ChildModel.deleteMany({});
  await ParentModel.deleteMany({});
};

const createChild = async (name: string): Promise<HydratedDocument<Child>> => {
  const child = new ChildModel({ name });
  await child.save();
  return child;
};

const findChild = async (name: string): Promise<HydratedDocument<Child>> => {
  const child = await ChildModel.findOne({ name });
  if (!child) {
    throw new Error("Not found");
  }
  return child;
};

const createParent = async (
  name: string,
  children: Array<HydratedDocument<Child>>
): Promise<HydratedDocument<Parent>> => {
  const parent = new ParentModel({ name, children });
  await parent.save();
  return parent;
};

const main = async (): Promise<number> => {
  await mongoose.connect("mongodb://localhost:27017/playpen");
  console.log("Connected");
  await clearAll();

  const child = await createChild("Toby");
  console.log("Person saved", child);

  const foundChild = await findChild("Toby");
  console.log("Person found", foundChild);

  const parent = await createParent("Marcus", [child]);
  console.log("Employer saved", parent);

  const foundParent = await ParentModel.findOne({ name: "Marcus" });
  console.log("Parent found", foundParent);
  if (foundParent) {
    console.log("Parent found", foundParent);
    console.log("Parent's child'", foundParent.children[0]);
    await foundParent.populate("children");
    console.log("Parent populated", foundParent);
    const foundParentChild = foundParent.children[0];
    foundParentChild.name = "Tobias";
    await foundParentChild.save();
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
