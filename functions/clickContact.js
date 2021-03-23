const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@abl.3aejj.mongodb.net`;

const getData = async () => {
  const client = await MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = await client.db("paws-n-claws");
  const collection = await db.collection("site_analysis");
  const findResult = await collection
    .find({
      name: "Paws_N_Claws Analysis",
    })
    .toArray();

  const obj = {
    ...findResult[0],
    contactClicks: findResult[0].contactClicks + 1,
  };

  const finalResult = await collection.findOneAndReplace(
    { name: "Paws_N_Claws Analysis" },
    obj
  );
  return finalResult.value;
};

exports.handler = async function (event, context) {
  const data = await getData();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Updated Successfully" }),
  };
};
