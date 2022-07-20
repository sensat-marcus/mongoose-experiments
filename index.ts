import mongoose, {HydratedDocument} from 'mongoose';

// Data model

interface Hobby {
  name: String;
}

const hobbySchema = new mongoose.Schema<Hobby>({name: {type: String}});

const HobbyModel = mongoose.model<Hobby>('Hobby', hobbySchema);

interface Address {
  street: String;
  city?: String;
  country: String;
}

const addressSchema = new mongoose.Schema<Address>({
  street: {type: String, required: true},
  city: {type: String, required: false},
  country: {type: String, default: 'UK'},
});

interface Person {
  name: String;
  nickname?: String;
  tags: mongoose.Types.Array<String>;
  hobbies: mongoose.Types.Array<mongoose.Types.ObjectId>;
  address: Address;
}

const personSchema = new mongoose.Schema<Person>({
  name: {type: String, required: true},
  nickname: {type: String, default: 'sonny'},
  tags: {type: [String], default: []},
  hobbies: {type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Hobby'},
  address: {type: addressSchema},
});

const PersonModel = mongoose.model<Person>('Person', personSchema);

// End data model

const clearAll  = async () => {
  await PersonModel.deleteMany({});
  await HobbyModel.deleteMany({});
};

const createHobby = async () => {
  const hobby = await new HobbyModel({name: 'Starcraft'}).save();
  console.log('Hobby ' + hobby._id.toString() + ' has been saved');
};

const newMe = async (): Promise<HydratedDocument<Person>> => {
  const hobby = await HobbyModel.findOne({name: 'Starcraft'});
  const person = new PersonModel({
    name: 'Marcus',
    tags: ["Aviva's husband"],
    address: {street: 'Oxford st'}
  });
  if (hobby) {
    person.hobbies.push(hobby);
  }
  return person;
};

const saveMe = async (me: HydratedDocument<Person>) => {
  await me.save();
  console.log('Person ' + me._id.toString() + ' has been saved');
};

const findMe = async (): Promise<HydratedDocument<Person>> => {
  const person = await PersonModel.findOne({name: 'Marcus'});
  if (! person) {
    throw new Error('No Person');
  }
  return person.populate<Hobby>('hobbies');
};

const showMe = (me: Person) => {
  console.log('Me:', me);
};

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/playpen');
  console.log('Connected');
  await clearAll();
  await createHobby();
  await saveMe(await newMe());
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
