import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- MIDDLEWARES ---
const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Non autorisé" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};

const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Accès admin requis" });
  next();
};

// --- AUTHENTIFICATION ---
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }
    // On utilise isAdmin du schéma
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || "secret");
    res.json({ token, isAdmin: user.isAdmin, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Erreur de connexion" });
  }
});

// --- PRODUITS ---
app.get("/api/products", async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    // On adapte pour le front (car colors/warranty ne sont pas dans ton Prisma)
    const mapped = products.map(p => ({
      ...p,
      _id: p.id, // C'est déjà un String (UUID)
      colors: [], // Vide car absent du schéma
      warranty: true
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Erreur produits" });
  }
});

// --- FAVORIS ---
app.post("/api/favorites/:id", authenticate, async (req: any, res: Response) => {
  try {
    await prisma.favorite.create({
      data: { 
        userId: req.user.id, 
        productId: req.params.id // Pas de parseInt, c'est un UUID (String)
      }
    });
    res.json({ message: "Ajouté aux favoris" });
  } catch (err) {
    res.status(500).json({ message: "Erreur ajout favori" });
  }
});

// --- GESTION DES TICKETS (COMMANDES) ---
app.post("/api/commandes", authenticate, async (req: any, res: Response) => {
  try {
    const { total } = req.body;
    // On utilise "commande" car c'est le nom dans ton schéma.prisma
    const ticket = await prisma.commande.create({
      data: {
        userId: req.user.id,
        total: parseFloat(total),
        statut: "Validé" // "statut" avec un 'u' comme dans ton schéma
      }
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création du ticket" });
  }
});

// --- DÉMARRAGE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur synchronisé sur http://localhost:${PORT}`);
  });
}

startServer();