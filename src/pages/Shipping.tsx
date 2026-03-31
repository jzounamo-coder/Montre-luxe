import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

export const Shipping = () => {
  return (
    <InfoPageLayout title="Expédition & Livraison" subtitle="Notre service de livraison au Congo">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Livraison au Congo</h2>
        <p>
          Chez Élégance Montre, nous sommes fiers de proposer un service de livraison disponible sur toute l'étendue du territoire congolais. Que vous soyez à Brazzaville, Pointe-Noire, Dolisie ou dans toute autre localité, nous nous engageons à vous livrer votre garde-temps d'exception en toute sécurité.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Délais de Livraison</h2>
        <p>
          Les délais de livraison varient en fonction de votre localisation :
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>Brazzaville & Pointe-Noire : 24h à 48h ouvrables.</li>
          <li>Autres localités : 3 à 7 jours ouvrables selon l'accessibilité.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Sécurité de l'Expédition</h2>
        <p>
          Toutes nos expéditions sont assurées et suivies. Chaque montre est emballée avec le plus grand soin dans un colis discret et sécurisé pour garantir qu'elle vous parvienne dans un état irréprochable.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Expédition Internationale</h2>
        <p className="p-6 bg-zinc-50 dark:bg-luxury-surface border border-gold/20 rounded-xl italic">
          Veuillez noter que l'expédition internationale n'est pas disponible pour le moment. Nous nous concentrons actuellement sur l'excellence de notre service au niveau national.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Frais de Livraison</h2>
        <p>
          Les frais de livraison sont calculés lors de la commande en fonction de votre adresse de livraison. Pour toute commande supérieure à 1 000 000 FCFA, la livraison est offerte sur tout le territoire.
        </p>
      </section>
    </InfoPageLayout>
  );
};
