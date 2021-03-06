/**
 * options décrivant une combinaison de touches recherchée
 * - id: sera utilisé dans l'Output pour identifier la combo par le code client de la directive
 * - scope: permet de surveiller le clavier sur le tag seulement, ou le document, ou la window
 * - ctrl, alt, shift: touches devant faire partie de la combinaison de touche détectée
 * - code: KeyboardEvent.code au sens EcmaScript de la touche déchencheuse de l'événement, ex "KeyL" ou "Digit9".
 *
 * Voir https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode#Value_of_keyCode
 */
import {ComboDirectivesOptions} from './combo-directives-options';

export interface ComboOptions extends ComboDirectivesOptions {
  code: string;
}
