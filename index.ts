import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: {type: String, required: true},
  nickname: {type: String, default: ''},
  friends: {type: [String]},
});

const Person = mongoose.model('Person', personSchema);

const clearMe  = async () => {
  await Person.deleteMany({});
};

const createMe = async () => {
  await new Person({name: 'Marcus', friends: ['Aviva']}).save()
};

const findMe = async () => {
  return await Person.find({name: 'Marcus'});
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
