import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function connectToMongoDB() {
    const client = new MongoClient(process.env.MONGODB_URI + 'EA');

    try {
        await client.connect();
        // console.log('Connected to MongoDB');

        const database = client.db();

        const studentDataCollection = database.collection('k1232023-12-06T18:30:00.000ZCompiler');

        const studentData = await studentDataCollection.find({}).toArray();

        const ci = new Map();

        studentData.forEach((student) => {
            const ci_val = student.weight / (4.5 * student.count);
            ci.set(student.s_rollNo, ci_val);
        });


        console.log('\x1b[033m%s\x1b[0m',"----------------------------------------");
        console.log('\x1b[033m%s\x1b[0m',"|   Roll No      | Engagement Analysis |");
        console.log('\x1b[033m%s\x1b[0m',"----------------------------------------");
        ci.forEach((value,key) => {
            if(value < 0.25) {
                console.log('\x1b[031m%s\x1b[0m',"| " + key +"  | Dis-Engaged         |");
            }
            else if(value < 0.65) {
                console.log('\x1b[36m%s\x1b[0m',"| " + key + "  | Engaged             |");
            }
            else {
                console.log('\x1b[032m%s\x1b[0m',"| " + key + "  | Highly-Engaged      |");
            }
            console.log('\x1b[033m%s\x1b[0m',"----------------------------------------");
        });
    } finally {
        await client.close();
        // console.log('Connection to MongoDB closed');
    }
}

connectToMongoDB();
