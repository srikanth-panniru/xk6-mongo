import xk6_mongo from 'k6/x/mongo';

// const client = xk6_mongo.newClient('mongodb://localhost:27017');
const client = xk6_mongo.newClient(`${__ENV.MONGO_URL}`);
const db = "testdb";
const col = "testcollection";
const maxNumberOfDocuments = 5

export function setup() {
    console.log("Setup")
    let totalDocs = client.count(db, col, {});
    console.log("totalDocs: ", totalDocs)
    let random = Math.floor(Math.random() * totalDocs);
    console.log("random: ", random)
    let randomDocs = client.find(db, col, {}, maxNumberOfDocuments, random, {"_id": 1, "updateTime": 1});
    console.log("randomDocs: ", randomDocs)
    return {objects: randomDocs}
}

export default (data) => {
    console.log("objects:", data.objects);
    for (let obj of data.objects) {
        console.log("Updating _id:", obj._id);
        let updatedCount = client.updateOne(db, col, {_id: xk6_mongo.hexToObjectID(obj._id)},
            {updateTime: new Date(new Date(obj.updateTime).getTime() + 1)})
        console.log("Updated ", updatedCount, " records");
    }
}