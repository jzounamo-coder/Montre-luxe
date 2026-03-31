import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

export const Returns = () => {
  return (
    <InfoPageLayout title="Retours (30 jours)" subtitle="Votre satisfaction est notre priorité absolue">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Politique de Retour</h2>
        <p>
          Chez Élégance Montre, nous comprenons que l'acquisition d'un garde-temps d'exception est une décision importante. C'est pourquoi nous offrons une politique de retour flexible de 30 jours pour tous nos produits.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Conditions de Retour</h2>
        <p>
          Pour être éligible à un retour, votre montre doit être dans le même état que celui dans lequel vous l'avez reçue :
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>Non portée et sans aucune rayure ou marque d'utilisation.</li>
          <li>Dans son emballage d'origine complet (écrin, surboîte).</li>
          <li>Accompagnée de tous les documents originaux (certificat d'authenticité, manuel, garantie).</li>
          <li>Avec tous les maillons du bracelet (si applicable).</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Processus de Retour</h2>
        <p>
          Pour initier un retour, veuillez nous contacter par téléphone au 06 851 80 85 ou par e-mail à Jzounamo@gmail.com. Notre équipe vous guidera à travers les étapes nécessaires pour l'inspection et le traitement de votre demande.
        </p>
        <p>
          Une fois la montre reçue et inspectée par nos experts horlogers, nous procéderons au remboursement ou à l'échange selon votre préférence.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Remboursement</h2>
        <p>
          Les remboursements sont effectués via le mode de paiement original ou par virement bancaire dans un délai de 7 à 14 jours ouvrables après validation du retour.
        </p>
      </section>
    </InfoPageLayout>
  );
};
