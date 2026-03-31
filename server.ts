import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db: any;

async function initDb() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS Product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      collectionType TEXT NOT NULL,
      functionType TEXT NOT NULL,
      gender TEXT NOT NULL,
      condition TEXT DEFAULT 'new',
      image TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      warranty BOOLEAN DEFAULT 1,
      colors TEXT,
      origin TEXT,
      history TEXT,
      waterResistance TEXT,
      usageConditions TEXT
    );

    CREATE TABLE IF NOT EXISTS favorites (
      userId INTEGER,
      ProductId INTEGER,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(ProductId) REFERENCES Product(id),
      PRIMARY KEY(userId, ProductId)
    );
  `);

  const ProductCount = await db.get('SELECT COUNT(*) as count FROM Product');
  if (ProductCount.count < 30) {
    console.log("Re-seeding products for Élégance Montre...");
    await db.run('DELETE FROM Product');
    const initialProducts = [
      {
        name: "Rolex Submariner Style",
        description: "L'élégance intemporelle d'une montre de plongée. Finition dorée et cadran noir profond.",
        price: 35000, category: "luxury", collectionType: "suspension", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
        stock: 10, warranty: 1, colors: JSON.stringify(["Or", "Noir"]), origin: "Suisse",
        history: "Un design inspiré par les plus grandes légendes de l'horlogerie."
      },
      {
        name: "Patek Nautilus Tribute",
        description: "Le luxe discret avec un cadran bleu texturé. Une pièce d'exception pour les connaisseurs.",
        price: 45000, category: "luxury", collectionType: "slim", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
        stock: 5, warranty: 1, colors: JSON.stringify(["Bleu", "Argent"]), origin: "Suisse",
        history: "L'élégance sportive redéfinie."
      },
      {
        name: "Cartier Tank Style",
        description: "La finesse d'un boîtier rectangulaire. Bracelet en cuir véritable et chiffres romains.",
        price: 28000, category: "luxury", collectionType: "leather", functionType: "quartz", gender: "women", condition: "new",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
        stock: 12, warranty: 1, colors: JSON.stringify(["Or Rose", "Brun"]), origin: "France",
        history: "Un classique qui traverse les époques avec grâce."
      },
      {
        name: "Omega Moon Tribute",
        description: "Un chronographe robuste prêt pour l'aventure. Précision et fiabilité exceptionnelles.",
        price: 32000, category: "sport", collectionType: "suspension", functionType: "mechanical", gender: "men", condition: "new",
        image: "https://i.pinimg.com/1200x/65/c3/67/65c36757a5115e655112d344eed9816e.jpg",
        stock: 8, warranty: 1, colors: JSON.stringify(["Noir", "Acier"]), origin: "Suisse",
        history: "Inspirée par les instruments de navigation spatiale."
      },
      {
        name: "AP Royal Tribute",
        description: "Design octogonal audacieux en acier brossé. Un style affirmé et contemporain.",
        price: 42000, category: "luxury", collectionType: "slim", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=800",
        stock: 6, warranty: 1, colors: JSON.stringify(["Bleu", "Acier"]), origin: "Suisse",
        history: "La révolution du design horloger moderne."
      },
      {
        name: "Swatch Flik Flak 'Space'",
        description: "La montre parfaite pour les petits astronautes. Apprendre l'heure devient une aventure spatiale.",
        price: 35000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&q=80&w=800",
        stock: 15, warranty: 1, colors: JSON.stringify(["Bleu", "Blanc"]), origin: "Suisse",
        history: "Flik Flak est la montre préférée des enfants depuis 1987."
      },
      {
        name: "Lego Watch 'Classic Blue'",
        description: "Une montre ludique et personnalisable avec des maillons Lego. Idéale pour développer la créativité.",
        price: 25000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://i.pinimg.com/736x/f2/3b/3b/f23b3bb3ce2e194029ec266d2fe07cd0.jpg",
        stock: 20, warranty: 1, colors: JSON.stringify(["Bleu", "Rouge", "Jaune"]), origin: "Danemark",
        history: "L'alliance parfaite entre le jeu et l'apprentissage du temps."
      },
      {
        name: "Casio Baby-G Kids Pink",
        description: "Ultra-résistante et stylée. Étanche et antichoc, elle accompagne toutes les activités des enfants.",
        price: 45000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800",
        stock: 12, warranty: 1, colors: JSON.stringify(["Rose", "Blanc"]), origin: "Japon",
        history: "La version enfant de la légendaire G-Shock."
      },
      {
        name: "Timex Time Machines",
        description: "Une montre éducative avec des aiguilles clairement marquées pour faciliter l'apprentissage de l'heure.",
        price: 20000, category: "vintage", collectionType: "leather", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
        stock: 25, warranty: 1, colors: JSON.stringify(["Bleu", "Noir"]), origin: "USA",
        history: "Timex aide les enfants à lire l'heure depuis des générations."
      },
      {
        name: "Swatch 'Color Explosion'",
        description: "Une explosion de couleurs pour égayer le poignet. Durable, légère et résistante à l'eau.",
        price: 38000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800",
        stock: 18, warranty: 1, colors: JSON.stringify(["Multicolore"]), origin: "Suisse",
        history: "Le design Swatch adapté aux plus jeunes."
      },
      {
        name: "Disney Mickey Mouse Classic",
        description: "La montre iconique avec les bras de Mickey indiquant l'heure. Un classique indémodable pour les enfants.",
        price: 28000, category: "vintage", collectionType: "leather", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://i.pinimg.com/736x/7f/3b/1c/7f3b1cf0df097d1a69cf673775ca53b5.jpg",
        stock: 30, warranty: 1, colors: JSON.stringify(["Rouge", "Noir"]), origin: "USA",
        history: "La première montre Mickey Mouse est née en 1933."
      },
      {
        name: "Garmin Vivofit jr. 3",
        description: "Le tracker d'activité robuste et étanche pour les enfants actifs. Suivi des pas, du sommeil et des tâches.",
        price: 65000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://i.pinimg.com/736x/a1/5e/79/a15e7929d68b461050ce9783ee39f3e1.jpg",
        stock: 10, warranty: 1, colors: JSON.stringify(["Bleu", "Noir"]), origin: "USA",
        history: "Garmin apporte la technologie de pointe aux plus jeunes."
      },
      {
        name: "VTech KidiZoom Smartwatch",
        description: "La montre intelligente avec appareil photo, jeux et plus. L'introduction parfaite au monde numérique.",
        price: 45000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://i.pinimg.com/1200x/a8/a4/a8/a8a4a8db039f39fa1f915dafb1b29a0e.jpg",
        stock: 15, warranty: 1, colors: JSON.stringify(["Violet", "Bleu"]), origin: "Chine",
        history: "VTech est le leader mondial des jouets éducatifs électroniques."
      },
      {
        name: "Breitling Navitimer Style",
        description: "Le chronographe des pilotes par excellence. Règle à calcul circulaire et style robuste.",
        price: 38000, category: "sport", collectionType: "leather", functionType: "automatic", gender: "men", condition: "new",
        image: "https://i.pinimg.com/1200x/ed/85/8f/ed858f56ee329beb7975964ddd641085.jpg",
        stock: 4, warranty: 1, colors: JSON.stringify(["Noir", "Argent"]), origin: "Suisse",
        history: "L'instrument de navigation préféré des aviateurs depuis 1952."
      },
      {
        name: "TAG Heuer Monaco Tribute",
        description: "L'édition spéciale aux couleurs légendaires. Boîtier carré et esprit de course automobile.",
        price: 34000, category: "vintage", collectionType: "leather", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=800",
        stock: 2, warranty: 1, colors: JSON.stringify(["Bleu", "Orange"]), origin: "Suisse",
        history: "Rendue célèbre par Steve McQueen dans le film 'Le Mans'."
      },
      {
        name: "JLC Reverso Style",
        description: "Le génie du boîtier réversible. Une face pour lire l'heure, l'autre pour protéger le cadran.",
        price: 31000, category: "luxury", collectionType: "leather", functionType: "mechanical", gender: "unisex", condition: "new",
        image: "https://i.pinimg.com/736x/f0/e0/6f/f0e06f1c21b641dceb670e52a37d3762.jpg",
        stock: 3, warranty: 1, colors: JSON.stringify(["Argent", "Noir"]), origin: "Suisse",
        history: "Créée pour les joueurs de polo en 1931."
      },
      {
        name: "Vacheron Overseas Style",
        description: "La montre du voyageur moderne. Second fuseau horaire et élégance sportive hors pair.",
        price: 44000, category: "luxury", collectionType: "suspension", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=800",
        stock: 1, warranty: 1, colors: JSON.stringify(["Bleu", "Acier"]), origin: "Suisse",
        history: "La quintessence de la haute horlogerie sportive."
      },
      {
        name: "Hublot Big Bang Style",
        description: "L'audace du design contemporain. Matériaux high-tech et style chronographe squelette.",
        price: 39000, category: "sport", collectionType: "suspension", functionType: "automatic", gender: "men", condition: "new",
        image: "https://i.pinimg.com/736x/a9/fb/6c/a9fb6cbea12d66d83cbbf836538a831c.jpg",
        stock: 2, warranty: 1, colors: JSON.stringify(["Noir", "Carbone"]), origin: "Suisse",
        history: "L'art de la fusion poussé à son paroxysme."
      },
      {
        name: "Zenith Chronomaster Style",
        description: "La précision au 1/10ème de seconde. Un design moderne héritier du mouvement El Primero.",
        price: 36000, category: "sport", collectionType: "suspension", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
        stock: 3, warranty: 1, colors: JSON.stringify(["Blanc", "Acier"]), origin: "Suisse",
        history: "Le moteur chronographe le plus précis du monde."
      },
      {
        name: "IWC Portugieser Style",
        description: "La sobriété et la lisibilité parfaite. Un design intemporel né dans les années 30.",
        price: 33000, category: "luxury", collectionType: "leather", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800",
        stock: 4, warranty: 1, colors: JSON.stringify(["Argent", "Bleu"]), origin: "Suisse",
        history: "Une icône de l'élégance classique."
      },
      {
        name: "Longines Master Style",
        description: "Le savoir-faire traditionnel. Phase de lune et complications classiques sur cadran argent.",
        price: 21000, category: "luxury", collectionType: "leather", functionType: "automatic", gender: "men", condition: "new",
        image: "https://i.pinimg.com/736x/a7/36/57/a73657c7a28f0e8ed4c956edad6ea6dd.jpg",
        stock: 6, warranty: 1, colors: JSON.stringify(["Argent", "Brun"]), origin: "Suisse",
        history: "L'élégance est une attitude."
      },
      {
        name: "Tissot PRX Style",
        description: "Le style vintage des années 70 revisité. Bracelet intégré et mouvement automatique.",
        price: 180000, category: "vintage", collectionType: "suspension", functionType: "automatic", gender: "unisex", condition: "new",
        image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=800",
        stock: 10, warranty: 1, colors: JSON.stringify(["Bleu", "Acier"]), origin: "Suisse",
        history: "Un succès phénoménal depuis son retour."
      },
      {
        name: "Seiko Alpinist Style",
        description: "La montre de terrain par excellence. Boussole interne et robustesse japonaise.",
        price: 160000, category: "sport", collectionType: "leather", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
        stock: 8, warranty: 1, colors: JSON.stringify(["Vert", "Brun"]), origin: "Japon",
        history: "Conçue pour les 'Yama-otoko' (hommes de la montagne) japonais."
      },
      {
        name: "Citizen Eco-Drive",
        description: "Alimentée par la lumière. Une montre écologique et précise qui ne nécessite jamais de pile.",
        price: 120000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "men", condition: "new",
        image: "https://i.pinimg.com/1200x/f2/a0/30/f2a03035e46a0d7abedef8dde8318fe1.jpg",
        stock: 15, warranty: 1, colors: JSON.stringify(["Noir", "Argent"]), origin: "Japon",
        history: "La technologie Eco-Drive est une révolution durable."
      },
      {
        name: "Orient Bambino",
        description: "Le charme du vintage à prix abordable. Verre bombé et cadran épuré pour une élégance classique.",
        price: 140000, category: "vintage", collectionType: "leather", functionType: "automatic", gender: "men", condition: "new",
        image: "https://i.pinimg.com/736x/97/e2/8f/97e28fe6d4bb618c83e59b344d9eb0ba.jpg",
        stock: 10, warranty: 1, colors: JSON.stringify(["Blanc", "Brun"]), origin: "Japon",
        history: "La référence des montres habillées accessibles."
      },
      {
        name: "Hamilton Khaki Field",
        description: "L'héritage militaire américain. Une montre robuste et lisible, parfaite pour le quotidien.",
        price: 220000, category: "vintage", collectionType: "leather", functionType: "mechanical", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
        stock: 7, warranty: 1, colors: JSON.stringify(["Noir", "Vert"]), origin: "Suisse",
        history: "Fournisseur officiel de l'armée américaine pendant les guerres."
      },
      {
        name: "Bulova Lunar Pilot",
        description: "Le chronographe porté sur la Lune lors de la mission Apollo 15. Haute fréquence et précision extrême.",
        price: 260000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "men", condition: "new",
        image: "https://i.pinimg.com/1200x/00/fa/1d/00fa1d208bf18499e1bb02c728e62453.jpg",
        stock: 5, warranty: 1, colors: JSON.stringify(["Noir", "Acier"]), origin: "USA",
        history: "Une alternative historique à la Speedmaster."
      },
      {
        name: "Seiko 5 Sports",
        description: "La montre automatique d'entrée de gamme par excellence. Fiable, robuste et stylée.",
        price: 130000, category: "sport", collectionType: "suspension", functionType: "automatic", gender: "men", condition: "new",
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
        stock: 20, warranty: 1, colors: JSON.stringify(["Bleu", "Argent"]), origin: "Japon",
        history: "La Seiko 5 définit la valeur horlogère depuis 1963."
      },
      {
        name: "Casio G-Shock GA-2100",
        description: "La 'CasiOak'. Un design ultra-plat et octogonal, virtuellement indestructible.",
        price: 75000, category: "sport", collectionType: "suspension", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://i.pinimg.com/736x/1b/9e/7d/1b9e7d5eb9f15ec0f7041e0865c0f353.jpg",
        stock: 25, warranty: 1, colors: JSON.stringify(["Noir"]), origin: "Japon",
        history: "La G-Shock la plus populaire de la décennie."
      },
      {
        name: "Timex Weekender",
        description: "La montre décontractée par excellence. Bracelet NATO interchangeable et éclairage Indiglo.",
        price: 45000, category: "vintage", collectionType: "leather", functionType: "quartz", gender: "unisex", condition: "new",
        image: "https://i.pinimg.com/1200x/cb/02/65/cb026503505765838bd5bfe0771dc707.jpg",
        stock: 30, warranty: 1, colors: JSON.stringify(["Blanc", "Bleu"]), origin: "USA",
        history: "La montre polyvalente pour tous les jours."
      }
    ];

    for (const p of initialProducts) {
      await db.run(
        `INSERT INTO Product (name, description, price, category, collectionType, functionType, gender, condition, image, stock, warranty, colors, origin, history) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.description, p.price, p.category, p.collectionType, p.functionType, p.gender, p.condition, p.image, p.stock, p.warranty, p.colors, p.origin, p.history]
      );
    }
    console.log("Seeding complete.");
  }
}

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
};

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secret");
    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await db.all('SELECT * FROM products');
    const mappedProducts = products.map((p: any) => {
      let colors = [];
      try { colors = p.colors ? JSON.parse(p.colors) : []; } catch (e) { colors = []; }
      return {
        ...p, _id: p.id.toString(),
        colors: Array.isArray(colors) ? colors : [],
        warranty: !!p.warranty, reviews: [],
        waterResistance: p.waterResistance || "N/A",
        usageConditions: p.usageConditions || "N/A"
      };
    });
    res.json(mappedProducts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Product" });
  }
});

app.post("/api/Product", authenticate, isAdmin, async (req, res) => {
  const p = req.body;
  const result = await db.run(
    `INSERT INTO Product (name, description, price, category, collectionType, functionType, gender, condition, image, stock, warranty, colors, origin, history) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.name, p.description, p.price, p.category, p.collectionType, p.functionType, p.gender, p.condition, p.image, p.stock, p.warranty ? 1 : 0, JSON.stringify(p.colors), p.origin, p.history]
  );
  res.status(201).json({ ...p, _id: result.lastID.toString() });
});

app.put("/api/Product/:id", authenticate, isAdmin, async (req, res) => {
  const p = req.body;
  await db.run(
    `UPDATE Product SET name=?, description=?, price=?, category=?, collectionType=?, functionType=?, gender=?, condition=?, image=?, stock=?, warranty=?, colors=?, origin=?, history=? WHERE id=?`,
    [p.name, p.description, p.price, p.category, p.collectionType, p.functionType, p.gender, p.condition, p.image, p.stock, p.warranty ? 1 : 0, JSON.stringify(p.colors), p.origin, p.history, req.params.id]
  );
  res.json({ ...p, _id: req.params.id });
});

app.delete("/api/Product/:id", authenticate, isAdmin, async (req, res) => {
  await db.run('DELETE FROM Product WHERE id = ?', [req.params.id]);
  res.json({ message: "Product deleted" });
});

app.get("/api/favorites", authenticate, async (req: any, res) => {
  try {
    const favorites = await db.all(
      `SELECT p.* FROM Product p JOIN favorites f ON p.id = f.productId WHERE f.userId = ?`,
      [req.user.id]
    );
    const mappedFavorites = favorites.map((p: any) => {
      let colors = [];
      try { colors = p.colors ? JSON.parse(p.colors) : []; } catch (e) { colors = []; }
      return {
        ...p, _id: p.id.toString(),
        colors: Array.isArray(colors) ? colors : [],
        warranty: !!p.warranty, reviews: [],
        waterResistance: p.waterResistance || "N/A",
        usageConditions: p.usageConditions || "N/A"
      };
    });
    res.json(mappedFavorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

app.post("/api/favorites/:id", authenticate, async (req: any, res) => {
  try {
    await db.run('INSERT OR IGNORE INTO favorites (userId, productId) VALUES (?, ?)', [req.user.id, req.params.id]);
    const favorites = await db.all('SELECT productId FROM favorites WHERE userId = ?', [req.user.id]);
    res.json(favorites.map((f: any) => f.productId.toString()));
  } catch (err) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

app.delete("/api/favorites/:id", authenticate, async (req: any, res) => {
  await db.run('DELETE FROM favorites WHERE userId = ? AND productId = ?', [req.user.id, req.params.id]);
  const favorites = await db.all('SELECT productId FROM favorites WHERE userId = ?', [req.user.id]);
  res.json(favorites.map((f: any) => f.productId.toString()));
});

async function startServer() {
  await initDb();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();