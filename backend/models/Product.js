import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, default: "HYRA Mobile Accessories" },
    category: {
      type: String,
      required: true,
      enum: [
        "Mobile Covers",
        "Tempered Glass",
        "Chargers",
        "Cables",
        "Power Banks",
        "Earphones",
        "Smart Watches",
        "Gadgets",
      ],
    },
    compatibleModels: [{ type: String }],
    images: [{ type: String, required: true }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    material: { type: String, default: "" },
    color: { type: String, default: "" },
    variants: [{ type: String }],
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

productSchema.virtual("finalPrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
