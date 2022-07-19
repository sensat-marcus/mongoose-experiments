import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: String,
});

const Person = mongoose.model('Person', personSchema);

const createMe = async () => {
  await new Person({name: 'Marcus'}).save()
};

const findMe = async () => {
  return await Person.find({name: 'Marcus'});
};

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/playpen');
  console.log('Connected');
  await createMe();
  const person = await findMe();
  await mongoose.disconnect();
  console.log('Done');
  return person;
}

main().then(console.log).catch(console.error);
