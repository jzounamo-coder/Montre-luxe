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
    const products = db.prepare('SELECT * FROM Product').all();

    console.log(`📦 ${products.length} montres trouvées. Transfert en cours...`);

    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description || "",
          price: parseFloat(product.price),
          image: product.image || "",
          category: product.category || "Luxury",
          gender: product.gender || "Men",
          stock: parseInt(product.stock) || 0,
        }
      });
      console.log(`✅ Transféré : ${product.name}`);
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