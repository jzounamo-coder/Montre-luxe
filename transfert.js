import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import Database from 'better-sqlite3';

// Structure exacte demandée par le validateur Prisma v7
const prisma = new PrismaClient({
  __internal: {
    configOverride: () => ({
      datasourceUrl: "postgresql://postgres:EleganceCongo2026@db.oihjnetcaaqyxqxmvnzs.supabase.co:5432/postgres"
    })
  }
});

// Chemin vers SQLite
const db = new Database('./prisma/dev.db'); 

async function transfererDonnees() {
  try {
    console.log("🚀 Tentative de connexion avec configOverride...");
    
    // On récupère les données de SQLite
    const Product = db.prepare('SELECT * FROM Product').all();

    console.log(`📦 ${Product.length} montres trouvées. Transfert en cours...`);

    for (const Product of Product) {
      await prisma.product.create({
        data: {
          name: Product.name,
          description: Product.description || "",
          price: parseFloat(Product.price),
          image: Product.image || "",
          category: Product.category || "Luxury",
          gender: Product.gender || "Men",
          stock: parseInt(Product.stock) || 0,
        }
      });
      console.log(`✅ Transféré : ${Product.name}`);
    }

    console.log("\n✨ Victoire ! Tes montres sont sur Supabase.");
  } catch (error) {
    console.error("❌ Erreur détaillée :", error);
  } finally {
    await prisma.$disconnect();
    db.close();
  }
}

transfererDonnees();