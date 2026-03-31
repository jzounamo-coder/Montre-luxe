import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

export const UsageConditions = () => {
  return (
    <InfoPageLayout title="Conditions d'utilisation" subtitle="Prendre soin de votre montre">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Introduction</h2>
        <p>
          Une montre d'exception est un instrument de précision qui nécessite un entretien régulier pour conserver sa beauté et sa fonctionnalité. Chez Élégance Montre, nous vous conseillons sur les meilleures pratiques pour préserver votre investissement.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Entretien Quotidien</h2>
        <p>
          Pour maintenir l'éclat de votre montre, essuyez-la régulièrement avec un chiffon doux et sec. Évitez tout contact direct avec des produits chimiques, des parfums ou des solvants qui pourraient endommager les joints ou le fini du boîtier.
        </p>
        <p>
          Évitez d'exposer votre montre à des champs magnétiques puissants (enceintes, aimants, scanners) qui pourraient perturber le fonctionnement du mouvement, en particulier pour les montres mécaniques.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Remontage et Réglage</h2>
        <p>
          Pour les montres mécaniques à remontage manuel, remontez-les quotidiennement à la même heure, de préférence le matin. Pour les montres automatiques, portez-les régulièrement ou utilisez un remontoir pour maintenir la réserve de marche.
        </p>
        <p>
          Ne réglez jamais la date entre 21h00 et 03h00, car le mécanisme de changement de date est alors engagé et pourrait être endommagé.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Révision Périodique</h2>
        <p>
          Nous recommandons une révision complète de votre montre tous les 4 à 6 ans par un horloger qualifié. Cette révision comprend le nettoyage du mouvement, le remplacement des huiles et le contrôle de l'étanchéité.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Service Client</h2>
        <p>
          Pour tout conseil supplémentaire ou pour planifier une révision, contactez Élégance Montre au 06 851 80 85 ou par e-mail à Jzounamo@gmail.com.
        </p>
      </section>
    </InfoPageLayout>
  );
};
