import mongoose, {HydratedDocument} from 'mongoose';

interface Address {
  street: String;
  city: String;
}

interface Person {
  name: String;
  nickname?: String;
  friends: String[];
  address: Address;
}

const personSchema = new mongoose.Schema<Person>({
  name: {type: String, required: true},
  nickname: {type: String, default: 'sonny'},
  friends: {type: [String]},
});

const PersonModel = mongoose.model<Person>('Person', personSchema);

const clearMe  = async () => {
  await PersonModel.deleteMany({});
};

const createMe = async (): Promise<HydratedDocument<Person>> => {
  return await new PersonModel({name: 'Marcus', friends: ['Aviva']})
};

const saveMe = async (me: HydratedDocument<Person>) => {
  await me.save();
  console.log('Saved', me._id);
};

const findMe = async (): Promise<HydratedDocument<Person>> => {
  const person = await PersonModel.findOne({name: 'Marcus'});
  if (! person) {
    throw new Error('No Person');
  }
  return person;
};

const showMe = (me: Person) => {
  console.log('Me', me);
};

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/playpen');
  console.log('Connected');
  await clearMe();
  await saveMe(await createMe());
  const person = await findMe();
  await mongoose.disconnect();
  showMe(person);
  return 0;
}

main().then(console.log).catch(err => {
  console.error(err);
  mongoose.disconnect().then(result => {
    console.log('disconnected:', result);
  });
});
