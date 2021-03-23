const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@abl.3aejj.mongodb.net`;

const getData = async (browser, ip, mobile) => {
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

  let browserData;
  if (!findResult[0].browser[browser]) {
    browserData = {
      ...findResult[0].browser,
      [browser]: 1,
    };
  } else {
    browserData = {
      ...findResult[0].browser,
      [browser]: findResult[0].browser[browser] + 1,
    };
  }

  let ipData;
  if (!findResult[0].ip[ip]) {
    ipData = {
      ...findResult[0].ip,
      [ip]: 1,
    };
  } else {
    ipData = {
      ...findResult[0].ip,
      [ip]: findResult[0].ip[ip] + 1,
    };
  }

  let mobileData;
  if (!findResult[0].mobileBrowsers[mobile]) {
    mobileData = {
      ...findResult[0].mobileBrowsers,
      [mobile]: 1,
    };
  } else {
    mobileData = {
      ...findResult[0].mobileBrowsers,
      [mobile]: findResult[0].mobileBrowsers[mobile] + 1,
    };
  }

  const obj = {
    ...findResult[0],
    visits: findResult[0].visits + 1,
    browser: browserData,
    ip: ipData,
    mobileBrowsers: mobileData,
  };

  const finalResult = await collection.findOneAndReplace(
    { name: "Paws_N_Claws Analysis" },
    obj
  );
  return finalResult.value;
};

exports.handler = async function (event, context) {
  const data = await getData(
    event.headers["sec-ch-ua"],
    event.headers["client-ip"],
    event.headers["sec-ch-ua-mobile"]
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Updated Successfully" }),
  };
};
