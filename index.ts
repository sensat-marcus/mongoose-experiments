import mongoose, {HydratedDocument} from 'mongoose';

interface Person {
  name: String;
  nickname?: String;
  friends: String[];
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

const createMe = async () => {
  await new PersonModel({name: 'Marcus', friends: ['Aviva']}).save()
};

const findMe = async (): Promise<HydratedDocument<Person>> => {
  const person = await PersonModel.findOne({name: 'Marcus'});
  if (! person) {
    throw new Error('No Person');
  }
  return person;
};

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/playpen');
  console.log('Connected');
  await clearMe();
  await createMe();
  const person = await findMe();
  await mongoose.disconnect();
  console.log('Done');
  return person;
}

main().then(console.log).catch(console.error);
