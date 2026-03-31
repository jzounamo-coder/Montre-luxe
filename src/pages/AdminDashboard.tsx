import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Package, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      toast.success("Produit supprimé avec succès");
      setConfirmDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Convert types
    const productData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      warranty: data.warranty === 'on',
      colors: (data.colors as string).split(',').map(s => s.trim()),
    };

    const method = editingProduct?._id ? 'PUT' : 'POST';
    const url = editingProduct?._id ? `/api/products/${editingProduct._id}` : '/api/products';

    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      },
      body: JSON.stringify(productData)
    });

    setIsAdding(false);
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif mb-2">Tableau de Bord</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Gestion de l'inventaire Chronos</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="luxury-button flex items-center gap-2"
          >
            <Plus size={16} /> Ajouter un produit
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="luxury-card p-8 flex items-center gap-6">
            <div className="p-4 bg-gold/10 text-gold rounded-full"><Package size={24} /></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Total Produits</p>
              <p className="text-2xl font-serif">{products.length}</p>
            </div>
          </div>
          <div className="luxury-card p-8 flex items-center gap-6">
            <div className="p-4 bg-green-500/10 text-green-500 rounded-full"><DollarSign size={24} /></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Valeur Stock</p>
              <p className="text-2xl font-serif">{products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()} €</p>
            </div>
          </div>
          <div className="luxury-card p-8 flex items-center gap-6">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-full"><Users size={24} /></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Clients Actifs</p>
              <p className="text-2xl font-serif">1,284</p>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="luxury-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Produit</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Catégorie</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Prix</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Stock</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.image} 
                          className="w-10 h-10 object-cover" 
                          alt="" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500">{product.category}</td>
                    <td className="px-6 py-4 font-mono">{product.price.toLocaleString()} €</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded ${product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {product.stock} en stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <button 
                          onClick={() => { setEditingProduct(product); setIsAdding(true); }}
                          className="text-zinc-400 hover:text-gold transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(product._id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-luxury-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-md p-8 luxury-card text-center"
          >
            <div className="inline-flex p-4 bg-red-500/10 text-red-500 rounded-full mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-serif mb-4">Confirmer la suppression</h3>
            <p className="text-zinc-500 text-sm mb-8">Êtes-vous sûr de vouloir supprimer ce garde-temps ? Cette action est irréversible.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-grow bg-red-500 text-white py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-grow border border-zinc-200 dark:border-zinc-800 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Form */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-2xl p-10 luxury-card max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-serif mb-8">{editingProduct ? 'Modifier' : 'Ajouter'} un Produit</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Nom du produit</label>
                <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Description</label>
                <textarea name="description" defaultValue={editingProduct?.description} required className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Prix (€)</label>
                <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Stock</label>
                <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Catégorie</label>
                <select name="category" defaultValue={editingProduct?.category} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold">
                  <option value="luxury">Luxe</option>
                  <option value="sport">Sport</option>
                  <option value="vintage">Vintage</option>
                  <option value="kids">Enfant</option>
                  <option value="women">Femme</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Collection</label>
                <select name="collectionType" defaultValue={editingProduct?.collectionType} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold">
                  <option value="pocket">Poche</option>
                  <option value="leather">Cuir</option>
                  <option value="slim">Ultra Mince</option>
                  <option value="suspension">Suspension</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Mouvement</label>
                <select name="functionType" defaultValue={editingProduct?.functionType} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold">
                  <option value="automatic">Automatique</option>
                  <option value="mechanical">Mécanique</option>
                  <option value="quartz">Quartz</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Genre</label>
                <select name="gender" defaultValue={editingProduct?.gender} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold">
                  <option value="men">Homme</option>
                  <option value="women">Femme</option>
                  <option value="kids">Enfant</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">URL de l'image</label>
                <input name="image" defaultValue={editingProduct?.image} required className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Couleurs (séparées par des virgules)</label>
                <input name="colors" defaultValue={editingProduct?.colors?.join(', ')} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Origine</label>
                <input name="origin" defaultValue={editingProduct?.origin} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 outline-none focus:border-gold" />
              </div>
              <div className="flex items-center gap-4">
                <input name="warranty" type="checkbox" defaultChecked={editingProduct?.warranty} className="w-4 h-4 accent-gold" />
                <label className="text-[10px] uppercase tracking-widest font-bold">Garantie incluse</label>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-grow luxury-button">Enregistrer</button>
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                  className="px-8 py-3 border border-zinc-200 dark:border-zinc-800 uppercase tracking-widest text-xs font-medium"
                >
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
