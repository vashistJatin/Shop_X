const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const products = [
  { name: "iPhone 15 Pro", description: "Apple's flagship smartphone with titanium design and A17 Pro chip.", price: 134900, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", category: "Electronics", brand: "Apple", stock: 50, rating: 4.8, numReviews: 120 },
  { name: "Samsung Galaxy S24", description: "Android flagship with AI features and stunning display.", price: 79999, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500", category: "Electronics", brand: "Samsung", stock: 45, rating: 4.6, numReviews: 89 },
  { name: "Sony WH-1000XM5", description: "Industry-leading noise cancelling wireless headphones.", price: 29990, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", category: "Electronics", brand: "Sony", stock: 30, rating: 4.9, numReviews: 200 },
  { name: "Apple MacBook Air M3", description: "Supercharged by M3 chip. Strikingly thin and light.", price: 114900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", category: "Electronics", brand: "Apple", stock: 25, rating: 4.9, numReviews: 156 },
  { name: "Nike Air Max 270", description: "Lightweight and breathable with Max Air cushioning.", price: 12995, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", category: "Fashion", brand: "Nike", stock: 100, rating: 4.5, numReviews: 300 },
  { name: "Levi's 511 Slim Jeans", description: "Slim fit jeans with just enough stretch for comfort.", price: 3999, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", category: "Fashion", brand: "Levis", stock: 80, rating: 4.3, numReviews: 450 },
  { name: "The Alchemist", description: "Paulo Coelho's masterpiece about following your dreams.", price: 299, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500", category: "Books", brand: "HarperCollins", stock: 200, rating: 4.7, numReviews: 1200 },
  { name: "Atomic Habits", description: "Tiny changes, remarkable results by James Clear.", price: 499, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500", category: "Books", brand: "Penguin", stock: 180, rating: 4.8, numReviews: 980 },
  { name: "Instant Pot Duo 7-in-1", description: "Multi-cooker that replaces 7 kitchen appliances.", price: 7999, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500", category: "Home", brand: "Instant Pot", stock: 60, rating: 4.6, numReviews: 340 },
  { name: "Dyson V15 Vacuum", description: "Most powerful cordless vacuum with laser dust detection.", price: 52900, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", category: "Home", brand: "Dyson", stock: 20, rating: 4.7, numReviews: 178 },
  { name: "iPad Pro 12.9-inch", description: "Ultimate iPad experience with M2 chip and Liquid Retina display.", price: 112900, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500", category: "Electronics", brand: "Apple", stock: 35, rating: 4.8, numReviews: 220 },
  { name: "Adidas Ultraboost 22", description: "Energy-returning running shoes with Boost midsole.", price: 14999, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500", category: "Fashion", brand: "Adidas", stock: 75, rating: 4.6, numReviews: 267 },
  { name: "Clean Code", description: "A handbook of agile software craftsmanship by Robert Martin.", price: 699, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500", category: "Books", brand: "Prentice Hall", stock: 150, rating: 4.6, numReviews: 560 },
  { name: "LG 4K OLED TV 55\"", description: "Gallery-quality OLED display with Dolby Vision.", price: 139990, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500", category: "Electronics", brand: "LG", stock: 15, rating: 4.7, numReviews: 134 },
  { name: "Kindle Paperwhite", description: "The thinnest, lightest Kindle with a 6.8\" display.", price: 13999, image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=500", category: "Electronics", brand: "Amazon", stock: 90, rating: 4.5, numReviews: 890 },
  { name: "Yoga Mat Premium", description: "Non-slip 6mm thick yoga mat with carry strap.", price: 1299, image: "https://images.unsplash.com/photo-1601925228008-8cd8a5d07af1?w=500", category: "Sports", brand: "Boldfit", stock: 120, rating: 4.4, numReviews: 456 },
  { name: "Whey Protein Isolate", description: "25g protein per serving, zero sugar, fast absorbing.", price: 3499, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500", category: "Sports", brand: "MuscleBlaze", stock: 200, rating: 4.5, numReviews: 678 },
  { name: "Puma Running Shorts", description: "Lightweight quick-dry shorts with inner liner.", price: 1299, image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500", category: "Fashion", brand: "Puma", stock: 110, rating: 4.2, numReviews: 234 },
  { name: "Wooden Coffee Table", description: "Solid mango wood coffee table with hairpin legs.", price: 8999, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500", category: "Home", brand: "Woodsworth", stock: 10, rating: 4.6, numReviews: 89 },
  { name: "boAt Airdopes 141", description: "True wireless earbuds with 42H total playback.", price: 1299, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", category: "Electronics", brand: "boAt", stock: 300, rating: 4.3, numReviews: 2100 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);

    // Create admin user
    const adminExists = await User.findOne({ email: "admin@shopx.com" });
    if (!adminExists) {
      await User.create({ name: "Admin", email: "admin@shopx.com", password: "admin123", isAdmin: true });
      console.log("Admin created: admin@shopx.com / admin123");
    }

    console.log(`✅ Seeded ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
