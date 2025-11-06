import mongoose from "mongoose";

// ✅ Helper function to always store Indian Standard Time (IST)
function getISTDate() {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

const courseDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User", // ✅ helps in population
    },

    name: {
      type: String,
      required: true,
    },

    courseName: {
      type: String,
      required: true,
    },

    packageName: {
      type: String,
      required: true,
    },

    validityStart: {
      type: Date,
      required: true,
    },

    validityEnd: {
      type: Date,
      required: true,
    },

    // ✅ Keeps record of every purchase made by this user
    purchaseHistory: [
      {
        courseName: {
          type: String,
          required: true,
        },
        packageName: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          default: getISTDate, // ✅ Saves human-readable IST date-time
        },
        status: {
          type: String,
          enum: ["completed", "pending", "failed"],
          default: "completed",
        },
      },
    ],
  },
  { timestamps: true } // ✅ Adds createdAt, updatedAt for each record
);

const CourseDetails = mongoose.model("CourseDetails", courseDetailsSchema);
export default CourseDetails;