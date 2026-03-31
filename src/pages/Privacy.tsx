import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

export const Privacy = () => {
  return (
    <InfoPageLayout title="Confidentialité" subtitle="Votre vie privée est notre priorité">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Introduction</h2>
        <p>
          Chez Élégance Montre, nous accordons une importance capitale à la protection de vos données personnelles. Cette politique de confidentialité détaille la manière dont nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre site web et nos services au Congo.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Collecte des Données</h2>
        <p>
          Nous collectons les informations que vous nous fournissez directement, notamment lors de la création d'un compte, d'un achat ou lorsque vous nous contactez. Ces données peuvent inclure votre nom, votre adresse e-mail, votre numéro de téléphone et vos informations de livraison.
        </p>
        <p>
          Nous collectons également automatiquement certaines informations techniques lors de votre navigation, telles que votre adresse IP, le type de navigateur utilisé et les pages consultées, afin d'améliorer votre expérience utilisateur.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Utilisation des Informations</h2>
        <p>
          Vos données sont utilisées pour traiter vos commandes, personnaliser votre expérience, vous envoyer des informations sur nos produits (si vous y avez consenti) et améliorer la qualité de nos services. Nous ne vendons jamais vos données personnelles à des tiers.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles rigoureuses pour protéger vos données contre tout accès non autorisé, modification ou divulgation. Nos serveurs sont sécurisés et les transactions sont cryptées.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Vos Droits</h2>
        <p>
          Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment en nous contactant à l'adresse Jzounamo@gmail.com.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Modifications</h2>
        <p>
          Élégance Montre se réserve le droit de modifier cette politique de confidentialité à tout moment. Les changements seront publiés sur cette page avec la date de mise à jour.
        </p>
      </section>
    </InfoPageLayout>
  );
};
