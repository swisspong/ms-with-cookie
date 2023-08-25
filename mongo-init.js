// db.createUser({
//   user: "root",
//   pwd: "root",
//   roles: [
//     {
//       role: "readWrite",
//       db: "ms_shopping",
//     },
//   ],
// });
// db.createCollection('sample_collection');

//db = db.getSiblingDB("ms_shopping");

// db.createCollection("init_collection");
// db = db.getSiblingDB("ms_product");

// db.createCollection("init_collection");

// db = db.getSiblingDB("ms_customer");

// db.createCollection("init_collection");
// db = db.getSiblingDB("ms_payment");

// db.createCollection("init_collection");

db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: [
    {
      role: "readWrite",
      db: "mydatabase",
    },
  ],
});

// db.sample_collection.insertMany([
//  {
//     org: 'helpdev',
//     filter: 'EVENT_A',
//     addrs: 'http://rest_client_1:8080/wh'
//   },
//   {
//     org: 'helpdev',
//     filter: 'EVENT_B',
//     addrs: 'http://rest_client_2:8081/wh'
//   },
//   {
//     org: 'github',
//     filter: 'EVENT_C',
//     addrs: 'http://rest_client_3:8082/wh'
//   }
// ]);
