import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Event from "../modules/event/event.model.js";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(mongoUri!);
  console.log("Connected to MongoDB");

  // Check existing users in the db
  const usersCollection = mongoose.connection.collection("user");
  const users = await usersCollection.find({}).toArray();
  console.log(`Found ${users.length} registered users in DB:`, users.map((u: any) => u.email));

  const creator = users[0] || {
    _id: "default_creator_id",
    email: "community@kindora.org",
  };

  const sampleEvents = [
    {
      title: "Winter Clothes Distribution — Mirpur 10",
      description:
        "Join our annual winter clothes drive to support underprivileged families and street children in the Mirpur 10 area. We will be packing warm blankets, sweaters, jackets, and thermal wear for over 500 recipients. Volunteers will help with inventory sorting, package distribution, and community coordination.",
      eventType: "Donation",
      thumbnail:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      location: "Mirpur 10 Circle, Dhaka",
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
      creatorId: String(creator._id),
      creatorEmail: creator.email,
      joinedUsers: [],
    },
    {
      title: "Blanket Distribution for the Needy — Mohammadpur",
      description:
        "Severe winter waves are hitting Dhaka. We are distributing 800 high-grade fleece blankets to homeless individuals and rickshaw pullers around Mohammadpur Town Hall and Geneva Camp. Hot tea and biscuits will also be served. Come lend a helping hand to keep our city warm.",
      eventType: "Donation",
      thumbnail:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
      location: "Town Hall, Mohammadpur, Dhaka",
      eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days ahead
      creatorId: String(creator._id),
      creatorEmail: creator.email,
      joinedUsers: [],
    },
    {
      title: "Dhanmondi Lake Clean-Up Drive",
      description:
        "Let's restore the scenic beauty of Dhanmondi Lake! In partnership with local youth groups, we are organizing a 4-hour community clean-up drive focusing on single-use plastics and lake walkways. Biodegradable trash bags, protective gloves, and grabbers will be provided to all volunteers.",
      eventType: "Cleanup",
      thumbnail:
        "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
      location: "Rabindra Sarobar, Dhanmondi 8/A, Dhaka",
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days ahead
      creatorId: String(creator._id),
      creatorEmail: creator.email,
      joinedUsers: [],
    },
    {
      title: "1000 Fruit Tree Plantation Drive",
      description:
        "Building a greener and more resilient city! We are planting 1000 native fruit and shade trees (Mango, Neem, Jamrul, Bakul) across community school playgrounds and public parks in Uttara Sector 18. Learn basic arboriculture skills and plant a tree that will nourish generations.",
      eventType: "Plantation",
      thumbnail:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      location: "Sector 18 Park, Uttara, Dhaka",
      eventDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days ahead
      creatorId: String(creator._id),
      creatorEmail: creator.email,
      joinedUsers: [],
    },
    {
      title: "Street Children Literacy & Book Fair",
      description:
        "Education is a fundamental right. Join us for a full-day weekend learning camp for underprivileged street children in Korail. Volunteers will conduct interactive storytelling, teach basic Bengali & English reading, and distribute free stationery sets and storybooks.",
      eventType: "Education",
      thumbnail:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
      location: "Korail Basti Community Center, Banani, Dhaka",
      eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days ahead
      creatorId: String(creator._id),
      creatorEmail: creator.email,
      joinedUsers: [],
    },
    {
      title: "Free Medical Check-up & Medicine Distribution",
      description:
        "A dedicated team of volunteer doctors and nurses will provide free general health consultations, blood pressure & glucose screenings, and essential prescription medications for over 300 slum residents in Old Dhaka. Non-medical volunteers are needed for queue management and vitals recording.",
      eventType: "Healthcare",
      thumbnail:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
      location: "Armanitola Government High School Field, Old Dhaka",
      eventDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days ahead
      creatorId: String(creator._id),
      creatorEmail: creator.email,
      joinedUsers: [],
    },
    {
      title: "Friday Warm Meal Distribution for Homeless",
      description:
        "Every Friday, Kindora volunteers prepare and serve 600 freshly cooked nutritious chicken khichuri meals with boiled eggs and bottled drinking water for day-laborers, disabled citizens, and homeless individuals around Kamalapur Railway Station. Join us in cooking, packaging, or serving.",
      eventType: "Food Distribution",
      thumbnail:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
      location: "Kamalapur Railway Station Plaza, Motijheel, Dhaka",
      eventDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days ahead
      creatorId: String(creator._id),
      creatorEmail: creator.email,
      joinedUsers: [],
    },
  ];

  // Insert events if none exist or update
  const count = await Event.countDocuments();
  console.log(`Current events in DB: ${count}`);

  if (count === 0) {
    await Event.insertMany(sampleEvents);
    console.log(`Inserted ${sampleEvents.length} events successfully!`);
  } else {
    console.log("Events already exist. Appending fresh future events if needed.");
    for (const ev of sampleEvents) {
      const exists = await Event.findOne({ title: ev.title });
      if (!exists) {
        await Event.create(ev);
        console.log(`Added: ${ev.title}`);
      }
    }
  }

  const finalEvents = await Event.find().sort({ eventDate: 1 });
  console.log(`Total events in database now: ${finalEvents.length}`);
  finalEvents.forEach((e) => {
    console.log(`- [${e.eventType}] ${e.title} (${e.eventDate.toISOString().split("T")[0]}) at ${e.location}`);
  });

  await mongoose.disconnect();
  console.log("Finished seeding!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
