import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

export const Terms = () => {
  return (
    <InfoPageLayout title="Conditions d'utilisation" subtitle="Les règles de notre service">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Acceptation des Conditions</h2>
        <p>
          En accédant à Élégance Montre, vous acceptez d'être lié par les présentes conditions d'utilisation, toutes les lois et réglementations applicables au Congo, et acceptez que vous êtes responsable du respect de toutes les lois locales applicables.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Utilisation du Site</h2>
        <p>
          Le contenu de ce site, y compris les textes, images, logos et designs, est la propriété exclusive d'Élégance Montre. Toute reproduction, distribution ou utilisation non autorisée de ce contenu est strictement interdite.
        </p>
        <p>
          Vous vous engagez à utiliser notre site uniquement à des fins licites et d'une manière qui ne porte pas atteinte aux droits de tiers, ni ne restreint ou n'empêche l'utilisation et la jouissance du site par autrui.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Exactitude des Informations</h2>
        <p>
          Bien que nous nous efforcions de maintenir les informations sur notre site aussi précises que possible, Élégance Montre ne garantit pas que les descriptions de produits, les prix ou tout autre contenu du site soient exempts d'erreurs, complets ou à jour.
        </p>
        <p>
          Nous nous réservons le droit de corriger toute erreur, inexactitude ou omission et de modifier ou mettre à jour les informations à tout moment et sans préavis.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Limitation de Responsabilité</h2>
        <p>
          Élégance Montre ne sera en aucun cas responsable des dommages directs, indirects, accessoires, consécutifs ou punitifs résultant de votre accès ou de votre utilisation de ce site, ou de l'impossibilité d'accéder ou d'utiliser ce site.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Droit Applicable</h2>
        <p>
          Toute réclamation relative au site web d'Élégance Montre sera régie par les lois de la République du Congo, sans égard à ses dispositions en matière de conflit de lois.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Contact</h2>
        <p>
          Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse Jzounamo@gmail.com ou au 06 851 80 85.
        </p>
      </section>
    </InfoPageLayout>
  );
};
