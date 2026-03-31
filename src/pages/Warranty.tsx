import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

export const Warranty = () => {
  return (
    <InfoPageLayout title="Garantie" subtitle="Votre investissement est protégé">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Garantie d'Authenticité</h2>
        <p>
          Chez Élégance Montre, nous garantissons l'authenticité absolue de chaque garde-temps que nous vendons. Chaque montre est accompagnée de ses documents originaux, de son certificat d'authenticité et de son écrin d'origine.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Garantie de Manufacture</h2>
        <p>
          Toutes nos montres neuves bénéficient de la garantie internationale du fabricant, généralement d'une durée de 2 à 5 ans selon la marque. Cette garantie couvre les défauts de fabrication et les problèmes de mouvement dans des conditions normales d'utilisation.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Garantie Élégance Montre</h2>
        <p>
          En plus de la garantie du fabricant, Élégance Montre offre une garantie de service de 12 mois sur tous les modèles d'occasion certifiés. Cette garantie couvre le bon fonctionnement du mouvement et l'étanchéité (si spécifiée).
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Exclusions de Garantie</h2>
        <p>
          La garantie ne couvre pas :
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>L'usure normale (rayures sur le boîtier, le verre ou le bracelet).</li>
          <li>Les dommages causés par une mauvaise manipulation, un accident ou une négligence.</li>
          <li>Les interventions effectuées par des tiers non autorisés.</li>
          <li>Les dommages causés par l'eau si les limites d'étanchéité ont été dépassées.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Service Après-Vente</h2>
        <p>
          Pour toute demande de service sous garantie, veuillez nous contacter au 06 851 80 85. Notre équipe se chargera de coordonner l'envoi de votre montre vers les centres de service agréés.
        </p>
      </section>
    </InfoPageLayout>
  );
};
