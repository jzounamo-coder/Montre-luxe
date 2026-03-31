import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

export const WaterResistance = () => {
  return (
    <InfoPageLayout title="Résistance à l'eau" subtitle="Comprendre les limites de votre montre">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Introduction</h2>
        <p>
          La résistance à l'eau d'une montre est une caractéristique cruciale qui dépend de sa conception, de ses joints et de sa couronne. Chez Élégance Montre, nous vous aidons à comprendre ce que signifient réellement les indications d'étanchéité.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Guide des Étanchéités</h2>
        <p>
          Les indications en mètres ou en atmosphères (ATM) ne correspondent pas à une profondeur de plongée réelle, mais à une pression statique équivalente.
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>30m / 3 ATM : Résiste aux éclaboussures et à la pluie. Ne pas immerger.</li>
          <li>50m / 5 ATM : Convient pour la natation en surface. Pas de plongée.</li>
          <li>100m / 10 ATM : Convient pour la natation et le snorkeling.</li>
          <li>200m / 20 ATM : Convient pour la plongée sous-marine récréative.</li>
          <li>300m+ / 30 ATM+ : Montre de plongée professionnelle.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Précautions Importantes</h2>
        <p>
          Pour préserver l'étanchéité de votre garde-temps :
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>Assurez-vous toujours que la couronne est bien revissée ou repoussée avant tout contact avec l'eau.</li>
          <li>Ne manipulez jamais les boutons-poussoirs ou la couronne sous l'eau.</li>
          <li>Rincez votre montre à l'eau douce après chaque baignade en mer ou en piscine chlorée.</li>
          <li>Évitez les chocs thermiques (douche chaude, sauna) qui peuvent dilater les joints.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif italic text-gold">Entretien</h2>
        <p>
          L'étanchéité n'est pas permanente. Nous vous recommandons de faire tester l'étanchéité de votre montre tous les deux ans ou avant chaque période d'utilisation intensive dans l'eau. Contactez Élégance Montre au 06 851 80 85 pour un test d'étanchéité professionnel.
        </p>
      </section>
    </InfoPageLayout>
  );
};
